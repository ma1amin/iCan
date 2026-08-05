import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ican-admin-token');
      const searchParams = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { search })
      });

      const response = await fetch(`http://localhost:3001/api/admin/users?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('ican-admin-token');
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleUpdatePlan = async (userId, currentPlan) => {
    const plans = ['free', 'pro', 'enterprise'];
    const currentIndex = plans.indexOf(currentPlan);
    const nextPlan = plans[(currentIndex + 1) % plans.length];

    try {
      const token = localStorage.getItem('ican-admin-token');
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/plan`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: nextPlan })
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Failed to update user plan');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-management-error">
        {error}
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1 className="user-management-title">User Management</h1>
        <div className="user-management-search">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={handleSearch}
            className="user-search-input"
          />
        </div>
      </div>

      <div className="user-management-content">
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Plan</th>
                <th>Verified</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-organization">{user.organization}</td>
                  <td className="user-plan">
                    <span className={`plan-badge plan-${user.plan}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="user-verified">
                    {user.emailVerified ? '✓' : '✗'}
                  </td>
                  <td className="user-created">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="user-actions">
                    <button
                      className="action-button"
                      onClick={() => handleUpdatePlan(user.id, user.plan)}
                      title="Change plan"
                    >
                      🔄
                    </button>
                    <button
                      className="action-button delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              className="pagination-button"
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
