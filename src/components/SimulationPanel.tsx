
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Square, RotateCcw, AlertTriangle, Shield, Database, Network } from 'lucide-react';
import { useSimulation } from '../contexts/SimulationContext';

const SimulationPanel = () => {
  const { simulationState, startSimulation, stopSimulation, initiateRecovery } = useSimulation();

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'reconnaissance': return Network;
      case 'infiltration': return AlertTriangle;
      case 'lateral_movement': return Network;
      case 'encryption': return Database;
      case 'ransom_demand': return AlertTriangle;
      case 'recovery': return RotateCcw;
      case 'recovered': return Shield;
      default: return Shield;
    }
  };

  const getPhaseDescription = (phase: string) => {
    switch (phase) {
      case 'reconnaissance': return 'Scanning network for vulnerabilities and entry points';
      case 'infiltration': return 'Gaining initial access through phishing or exploits';
      case 'lateral_movement': return 'Escalating privileges and moving through the network';
      case 'encryption': return 'Encrypting critical files and databases';
      case 'ransom_demand': return 'Displaying ransom message and payment demands';
      case 'recovery': return 'Automated recovery process in progress';
      case 'recovered': return 'System fully recovered and secured';
      case 'completed': return 'Attack simulation completed successfully';
      default: return 'System ready for simulation';
    }
  };

  const PhaseIcon = getPhaseIcon(simulationState.phase);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Simulation Control Panel */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            Attack Simulation Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Phase */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Current Phase:</span>
              <Badge className={`${
                simulationState.phase === 'idle' ? 'bg-slate-600' :
                simulationState.phase === 'recovered' ? 'bg-green-600' :
                simulationState.phase === 'recovery' ? 'bg-blue-600' :
                'bg-red-600'
              } text-white`}>
                <PhaseIcon className="w-3 h-3 mr-1" />
                {simulationState.phase.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-sm text-slate-200 mb-3">
                {getPhaseDescription(simulationState.phase)}
              </p>
              
              {simulationState.isActive && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span>{Math.round(simulationState.progress)}%</span>
                  </div>
                  <Progress 
                    value={simulationState.progress} 
                    className="h-2 bg-slate-700"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-3">
            {!simulationState.isActive && simulationState.phase !== 'completed' && simulationState.phase !== 'recovery' && (
              <Button 
                onClick={startSimulation}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Ransomware Simulation
              </Button>
            )}
            
            {simulationState.isActive && (
              <Button 
                onClick={stopSimulation}
                variant="destructive"
                className="w-full"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Simulation
              </Button>
            )}

            {(simulationState.phase === 'completed' || simulationState.filesEncrypted > 0) && simulationState.phase !== 'recovery' && simulationState.phase !== 'recovered' && (
              <Button 
                onClick={initiateRecovery}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Initiate Automated Recovery
              </Button>
            )}
          </div>

          {/* Simulation Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Files Encrypted</div>
              <div className="text-lg font-bold text-red-400">
                {simulationState.filesEncrypted.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">
                of {simulationState.totalFiles.toLocaleString()} total
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Threat Level</div>
              <div className="text-lg font-bold text-orange-400">
                {Math.round(simulationState.systemMetrics.threat_level)}%
              </div>
              <div className="text-xs text-slate-500">
                Current risk score
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Status Panel */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Recovery Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recovery Progress */}
          {(simulationState.phase === 'recovery' || simulationState.recoveryProgress > 0) && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Recovery Progress:</span>
                <span className="text-green-400 font-bold">
                  {Math.round(simulationState.recoveryProgress)}%
                </span>
              </div>
              <Progress 
                value={simulationState.recoveryProgress} 
                className="h-3 bg-slate-700"
              />
              <div className="text-sm text-slate-400">
                {simulationState.phase === 'recovery' ? 
                  'Restoring files from secure backups...' : 
                  'Recovery completed successfully'
                }
              </div>
            </div>
          )}

          {/* Recovery Metrics */}
          <div className="space-y-4">
            <h5 className="text-slate-300 font-medium">Recovery Capabilities</h5>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Backup Status</span>
                <Badge className="bg-green-600 text-white">Current</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">RTO Target</span>
                <span className="text-slate-200 text-sm">< 4 hours</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">RPO Target</span>
                <span className="text-slate-200 text-sm">< 1 hour</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Auto-Recovery</span>
                <Badge className="bg-blue-600 text-white">Enabled</Badge>
              </div>
            </div>
          </div>

          {/* Recovery Steps */}
          <div className="space-y-3">
            <h5 className="text-slate-300 font-medium">Recovery Process</h5>
            <div className="space-y-2 text-sm">
              <div className={`flex items-center space-x-2 ${
                simulationState.recoveryProgress >= 20 ? 'text-green-400' : 'text-slate-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  simulationState.recoveryProgress >= 20 ? 'bg-green-400' : 'bg-slate-600'
                }`}></div>
                <span>Isolate infected systems</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${
                simulationState.recoveryProgress >= 40 ? 'text-green-400' : 'text-slate-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  simulationState.recoveryProgress >= 40 ? 'bg-green-400' : 'bg-slate-600'
                }`}></div>
                <span>Verify backup integrity</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${
                simulationState.recoveryProgress >= 60 ? 'text-green-400' : 'text-slate-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  simulationState.recoveryProgress >= 60 ? 'bg-green-400' : 'bg-slate-600'
                }`}></div>
                <span>Restore from backups</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${
                simulationState.recoveryProgress >= 80 ? 'text-green-400' : 'text-slate-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  simulationState.recoveryProgress >= 80 ? 'bg-green-400' : 'bg-slate-600'
                }`}></div>
                <span>Validate system integrity</span>
              </div>
              
              <div className={`flex items-center space-x-2 ${
                simulationState.recoveryProgress >= 100 ? 'text-green-400' : 'text-slate-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  simulationState.recoveryProgress >= 100 ? 'bg-green-400' : 'bg-slate-600'
                }`}></div>
                <span>Resume normal operations</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationPanel;
