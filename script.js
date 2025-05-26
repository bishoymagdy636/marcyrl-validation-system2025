const binId = "6832d59f8561e97a501b3c6b";
const apiKey = "$2a$10$Qwz/rVHOM8oW1ObRlYgz/uIcqiEvj1e/bLngpd2/P3i2gf0flGbFq";

let currentData = {
  process: [],
  report: [],
  cleaning: [],
  risk: []
};

function fetchData(callback) {
  fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
    headers: { 'X-Master-Key': apiKey }
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.record) {
        currentData = {
          process: data.record.process || [],
          report: data.record.report || [],
          cleaning: data.record.cleaning || [],
          risk: data.record.risk || []
        };
      }
      callback();
    })
    .catch(err => {
      console.error("Fetch error:", err);
      callback(); // still call callback to avoid freeze
    });
}

function saveData() {
  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey
    },
    body: JSON.stringify(currentData)
  })
    .then(res => res.json())
    .then(() => console.log("Data saved"))
    .catch(err => console.error("Save error:", err));
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  const tab = document.getElementById(tabName);
  tab.style.display = 'block';
  renderTab(tabName);
}

function renderTab(tabName) {
  const tab = document.getElementById(tabName);
  tab.innerHTML = `
    <h2>${capitalize(tabName)} Validation</h2>
    <form onsubmit="addItem('${tabName}'); return false;" class="form">
      <input type="text" id="${tabName}-name" placeholder="Product Name" required>
      <select id="${tabName}-status">
        <option value="Pending">Pending</option>
        <option value="In Process">In Process</option>
        <option value="Completed">Completed</option>
      </select>
      <input type="date" id="${tabName}-start" required>
      <input type="date" id="${tabName}-end" required>
      <button type="submit">Add</button>
    </form>
    <div class="table-container">
      <table class="modern-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Date Added</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody id="${tabName}-list"></tbody>
      </table>
    </div>
  `;

  const list = document.getElementById(`${tabName}-list`);
  list.innerHTML = "";

  currentData[tabName].forEach((item, index) => {
    const tr = document.createElement("tr");

    const statusColor =
      item.status === "Pending" ? "#f0ad4e" :
      item.status === "In Process" ? "#5bc0de" :
      item.status === "Completed" ? "#5cb85c" : "#ddd";

    const endDate = new Date(item.endDate);
    const today = new Date();
    const diffDays = (endDate - today) / (1000 * 60 * 60 * 24);
    let alertIcon = "";

    if (diffDays <= 1) {
      alertIcon = `<span style="color:red;font-weight:bold;">&#9888;</span>`;
      setTimeout(() => {
        alert(`تنبيه: المنتج "${item.name}" اقترب من تاريخ الانتهاء!`);
      }, 500);
    }

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td><span style="background:${statusColor};color:white;padding:4px 8px;border-radius:5px;">${item.status}</span></td>
      <td>${item.startDate || "-"}</td>
      <td>${item.endDate || "-"} ${alertIcon}</td>
      <td>${item.date || "-"}</td>
      <td><button class="delete-btn" onclick="deleteItem('${tabName}', ${index})">Delete</button></td>
    `;
    list.appendChild(tr);
  });
}

function addItem(tabName) {
  const name = document.getElementById(`${tabName}-name`).value;
  const status = document.getElementById(`${tabName}-status`).value;
  const startDate = document.getElementById(`${tabName}-start`).value;
  const endDate = document.getElementById(`${tabName}-end`).value;
  const date = new Date().toLocaleString();

  if (name.trim() === "") return;

  currentData[tabName].push({ name, status, startDate, endDate, date });
  saveData();
  renderTab(tabName);

  // Clear form fields
  document.getElementById(`${tabName}-name`).value = "";
  document.getElementById(`${tabName}-start`).value = "";
  document.getElementById(`${tabName}-end`).value = "";
}

function deleteItem(tabName, index) {
  currentData[tabName].splice(index, 1);
  saveData();
  renderTab(tabName);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const error = document.getElementById("login-error");

  if (username === "Qa" && password === "qa12345") {
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    fetchData(() => showTab('process'));
  } else {
    error.textContent = "Invalid username or password";
  }
}
