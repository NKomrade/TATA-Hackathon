# Battery Analytics API

This API provides comprehensive battery analytics for lithium-ion battery data. It processes uploaded .pkl or .csv files containing battery cycling data and returns detailed analytics, visualizations, and health assessments.

## Features

- **Capacity Fade Analysis**: Track battery degradation over cycles
- **Voltage Profile Analysis**: Examine voltage behavior during charge/discharge
- **Temperature Correlation**: Analyze performance vs. temperature
- **Statistical Metrics**: Calculate key battery performance indicators
- **Battery Health Assessment**: Evaluate overall battery condition
- **Visualization**: Generate plots for all major metrics

## API Usage

### Endpoints

- `POST /api/upload`: Upload battery data files for analysis

### Upload Endpoint

**URL**: `/api/upload`

**Method**: `POST`

**Content-Type**: `multipart/form-data`

**Parameters**:

- `file`: One or more battery data files (.pkl or .csv)

**Response Format**:
```json
{
  "metadata": {
    "cell_id": "CALB_XX_BYYY",
    "form_factor": "Prismatic",
    "nominal_capacity_in_Ah": 58.0,
    "total_cycles": 100,
    "first_cycle_number": 1,
    "last_cycle_number": 100,
    "test_temperature_C": 35.0
  },
  "capacity_fade": {
    "cycle_numbers": [1, 2, 3, ...],
    "charge_capacities": [58.82, 58.81, ...],
    "discharge_capacities": [58.82, 58.81, ...],
    "coulombic_efficiencies": [100.0, 100.0, ...],
    "capacity_fade_percentage": 0.41,
    "capacity_fade_rate_per_cycle": 0.0041,
    "capacity_retention_percentage": 99.59,
    "capacity_plot": "base64_encoded_image"
  },
  "voltage_profile": {
    "voltage_curves": [...],
    "voltage_stats": {
      "min_voltage": 2.75,
      "max_voltage": 4.35,
      "avg_voltage": 3.65
    },
    "voltage_profile_plot": "base64_encoded_image",
    "differential_voltage_plot": "base64_encoded_image"
  },
  "temperature_analysis": {
    "has_temperature_data": true,
    "average_temperature": 35.2,
    "temperature_range": {
      "min": 34.8,
      "max": 35.6
    },
    "temperature_stats": {...},
    "temperature_vs_capacity_plot": "base64_encoded_image"
  },
  "statistical_metrics": {
    "charge_discharge_stats": {...},
    "current_stats": {...},
    "voltage_stats": {...},
    "cycle_life_projection": {
      "fade_rate": -0.0024,
      "projected_eol_cycle": 4500,
      "confidence": 0.92
    }
  },
  "battery_health": {
    "health_score": 99.6,
    "health_status": "Excellent",
    "capacity_retention": 99.6,
    "degradation_indicators": []
  }
}
```

### File Formats

The API accepts two types of files:

1. **Pickle (.pkl) Files**: Python pickle files containing battery data in the CALB format
2. **CSV Files**: Sets of CSV files exported from the CALB data:
   - `*_cycles.csv`: Contains cycle-by-cycle measurements
   - `*_metadata.csv`: Contains battery properties and test conditions
   - `*_metrics.csv`: Contains summary metrics for each cycle

## Running the API

### Installation

1. Clone this repository
2. Install the required packages:
   ```bash
   pip install flask flask-cors pandas numpy matplotlib scikit-learn
   ```

### Starting the Server

```bash
python battery_analytics_api.py [port]
```

Default port is 5000 if not specified.

### Using the Client

A client script is provided to interact with the API:

```bash
python battery_analytics_client.py --file CALB_35_B249.pkl
python battery_analytics_client.py --files CALB_35_B249_cycles.csv CALB_35_B249_metadata.csv CALB_35_B249_metrics.csv
```

Options:
- `--file`: Path to a single file to analyze
- `--files`: Paths to multiple files to analyze together
- `--url`: API endpoint URL (default: http://localhost:5000/api/upload)
- `--output`: Path to save the JSON results
- `--show-plots`: Display the generated plots

## Integration with Dashboards

The API is designed to integrate easily with web dashboards. The response includes:

1. **Structured Data**: All metrics and statistics are provided in a structured JSON format
2. **Base64 Encoded Plots**: All visualizations are included as base64-encoded PNG images

To display in a dashboard:
1. Make a POST request to the `/api/upload` endpoint with the battery data file(s)
2. Parse the JSON response
3. Display the metrics and decode the base64 images for visualization

## Example Dashboard Integration

```javascript
// Example React code
async function uploadBatteryData(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  return data;
}

function BatteryDashboard() {
  const [batteryData, setBatteryData] = useState(null);
  
  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const data = await uploadBatteryData(file);
    setBatteryData(data);
  };
  
  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      
      {batteryData && (
        <div>
          <h2>Battery: {batteryData.metadata.cell_id}</h2>
          
          <div className="dashboard-card">
            <h3>Capacity Fade</h3>
            <p>Fade Rate: {batteryData.capacity_fade.capacity_fade_rate_per_cycle}% per cycle</p>
            <p>Retention: {batteryData.capacity_fade.capacity_retention_percentage}%</p>
            <img src={`data:image/png;base64,${batteryData.capacity_fade.capacity_plot}`} alt="Capacity Fade" />
          </div>
          
          <div className="dashboard-card">
            <h3>Voltage Profile</h3>
            <img src={`data:image/png;base64,${batteryData.voltage_profile.voltage_profile_plot}`} alt="Voltage Profile" />
          </div>
          
          <div className="dashboard-card">
            <h3>Battery Health</h3>
            <h4>{batteryData.battery_health.health_status}</h4>
            <p>Health Score: {batteryData.battery_health.health_score}/100</p>
            <p>Capacity Retention: {batteryData.battery_health.capacity_retention}%</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Error Handling

The API provides descriptive error messages for common issues:

- Invalid file formats
- Missing or corrupted data
- Unsupported battery data structures

Error responses include an error message and HTTP status code 400 (Bad Request).

## Data Privacy

All uploaded files are processed in memory and then deleted from the server. No battery data is stored permanently unless explicitly configured.

## Performance Considerations

- Maximum upload size is limited to 50MB by default
- Large datasets may take longer to process, especially when generating visualizations
- For production use, consider implementing caching or background processing for large files