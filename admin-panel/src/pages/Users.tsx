import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Users as UsersIcon } from 'lucide-react';
import { User } from '../types';
import '../styles/Users.css';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ results: User[] }>('/admin/users', {
        params: searchTerm ? { search: searchTerm } : {}
      });
      setUsers(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="users-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h1 className="users-title">Users</h1>
        <p className="users-subtitle">View all registered users</p>
      </div>

      <div className="users-search-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="users-table-container">
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <UsersIcon className="empty-state-icon" size={48} />
                    <p className="empty-state-text">No users found</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          <span>{user.email?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="user-details">
                          <p className="user-name">
                            {user.first_name || user.last_name
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                              : user.username}
                          </p>
                          <p className="user-username">{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="user-email">{user.email}</span>
                    </td>
                    <td>
                      <span className="user-phone">{user.phone_number || 'N/A'}</span>
                    </td>
                    <td>
                      <span className={`role-badge ${
                        user.is_superuser
                          ? 'superuser'
                          : user.is_staff
                          ? 'staff'
                          : 'user'
                      }`}>
                        {user.is_superuser ? 'Super Admin' : user.is_staff ? 'Staff' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span className="user-date">
                        {user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

