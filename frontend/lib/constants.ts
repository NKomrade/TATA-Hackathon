// API Endpoints
export const API_ENDPOINTS = {
  BATTERIES: "/api/v1/batteries",
  PREDICTIONS: "/api/v1/predictions",
  ANALYTICS: "/api/v1/analytics",
  RUL: "/api/v1/rul",
  REUSE: "/api/v1/reuse",
  TRAINING: "/api/v1/models",
  REPORTS: "/api/v1/reports",
} as const;

// Battery Status Constants
export const BATTERY_STATUS = {
  ACTIVE: "active",
  DEGRADED: "degraded",
  EOL: "eol",
} as const;

// Model Types
export const MODEL_TYPES = {
  NEURAL_NETWORK: "neural_network",
  XGBOOST: "xgboost",
  RANDOM_FOREST: "random_forest",
  HYBRID: "hybrid",
} as const;

// Prediction Types
export const PREDICTION_TYPES = {
  CAPACITY: "capacity",
  RUL: "rul",
  HYBRID: "hybrid",
} as const;

// Default Values
export const DEFAULTS = {
  EOL_THRESHOLD: 80, // 80% of initial capacity
  PREDICTION_INTERVAL: 10, // cycles
  CHART_COLORS: {
    PRIMARY: "#3b82f6",
    SECONDARY: "#ef4444",
    SUCCESS: "#10b981",
    WARNING: "#f59e0b",
    INFO: "#8b5cf6",
  },
  EXPORT_FORMATS: ["csv", "json", "xlsx", "pdf"],
  CHART_RESOLUTIONS: ["low", "medium", "high", "ultra"],
} as const;

// Battery Applications for Reuse
export const REUSE_APPLICATIONS = [
  {
    name: "Electric Vehicle",
    minCapacityPercent: 90,
    estimatedValue: 25000,
    description: "Primary automotive applications",
  },
  {
    name: "Home Energy Storage",
    minCapacityPercent: 80,
    estimatedValue: 18000,
    description: "Residential backup power systems",
  },
  {
    name: "UPS System",
    minCapacityPercent: 70,
    estimatedValue: 12000,
    description: "Uninterruptible power supply",
  },
  {
    name: "Solar Street Light",
    minCapacityPercent: 65,
    estimatedValue: 8000,
    description: "Solar-powered lighting systems",
  },
  {
    name: "Emergency Lighting",
    minCapacityPercent: 60,
    estimatedValue: 5000,
    description: "Emergency backup lighting",
  },
  {
    name: "Recycle",
    minCapacityPercent: 0,
    estimatedValue: 2000,
    description: "Material recovery and recycling",
  },
] as const;

// Training Parameters
export const TRAINING_DEFAULTS = {
  EPOCHS: 100,
  BATCH_SIZE: 32,
  LEARNING_RATE: 0.001,
  VALIDATION_SPLIT: 0.2,
  EARLY_STOPPING_PATIENCE: 10,
} as const;

// File Upload Constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_EXTENSIONS: [".csv", ".mat", ".xlsx", ".json"],
  REQUIRED_COLUMNS: [
    "cycle",
    "capacity",
    "voltage",
    "current",
    "temperature",
  ],
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  RESPONSIVE_BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  ANIMATION_DURATION: 300,
  TOOLTIP_DELAY: 100,
  GRID_COLOR: "#e5e7eb",
  AXIS_COLOR: "#6b7280",
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "battery_twin_preferences",
  SELECTED_BATTERY: "selected_battery",
  DASHBOARD_LAYOUT: "dashboard_layout",
  THEME: "theme",
  BATTERY_ANALYTICS: 'batteryAnalytics',
  BATTERY_ANALYTICS_TIMESTAMP: 'batteryAnalyticsTimestamp'
} as const;

// Flask API Configuration - Localhost only
export const FLASK_API_BASE = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000";

export const FLASK_API_ENDPOINTS = {
  ROOT: "/",
  UPLOAD: "/api/upload"
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_FILE_TYPES: ['.pkl', '.csv', '.xlsx', '.json']
};
