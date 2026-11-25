// js/services/student-service.js
import { studentRepository } from '../repositories/student-repository.js';
import { db } from '../database/db.js';

export class StudentService {
  async getAllStudents() {
    const students = await studentRepository.getAll();
    const classes = await db.getAll('classes');
    const classMap = new Map(classes.map(c => [c.id, c.name]));

    // Join with class name
    return students.map(s => ({
      ...s,
      className: classMap.get(s.classId) || 'Unassigned'
    }));
  }

  async createStudent({ name, admissionNo, email, classId, phone }) {
    if (!name || !admissionNo || !classId) {
      throw new Error('Name, Admission Number, and Class are required.');
    }

    // Business validation: Check duplicate admission number
    const existing = await studentRepository.getByAdmissionNo(admissionNo.trim());
    if (existing) {
      throw new Error(`Student with Admission No "${admissionNo}" already exists.`);
    }

    const newStudent = {
      id: 's_' + Date.now(),
      admissionNo: admissionNo.trim(),
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      classId,
      status: 'active'
    };

    return await studentRepository.create(newStudent);
  }

  async deleteStudent(id) {
    return await studentRepository.delete(id);
  }
}

export const studentService = new StudentService();