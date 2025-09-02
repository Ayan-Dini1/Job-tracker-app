<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Job Tracker App • Ayan Dini</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main class="wrap">
    <header class="head">
      <h1>Job Tracker</h1>
      <p class="muted">Track job applications with status, notes, search & export.</p>
    </header>

    <!-- Add / Edit -->
    <section class="card">
      <h2>Add / Edit Job</h2>
      <form id="jobForm" autocomplete="off">
        <div class="grid2">
          <label>
            <span>Position</span>
            <input id="position" type="text" placeholder="Frontend Developer" required />
          </label>
          <label>
            <span>Company</span>
            <input id="company" type="text" placeholder="Acme Inc." required />
          </label>
        </div>
        <div class="grid2">
          <label>
            <span>Status</span>
            <select id="status">
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </label>
          <label>
            <span>Notes</span>
            <input id="notes" type="text" placeholder="Recruiter email, next steps…" />
          </label>
        </div>
        <div class="row">
          <button type="submit" class="primary" id="submitBtn">Add Job</button>
          <button type="button" id="clearForm">Clear Form</button>
        </div>
      </form>
    </section>

    <!-- Controls -->
    <section class="card">
      <h2>Your Applications</h2>
      <div class="row wrap-controls">
        <label class="inline">
          <span>Status</span>
          <select id="filterStatus">
            <option>All</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </label>
        <label class="inline grow">
          <span>Search</span>
          <input id="search" type="text" placeholder="Search position, company or notes" />
        </label>
        <button id="exportCsv">Export CSV</button>
        <button id="clearAll" class="danger">Clear All</button>
      </div>

      <p id="counts" class="muted" style="margin-top:6px"></p>
      <div id="jobList" class="list" aria-live="polite"></div>
    </section>

    <footer class="foot">
      <p>© <span id="year"></span> Ayan Dini</p>
      <a href="https://comfy-swan-4aa8be.netlify.app" target="_blank" rel="noreferrer">Live Demo</a>
      <a href="https://github.com/Ayan-Dini1/Job-tracker-app" target="_blank" rel="noreferrer">Source Code</a>
    </footer>
  </main>

  <script src="app.js"></script>
</body>
</html>
