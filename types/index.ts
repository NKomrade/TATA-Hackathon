export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: Record<string, any>;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  lastUpdated: Date;
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  color: string;
}

export interface SystemStatus {
  status: 'online' | 'offline' | 'maintenance';
  uptime: string;
  cpuUsage: number;
  memoryUsage: {
    used: number;
    total: number;
  };
  activeUsers: number;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  source?: string;
}

export interface QueryTopic {
  id: string;
  name: string;
  description: string;
  entityCount: number;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export interface AdminAction {
  id: string;
  title: string;
  description: string;
  dangerous: boolean;
  requiresConfirmation: boolean;
  action: () => void;
}