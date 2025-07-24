// Battery Data Types
export interface Battery {
  id: string;
  name: string;
  status: 'active' | 'degraded' | 'eol';
  initialCapacity: number;
  currentCapacity: number;
  cycles: number;
  soh: number;
  temperature: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CycleData {
  cycleNumber: number;
  capacity: number;
  voltage: number;
  current: number;
  temperature: number;
  timestamp: Date;
  impedance?: {
    re: number;
    rct: number;
    total: number;
  };
}

// Prediction Types
export interface PredictionResult {
  batteryId: string;
  predictionType: 'capacity' | 'rul' | 'hybrid';
  predictedValues: number[];
  cycles: number[];
  confidenceInterval: {
    upper: number[];
    lower: number[];
  };
  accuracy: {
    mae: number;
    rmse: number;
    r2: number;
    mape: number;
  };
  generatedAt: Date;
}

// RUL Types
export interface RulCalculation {
  batteryId: string;
  currentCycle: number;
  eolThreshold: number;
  predictedEolCycle: number;
  remainingCycles: number;
  remainingDays: number;
  confidence: number;
}

// Reuse Types
export interface ReuseRecommendation {
  application: string;
  minCapacity: number;
  maxCapacity: number;
  estimatedValue: number;
  description: string;
  suitable: boolean;
  economicImpact: {
    cost: number;
    profit: number;
    roi: number;
  };
}

// Training Types
export interface ModelTrainingJob {
  id: string;
  modelType: 'neural_network' | 'xgboost' | 'random_forest' | 'hybrid';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  parameters: Record<string, any>;
  metrics?: {
    mae: number;
    rmse: number;
    r2: number;
    trainingTime: number;
  };
  startedAt: Date;
  completedAt?: Date;
}

// Analytics Types
export interface AnalyticsData {
  batteryId: string;
  capacityTrend: {
    actual: number[];
    predicted: number[];
    cycles: number[];
  };
  temperatureTrend: {
    values: number[];
    cycles: number[];
  };
  degradationRate: {
    rate: number[];
    cycles: number[];
  };
  featureImportance: {
    feature: string;
    importance: number;
  }[];
}

// Report Types
export interface ReportConfig {
  type: 'executive' | 'technical' | 'maintenance' | 'custom';
  batteryIds: string[];
  sections: string[];
  format: 'pdf' | 'html' | 'csv';
  dateRange: {
    start: Date;
    end: Date;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: Date;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: Date;
}

// Component Props Types
export interface ChartProps {
  data: any[];
  loading?: boolean;
  error?: string;
}

export interface TableProps {
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
  }[];
  data: any[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
}

// Form Types
export interface BatteryUploadForm {
  file: File;
  batteryName: string;
  initialCapacity: number;
  description?: string;
}

export interface PredictionForm {
  batteryId: string;
  predictionType: string;
  parameters?: Record<string, any>;
}

export interface TrainingForm {
  modelType: string;
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
}
