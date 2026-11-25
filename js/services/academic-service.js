// js/services/academic-service.js
import { academicRepository } from '../repositories/academic-repository.js';
import { studentRepository } from '../repositories/student-repository.js';

export class AcademicService {
  async getClassesWithCounts() {
    const [classes, students] = await Promise.all([
      academicRepository.getAllClasses(),
      studentRepository.getAll()
    ]);

    // Count enrolled students per class
    const countMap = {};
    students.forEach(s => {
      countMap[s.classId] = (countMap[s.classId] || 0) + 1;
    });

    return classes.map(c => ({
      ...c,
      studentCount: countMap[c.id] || 0
    }));
  }

  async createClass({ name, academicYear }) {
    if (!name || !academicYear) {
      throw new Error('Class Name and Academic Year are required.');
    }

    const newClass = {
      id: 'c_' + Date.now(),
      name: name.trim(),
      academicYear: academicYear.trim()
    };

    return await academicRepository.createClass(newClass);
  }

  async deleteClass(id) {
    // Check if students are currently enrolled in this class
    const students = await studentRepository.getAll();
    const enrolled = students.filter(s => s.classId === id);
    if (enrolled.length > 0) {
      throw new Error(`Cannot delete class: ${enrolled.length} student(s) are currently enrolled. Reassign them first.`);
    }

    return await academicRepository.deleteClass(id);
  }

  async getAllCourses() {
    return await academicRepository.getAllCourses();
  }

  async createCourse({ name, code }) {
    if (!name || !code) {
      throw new Error('Course Name and Code are required.');
    }

    const newCourse = {
      id: 'crs_' + Date.now(),
      name: name.trim(),
      code: code.trim().toUpperCase()
    };

    return await academicRepository.createCourse(newCourse);
  }

  async deleteCourse(id) {
    return await academicRepository.deleteCourse(id);
  }
}

export const academicService = new AcademicService();