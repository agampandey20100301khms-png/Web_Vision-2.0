import React, { useEffect, useMemo, useState } from "react";

const OFFICIAL_NOTICES_URL = "https://mait.ac.in/index.php?option=com_sppagebuilder&view=page&id=6";
const OFFICIAL_HOME_URL = "https://www.mait.ac.in/";
const categories = ["All notices", "Academics", "Examinations", "Admissions", "Campus"];
const demoAccount = {
  studentId: "LAVISH-CSE-04",
  password: "maitdemo2026",
  name: "Lavish Hurria",
  program: "B.Tech",
  branch: "Computer Science and Engineering",
  semester: "4",
};

function formatDate(dateString, options = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-IN", options).format(new Date(`${dateString}T12:00:00`));
}

function Brand({ onClick }) {
  return (
    <button className="brand" type="button" onClick={onClick} aria-label="MAIT home">
      <img className="brand-mark" src="https://www.mait.ac.in/images/MAIT_LOGO.png" alt="Maharaja Agrasen Institute of Technology" />
      <span className="brand-copy">
        <strong>MAIT</strong>
        <small>ROHINI · NEW DELHI</small>
      </span>
    </button>
  );
}

function NoticeCard({ notice, compact = false }) {
  return (
    <a
      className={`notice-card${compact ? " notice-card-compact" : ""}`}
      href={notice.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${notice.title} — open official MAIT notice`}
    >
      <div className="notice-date">
        <span>{notice.date ? formatDate(notice.date, { day: "2-digit", month: "short" }).replace(" ", "\n") : "Date\nunlisted"}</span>
        <span className="notice-dot" />
      </div>
      <div className="notice-content">
        <div className="notice-meta">
          <span className="notice-category">{notice.category}</span>
          <span className="notice-audience">Official MAIT notice</span>
        </div>
        <h3>{notice.title}</h3>
        <p>Open the original notice for full details and attachments.</p>
      </div>
      <span className="notice-arrow" aria-hidden="true">↗</span>
    </a>
  );
}

function OfficialLink({ href, children }) {
  return (
    <a className="external-link" href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function CampusHighlights() {
  return (
    <>
      <section className="institution-section" id="about">
        <div className="institution-intro">
          <span className="eyebrow">ABOUT THE INSTITUTE</span>
          <h2>Education with<br /><em>purpose and possibility.</em></h2>
          <p>
            Established in 1999 by Maharaja Agrasen Technical Education Society, Maharaja
            Agrasen Institute of Technology offers programmes in engineering and management.
            Its campus includes teaching blocks, laboratories, a Learning Resource Centre,
            student facilities and an auditorium.
          </p>
          <OfficialLink href="https://mait.ac.in/index.php/abouts/about-us.html">Read MAIT’s official institute profile</OfficialLink>
        </div>
        <div className="institution-links">
          <OfficialLink href="https://mait.ac.in/index.php/abouts/vision.html">Vision, mission &amp; values</OfficialLink>
          <OfficialLink href="https://mait.ac.in/index.php/institute/achievements.html">Achievements &amp; institutional updates</OfficialLink>
          <OfficialLink href="https://mait.ac.in/index.php/about/alumni-achievements.html">Alumni achievements</OfficialLink>
          <OfficialLink href="https://mait.ac.in/index.php/contact-us.html">Campus address &amp; directions</OfficialLink>
        </div>
      </section>

      <section className="placement-section" id="placements">
        <div className="placement-copy">
          <span className="eyebrow">CAREER DEVELOPMENT</span>
          <h2>Preparing for<br /><em>what comes next.</em></h2>
          <p>
            Explore MAIT’s official placement records, Career Development Cell and
            industry-institute initiatives. Placement information is published by the
            institute; consult the linked reports for the relevant academic year and context.
          </p>
          <OfficialLink href="https://mait.ac.in/index.php/placements/placement-details.html">
            View official placement details
          </OfficialLink>
        </div>
        <div className="placement-metrics">
          <a className="placement-metric featured" href="https://mait.ac.in/index.php/placements/placement-details.html" target="_blank" rel="noreferrer">
            <strong>Placement<br />records</strong><span>Explore published<br />year-wise information <b aria-hidden="true">↗</b></span>
          </a>
          <a className="placement-metric" href="https://mait.ac.in/index.php/placements/campus-placement-support.html" target="_blank" rel="noreferrer">
            <strong>Career</strong><span>Development Cell<br />and campus support <b aria-hidden="true">↗</b></span>
          </a>
          <a className="placement-metric" href="https://mait.ac.in/index.php/placements/industry-institute-interaction-cell-committee.html" target="_blank" rel="noreferrer">
            <strong>Industry</strong><span>Institute interaction<br />and collaboration <b aria-hidden="true">↗</b></span>
          </a>
          <p>All placement information is attributed to MAIT. Please verify figures and dates in the official reports.</p>
        </div>
      </section>

      <section className="resources-section" id="resources">
        <div className="section-heading">
          <div>
            <span className="eyebrow">OFFICIAL INFORMATION</span>
            <h2>Explore MAIT</h2>
            <p>Go directly to the institute’s published information and services.</p>
          </div>
        </div>
        <div className="resource-grid">
          <a className="resource-card" href={OFFICIAL_NOTICES_URL} target="_blank" rel="noreferrer">
            <span className="resource-number">01 / CAMPUS</span><strong>Notice board</strong>
            <span>Official announcements and circulars</span><b aria-hidden="true">↗</b>
          </a>
          <a className="resource-card" href="https://mait.ac.in/index.php/portfolio/academic-calendar.html" target="_blank" rel="noreferrer">
            <span className="resource-number">02 / ACADEMICS</span><strong>Academic calendar</strong>
            <span>Key dates for the academic year</span><b aria-hidden="true">↗</b>
          </a>
          <a className="resource-card" href="https://mait.ac.in/index.php/placements/campus-placement-support.html" target="_blank" rel="noreferrer">
            <span className="resource-number">03 / CAREERS</span><strong>Placement support</strong>
            <span>Placement details and campus support</span><b aria-hidden="true">↗</b>
          </a>
          <a className="resource-card" href="https://mait.ac.in/index.php/contact-us.html" target="_blank" rel="noreferrer">
            <span className="resource-number">04 / CONTACT</span><strong>Contact MAIT</strong>
            <span>Official contact details and directions</span><b aria-hidden="true">↗</b>
          </a>
        </div>
      </section>
    </>
  );
}

function CampusFacts() {
  return (
    <section className="facts-strip" aria-label="MAIT at a glance">
      <div className="fact-item"><strong>1999</strong><span>Established by Maharaja Agrasen Technical Education Society</span></div>
      <div className="fact-item"><strong>13</strong><span>Engineering disciplines listed on the institute profile</span></div>
      <div className="fact-item"><strong>10 blocks</strong><span>Campus facilities described in the official profile</span></div>
      <OfficialLink href="https://mait.ac.in/index.php/abouts/about-us.html">Institute profile source</OfficialLink>
    </section>
  );
}

function CampusGallery() {
  const photos = [
    { src: "https://www.mait.ac.in/images/slideshow/blockview.jpg", alt: "Academic block at the MAIT campus", className: "campus-photo-wide" },
    { src: "https://www.mait.ac.in/images/slideshow/gm2025.jpg", alt: "A photograph featured on the official MAIT website", className: "" },
    { src: "https://www.mait.ac.in/images/2025/09/17/photos.png", alt: "A campus photograph featured on the official MAIT website", className: "" },
  ];

  return (
    <section className="campus-gallery-section" aria-labelledby="campus-gallery-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">CAMPUS &amp; COMMUNITY</span>
          <h2 id="campus-gallery-title">A place to learn and grow</h2>
          <p>Official photographs from MAIT’s published website.</p>
        </div>
        <OfficialLink href={OFFICIAL_HOME_URL}>Visit MAIT’s official website</OfficialLink>
      </div>
      <div className="campus-gallery">
        {photos.map((photo) => (
          <figure className={`campus-photo ${photo.className}`} key={photo.src}>
            <img src={photo.src} alt={photo.alt} loading="lazy" />
            <figcaption>
              <span>OFFICIAL MAIT PHOTOGRAPH</span>
              <a href={OFFICIAL_HOME_URL} target="_blank" rel="noreferrer">Official website ↗</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function NoticeBoard({
  dashboard = false,
  student,
  notices,
  loading,
  noticeError,
  archive: selectedArchive,
  onArchiveChange,
}) {
  const [category, setCategory] = useState("All notices");
  const [query, setQuery] = useState("");
  const [localArchive, setLocalArchive] = useState("all");
  const archive = selectedArchive ?? localArchive;
  const changeArchive = onArchiveChange ?? setLocalArchive;

  const visibleNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchesProgram = !student || !notice.programs?.length || notice.programs.includes(student.program);
      const matchesBranch = !student || !notice.branches?.length || notice.branches.includes(student.branchCode);
      const matchesSemester = !student || !notice.semesters?.length || notice.semesters.includes(Number(student.semester));
      const matchesCategory = category === "All notices" || notice.category === category;
      const matchesArchive = archive === "all" || (archive === "undated" ? !notice.date : notice.date?.startsWith(archive));
      const searchable = `${notice.title} ${notice.category}`.toLowerCase();
      return matchesProgram && matchesBranch && matchesSemester && matchesCategory && matchesArchive && searchable.includes(query.toLowerCase());
    });
  }, [archive, category, notices, query, student]);

  const archiveMonths = useMemo(() => {
    const counts = new Map();
    notices.forEach((notice) => {
      if (notice.date) {
        const month = notice.date.slice(0, 7);
        counts.set(month, (counts.get(month) ?? 0) + 1);
      }
    });
    return [...counts.entries()]
      .sort(([left], [right]) => right.localeCompare(left))
      .map(([value, count]) => ({
        value,
        count,
        label: formatDate(`${value}-01`, { month: "long", year: "numeric" }),
      }));
  }, [notices]);

  return (
    <section className={`notice-section${dashboard ? " dashboard-notices" : ""}`} id="notices">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{dashboard ? "YOUR CAMPUS, FILTERED" : "THE LATEST FROM CAMPUS"}</span>
          <h2>{dashboard ? "Notices for you" : "The notice board"}</h2>
          <p>
            {dashboard
              ? `Updates for ${student.branch}, semester ${student.semester}.`
              : "The important things, in one place. No digging through menus."}
          </p>
        </div>
        {dashboard && (
          <a className="text-button" href={OFFICIAL_NOTICES_URL} target="_blank" rel="noreferrer">
            Browse all campus notices <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      <div className="notice-tools">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notices"
            aria-label="Search notices"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </label>
        <label className="archive-select">
          <span className="sr-only">Filter archive by date</span>
          <select value={archive} onChange={(event) => changeArchive(event.target.value)}>
            <option value="all">All archive dates</option>
            {archiveMonths.map((month) => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
            {notices.some((notice) => !notice.date) && <option value="undated">Date not listed</option>}
          </select>
          <span aria-hidden="true">⌄</span>
        </label>
      </div>

      <div className="category-list" role="group" aria-label="Filter by notice category">
        {categories.map((item) => (
          <button
            className={category === item ? "category-chip active" : "category-chip"}
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
          >
            {item}
          </button>
        ))}
      </div>

      {loading && <div className="feed-status" role="status">Loading current notices from mait.ac.in…</div>}
      {noticeError && (
        <div className="feed-error" role="alert">
          <strong>Official notices couldn’t be loaded.</strong>
          <span>{noticeError}</span>
          <a href={OFFICIAL_NOTICES_URL} target="_blank" rel="noreferrer">Open the MAIT notice board ↗</a>
        </div>
      )}
      {!loading && !noticeError && <div className="notice-list" aria-live="polite">
        {visibleNotices.map((notice) => <NoticeCard key={notice.id} notice={notice} compact={dashboard} />)}
        {visibleNotices.length === 0 && (
          <div className="empty-state">
            <span aria-hidden="true">⌕</span>
            <strong>{notices.length ? "No notices found" : "No official notices are available"}</strong>
            <p>{notices.length ? "Try another search or choose a different date or category." : "Check the official MAIT notice board for current information."}</p>
          </div>
        )}
      </div>}
      {!dashboard && (
        <p className="sample-note">Live notices sourced from <a href={OFFICIAL_HOME_URL} target="_blank" rel="noreferrer">mait.ac.in ↗</a></p>
      )}
    </section>
  );
}

function LoginCard({ onLogin }) {
  const [studentId, setStudentId] = useState(demoAccount.studentId);
  const [passcode, setPasscode] = useState(demoAccount.password);
  const [loginError, setLoginError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (studentId.trim().toLowerCase() !== demoAccount.studentId.toLowerCase() || passcode !== demoAccount.password) {
      setLoginError("That demo ID or password doesn’t match. Use the test credentials shown below.");
      return;
    }
    setLoginError("");
    onLogin(demoAccount);
  }

  return (
    <aside className="login-card" id="student-login">
      <div className="login-card-top">
        <span className="login-icon" aria-hidden="true">↗</span>
        <span className="eyebrow">STUDENT ACCESS</span>
      </div>
      <h2>Student information,<br />in one place.</h2>
      <p className="login-intro">Use the demonstration account to preview a course-specific student dashboard.</p>
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="student-id">Student ID</label>
        <input
          id="student-id"
          autoComplete="username"
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
          placeholder="Student ID"
          required
        />
        <label className="form-label" htmlFor="student-passcode">Password</label>
        <input
          id="student-passcode"
          type="password"
          autoComplete="current-password"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          placeholder="Password"
          required
        />
        <button className="primary-button login-submit" type="submit">
          Open my dashboard <span aria-hidden="true">↗</span>
        </button>
      </form>
      {loginError && <p className="login-error" role="alert">{loginError}</p>}
      <div className="prototype-note">
        <span aria-hidden="true">ⓘ</span>
        Demo access only. This does not connect to MAIT student accounts or records.
      </div>
      <div className="demo-credentials">
        <span>TEST STUDENT</span>
        <code>{demoAccount.studentId}</code>
        <code>{demoAccount.password}</code>
      </div>
      <a className="login-help" href="https://www.mait.ac.in/index.php/component/content/article/student-verification.html?catid=10&Itemid=384" target="_blank" rel="noreferrer">
        Need help with your student account? <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}

function HomePage({ onStudentLogin, notices, loading, noticeError, archive, setArchive }) {
  const archiveMonths = useMemo(() => {
    const counts = new Map();
    notices.forEach((notice) => {
      if (notice.date) {
        const month = notice.date.slice(0, 7);
        counts.set(month, (counts.get(month) ?? 0) + 1);
      }
    });
    return [...counts.entries()]
      .sort(([left], [right]) => right.localeCompare(left))
      .map(([value, count]) => ({
        value,
        count,
        label: formatDate(`${value}-01`, { month: "long", year: "numeric" }),
      }));
  }, [notices]);

  return (
    <div className="public-site">
      <header className="site-header">
        <Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <nav className="main-nav" aria-label="Main navigation">
          <a href={OFFICIAL_NOTICES_URL} target="_blank" rel="noreferrer">Official notices ↗</a>
          <a href="#archives">Archives</a>
          <a href="#about">Discover MAIT</a>
          <a href="#placements">Careers</a>
          <a href="#resources">Information</a>
        </nav>
        <button className="header-login" type="button" onClick={onStudentLogin}>Student portal <span aria-hidden="true">↗</span></button>
      </header>
      <main>
        <section className="welcome-layout">
          <div className="welcome-copy">
            <div className="welcome-kicker"><span /> ROHINI, NEW DELHI <span className="kicker-divider">/</span> ESTABLISHED 1999</div>
            <h1>Knowledge for<br />a changing <em>world.</em></h1>
            <p className="welcome-description">
              Maharaja Agrasen Institute of Technology brings together engineering and management education, campus life and industry engagement in Rohini, New Delhi.
            </p>
            <div className="welcome-actions">
              <a className="primary-button" href="#about">Discover the institute <span aria-hidden="true">↓</span></a>
              <a className="action-caption official-home-link" href="https://mait.ac.in/index.php/abouts/about-us.html" target="_blank" rel="noreferrer">Official institute profile ↗</a>
            </div>
            <div className="welcome-foot">
              <span className="live-dot" /> ACADEMICS · CAMPUS · OPPORTUNITY
            </div>
          </div>
          <figure className="hero-visual">
            <img src="https://www.mait.ac.in/images/slideshow/blockview.jpg" alt="Courtyard fountain at the MAIT campus in Rohini" />
            <figcaption><span>MAIT CAMPUS · ROHINI</span><a href={OFFICIAL_HOME_URL} target="_blank" rel="noreferrer">Photograph: official MAIT website ↗</a></figcaption>
          </figure>
        </section>

        <CampusFacts />
        <CampusGallery />
        <section className="notice-home-layout">
          <NoticeBoard
            notices={notices}
            loading={loading}
            noticeError={noticeError}
            archive={archive}
            onArchiveChange={setArchive}
          />
          <aside className="archive-aside" id="archives">
            <span className="eyebrow">INSTITUTE NOTICES</span>
            <h2>Official updates,<br /><em>in context.</em></h2>
            <p>Browse current notices and dated archive entries. Each item links back to the official MAIT source.</p>
            <div className="archive-months">
              {archiveMonths.map((month, index) => {
                return (
                  <a className="archive-month" href="#notices" key={month.value} onClick={() => setArchive(month.value)}>
                    <span><span className="archive-index">0{index + 1}</span>{month.label}</span>
                    <span>{String(month.count).padStart(2, "0")} <span aria-hidden="true">↗</span></span>
                  </a>
                );
              })}
            </div>
            <p className="archive-footnote">
              {loading ? "Loading archive dates from MAIT…" : archiveMonths.length
                ? "Archive dates are taken from the official notice pages."
                : "Published dates appear here when MAIT provides them."}
            </p>
          </aside>
        </section>
        <CampusHighlights />
      </main>
      <SiteFooter />
    </div>
  );
}

function StudentPortalPage({ onLogin, onBack }) {
  return (
    <div className="portal-site">
      <header className="site-header portal-header">
        <Brand onClick={onBack} />
        <button className="header-login" type="button" onClick={onBack}>Back to MAIT <span aria-hidden="true">↗</span></button>
      </header>
      <main className="portal-layout">
        <section className="portal-intro">
          <span className="eyebrow">STUDENT SERVICES · DEMONSTRATION</span>
          <h1>Student portal</h1>
          <p>Sign in to preview a course-specific dashboard concept with notices and sample academic information.</p>
          <div className="portal-disclosure">
            This prototype is not connected to MAIT accounts or student records. Use only the demonstration credentials shown on this page.
          </div>
        </section>
        <LoginCard onLogin={onLogin} />
      </main>
      <SiteFooter />
    </div>
  );
}

function Avatar({ name }) {
  return (
    <div className="student-avatar-wrap">
      <img
        className="student-avatar"
        src="/images/demo-student.jpg"
        alt="Illustrative demo-student portrait"
        onError={(event) => {
          event.currentTarget.hidden = true;
          event.currentTarget.nextElementSibling.hidden = false;
        }}
      />
      <span className="student-avatar-fallback" hidden aria-hidden="true">
        {name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
      </span>
      <a className="avatar-caption" href="https://unsplash.com/" target="_blank" rel="noreferrer">STOCK PHOTO · UNSPLASH</a>
    </div>
  );
}

function Dashboard({ student, notices, loading, noticeError, onLogout }) {
  const firstName = student.name.split(" ")[0];
  return (
    <>
      <header className="site-header dashboard-header">
        <Brand onClick={onLogout} />
        <div className="dashboard-context"><span className="live-dot" /> STUDENT SPACE <span>/</span> {student.program}</div>
        <button className="header-login" type="button" onClick={onLogout}>Sign out <span aria-hidden="true">↗</span></button>
      </header>
      <main className="dashboard-layout">
        <aside className="student-sidebar">
          <div className="profile-block">
            <Avatar name={student.name} />
            <span className="eyebrow">YOUR STUDENT PROFILE</span>
            <h1>{student.name}</h1>
            <p className="student-id">{student.studentId}</p>
            <div className="profile-tags"><span>{student.program}</span><span>Semester {student.semester}</span></div>
            <p className="branch-name">{student.branch}</p>
          </div>
          <div className="sidebar-divider" />
          <div className="academic-progress">
            <div className="sidebar-title"><span>01</span> Attendance</div>
            <div className="progress-value"><strong>86</strong><span>%</span><span className="progress-status">DEMO</span></div>
            <div className="progress-track"><span style={{ width: "86%" }} /></div>
            <p>Sample attendance value · not linked to MAIT records.</p>
          </div>
          <div className="sidebar-divider" />
          <div className="academic-progress marks-progress">
            <div className="sidebar-title"><span>02</span> Academic snapshot</div>
            <div className="progress-value"><strong>8.4</strong><span className="gpa-label">CGPA</span></div>
            <p>Sample values only · not linked to MAIT records.</p>
            <div className="marks-row">
              <span>Last semester</span><strong>8.7 SGPA <span aria-hidden="true">↗</span></strong>
            </div>
          </div>
          <div className="profile-side-footer">DEMO STUDENT PROFILE <span>•</span> NOT OFFICIAL RECORDS</div>
        </aside>

        <section className="dashboard-main">
          <div className="dashboard-welcome">
            <div className="welcome-kicker"><span /> YOUR MAIT, YOUR WAY</div>
            <h2>Good to see you,<br /><em>{firstName}.</em></h2>
            <p>Your semester at a glance. Important updates, without the noise.</p>
            <div className="dashboard-today">
              <span className="today-mark">✳</span>
              <span><strong>One space, less searching.</strong><small>Notices are matched to your course and semester.</small></span>
            </div>
          </div>
          <NoticeBoard dashboard student={student} notices={notices} loading={loading} noticeError={noticeError} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
          <p>An independent redesign of the MAIT public website by Lavish Hurria.<br />Not affiliated with or endorsed by MAIT.</p>
        </div>
        <div className="footer-contact">
          <span className="eyebrow">INSTITUTE CONTACT · OFFICIAL SOURCE</span>
          <a href="mailto:mait@mait.ac.in">mait@mait.ac.in</a>
          <a href="tel:+918448186942">+91 84481 86942</a>
          <span>PSP Area, Plot No-1, Sector-22,<br />Rohini, Delhi-110086, India</span>
        </div>
        <div className="footer-links">
          <span className="eyebrow">SOURCE &amp; POLICIES</span>
          <OfficialLink href={OFFICIAL_HOME_URL}>Official MAIT website</OfficialLink>
          <OfficialLink href="https://mait.ac.in/index.php/component/content/article/privacy-policy.html?catid=10&Itemid=384">Privacy policy</OfficialLink>
          <OfficialLink href="https://mait.ac.in/index.php/component/content/article/terms-of-use.html?catid=10&Itemid=384">Terms of use</OfficialLink>
          <OfficialLink href="https://mait.ac.in/index.php/contact-us.html">Copyright &amp; contact</OfficialLink>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Institutional information and photographs link to MAIT’s official website.</span>
        <span>Independent redesign concept by Lavish Hurria · Not an official MAIT service.</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [student, setStudent] = useState(null);
  const [studentPortalOpen, setStudentPortalOpen] = useState(false);
  const [notices, setNotices] = useState([]);
  const [noticeError, setNoticeError] = useState("");
  const [loading, setLoading] = useState(true);
  const [archive, setArchive] = useState("all");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/notices", { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "The MAIT notice service is unavailable.");
        if (!Array.isArray(result.notices)) throw new Error("The MAIT notice response was not in the expected format.");
        setNotices(result.notices);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setNoticeError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  function handleLogin() {
    setStudent({ ...demoAccount, branchCode: "CSE" });
    setStudentPortalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLogout() {
    setStudent(null);
    setStudentPortalOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (student) {
    return <Dashboard student={student} notices={notices} loading={loading} noticeError={noticeError} onLogout={handleLogout} />;
  }

  return studentPortalOpen
    ? <StudentPortalPage onLogin={handleLogin} onBack={() => setStudentPortalOpen(false)} />
    : <HomePage onStudentLogin={() => { setStudentPortalOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }); }} notices={notices} loading={loading} noticeError={noticeError} archive={archive} setArchive={setArchive} />;
}
