// js/repositories/user-repository.js
import { db } from '../database/db.js';

export class UserRepository {
  async getByUsername(username) {
    const store = await db.getStore('users', 'readonly');
    const index = store.index('username');
    return new Promise((resolve, reject) => {
      const request = index.get(username);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll() {
    return await db.getAll('users');
  }

  async create(user) {
    return await db.add('users', user);
  }
}

export const userRepository = new UserRepository();