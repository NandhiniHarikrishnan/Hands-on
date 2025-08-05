
import React, { useState, useEffect } from 'react';
import { customerAPI, salesLeadAPI, taskAPI } from '../services/api';

const Reports = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    totalTasks: 0,
    overdueTasks: 0,
    closedLeads: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [customersRes, leadsRes, tasksRes, overdueTasksRes] = await Promise.all([
        customerAPI.getAll(),
        salesLeadAPI.getAll(),
        taskAPI.getAll(),
        taskAPI.getOverdue()
      ]);
      const closedLeads = leadsRes.data.filter(l => l.stage === 'Closed').length;
      const conversionRate = leadsRes.data.length > 0 ? ((closedLeads / leadsRes.data.length) * 100).toFixed(2) : 0;
      setStats({
        totalCustomers: customersRes.data.length,
        totalLeads: leadsRes.data.length,
        totalTasks: tasksRes.data.length,
        overdueTasks: overdueTasksRes.data.length,
        closedLeads,
        conversionRate
      });
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1>Reports</h1>
      {loading ? (
        <div className="card"><div className="card-content">Loading...</div></div>
      ) : error ? (
        <div className="card"><div className="card-content error">{error}</div></div>
      ) : (
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
            <div className="card-title">Closed Leads</div>
            <div className="card-content">{stats.closedLeads}</div>
          </div>
          <div className="card">
            <div className="card-title">Conversion Rate</div>
            <div className="card-content">{stats.conversionRate}%</div>
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
      )}
    </div>
  );
};

export default Reports;
