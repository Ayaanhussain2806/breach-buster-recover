
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cpu, MemoryStick, HardDrive, Network, Activity, TrendingUp } from 'lucide-react';
import { useSimulation } from '../contexts/SimulationContext';

const SystemMetrics = () => {
  const { simulationState } = useSimulation();
  const [historicalData, setHistoricalData] = useState<{[key: string]: number[]}>({
    cpu: [],
    memory: [],
    network: [],
    threats: []
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHistoricalData(prev => ({
        cpu: [...prev.cpu, simulationState.systemMetrics.cpu_usage].slice(-30),
        memory: [...prev.memory, simulationState.systemMetrics.memory_usage].slice(-30),
        network: [...prev.network, simulationState.systemMetrics.network_activity].slice(-30),
        threats: [...prev.threats, simulationState.systemMetrics.threat_level].slice(-30)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationState.systemMetrics]);

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    data 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
    data: number[];
  }) => (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${color}`} />
            <span className="text-slate-300 font-medium">{title}</span>
          </div>
          <span className={`text-2xl font-bold ${color}`}>
            {Math.round(value)}%
          </span>
        </div>
        
        <Progress 
          value={value} 
          className={`h-2 mb-4 ${
            value > 80 ? 'bg-red-900' : 
            value > 60 ? 'bg-yellow-900' : 
            'bg-slate-700'
          }`}
        />
        
        {/* Mini chart */}
        <div className="flex items-end space-x-1 h-12">
          {data.map((point, index) => (
            <div
              key={index}
              className={`flex-1 rounded-sm transition-all duration-300 ${
                point > 80 ? 'bg-red-500' :
                point > 60 ? 'bg-yellow-500' :
                point > 30 ? 'bg-blue-500' :
                'bg-green-500'
              }`}
              style={{ height: `${Math.max(point, 5)}%` }}
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const networkConnections = [
    { source: 'File Server', target: 'Workstation-01', status: 'active', traffic: 'High' },
    { source: 'Database Server', target: 'App Server', status: 'active', traffic: 'Medium' },
    { source: 'Workstation-02', target: 'Internet', status: 'blocked', traffic: 'Suspicious' },
    { source: 'Backup Server', target: 'File Server', status: 'active', traffic: 'Low' },
  ];

  return (
    <div className="space-y-6">
      {/* System Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU Usage"
          value={simulationState.systemMetrics.cpu_usage}
          icon={Cpu}
          color="text-blue-400"
          data={historicalData.cpu}
        />
        <MetricCard
          title="Memory Usage"
          value={simulationState.systemMetrics.memory_usage}
          icon={MemoryStick}
          color="text-green-400"
          data={historicalData.memory}
        />
        <MetricCard
          title="Network Activity"
          value={simulationState.systemMetrics.network_activity}
          icon={Network}
          color="text-purple-400"
          data={historicalData.network}
        />
        <MetricCard
          title="Threat Level"
          value={simulationState.systemMetrics.threat_level}
          icon={Activity}
          color="text-red-400"
          data={historicalData.threats}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Topology */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Network className="w-5 h-5 mr-2 text-cyan-400" />
              Network Connections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkConnections.map((connection, index) => (
              <div key={index} className="bg-slate-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      connection.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-slate-200 font-medium">
                      {connection.source} → {connection.target}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    connection.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                  } text-white`}>
                    {connection.status}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  Traffic: <span className={`${
                    connection.traffic === 'Suspicious' ? 'text-red-400' :
                    connection.traffic === 'High' ? 'text-orange-400' :
                    'text-slate-300'
                  }`}>{connection.traffic}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Events Summary */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
              Security Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-red-400">
                  {simulationState.threatEvents.filter(e => e.severity === 'critical').length}
                </div>
                <div className="text-xs text-slate-400">Critical Threats</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {simulationState.threatEvents.filter(e => e.severity === 'high').length}
                </div>
                <div className="text-xs text-slate-400">High Threats</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {simulationState.filesEncrypted > 0 ? 1 : 0}
                </div>
                <div className="text-xs text-slate-400">Active Incidents</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {simulationState.phase === 'recovered' ? 100 : Math.round(simulationState.recoveryProgress)}%
                </div>
                <div className="text-xs text-slate-400">Recovery Status</div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-slate-300 font-medium">System Health</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Firewall Status</span>
                  <span className="text-green-400 text-sm font-medium">Protected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Antivirus</span>
                  <span className="text-green-400 text-sm font-medium">Updated</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Intrusion Detection</span>
                  <span className="text-green-400 text-sm font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Backup Integrity</span>
                  <span className="text-green-400 text-sm font-medium">Verified</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed System Information */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <HardDrive className="w-5 h-5 mr-2 text-indigo-400" />
            System Resources & Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h5 className="text-slate-300 font-medium">Storage Usage</h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">C: System Drive</span>
                    <span className="text-slate-200">45% (450GB / 1TB)</span>
                  </div>
                  <Progress value={45} className="h-2 bg-slate-700" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">D: Data Drive</span>
                    <span className="text-slate-200">78% (1.56TB / 2TB)</span>
                  </div>
                  <Progress value={78} className="h-2 bg-slate-700" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">E: Backup Drive</span>
                    <span className="text-slate-200">23% (920GB / 4TB)</span>
                  </div>
                  <Progress value={23} className="h-2 bg-slate-700" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-slate-300 font-medium">Active Processes</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">CyberGuard Service</span>
                  <span className="text-green-400">Running</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Backup Agent</span>
                  <span className="text-green-400">Running</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Threat Scanner</span>
                  <span className="text-green-400">Running</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recovery Service</span>
                  <span className="text-blue-400">Standby</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h5 className="text-slate-300 font-medium">Network Interfaces</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ethernet 1</span>
                  <span className="text-green-400">1 Gbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ethernet 2</span>
                  <span className="text-green-400">1 Gbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">WiFi</span>
                  <span className="text-slate-500">Disabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">VPN Tunnel</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMetrics;
