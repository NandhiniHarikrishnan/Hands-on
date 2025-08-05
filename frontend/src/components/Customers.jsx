import React, { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      company: ''
    });
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCustomer) {
        await customerAPI.update(editingCustomer.id, formData);
        alert('Customer updated successfully!');
      } else {
        await customerAPI.create(formData);
        alert('Customer created successfully!');
      }
      
      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Failed to save customer');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      company: customer.company || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        alert('Customer deleted successfully!');
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Failed to delete customer');
      }
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-content">Loading customers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1>Customers</h1>
      <button 
        className="btn btn-primary" 
        style={{ marginBottom: '2rem' }}
        onClick={() => setShowForm(true)}
      >
        Add New Customer
      </button>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingCustomer ? 'Update Customer' : 'Create Customer'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Customers List */}
      <div className="card">
        <h2 className="card-title">Customer List</h2>
        {customers.length === 0 ? (
          <p className="no-data-message">No customers found. Add your first customer!</p>
        ) : (
          <div className="table">
            {customers.map(customer => (
              <div key={customer.id} className="table-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{customer.name}</h3>
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      <strong>Email:</strong> {customer.email}
                    </p>
                    {customer.phone && (
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Phone:</strong> {customer.phone}
                      </p>
                    )}
                    {customer.company && (
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Company:</strong> {customer.company}
                      </p>
                    )}
                    {customer.address && (
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                        <strong>Address:</strong> {customer.address}
                      </p>
                    )}
                    <small style={{ color: '#999' }}>
                      Created: {new Date(customer.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers; 