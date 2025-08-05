import React, { useEffect, useState } from 'react';
import { contactHistoryAPI, customerAPI } from '../services/api';

const ContactHistory = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    date: '',
    type: '',
    notes: ''
  });
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchCustomers();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await contactHistoryAPI.getAll();
      setContacts(res.data);
    } catch (err) {
      setError('Failed to fetch contact history');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await customerAPI.getAll();
      setCustomers(res.data);
    } catch {}
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editId) {
        await contactHistoryAPI.update(editId, {
          customerId: formData.customerId,
          date: formData.date,
          type: formData.type,
          notes: formData.notes
        });
      } else {
        await contactHistoryAPI.create({
          customerId: formData.customerId,
          date: formData.date,
          type: formData.type,
          notes: formData.notes
        });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ customerId: '', date: '', type: '', notes: '' });
      fetchContacts();
    } catch (err) {
      setError('Failed to save contact history');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = contact => {
    setEditId(contact.id);
    setFormData({
      customerId: contact.customer?.id || '',
      date: contact.date.slice(0, 10),
      type: contact.type,
      notes: contact.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this contact history?')) return;
    try {
      setLoading(true);
      await contactHistoryAPI.delete(id);
      fetchContacts();
    } catch (err) {
      setError('Failed to delete contact history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1>Contact History</h1>
      <button className="btn btn-primary" style={{ marginBottom: '2rem' }} onClick={() => { setShowForm(true); setEditId(null); setFormData({ customerId: '', date: '', type: '', notes: '' }); }}>Add Contact</button>
      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{editId ? 'Edit Contact' : 'Add Contact'}</h2>
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select name="customerId" value={formData.customerId} onChange={handleInputChange} className="form-select" required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Type *</label>
              <input name="type" value={formData.type} onChange={handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="form-input" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" type="submit">{editId ? 'Update' : 'Add'}</button>
              <button className="btn btn-secondary" type="button" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <div className="card"><div className="card-content">Loading...</div></div>
      ) : error ? (
        <div className="card"><div className="card-content error">{error}</div></div>
      ) : (
        <div className="card">
          <h2 className="card-title">Contact History List</h2>
          {contacts.length === 0 ? (
            <p className="no-data-message">No contact history found. Add your first contact!</p>
          ) : (
            <div className="table">
              {contacts.map(contact => (
                <div key={contact.id} className="table-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{contact.type} - {contact.customer?.name || 'Unknown Customer'}</h3>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Date:</strong> {new Date(contact.date).toLocaleDateString()}
                      </p>
                      {contact.notes && (
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                          <strong>Notes:</strong> {contact.notes}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(contact)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactHistory;
