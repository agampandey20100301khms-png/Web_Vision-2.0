import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const OFFICIAL_HOME = "https://www.mait.ac.in/";
const ALLOWED_HOSTS = new Set(["mait.ac.in", "www.mait.ac.in"]);
const FETCH_TIMEOUT_MS = 8000;
const MAX_PARALLEL_ARTICLES = 6;
const MAX_PDF_BYTES = 4 * 1024 * 1024;

function decodeHtml(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
    ndash: "–",
    mdash: "—",
    rsquo: "’",
    lsquo: "‘",
    rdquo: "”",
    ldquo: "“",
  };
  return value
    .replace(/&#x([0-9a-f]+);?/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);?/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&([a-z]+);/gi, (entity, name) => named[name.toLowerCase()] ?? entity);
}

function cleanText(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function inferCategory(title) {
  if (/\b(admission|admitted|counselling|counseling)\b/i.test(title)) return "Admissions";
  if (/\b(exam|date sheet|mid[- ]term|end[- ]term|timetable|time table|result)\b/i.test(title)) return "Examinations";
  if (/\b(semester|registration|academic|class|course)\b/i.test(title)) return "Academics";
  return "Campus";
}

function inferAudience(title) {
  const branchCodes = [
    ["Computer Science and Engineering", /\bCSE\b/i],
    ["Information Technology", /\bIT\b/i],
    ["Electronics and Communication Engineering", /\bECE\b/i],
    ["Electrical and Electronics Engineering", /\bEEE\b/i],
    ["Mechanical and Automation Engineering", /\bMAE\b/i],
  ];
  const branchMatches = branchCodes.filter(([, pattern]) => pattern.test(title)).map(([branch]) => branch);
  let semesterMatches = [...title.matchAll(/\b([1-8])(?:st|nd|rd|th)?\s*(?:semester|sem)\b|\b(?:semester|sem)\s*([1-8])\b/gi)]
    .map((match) => Number(match[1] || match[2]));
  const isBbaMba = /\bBBA\s*[-–]\s*MBA\b/i.test(title);
  const programs = [
    /\bB\.?\s?Tech\b/i.test(title) && "B.Tech",
    /\bBBA\b/i.test(title) && "BBA",
    isBbaMba && "BBA-MBA",
    /\bMBA\b/i.test(title) && !isBbaMba && "MBA",
    /\bMCA\b/i.test(title) && "MCA",
  ].filter(Boolean);

  if (/\bnewly admitted\b/i.test(title)) semesterMatches = [1];
  else if (/\b1st year\b/i.test(title)) semesterMatches = [1, 2];

  return {
    branches: branchMatches,
    semesters: [...new Set(semesterMatches)],
    programs: [...new Set(programs)],
  };
}

function parseNoticeLinks(html) {
  const marquee = html.match(/<marquee\b[^>]*>([\s\S]*?)<\/marquee>/i)?.[1];
  if (!marquee) throw new Error("The official MAIT homepage no longer exposes its notice feed in the expected format.");

  const noticesByUrl = new Map();
  for (const match of marquee.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const rawHref = match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    const title = cleanText(match[2]);
    if (!rawHref || !title) continue;

    const url = new URL(decodeHtml(rawHref), OFFICIAL_HOME);
    if (!ALLOWED_HOSTS.has(url.hostname) || !url.pathname.includes("/component/content/article/")) continue;
    const audience = inferAudience(title);
    noticesByUrl.set(url.href, {
      id: url.href,
      title,
      url: url.href,
      date: null,
      category: inferCategory(title),
      ...audience,
    });
  }
  if (noticesByUrl.size === 0) throw new Error("No official notice links were found in the MAIT homepage feed.");
  return [...noticesByUrl.values()];
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html", "User-Agent": "MAIT-Student-Portal/1.0 (official-notice reader)" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`MAIT returned HTTP ${response.status} for ${new URL(url).pathname}.`);
    return response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function parsePublishedDate(html) {
  const jsonLdDate = html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/i)?.[1];
  if (jsonLdDate) return jsonLdDate;

  const dateTime = html.match(/<time\b[^>]*datetime=["'](\d{4}-\d{2}-\d{2})/i)?.[1];
  if (dateTime) return dateTime;

  const datedText = cleanText(html).match(/\bDated\s*:\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\b/i);
  if (datedText) {
    const [, day, month, year] = datedText;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return null;
}

function dateFromText(value) {
  const labeledDate = value.match(/\b(?:dated|date(?:\s+of\s+(?:issue|publication))?|issued\s+on)\s*[:\-]?\s*(\d{1,2}[./-]\d{1,2}[./-]\d{4}|\d{4}[./-]\d{1,2}[./-]\d{1,2}|\d{1,2}\s+[A-Za-z]+\s+\d{4})\b/i)?.[1];
  if (!labeledDate) return null;

  const numeric = labeledDate.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  const iso = labeledDate.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
  let date;
  if (numeric) {
    const [, day, month, year] = numeric.map(Number);
    date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1) return null;
  } else if (iso) {
    const [, year, month, day] = iso.map(Number);
    date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCDate() !== day || date.getUTCMonth() !== month - 1) return null;
  }
  else {
    const parsed = new Date(`${labeledDate} UTC`);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  if (!date || Number.isNaN(date.getTime())) return null;
  const year = date.getUTCFullYear();
  if (year < 2000 || year > new Date().getUTCFullYear() + 2) return null;
  return date.toISOString().slice(0, 10);
}

function extractDocumentDates(value) {
  const found = new Set();
  for (const match of value.matchAll(/\b(\d{1,2}[./-]\d{1,2}[./-]\d{4}|\d{4}[./-]\d{1,2}[./-]\d{1,2})\b/g)) {
    const date = dateFromText(`Date: ${match[1]}`);
    if (date) found.add(date);
  }
  return [...found].sort();
}

function findPdfLink(html, articleUrl) {
  const articleBody = html.match(/<div\b[^>]*class=["'][^"']*astroid-article-text[^"']*["'][\s\S]*?<\/main>/i)?.[0];
  if (!articleBody) return null;
  for (const match of articleBody.matchAll(/<a\b([^>]*)>/gi)) {
    const rawHref = match[1].match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (!rawHref) continue;
    try {
      const url = new URL(decodeHtml(rawHref), articleUrl);
      if (ALLOWED_HOSTS.has(url.hostname) && /\.pdf(?:$|[?#])/i.test(url.href)) return url.href;
    } catch {
      console.warn(`Ignoring invalid attachment URL on ${articleUrl}.`);
    }
  }
  return null;
}

async function parsePdfDetails(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/pdf", "User-Agent": "MAIT-Student-Portal/1.0 (official-notice reader)" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`MAIT returned HTTP ${response.status} for a notice PDF.`);
    const declaredLength = Number(response.headers.get("content-length"));
    if (declaredLength > MAX_PDF_BYTES) throw new Error("The notice PDF exceeds the 4 MB extraction limit.");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("The notice PDF response did not contain a readable file.");
    const chunks = [];
    let totalLength = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalLength += value.byteLength;
      if (totalLength > MAX_PDF_BYTES) {
        await reader.cancel();
        throw new Error("The notice PDF exceeds the 4 MB extraction limit.");
      }
      chunks.push(value);
    }
    const data = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const loadingTask = getDocument({ data, isEvalSupported: false, useSystemFonts: true });
    const document = await loadingTask.promise;
    try {
      const pageCount = Math.min(document.numPages, 10);
      const pageTexts = await Promise.all(Array.from({ length: pageCount }, async (_, index) => {
        const page = await document.getPage(index + 1);
        const content = await page.getTextContent();
        return content.items.map((item) => item.str).join(" ");
      }));
      const text = pageTexts.join(" ");
      return {
        date: dateFromText(text),
        documentDates: extractDocumentDates(text),
      };
    } finally {
      await loadingTask.destroy();
    }
  } finally {
    clearTimeout(timeout);
  }
}

async function addPublishedDates(notices) {
  const result = notices.slice();
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < notices.length) {
      const index = nextIndex++;
      const notice = notices[index];
      try {
        const html = await fetchPage(notice.url);
        let date = parsePublishedDate(html);
        let documentDates = [];
        const pdfUrl = findPdfLink(html, notice.url);
        if (pdfUrl) {
          try {
            const pdfDetails = await parsePdfDetails(pdfUrl);
            date ??= pdfDetails.date;
            documentDates = pdfDetails.documentDates;
          } catch (error) {
            console.warn(`Could not extract dates from ${pdfUrl}: ${error.message}`);
          }
        }
        result[index] = { ...notice, date, documentDates };
      } catch (error) {
        console.warn(`Could not read the publication date for ${notice.url}: ${error.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(MAX_PARALLEL_ARTICLES, notices.length) }, () => worker()));
  return result.sort((left, right) => {
    if (!left.date) return right.date ? 1 : 0;
    if (!right.date) return -1;
    return right.date.localeCompare(left.date);
  });
}

async function getOfficialNotices() {
  const homepage = await fetchPage(OFFICIAL_HOME);
  return addPublishedDates(parseNoticeLinks(homepage));
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.statusCode = 405;
    response.end(JSON.stringify({ error: "Only GET requests are supported." }));
    return;
  }

  try {
    const notices = await getOfficialNotices();
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=300");
    response.statusCode = 200;
    response.end(JSON.stringify({ notices }));
  } catch (error) {
    console.error("Unable to load the official MAIT notice feed:", error);
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.statusCode = 502;
    response.end(JSON.stringify({ error: error.message || "Unable to load the official MAIT notice feed." }));
  }
}
