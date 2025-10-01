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
  parameters: Record<string, any>;
  batteryIds: string[];
}

// Flask API Response Types
export interface FlaskApiResponse {
  metadata: {
    cell_id?: string;
    form_factor?: string;
    anode_material?: string;
    cathode_material?: string;
    nominal_capacity_in_Ah?: number;
    total_cycles: number;
    first_cycle_number?: number;
    last_cycle_number?: number;
    test_temperature_C?: number;
  };
  capacity_fade: {
    cycle_numbers: number[];
    charge_capacities: (number | null)[];
    discharge_capacities: (number | null)[];
    coulombic_efficiencies: (number | null)[];
    capacity_fade_percentage?: number;
    capacity_fade_rate_per_cycle?: number;
    capacity_retention_percentage?: number;
    capacity_plot?: string; // base64 encoded image
  };
  voltage_profile: {
    voltage_curves: Array<{
      cycle_number: number;
      charge_data?: {
        capacities: number[];
        voltages: number[];
      };
      discharge_data?: {
        capacities: number[];
        voltages: number[];
      };
    }>;
    voltage_stats: {
      min_voltage?: number;
      max_voltage?: number;
      avg_voltage?: number;
    };
    voltage_profile_plot?: string;
    differential_voltage_plot?: string;
  };
  temperature_analysis: {
    has_temperature_data: boolean;
    average_temperature?: number;
    temperature_range?: {
      min: number;
      max: number;
    };
    temperature_stats: Record<string, number>;
    temperature_vs_capacity_plot?: string;
  };
  statistical_metrics: {
    charge_discharge_stats: Record<string, any>;
    current_stats: Record<string, number>;
    voltage_stats: Record<string, number>;
    cycle_life_projection?: {
      fade_rate: number;
      r_squared: number;
      initial_capacity: number;
      eol_capacity: number;
      projected_eol_cycle?: number;
      confidence: number;
    };
  };
  battery_health: {
    health_score?: number;
    health_status?: string;
    capacity_retention?: number;
    degradation_indicators: string[];
  };
}

// Updated Battery interface to include Flask API data
export interface BatteryWithAnalytics extends Battery {
  analytics?: FlaskApiResponse;
  lastAnalyzed?: Date;
}

// File Upload Response
export interface FileUploadResponse {
  success: boolean;
  batteryId?: string;
  analytics?: FlaskApiResponse;
  message?: string;
  error?: string;
}