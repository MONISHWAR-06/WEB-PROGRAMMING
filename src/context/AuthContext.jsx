/**
 * Authentication & Role Context for EcoTrack
 * 
 * Supports:
 * - Administrator role (Full CRUD, manage targets, review suggestions, configure emissions)
 * - Student role (Challenges, participation, leaderboard, personal points, submit suggestions)
 * - Quick Demo Role Switcher for seamless faculty/evaluator demonstration
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_USERS = {
  ADMIN: {
    id: 'usr-admin',
    name: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@campus.edu',
    role: 'admin',
    title: 'Director of Campus Sustainability & Facilities',
    avatar: '👩‍💼',
    department: 'Office of Campus Planning'
  },
  STUDENT: {
    id: 'usr-student',
    name: 'Rohan Verma',
    email: 'rohan.verma@student.campus.edu',
    role: 'student',
    title: 'Sustainability Representative, 3rd Year',
    avatar: '🌿',
    studentId: 'EC-2024-099',
    department: 'Electronics & Communication'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ecotrack_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.ADMIN;
      }
    }
    return DEMO_USERS.ADMIN;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecotrack_auth_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const switchRole = (roleType) => {
    if (roleType === 'admin') {
      setCurrentUser(DEMO_USERS.ADMIN);
    } else {
      setCurrentUser(DEMO_USERS.STUDENT);
    }
  };

  const loginAs = (role) => {
    setIsAuthenticated(true);
    switchRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isStudent = currentUser?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        isStudent,
        switchRole,
        loginAs,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
