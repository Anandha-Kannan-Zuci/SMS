// js/services/auth-service.js
import { userRepository } from '../repositories/user-repository.js';

const SESSION_KEY = 'sms_current_user';

export class AuthService {
  /**
   * Authenticate user by username and password
   */
  async login(username, password) {
    const user = await userRepository.getByUsername(username);
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.password !== password) {
      throw new Error('Invalid password.');
    }

    // Save session in sessionStorage (excluding password)
    const sessionUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      refId: user.refId || null
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  }

  /**
   * Get currently logged-in user from sessionStorage
   */
  getCurrentUser() {
    const userStr = sessionStorage.getItem(SESSION_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Logout user and clear session
   */
  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = '/login.html';
  }

  /**
   * Guard for protected pages. Redirects if not logged in or wrong role.
   */
  requireAuth(allowedRoles = []) {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = '/login.html';
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert('Access denied: You do not have permission to view this page.');
      // Redirect to their respective dashboard
      window.location.href = `/pages/${user.role}/dashboard.html`;
      return null;
    }

    return user;
  }
}

export const authService = new AuthService();