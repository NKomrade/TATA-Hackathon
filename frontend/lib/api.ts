const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Battery Data API
  async getBatteries() {
    return this.request("/api/v1/batteries");
  }

  async getBattery(id: string) {
    return this.request(`/api/v1/batteries/${id}`);
  }

  async uploadBatteryData(data: FormData) {
    return this.request("/api/v1/batteries/upload", {
      method: "POST",
      body: data,
      headers: {}, // Remove Content-Type for FormData
    });
  }

  // Predictions API
  async runPrediction(batteryId: string, predictionType: string) {
    return this.request("/api/v1/predictions", {
      method: "POST",
      body: JSON.stringify({ battery_id: batteryId, type: predictionType }),
    });
  }

  async getPredictions(batteryId: string) {
    return this.request(`/api/v1/predictions/${batteryId}`);
  }

  // Analytics API
  async getAnalytics(batteryId: string) {
    return this.request(`/api/v1/analytics/${batteryId}`);
  }

  // RUL API
  async calculateRul(batteryId: string, eolThreshold: number) {
    return this.request("/api/v1/rul/calculate", {
      method: "POST",
      body: JSON.stringify({ battery_id: batteryId, eol_threshold: eolThreshold }),
    });
  }

  // Reuse API
  async getRecommendations(batteryId: string) {
    return this.request(`/api/v1/reuse/recommend/${batteryId}`);
  }

  // Training API
  async trainModel(modelType: string, parameters: any) {
    return this.request("/api/v1/models/train", {
      method: "POST",
      body: JSON.stringify({ model_type: modelType, parameters }),
    });
  }

  async getModelStatus(jobId: string) {
    return this.request(`/api/v1/models/status/${jobId}`);
  }

  // Reports API
  async generateReport(reportConfig: any) {
    return this.request("/api/v1/reports/generate", {
      method: "POST",
      body: JSON.stringify(reportConfig),
    });
  }
}

export const apiClient = new ApiClient();
