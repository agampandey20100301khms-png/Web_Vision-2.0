const OFFICIAL_HOME = "https://www.mait.ac.in/";
const ALLOWED_HOSTS = new Set(["mait.ac.in", "www.mait.ac.in"]);
const FETCH_TIMEOUT_MS = 8000;
const MAX_PARALLEL_ARTICLES = 6;

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

async function addPublishedDates(notices) {
  const result = notices.slice();
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < notices.length) {
      const index = nextIndex++;
      const notice = notices[index];
      try {
        const html = await fetchPage(notice.url);
        result[index] = { ...notice, date: parsePublishedDate(html) };
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
