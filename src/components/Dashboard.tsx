
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, Database, Users, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ThreatMonitor from './ThreatMonitor';
import SimulationPanel from './SimulationPanel';
import RecoveryDashboard from './RecoveryDashboard';
import SystemMetrics from './SystemMetrics';
import { useSimulation } from '../contexts/SimulationContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { simulationState, startSimulation, stopSimulation } = useSimulation();

  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: Shield },
    { id: 'simulation', label: 'Attack Simulation', icon: AlertTriangle },
    { id: 'recovery', label: 'Recovery Center', icon: Database },
    { id: 'metrics', label: 'System Metrics', icon: Activity },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                CyberGuard Pro
              </h1>
              <p className="text-blue-200">
                Advanced Ransomware Simulation & Recovery Platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Secure</span>
              </div>
              <Button variant="outline" className="bg-blue-600 border-blue-500 text-white hover:bg-blue-700">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-200 hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ThreatMonitor />
              </div>
              <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-400" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Firewall</span>
                      <span className="text-green-400 font-medium">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Backup Status</span>
                      <span className="text-green-400 font-medium">Current</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Threat Detection</span>
                      <span className="text-green-400 font-medium">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Auto-Recovery</span>
                      <span className="text-green-400 font-medium">Ready</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={() => {
                        setActiveTab('simulation');
                        startSimulation();
                      }}
                    >
                      Start Simulation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      View Reports
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Training Modules
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'simulation' && <SimulationPanel />}
          {activeTab === 'recovery' && <RecoveryDashboard />}
          {activeTab === 'metrics' && <SystemMetrics />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
