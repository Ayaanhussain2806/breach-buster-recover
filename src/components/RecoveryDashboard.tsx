
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, HardDrive, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useSimulation } from '../contexts/SimulationContext';

const RecoveryDashboard = () => {
  const { simulationState, initiateRecovery } = useSimulation();

  const backupSources = [
    {
      name: 'Primary File Server',
      status: 'healthy',
      lastBackup: '2 hours ago',
      size: '2.4 TB',
      recoveryTime: '45 minutes'
    },
    {
      name: 'Database Cluster',
      status: 'healthy',
      lastBackup: '1 hour ago',
      size: '890 GB',
      recoveryTime: '20 minutes'
    },
    {
      name: 'User Workstations',
      status: 'healthy',
      lastBackup: '6 hours ago',
      size: '1.8 TB',
      recoveryTime: '60 minutes'
    },
    {
      name: 'Application Servers',
      status: 'healthy',
      lastBackup: '4 hours ago',
      size: '1.2 TB',
      recoveryTime: '30 minutes'
    }
  ];

  const recoveryJobs = [
    {
      id: 1,
      name: 'Critical Database Recovery',
      progress: simulationState.recoveryProgress,
      status: simulationState.phase === 'recovery' ? 'running' : 
              simulationState.phase === 'recovered' ? 'completed' : 'pending',
      eta: '15 minutes remaining'
    },
    {
      id: 2,
      name: 'File Server Restoration',
      progress: Math.max(simulationState.recoveryProgress - 20, 0),
      status: simulationState.recoveryProgress > 20 ? 
              (simulationState.phase === 'recovered' ? 'completed' : 'running') : 'pending',
      eta: '25 minutes remaining'
    },
    {
      id: 3,
      name: 'User Data Recovery',
      progress: Math.max(simulationState.recoveryProgress - 40, 0),
      status: simulationState.recoveryProgress > 40 ? 
              (simulationState.phase === 'recovered' ? 'completed' : 'running') : 'pending',
      eta: '35 minutes remaining'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Recovery Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Recovery Time Objective</p>
                <p className="text-2xl font-bold text-white">< 4 hrs</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Recovery Point Objective</p>
                <p className="text-2xl font-bold text-white">< 1 hr</p>
              </div>
              <Database className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Backup Health</p>
                <p className="text-2xl font-bold text-green-400">100%</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Sources */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <HardDrive className="w-5 h-5 mr-2 text-blue-400" />
              Backup Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {backupSources.map((source, index) => (
              <div key={index} className="bg-slate-900/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-white font-medium">{source.name}</h5>
                  <Badge className={`${
                    source.status === 'healthy' ? 'bg-green-600' : 'bg-red-600'
                  } text-white`}>
                    {source.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Last Backup:</span>
                    <span className="text-slate-200 ml-2">{source.lastBackup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-200 ml-2">{source.size}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-slate-400">Est. Recovery Time:</span>
                  <span className="text-slate-200 ml-2">{source.recoveryTime}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Recovery Jobs */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-400" />
                Recovery Jobs
              </div>
              {simulationState.filesEncrypted > 0 && simulationState.phase !== 'recovery' && simulationState.phase !== 'recovered' && (
                <Button 
                  onClick={initiateRecovery}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Recovery
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recoveryJobs.map((job) => (
              <div key={job.id} className="bg-slate-900/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-white font-medium">{job.name}</h5>
                  <div className="flex items-center space-x-2">
                    {job.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {job.status === 'running' && <AlertCircle className="w-4 h-4 text-blue-400 animate-pulse" />}
                    {job.status === 'pending' && <Clock className="w-4 h-4 text-slate-400" />}
                    <Badge className={`${
                      job.status === 'completed' ? 'bg-green-600' :
                      job.status === 'running' ? 'bg-blue-600' :
                      'bg-slate-600'
                    } text-white`}>
                      {job.status}
                    </Badge>
                  </div>
                </div>
                
                {job.status !== 'pending' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-200">{Math.round(job.progress)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2 bg-slate-700" />
                    {job.status === 'running' && (
                      <p className="text-xs text-slate-400">{job.eta}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recovery Timeline */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-400" />
            Recovery Timeline & Playbook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { phase: 'Detection & Assessment', time: '0-15 min', status: 'completed' },
              { phase: 'Isolation & Containment', time: '15-30 min', status: simulationState.recoveryProgress >= 20 ? 'completed' : 'pending' },
              { phase: 'Backup Verification', time: '30-45 min', status: simulationState.recoveryProgress >= 40 ? 'completed' : 'pending' },
              { phase: 'Data Recovery', time: '45-120 min', status: simulationState.recoveryProgress >= 60 ? 'completed' : 'pending' },
              { phase: 'System Validation', time: '120-180 min', status: simulationState.recoveryProgress >= 80 ? 'completed' : 'pending' },
              { phase: 'Operations Resume', time: '180-240 min', status: simulationState.recoveryProgress >= 100 ? 'completed' : 'pending' }
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${
                  step.status === 'completed' ? 'bg-green-400' : 'bg-slate-600'
                }`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      step.status === 'completed' ? 'text-green-400' : 'text-slate-300'
                    }`}>
                      {step.phase}
                    </span>
                    <span className="text-slate-400 text-sm">{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoveryDashboard;
