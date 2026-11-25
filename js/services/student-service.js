// js/services/student-service.js
import { studentRepository } from '../repositories/student-repository.js';
import { db } from '../database/db.js';
import { userRepository } from '../repositories/user-repository.js';

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

    const cleanAdmissionNo = admissionNo.trim();

    // Business validation: Check duplicate admission number
    const existing = await studentRepository.getByAdmissionNo(admissionNo.trim());
    if (existing) {
      throw new Error(`Student with Admission No "${admissionNo}" already exists.`);
    }

    const studentId = 's_' + Date.now();
    const newStudent = {
      id: studentId,
      admissionNo: cleanAdmissionNo,
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      classId,
      status: 'active'
    };

     await studentRepository.create(newStudent);
    // 2. Automatically generate login account for the student
    const username = cleanAdmissionNo.toLowerCase();
    await userRepository.create({
      id: 'u_' + Date.now(),
      username: username,              // Login username = admission number in lowercase
      password: 'password123',         // Default initial password
      role: 'student',
      name: name.trim(),
      refId: studentId                 // Links user account to their student record
    });
    return newStudent;
  }

  async deleteStudent(id) {
    await studentRepository.delete(id);
    await userRepository.deleteByRefId(id); // Delete associated user account first
    
    return true;
  }
}

export const studentService = new StudentService();