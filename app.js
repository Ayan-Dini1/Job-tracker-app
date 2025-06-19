let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

document.getElementById("jobForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const job = {
        id: Date.now(),
        position: document.getElementById("position").value,
        company: document.getElementById("company").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value,
    };
    jobs.push(job);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    this.reset();
    renderJobs();
});

document.getElementById("filterStatus").addEventListener("change", renderJobs);

function deleteJob(id) {
    jobs = jobs.filter(job => job.id !== id);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    renderJobs();
}

function renderJobs() {
    const list = document.getElementById("jobList");
    list.innerHTML = "";
    const filter = document.getElementById("filterStatus").value;
    const filteredJobs = filter === "All" ? jobs : jobs.filter(j => j.status === filter);
    filteredJobs.forEach(job => {
        const div = document.createElement("div");
        div.className = "job-entry";
        div.innerHTML = `
            <strong>${job.position}</strong> at <em>${job.company}</em><br />
            Status: ${job.status}<br />
            Notes: ${job.notes}<br />
            <button onclick="deleteJob(${job.id})">Delete</button>
        `;
        list.appendChild(div);
    });
}

renderJobs();
