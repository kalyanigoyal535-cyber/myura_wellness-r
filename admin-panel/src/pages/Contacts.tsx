import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Mail, Check, CheckCircle, Trash2 } from 'lucide-react';
import { ContactSubmission } from '../types';
import '../styles/Contacts.css';

export default function Contacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ results: ContactSubmission[] }>('/admin/contacts');
      setContacts(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to load contacts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await api.patch(`/admin/contacts/${id}/mark_read`);
      fetchContacts();
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  const handleMarkResolved = async (id: number) => {
    try {
      await api.patch(`/admin/contacts/${id}/mark_resolved`);
      fetchContacts();
    } catch (err) {
      alert('Failed to mark as resolved');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      await api.delete(`/admin/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      alert('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="contacts-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h1 className="contacts-title">Contact Submissions</h1>
        <p className="contacts-subtitle">Manage customer inquiries</p>
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="contacts-list">
        {filteredContacts.length === 0 ? (
          <div className="empty-state">
            <Mail className="empty-state-icon" size={48} />
            <p className="empty-state-text">No contact submissions found</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`contact-card ${!contact.is_read ? 'unread' : ''} ${contact.is_resolved ? 'resolved' : ''}`}
            >
              <div className="contact-card-header">
                <div className="contact-info">
                  <div className="contact-name-row">
                    <h3 className="contact-name">{contact.name}</h3>
                    {!contact.is_read && (
                      <span className="new-badge">New</span>
                    )}
                    {contact.is_resolved && (
                      <span className="resolved-badge">Resolved</span>
                    )}
                  </div>
                  <div className="contact-details">
                    <span>{contact.email}</span>
                    {contact.phone_number && <span>{contact.phone_number}</span>}
                  </div>
                </div>
                <div className="contact-actions">
                  {!contact.is_read && (
                    <button
                      onClick={() => handleMarkRead(contact.id)}
                      className="action-btn mark-read-btn"
                      title="Mark as Read"
                    >
                      <Check size={16} />
                      Mark Read
                    </button>
                  )}
                  {!contact.is_resolved && (
                    <button
                      onClick={() => handleMarkResolved(contact.id)}
                      className="action-btn mark-resolved-btn"
                      title="Mark as Resolved"
                    >
                      <CheckCircle size={16} />
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="action-btn delete-btn"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
              <div className="contact-subject">
                <span className="subject-label">Subject: </span>
                <span className="subject-value">{contact.subject}</span>
              </div>
              <div className="contact-message">{contact.message}</div>
              <div className="contact-date">
                Submitted: {new Date(contact.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

