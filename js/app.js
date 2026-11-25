// js/app.js
import { db } from './database/db.js';
import { seedDatabase } from './database/seed.js';

async function init() {
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('data-preview');

  try {
    statusEl.textContent = 'Initializing Database...';
    await seedDatabase();

    // Fetch and show students to prove it works
    const students = await db.getAll('students');
    statusEl.textContent = `Connected! Found ${students.length} students in IndexedDB.`;
    
    previewEl.innerHTML = `
      <ul>
        ${students.map(s => `<li><strong>${s.name}</strong> (${s.admissionNo}) - Class: ${s.classId}</li>`).join('')}
      </ul>
    `;
  } catch (error) {
    statusEl.textContent = 'Database error: ' + error.message;
    console.error(error);
  }
}

init();