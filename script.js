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
    headers: {
      'X-Master-Key': apiKey
    }
  })
    .then(res => res.json())
    .then(data => {
      currentData = data.record;
      callback();
    })
    .catch(err => console.error("Fetch error:", err));
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
    <h2>${capitalize(tabName)} Tab</h2>
    <form onsubmit="addItem('${tabName}'); return false;" style="margin-bottom: 20px;">
      <input type="text" id="${tabName}-name" placeholder="Product Name" required>
      <select id="${tabName}-status">
        <option value="Pending">Pending</option>
        <option value="In Process">In Process</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">Add</button>
    </form>
    <table class="styled-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Product Name</th>
          <th>Status</th>
          <th>Date Added</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody id="${tabName}-list"></tbody>
    </table>
  `;

  const list = document.getElementById(`${tabName}-list`);
  list.innerHTML = "";

  currentData[tabName].forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.status}</td>
      <td>${item.date || "—"}</td>
      <td><button onclick="deleteItem('${tabName}', ${index})">Delete</button></td>
    `;
    list.appendChild(tr);
  });
}

function addItem(tabName) {
  const name = document.getElementById(`${tabName}-name`).value;
  const status = document.getElementById(`${tabName}-status`).value;
  const date = new Date().toLocaleString();

  if (name.trim() === "") return;

  currentData[tabName].push({ name, status, date });
  saveData();
  renderTab(tabName);
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
