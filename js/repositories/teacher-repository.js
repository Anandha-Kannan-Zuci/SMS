// js/repositories/teacher-repository.js
import { db } from '../database/db.js';

export class TeacherRepository {
  async getAll() {
    return await db.getAll('teachers');
  }

  async getById(id) {
    return await db.get('teachers', id);
  }

  async getByEmployeeId(employeeId) {
    const store = await db.getStore('teachers', 'readonly');
    const index = store.index('employeeId');
    return new Promise((resolve, reject) => {
      const request = index.get(employeeId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async create(teacher) {
    return await db.add('teachers', teacher);
  }

  async update(teacher) {
    return await db.update('teachers', teacher);
  }

  async delete(id) {
    return await db.delete('teachers', id);
  }
}

export const teacherRepository = new TeacherRepository();