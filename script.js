// script.js

const apiKey = "$2a$10$Qwz/rVHOM8oW1ObRlYgz/uIcqiEvj1e/bLngpd2/P3i2gf0flGbFq"; const binId = "6832d59f8561e97a501b3c6b"; const baseUrl = https://api.jsonbin.io/v3/b/${binId};

const usernameInput = document.getElementById("username"); const passwordInput = document.getElementById("password"); const loginPage = document.getElementById("login-page"); const mainContent = document.getElementById("main-content"); const loginError = document.getElementById("login-error");

const tabs = ["process", "report", "cleaning", "risk"]; let data = { process: [], report: [], cleaning: [], risk: [] };

function login() { const username = usernameInput.value; const password = passwordInput.value; if (username === "Qa" && password === "qa12345") { loginPage.style.display = "none"; mainContent.style.display = "block"; fetchData(); } else { loginError.textContent = "Invalid username or password."; } }

function showTab(tab) { tabs.forEach(t => { document.getElementById(t).style.display = t === tab ? "block" : "none"; }); renderTab(tab); }

function renderTab(tab) { const container = document.getElementById(tab); container.innerHTML = <h2>${tab.toUpperCase()}</h2> <input type="text" id="${tab}-name" placeholder="Product Name"> <select id="${tab}-status"> <option value="Pending">Pending</option> <option value="In Process">In Process</option> <option value="Completed">Completed</option> </select> <button onclick="addItem('${tab}')">Add</button> <ul id="${tab}-list"></ul>;

const list = container.querySelector("ul"); data[tab].forEach((item, index) => { const li = document.createElement("li"); li.innerHTML = ${item.name} - ${item.status} <button onclick="deleteItem('${tab}', ${index})">Delete</button>; list.appendChild(li); }); }

function addItem(tab) { const nameInput = document.getElementById(${tab}-name); const statusInput = document.getElementById(${tab}-status); if (!nameInput.value.trim()) return; data[tab].push({ name: nameInput.value, status: statusInput.value }); updateBin(); renderTab(tab); nameInput.value = ""; }

function deleteItem(tab, index) { data[tab].splice(index, 1); updateBin(); renderTab(tab); }

function fetchData() { fetch(baseUrl, { headers: { 'X-Master-Key': apiKey } }) .then(res => res.json()) .then(json => { if (json && json.record) { data = json.record; } showTab("process"); }) .catch(err => console.error("Error fetching data:", err)); }

function updateBin() { fetch(baseUrl, { method: "PUT", headers: { 'Content-Type': 'application/json', 'X-Master-Key': apiKey }, body: JSON.stringify(data) }) .then(res => res.json()) .then(json => console.log("Data updated", json)) .catch(err => console.error("Error updating data:", err)); }

