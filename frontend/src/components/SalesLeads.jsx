
import React, { useState, useEffect } from 'react';
import { salesLeadAPI, customerAPI } from '../services/api';
import { SalesStage } from '../types';

const SalesLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    stage: SalesStage.LEAD,
    value: '',
    description: ''
  });
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchLeads();
    fetchCustomers();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await salesLeadAPI.getAll();
      setLeads(res.data);
    } catch (err) {
      setError('Failed to fetch sales leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await customerAPI.getAll();
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
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
        await salesLeadAPI.update(editId, {
          customerId: formData.customerId,
          stage: formData.stage,
          value: formData.value || undefined,
          description: formData.description
        });
      } else {
        await salesLeadAPI.create({
          customerId: formData.customerId,
          stage: formData.stage,
          value: formData.value || undefined,
          description: formData.description
        });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ customerId: '', stage: SalesStage.LEAD, value: '', description: '' });
      fetchLeads();
    } catch (err) {
      setError('Failed to save sales lead');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = lead => {
    setEditId(lead.id);
    setFormData({
      customerId: lead.customer?.id || '',
      stage: lead.stage,
      value: lead.value || '',
      description: lead.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this sales lead?')) return;
    try {
      setLoading(true);
      await salesLeadAPI.delete(id);
      fetchLeads();
    } catch (err) {
      setError('Failed to delete sales lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1>Sales Leads</h1>
      <button className="btn btn-primary" style={{ marginBottom: '2rem' }} onClick={() => { setShowForm(true); setEditId(null); setFormData({ customerId: '', stage: SalesStage.LEAD, value: '', description: '' }); }}>Add Sales Lead</button>
      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{editId ? 'Edit Sales Lead' : 'Add Sales Lead'}</h2>
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select name="customerId" value={formData.customerId} onChange={handleInputChange} className="form-select" required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stage *</label>
              <select name="stage" value={formData.stage} onChange={handleInputChange} className="form-select" required>
                {Object.values(SalesStage).map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Value</label>
              <input name="value" type="number" value={formData.value} onChange={handleInputChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-input" />
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
          <h2 className="card-title">Sales Leads List</h2>
          {leads.length === 0 ? (
            <p className="no-data-message">No sales leads found. Add your first sales lead!</p>
          ) : (
            <div className="table">
              {leads.map(lead => (
                <div key={lead.id} className="table-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{lead.stage} - {lead.customer?.name || 'Unknown Customer'}</h3>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Value:</strong> {lead.value || 'N/A'}
                      </p>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Description:</strong> {lead.description || 'N/A'}
                      </p>
                      <small style={{ color: '#999' }}>
                        Created: {new Date(lead.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(lead)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(lead.id)}>Delete</button>
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

export default SalesLeads;
