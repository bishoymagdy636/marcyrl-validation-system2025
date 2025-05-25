<!-- أضف هذا الكود داخل ملف script.js بدلًا من الكود الموجود حاليًا -->const binId = "6832d59f8561e97a501b3c6b"; const apiKey = "$2a$10$Qwz/rVHOM8oW1ObRlYgz/uIcqiEvj1e/bLngpd2/P3i2gf0flGbFq";

function fetchData(callback) { fetch(https://api.jsonbin.io/v3/b/${binId}/latest, { headers: { 'X-Master-Key': apiKey } }) .then(res => res.json()) .then(data => callback(data.record)) .catch(err => console.error("Fetch error:", err)); }

function saveData(data) { fetch(https://api.jsonbin.io/v3/b/${binId}, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': apiKey }, body: JSON.stringify(data) }) .then(res => res.json()) .then(() => console.log("Data saved")) .catch(err => console.error("Save error:", err)); }

// مثال للاستخدام داخل التبويبات: let currentData = { process: [], report: [], cleaning: [], risk: [] };

fetchData(data => { currentData = data; // بعدها تظهر البيانات في التبويبات });

function addItem(tab, item) { currentData[tab].push(item); saveData(currentData); }

