// js/services/teacher-service.js
import { teacherRepository } from '../repositories/teacher-repository.js';
import { userRepository } from '../repositories/user-repository.js';
import { isValidEmail } from '../utils/validators.js';

export class TeacherService {
  async getAllTeachers() {
    return await teacherRepository.getAll();
  }

  async createTeacher({ name, employeeId, email, department, phone }) {
    if (!name || !employeeId || !department) {
      throw new Error('Name, Employee ID, and Department are required.');
    }

    if (email && !isValidEmail(email)) {
      throw new Error('Invalid email format.');
    }

    // Check duplicate employee ID
    const existing = await teacherRepository.getByEmployeeId(employeeId.trim());
    if (existing) {
      throw new Error(`Teacher with Employee ID "${employeeId}" already exists.`);
    }

    const teacherId = 't_' + Date.now();
    const newTeacher = {
      id: teacherId,
      employeeId: employeeId.trim(),
      name: name.trim(),
      department: department.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      status: 'active'
    };

    await teacherRepository.create(newTeacher);

    // Also create login account for this teacher
    const username = employeeId.trim().toLowerCase();
    await userRepository.create({
      id: 'u_' + Date.now(),
      username: username,
      password: 'password123',
      role: 'teacher',
      name: name.trim(),
      refId: teacherId
    });

    return newTeacher;
  }

  async deleteTeacher(id) {
    await teacherRepository.delete(id);
    await userRepository.deleteByRefId(id); // Delete associated user account
    return true;
  }
}

export const teacherService = new TeacherService();