import React, { useEffect, useState } from 'react';
import { taskAPI, customerAPI, salesLeadAPI } from '../services/api';
import { TaskStatus } from '../types';


const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    salesLeadId: '',
    title: '',
    dueDate: '',
    notes: ''
  });
  const [customers, setCustomers] = useState([]);
  const [salesLeads, setSalesLeads] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchCustomers();
    fetchSalesLeads();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskAPI.getAll();
      setTasks(res.data);
    } catch (err) {
      setError('Failed to fetch tasks');
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

  const fetchSalesLeads = async () => {
    try {
      const res = await salesLeadAPI.getAll();
      setSalesLeads(res.data);
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
        await taskAPI.update(editId, {
          customerId: formData.customerId,
          salesLeadId: formData.salesLeadId || undefined,
          title: formData.title,
          dueDate: formData.dueDate,
          notes: formData.notes
        });
      } else {
        await taskAPI.create({
          customerId: formData.customerId,
          salesLeadId: formData.salesLeadId || undefined,
          title: formData.title,
          dueDate: formData.dueDate,
          notes: formData.notes
        });
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ customerId: '', salesLeadId: '', title: '', dueDate: '', notes: '' });
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = task => {
    setEditId(task.id);
    setFormData({
      customerId: task.customer?.id || '',
      salesLeadId: task.salesLead?.id || '',
      title: task.title,
      dueDate: task.dueDate.slice(0, 10),
      notes: task.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this task?')) return;
    try {
      setLoading(true);
      await taskAPI.delete(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1>Tasks</h1>
      <button className="btn btn-primary" style={{ marginBottom: '2rem' }} onClick={() => { setShowForm(true); setEditId(null); setFormData({ customerId: '', salesLeadId: '', title: '', dueDate: '', notes: '' }); }}>Add Task</button>
      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>{editId ? 'Edit Task' : 'Add Task'}</h2>
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select name="customerId" value={formData.customerId} onChange={handleInputChange} className="form-select" required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sales Lead (optional)</label>
              <select name="salesLeadId" value={formData.salesLeadId} onChange={handleInputChange} className="form-select">
                <option value="">None</option>
                {salesLeads.map(l => <option key={l.id} value={l.id}>{l.stage} - {l.customer?.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input name="title" value={formData.title} onChange={handleInputChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="form-input" required />
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
          <h2 className="card-title">Tasks List</h2>
          {tasks.length === 0 ? (
            <p className="no-data-message">No tasks found. Add your first task!</p>
          ) : (
            <div className="table">
              {tasks.map(task => (
                <div key={task.id} className="table-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0' }}>{task.title}</h3>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Status:</strong> {task.status}
                      </p>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Customer:</strong> {task.customer?.name || 'Unknown'}
                      </p>
                      {task.notes && (
                        <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                          <strong>Notes:</strong> {task.notes}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(task)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>Delete</button>
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

export default Tasks;
