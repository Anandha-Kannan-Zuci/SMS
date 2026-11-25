// js/repositories/academic-repository.js
import { db } from '../database/db.js';

export class AcademicRepository {
  // --- Classes ---
  async getAllClasses() {
    return await db.getAll('classes');
  }

  async getClassById(id) {
    return await db.get('classes', id);
  }

  async createClass(classData) {
    return await db.add('classes', classData);
  }

  async deleteClass(id) {
    return await db.delete('classes', id);
  }

  // --- Courses ---
  async getAllCourses() {
    return await db.getAll('courses');
  }

  async getCourseById(id) {
    return await db.get('courses', id);
  }

  async createCourse(courseData) {
    return await db.add('courses', courseData);
  }

  async deleteCourse(id) {
    return await db.delete('courses', id);
  }
}

export const academicRepository = new AcademicRepository();