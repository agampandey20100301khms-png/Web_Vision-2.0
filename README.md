# Maharaja Agrasen Institute of Technology — Campus & Academics (https://webvision-five.vercel.app/)

A formal, public-facing redesign concept for Maharaja Agrasen Institute of Technology (MAIT). The homepage introduces the institute to prospective students, families, alumni, and visitors. Student demo access is available separately from the top-right Student Portal link.

This is an independent educational project, not an official MAIT service. It is not affiliated with or endorsed by MAIT, and it does not connect to institute accounts or student records. Institute facts and photographs link to MAIT's official website; figures without a clearly stated reporting period are not presented as current statistics.

## What’s included

- Responsive institute overview with MAIT's official logo and locally bundled campus photography, so images do not depend on third-party image hosts.
- Readable typography and a light/dark appearance toggle that is saved in the browser.
- Verified profile highlights: established in 1999, 13 engineering disciplines, and 10 campus blocks, as described in MAIT's institute profile.
- Notice feed sourced from MAIT’s public website, with source links, published dates, and clearly separated dates extracted from attached PDFs.
- Prospective-student guide with the current MAIT-published fee and hostel tables, 2026–27 admission links, published engineering programmes, NBA record links, and AICTE approval documents. Fee and source metadata are refreshed from MAIT’s public pages.
- A source-grounded retrieval assistant for admissions, fees, programmes, scholarships, accreditation, placements, and the current course-filtered notice feed. Answers link to the MAIT pages used.
- Institute, career-development, academic-calendar, contact, and legal links.
- Separate student portal and course-scoped demo dashboard for Lavish Hurria, with sample attendance, marks, and notices.
- A locally bundled illustrative stock portrait; it is not verified to depict the demo student.

## Run locally

```bash
npm install
npm run dev
```

The dev server uses `127.0.0.1:5173` with a strict port. Open <http://127.0.0.1:5173/>. Keep the dev process running to retain the local fallback if the hosted site is unavailable. The `/api/notices` endpoint fetches public content from MAIT, so the feed depends on MAIT’s site being reachable.

The logo and campus images are served from `public/images`. Only live notices and links to official MAIT pages require an internet connection.

The college information endpoint fetches a fixed list of public MAIT pages and refreshes its in-process cache every ten minutes. If a source cannot be reached or its fee table cannot be parsed, the page reports that state and links to the official source instead of presenting estimated values.

## Local Qwen assistant

The development API uses Ollama on `127.0.0.1:11434` for local Qwen generation, grounded in retrieved excerpts from official MAIT pages. The default model is `qwen3.5:4b`; set `MAIT_OLLAMA_MODEL` to use another model already installed in Ollama. On a new machine, install Ollama and pull the chosen model, then keep the Ollama service running while using the assistant. If Ollama is unavailable, the assistant reports that and shows matching official excerpts.

The Vercel deployment does not connect to a developer’s machine or expose an Ollama endpoint. Online answers use source-linked retrieval from the same official pages; model generation remains local-only unless a separately hosted, secured inference service is deliberately configured.

## Demo access

- **Student ID:** `LAVISH-CSE-04`
- **Password:** `maitdemo2026`

This is a front-end-only demonstration login. Attendance and marks are sample values and are not official academic records. Do not enter real student credentials.

## Official sources

- [MAIT homepage and public notices](https://www.mait.ac.in/)
- [About MAIT](https://mait.ac.in/index.php/abouts/about-us.html)
- [MAIT fees and hostel charges](https://www.mait.ac.in/index.php/portfolio/fees.html)
- [MAIT admissions 2026–27](https://www.mait.ac.in/index.php/component/content/article/admissions-2026-27.html?catid=9&Itemid=384)
- [GGSIPU admissions 2026](https://ipu.ac.in/adm2026/adm2026main.php)
- [Programmes and courses of study](https://mait.ac.in/index.php/portfolio/course-of-study.html)
- [Academic calendar](https://mait.ac.in/index.php/portfolio/academic-calendar.html)
- [NBA accreditation records](https://mait.ac.in/index.php/component/content/article/present-accreditation-status-with-nba.html?catid=9&Itemid=384)
- [AICTE approval documents](https://mait.ac.in/index.php/component/content/article/aicte-feedback-approvals.html?catid=9&Itemid=384)
- [Scholarships](https://mait.ac.in/index.php/portfolio/scholarships.html)
- [Vision, mission, and values](https://mait.ac.in/index.php/abouts/vision.html)
- [Placement details](https://mait.ac.in/index.php/placements/placement-details.html)
- [Career development and campus placement support](https://mait.ac.in/index.php/placements/campus-placement-support.html)
- [Contact MAIT](https://mait.ac.in/index.php/contact-us.html)
- [MAIT privacy policy](https://mait.ac.in/index.php/component/content/article/privacy-policy.html?catid=10&Itemid=384)
- [MAIT terms of use](https://mait.ac.in/index.php/component/content/article/terms-of-use.html?catid=10&Itemid=384)

The institute and placement pages may be updated by MAIT. Verify current details and the reporting period at the linked official sources. Undated notices are not assigned invented dates. The student portal is a UI demonstration and must not be used with real student credentials.

## Build and deployment

```bash
npm run build
npx vercel --prod
```

The project is configured for Vercel, including the `/api/notices` serverless endpoint. The built static site is emitted to `dist/`.
