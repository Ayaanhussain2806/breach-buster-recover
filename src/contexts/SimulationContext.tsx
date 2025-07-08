
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface ThreatEvent {
  id: string;
  timestamp: Date;
  type: 'reconnaissance' | 'infiltration' | 'lateral_movement' | 'encryption' | 'ransom_demand';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affected_systems: string[];
  status: 'active' | 'mitigated' | 'resolved';
}

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  network_activity: number;
  disk_usage: number;
  threat_level: number;
}

interface SimulationState {
  isActive: boolean;
  phase: string;
  progress: number;
  threatEvents: ThreatEvent[];
  systemMetrics: SystemMetrics;
  filesEncrypted: number;
  totalFiles: number;
  recoveryProgress: number;
}

interface SimulationContextType {
  simulationState: SimulationState;
  startSimulation: () => void;
  stopSimulation: () => void;
  initiateRecovery: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isActive: false,
    phase: 'idle',
    progress: 0,
    threatEvents: [],
    systemMetrics: {
      cpu_usage: 15,
      memory_usage: 32,
      network_activity: 8,
      disk_usage: 45,
      threat_level: 0
    },
    filesEncrypted: 0,
    totalFiles: 1247,
    recoveryProgress: 0
  });

  const generateThreatEvent = useCallback((type: ThreatEvent['type'], phase: string): ThreatEvent => {
    const eventTemplates = {
      reconnaissance: [
        'Port scanning detected on network perimeter',
        'Suspicious DNS queries from external sources',
        'Automated vulnerability scanning in progress'
      ],
      infiltration: [
        'Phishing email opened by user in Finance department',
        'Malicious payload executed via email attachment',
        'Initial access gained through compromised credentials'
      ],
      lateral_movement: [
        'Privilege escalation attempt detected',
        'Lateral movement to domain controller',
        'Administrative shares accessed from compromised host'
      ],
      encryption: [
        'File encryption process initiated on file server',
        'Database files being encrypted by malicious process',
        'User documents encryption in progress'
      ],
      ransom_demand: [
        'Ransom note deployed to desktop backgrounds',
        'Payment portal URL distributed',
        'Countdown timer activated for ransom payment'
      ]
    };

    const descriptions = eventTemplates[type];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    return {
      id: `event-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type,
      severity: type === 'ransom_demand' ? 'critical' : 
                type === 'encryption' ? 'high' :
                type === 'lateral_movement' ? 'high' : 'medium',
      description,
      affected_systems: ['File Server', 'Workstation-01', 'Database Server'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: 'active'
    };
  }, []);

  const startSimulation = useCallback(() => {
    console.log('Starting ransomware simulation...');
    
    setSimulationState(prev => ({
      ...prev,
      isActive: true,
      phase: 'reconnaissance',
      progress: 0,
      threatEvents: [],
      filesEncrypted: 0,
      recoveryProgress: 0
    }));

    const phases = [
      { name: 'reconnaissance', duration: 3000 },
      { name: 'infiltration', duration: 4000 },
      { name: 'lateral_movement', duration: 5000 },
      { name: 'encryption', duration: 8000 },
      { name: 'ransom_demand', duration: 2000 }
    ];

    let currentPhaseIndex = 0;
    let progress = 0;

    const simulationInterval = setInterval(() => {
      const currentPhase = phases[currentPhaseIndex];
      
      if (!currentPhase) {
        clearInterval(simulationInterval);
        return;
      }

      progress += 100 / (currentPhase.duration / 200);

      // Generate threat events during simulation
      if (Math.random() < 0.3) {
        const event = generateThreatEvent(currentPhase.name as ThreatEvent['type'], currentPhase.name);
        setSimulationState(prev => ({
          ...prev,
          threatEvents: [event, ...prev.threatEvents.slice(0, 9)]
        }));
      }

      // Update system metrics based on phase
      const metricMultiplier = Math.min(progress / 100, 1);
      
      setSimulationState(prev => ({
        ...prev,
        phase: currentPhase.name,
        progress: Math.min(progress, 100),
        systemMetrics: {
          cpu_usage: Math.min(15 + (metricMultiplier * 60), 85),
          memory_usage: Math.min(32 + (metricMultiplier * 40), 75),
          network_activity: Math.min(8 + (metricMultiplier * 70), 85),
          disk_usage: 45,
          threat_level: Math.min(metricMultiplier * 100, 95)
        },
        filesEncrypted: currentPhase.name === 'encryption' ? 
          Math.floor(prev.totalFiles * (progress / 100)) : prev.filesEncrypted
      }));

      if (progress >= 100) {
        progress = 0;
        currentPhaseIndex++;
        
        if (currentPhaseIndex >= phases.length) {
          clearInterval(simulationInterval);
          setSimulationState(prev => ({
            ...prev,
            phase: 'completed'
          }));
        }
      }
    }, 200);

  }, [generateThreatEvent]);

  const stopSimulation = useCallback(() => {
    console.log('Stopping simulation...');
    setSimulationState(prev => ({
      ...prev,
      isActive: false,
      phase: 'idle',
      progress: 0,
      systemMetrics: {
        cpu_usage: 15,
        memory_usage: 32,
        network_activity: 8,
        disk_usage: 45,
        threat_level: 0
      }
    }));
  }, []);

  const initiateRecovery = useCallback(() => {
    console.log('Initiating automated recovery...');
    
    setSimulationState(prev => ({
      ...prev,
      phase: 'recovery',
      recoveryProgress: 0
    }));

    const recoveryInterval = setInterval(() => {
      setSimulationState(prev => {
        const newProgress = Math.min(prev.recoveryProgress + 2, 100);
        
        if (newProgress >= 100) {
          clearInterval(recoveryInterval);
          return {
            ...prev,
            recoveryProgress: 100,
            phase: 'recovered',
            isActive: false,
            filesEncrypted: 0,
            systemMetrics: {
              cpu_usage: 12,
              memory_usage: 28,
              network_activity: 5,
              disk_usage: 45,
              threat_level: 0
            }
          };
        }
        
        return {
          ...prev,
          recoveryProgress: newProgress,
          filesEncrypted: Math.floor(prev.totalFiles * ((100 - newProgress) / 100))
        };
      });
    }, 100);
  }, []);

  return (
    <SimulationContext.Provider 
      value={{ 
        simulationState, 
        startSimulation, 
        stopSimulation, 
        initiateRecovery 
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};
