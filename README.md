# Maharaja Agrasen Institute of Technology — Campus & Academics

A formal, public-facing redesign concept for Maharaja Agrasen Institute of Technology (MAIT). The homepage introduces the institute to prospective students, families, alumni, and visitors. Student demo access is available separately from the top-right Student Portal link.

This is an independent educational project, not an official MAIT service. It is not affiliated with or endorsed by MAIT, and it does not connect to institute accounts or student records. Institute facts and photographs link to MAIT's official website; figures without a clearly stated reporting period are not presented as current statistics.

## What’s included

- Responsive institute overview with MAIT's official logo and campus photography.
- Readable typography and a light/dark appearance toggle that is saved in the browser.
- Verified profile highlights: established in 1999, 13 engineering disciplines, and 10 campus blocks, as described in MAIT's institute profile.
- Notice feed sourced from MAIT’s public website, with links to the original notices and dates only when published.
- Institute, career-development, academic-calendar, contact, and legal links.
- Separate student portal and course-scoped demo dashboard for Lavish Hurria, with sample attendance, marks, and notices.
- A locally bundled illustrative stock portrait; it is not verified to depict the demo student.

## Run locally

```bash
npm install
npm run dev
```

The dev server uses `127.0.0.1:5173` with a strict port. Open <http://127.0.0.1:5173/>. Keep the dev process running to retain the local fallback if the hosted site is unavailable. The `/api/notices` endpoint fetches public content from MAIT, so the feed depends on MAIT’s site being reachable.

## Demo access

- **Student ID:** `LAVISH-CSE-04`
- **Password:** `maitdemo2026`

This is a front-end-only demonstration login. Attendance and marks are sample values and are not official academic records. Do not enter real student credentials.

## Official sources

- [MAIT homepage and public notices](https://www.mait.ac.in/)
- [About MAIT](https://mait.ac.in/index.php/abouts/about-us.html)
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
