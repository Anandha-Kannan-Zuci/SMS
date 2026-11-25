// js/database/seed.js
import { db } from './db.js';

export const initialData = {
  users: [
    { id: 'u1', username: 'admin', password: 'password123', role: 'admin', name: 'System Administrator' },
    { id: 'u2', username: 'teacher1', password: 'password123', role: 'teacher', name: 'Prof. Ramesh Kumar', refId: 't1' },
    { id: 'u3', username: 'student1', password: 'password123', role: 'student', name: 'Anand Kannan', refId: 's1' }
  ],
  classes: [
    { id: 'c1', name: 'Grade 10 - Section A', academicYear: '2026-2027' },
    { id: 'c2', name: 'Grade 10 - Section B', academicYear: '2026-2027' }
  ],
  courses: [
    { id: 'crs1', name: 'Mathematics', code: 'MATH101' },
    { id: 'crs2', name: 'Computer Science', code: 'CS101' },
    { id: 'crs3', name: 'Physics', code: 'PHY101' }
  ],
  teachers: [
    { id: 't1', employeeId: 'EMP001', name: 'Prof. Ramesh Kumar', email: 'ramesh@school.edu', department: 'Science', phone: '9876543210' }
  ],
  students: [
    { id: 's1', admissionNo: 'ADM202601', name: 'Anand Kannan', email: 'anand@school.edu', classId: 'c1', phone: '9123456780', status: 'active' },
    { id: 's2', admissionNo: 'ADM202602', name: 'Priya Sharma', email: 'priya@school.edu', classId: 'c1', phone: '9123456781', status: 'active' },
    { id: 's3', admissionNo: 'ADM202603', name: 'Rahul Verma', email: 'rahul@school.edu', classId: 'c2', phone: '9123456782', status: 'active'  }
  ],
  announcements: [
    { id: 'a1', title: 'Welcome to the New Academic Year', content: 'Classes begin next Monday. Please review your schedules.', date: '2026-11-25' }
  ]
};

/**
 * Seeds the database if it is empty
 */
export async function seedDatabase() {
  await db.open();
  
  // Check if users store already has data
  const userCount = await db.count('users');
  if (userCount > 0) {
    console.log('Database already contains data, skipping seed.');
    return;
  }

  console.log('Seeding initial demo data...');
  for (const storeName of Object.keys(initialData)) {
    for (const item of initialData[storeName]) {
      await db.add(storeName, item);
    }
  }
  console.log('Database seeded successfully!');
}