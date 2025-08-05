import React, { useState, useEffect } from 'react';
import { customerAPI, salesLeadAPI, taskAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    totalTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [customersRes, leadsRes, tasksRes, overdueTasksRes] = await Promise.all([
        customerAPI.getAll(),
        salesLeadAPI.getAll(),
        taskAPI.getAll(),
        taskAPI.getOverdue()
      ]);

      setStats({
        totalCustomers: customersRes.data.length,
        totalLeads: leadsRes.data.length,
        totalTasks: tasksRes.data.length,
        overdueTasks: overdueTasksRes.data.length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="card">
          <div className="card-content">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1>Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-title">Total Customers</div>
          <div className="card-content">{stats.totalCustomers}</div>
        </div>
        
        <div className="card">
          <div className="card-title">Sales Leads</div>
          <div className="card-content">{stats.totalLeads}</div>
        </div>
        
        <div className="card">
          <div className="card-title">Total Tasks</div>
          <div className="card-content">{stats.totalTasks}</div>
        </div>
        
        <div className="card">
          <div className="card-title">Overdue Tasks</div>
          <div className="card-content" style={{ color: stats.overdueTasks > 0 ? '#dc3545' : '#28a745' }}>
            {stats.overdueTasks}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => window.location.href = '/customers'}>
            Add New Customer
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/sales-leads'}>
            Create Sales Lead
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/tasks'}>
            Add New Task
          </button>
          <button className="btn btn-secondary" onClick={() => window.location.href = '/reports'}>
            View Reports
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title">Welcome to Your CRM System</h2>
        <p style={{ lineHeight: '1.6', color: '#666' }}>
          This is your central hub for managing customer relationships, sales leads, and tasks. 
          Use the navigation menu above to access different sections of your CRM.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Getting Started:</h3>
          <ul style={{ color: '#666', lineHeight: '1.6' }}>
            <li>Add your first customer in the <strong>Customers</strong> section</li>
            <li>Create sales leads and track them through the pipeline</li>
            <li>Manage tasks and follow-ups in the <strong>Tasks</strong> section</li>
            <li>View analytics and reports to track your progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 