
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Activity, Clock } from 'lucide-react';
import { useSimulation } from '../contexts/SimulationContext';

const ThreatMonitor = () => {
  const { simulationState } = useSimulation();
  const [realTimeData, setRealTimeData] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev, simulationState.systemMetrics.threat_level];
        return newData.slice(-20); // Keep last 20 data points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationState.systemMetrics.threat_level]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getThreatLevelStatus = (level: number) => {
    if (level >= 80) return { status: 'CRITICAL', color: 'text-red-400', icon: AlertTriangle };
    if (level >= 60) return { status: 'HIGH', color: 'text-orange-400', icon: AlertTriangle };
    if (level >= 30) return { status: 'ELEVATED', color: 'text-yellow-400', icon: Activity };
    return { status: 'NORMAL', color: 'text-green-400', icon: Shield };
  };

  const threatStatus = getThreatLevelStatus(simulationState.systemMetrics.threat_level);
  const ThreatIcon = threatStatus.icon;

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Real-Time Threat Monitor
          </div>
          <div className="flex items-center space-x-2">
            <ThreatIcon className={`w-4 h-4 ${threatStatus.color}`} />
            <span className={`text-sm font-medium ${threatStatus.color}`}>
              {threatStatus.status}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Threat Level Visualization */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Current Threat Level</span>
            <span className={`font-bold ${threatStatus.color}`}>
              {Math.round(simulationState.systemMetrics.threat_level)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                simulationState.systemMetrics.threat_level >= 80 ? 'bg-red-500' :
                simulationState.systemMetrics.threat_level >= 60 ? 'bg-orange-500' :
                simulationState.systemMetrics.threat_level >= 30 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${simulationState.systemMetrics.threat_level}%` }}
            ></div>
          </div>
        </div>

        {/* Simple Threat Activity Graph */}
        <div className="space-y-2">
          <h4 className="text-slate-300 text-sm font-medium">Threat Activity (Last 20s)</h4>
          <div className="flex items-end space-x-1 h-20 bg-slate-900/50 rounded p-2">
            {realTimeData.map((value, index) => (
              <div
                key={index}
                className={`flex-1 rounded-sm transition-all duration-300 ${
                  value >= 80 ? 'bg-red-500' :
                  value >= 60 ? 'bg-orange-500' :
                  value >= 30 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ height: `${Math.max(value, 5)}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Recent Threat Events */}
        <div className="space-y-3">
          <h4 className="text-slate-300 text-sm font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Recent Security Events
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {simulationState.threatEvents.length === 0 ? (
              <div className="text-slate-400 text-sm py-4 text-center">
                No recent threats detected
              </div>
            ) : (
              simulationState.threatEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="bg-slate-900/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200">{event.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Affected:</span>
                    <div className="flex space-x-1">
                      {event.affected_systems.map((system, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {system}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreatMonitor;
