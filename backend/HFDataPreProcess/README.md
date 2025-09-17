# CALB Battery Data Analysis

This repository contains tools for analyzing battery cell data from CALB lithium-ion batteries. The data is stored in Python pickle (.pkl) files and includes charge/discharge cycle information, voltage curves, capacity measurements, and other battery performance metrics.

## Data Structure

The battery data is organized as follows:

### Pickle File Format

Each `.pkl` file contains data for a single battery cell, stored as a Python dictionary with the following structure:

```
{
    'cell_id': 'CALB_XX_BYYY',              # Battery cell identifier
    'cycle_data': [                         # List of cycle dictionaries
        {
            'cycle_number': N,              # Cycle sequence number
            'current_in_A': [...],          # List of current measurements
            'voltage_in_V': [...],          # List of voltage measurements
            'charge_capacity_in_Ah': [...], # Charge capacity at each measurement
            'discharge_capacity_in_Ah': [...], # Discharge capacity at each measurement
            'time_in_s': [...],             # Time measurements
            ...
        },
        ...
    ],
    'form_factor': '...',                   # Cell form factor (e.g., 'Prismatic')
    'anode_material': '...',                # Anode material (e.g., 'graphite')
    'cathode_material': '...',              # Cathode material (e.g., 'NMC')
    'electrolyte_material': '...',          # Electrolyte material
    'nominal_capacity_in_Ah': X.X,          # Nominal capacity in Amp-hours
    'depth_of_charge': X.X,                 # Depth of charge
    'depth_of_discharge': X.X,              # Depth of discharge
    'already_spent_cycles': N,              # Number of cycles already spent
    'max_voltage_limit_in_V': X.X,          # Maximum voltage limit
    'min_voltage_limit_in_V': X.X,          # Minimum voltage limit
    'max_current_limit_in_A': X.X,          # Maximum current limit
    'min_current_limit_in_A': X.X,          # Minimum current limit
    'reference': '...',                     # Reference information
    'description': '...',                   # Description of the cell or test
    'charge_protocol': '...',               # Charging protocol details
    'discharge_protocol': '...',            # Discharging protocol details
    'SOC_interval': [...]                   # State of Charge intervals
}
```

### File Naming Convention

The pickle files follow a naming convention that indicates the test temperature and cell identifier:

- `CALB_XX_BYYY.pkl`: Where XX is the temperature (e.g., 0, 25, 35, 45 °C) and YYY is the cell identifier.

Examples:
- `CALB_0_B182.pkl`: Cell B182 tested at 0°C
- `CALB_25_T25-1.pkl`: Cell T25-1 tested at 25°C
- `CALB_35_B249.pkl`: Cell B249 tested at 35°C

## Exported Data Format

When converted to CSV using the provided tools, the data is organized into three files per battery cell:

1. **Metadata CSV** (`CALB_XX_BYYY_metadata.csv`):
   - Contains all cell properties except cycle data
   - Includes material information, capacity ratings, and test parameters

2. **Cycle Data CSV** (`CALB_XX_BYYY_cycles.csv`):
   - Contains all measurement data from each cycle
   - Columns include cycle_number, current_in_A, voltage_in_V, charge_capacity_in_Ah, discharge_capacity_in_Ah, time_in_s

3. **Metrics CSV** (`CALB_XX_BYYY_metrics.csv`):
   - Contains summarized metrics for each cycle
   - Includes max_voltage_V, max_current_A, charge_capacity_Ah, discharge_capacity_Ah, coulombic_efficiency_%

## Analysis Tools

This repository includes three Python scripts for analyzing the battery data:

1. **explore_calb_data.py**:
   - Quick overview of pickle file contents
   - Usage: `python explore_calb_data.py [filename.pkl]`

2. **analyze_calb_data.py**:
   - Detailed inspection of data structure
   - Visualization of data
   - Options for listing all files, detailed output, and plotting
   - Usage: 
     - `python analyze_calb_data.py --list`
     - `python analyze_calb_data.py CALB_35_B249.pkl --detail`
     - `python analyze_calb_data.py CALB_35_B249.pkl --plot`

3. **convert_calb_data.py**:
   - Converts pickle data to CSV format
   - Generates battery performance metrics plots
   - Options for processing individual or all files
   - Usage:
     - `python convert_calb_data.py --file CALB_35_B249.pkl --export --plot`
     - `python convert_calb_data.py --all --export --plot`

## Battery Performance Metrics

The analysis tools generate visualizations for key battery performance metrics:

1. **Capacity Fade Analysis**:
   - Plots charge and discharge capacity vs. cycle number
   - Tracks capacity degradation over battery lifetime
   - Shows coulombic efficiency trends

2. **Voltage Curves**:
   - Voltage vs. capacity plots for charge and discharge cycles
   - Comparison of voltage profiles across different cycles
   - Useful for identifying changes in battery behavior over time

## Getting Started

### Requirements

- Python 3.6+
- Required packages: pandas, numpy, matplotlib, pickle

### Basic Usage

1. Clone this repository
2. Ensure you have the CALB pickle files in the `CALB/` directory
3. Run one of the analysis tools:

```bash
# Quick overview of files
python explore_calb_data.py

# Detailed analysis and plotting
python analyze_calb_data.py CALB_35_B249.pkl --detail --plot

# Convert to CSV and generate metrics
python convert_calb_data.py --file CALB_35_B249.pkl --export --plot

# Process all files
python convert_calb_data.py --all --export --plot
```

## Data Interpretation

### Key Metrics

1. **Charge/Discharge Capacity**:
   - Maximum charge/discharge capacity in each cycle
   - Decreasing trend indicates battery degradation

2. **Coulombic Efficiency**:
   - Ratio of discharge capacity to charge capacity (%)
   - Indicates energy efficiency of the battery
   - Lower efficiency suggests increased side reactions

3. **Voltage Curves**:
   - Shape changes can indicate aging mechanisms
   - Increased resistance (steeper slopes)
   - Loss of active material (decreased capacity)

### Common Battery Aging Mechanisms

1. **Loss of Lithium Inventory (LLI)**:
   - Due to SEI formation, lithium plating, or irreversible reactions
   - Results in capacity fade

2. **Loss of Active Material (LAM)**:
   - Structural changes in electrode materials
   - Changes in voltage curve shapes

3. **Increased Internal Resistance**:
   - Due to SEI growth, particle cracking, or electrolyte degradation
   - Results in power fade

## Example Applications

The data and tools in this repository can be used for:

1. **Battery Life Prediction**:
   - Capacity fade trend analysis
   - Estimation of remaining useful life

2. **Degradation Mechanism Identification**:
   - Voltage curve analysis
   - Coulombic efficiency tracking

3. **Battery Management System Optimization**:
   - State of charge estimation
   - State of health monitoring

4. **Machine Learning Model Development**:
   - Feature extraction from battery cycling data
   - Predictive modeling of battery aging

