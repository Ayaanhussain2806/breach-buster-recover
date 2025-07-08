
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { SimulationProvider } from '../contexts/SimulationContext';

const Index = () => {
  return (
    <AuthProvider>
      <SimulationProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <Dashboard />
        </div>
      </SimulationProvider>
    </AuthProvider>
  );
};

export default Index;
