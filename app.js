// ============================
// Job Tracker - app.js
// ============================

// ---- storage helpers ----
const KEY = "jobs";
const $ = (id) => document.getElementById(id);

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

// ---- state ----
let jobs = load();                 // [{ id, position, company, status, notes, createdAt }]
let editingId = null;

// ---- elements ----
const form       = $("jobForm");
const submitBtn  = $("submitBtn") || form?.querySelector("[type=submit]");
const positionEl = $("position");
const companyEl  = $("company");
const statusEl   = $("status");
const notesEl    = $("notes");

const filterEl   = $("filterStatus");
const searchEl   = $("search");
const listEl     = $("jobList");
const countsEl   = $("counts");

const yearEl     = $("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- form: clear/reset ----
$("clearForm")?.addEventListener("click", () => {
  editingId = null;
  form?.reset();
  if (submitBtn) submitBtn.textContent = "Add Job";
  positionEl?.focus();
});

// ---- form: submit (add or update) ----
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const position = positionEl.value.trim();
  const company  = companyEl.value.trim();
  const status   = statusEl.value;
  const notes    = notesEl.value.trim();

  if (!position || !company) {
    alert("Please fill Position and Company.");
    return;
  }

  if (editingId) {
    const i = jobs.findIndex(j => j.id === editingId);
    if (i > -1) jobs[i] = { ...jobs[i], position, company, status, notes };
    editingId = null;
    if (submitBtn) submitBtn.textContent = "Add Job";
  } else {
    jobs.push({
      id: Date.now(),
      position, company, status, notes,
      createdAt: Date.now()
    });
  }

  save(jobs);
  form.reset();
  render();
});

// ---- controls ----
filterEl?.addEventListener("change", render);
searchEl?.addEventListener("input", render);

$("exportCsv")?.addEventListener("click", () => {
  if (!jobs.length) return;

  const header = ["id","position","company","status","notes","createdAt"];
  const rows = jobs.map(j => [
    j.id,
    csvEscape(j.position),
    csvEscape(j.company),
    j.status,
    csvEscape(j.notes || ""),
    new Date(j.createdAt).toISOString()
  ]);

  const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = "jobs.csv";
  a.click();
  URL.revokeObjectURL(url);
});

$("clearAll")?.addEventListener("click", () => {
  if (!jobs.length) return;
  if (confirm("Delete all jobs? This cannot be undone.")) {
    jobs = [];
    save(jobs);
    render();
  }
});

// ---- render ----
function render() {
  if (!listEl) return;

  // filter + search + sort (newest first)
  const byStatus = filterEl?.value || "All";
  const term = (searchEl?.value || "").trim().toLowerCase();

  const filtered = jobs
    .filter(j => (byStatus === "All" ? true : j.status === byStatus))
    .filter(j =>
      !term ||
      j.position.toLowerCase().includes(term) ||
      j.company.toLowerCase().includes(term) ||
      (j.notes || "").toLowerCase().includes(term)
    )
    .sort((a,b) => b.createdAt - a.createdAt);

  // counts
  if (countsEl) {
    const total = jobs.length;
    const counts = jobs.reduce((acc, j) => {
      acc[j.status] = (acc[j.status] || 0) + 1;
      return acc;
    }, {});
    countsEl.textContent =
      `Total: ${total} · Applied: ${counts.Applied||0} · Interview: ${counts.Interview||0} · ` +
      `Offer: ${counts.Offer||0} · Rejected: ${counts.Rejected||0}`;
  }

  // paint list safely (no innerHTML with user input)
  listEl.textContent = "";
  if (!filtered.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No jobs found.";
    listEl.appendChild(p);
    return;
  }

  const frag = document.createDocumentFragment();
  filtered.forEach(job => frag.appendChild(renderItem(job)));
  listEl.appendChild(frag);
}

function renderItem(job) {
  const item = document.createElement("div");
  item.className = "job-entry";
  item.dataset.id = job.id;

  // header line: Position at Company | date
  const header = document.createElement("div");
  header.className = "job-header";

  const left = document.createElement("div");
  const strong = document.createElement("strong"); strong.textContent = job.position;
  const sep    = document.createElement("span");   sep.textContent    = " at ";
  const em     = document.createElement("em");     em.textContent     = job.company;
  left.appendChild(strong); left.appendChild(sep); left.appendChild(em);

  const right = document.createElement("div");
  right.className = "job-meta";
  right.textContent = new Date(job.createdAt).toLocaleDateString();

  header.appendChild(left);
  header.appendChild(right);

  // status line with color-coded badge
  const statusLine  = document.createElement("div");
  const statusLabel = document.createElement("span"); statusLabel.textContent = "Status: ";
  const statusBadge = document.createElement("span");
  statusBadge.className = "badge";
  statusBadge.textContent = job.status;
  statusBadge.dataset.status = job.status; // <-- enables CSS color-coding

  statusLine.appendChild(statusLabel);
  statusLine.appendChild(statusBadge);

  // notes line
  const notesLine = document.createElement("div");
  const nL = document.createElement("span"); nL.textContent = "Notes: ";
  const nT = document.createElement("span"); nT.textContent = job.notes || "—";
  notesLine.appendChild(nL); notesLine.appendChild(nT);

  // action buttons
  const btns = document.createElement("div");
  btns.className = "buttons";

  const edit = document.createElement("button");
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEdit(job.id));

  const del = document.createElement("button");
  del.textContent = "Delete";
  del.className = "danger";
  del.addEventListener("click", () => remove(job.id));

  btns.appendChild(edit);
  btns.appendChild(del);

  // assemble
  item.appendChild(header);
  item.appendChild(statusLine);
  item.appendChild(notesLine);
  item.appendChild(btns);
  return item;
}

function startEdit(id) {
  const j = jobs.find(x => x.id === id);
  if (!j) return;
  positionEl.value = j.position;
  companyEl.value  = j.company;
  statusEl.value   = j.status;
  notesEl.value    = j.notes || "";
  editingId = id;
  if (submitBtn) submitBtn.textContent = "Save Changes";
  positionEl.focus();
}

function remove(id) {
  if (!confirm("Delete this job?")) return;
  jobs = jobs.filter(j => j.id !== id);
  save(jobs);
  render();
}

// ---- CSV escape helper ----
function csvEscape(v){
  const s = String(v).replace(/"/g,'""');
  return /[,\"\n]/.test(s) ? `"${s}"` : s;
}

// ---- initial paint ----
render();
