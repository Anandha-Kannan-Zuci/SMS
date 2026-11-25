// js/repositories/student-repository.js
import { db } from '../database/db.js';

export class StudentRepository {
  async getAll() {
    return await db.getAll('students');
  }

  async getById(id) {
    return await db.get('students', id);
  }

  async getByAdmissionNo(admissionNo) {
    const store = await db.getStore('students', 'readonly');
    const index = store.index('admissionNo');
    return new Promise((resolve, reject) => {
      const request = index.get(admissionNo);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async create(student) {
    return await db.add('students', student);
  }

  async update(student) {
    return await db.update('students', student);
  }

  async delete(id) {
    return await db.delete('students', id);
  }
}

export const studentRepository = new StudentRepository();