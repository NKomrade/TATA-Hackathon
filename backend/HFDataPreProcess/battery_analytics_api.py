#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import io
import pickle
import tempfile
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import json
import traceback
import logging
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Custom JSON encoder to handle NumPy types
class NumpyEncoder(json.JSONEncoder):
    """Custom JSON encoder that converts NumPy types to Python native types."""
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, (np.bool_, bool)):
            return bool(obj)
        elif pd.isna(obj):
            return None
        return super().default(obj)

def convert_numpy_types(obj):
    """Recursively convert NumPy types to Python native types."""
    if isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, (np.bool_, bool)):
        return bool(obj)
    elif pd.isna(obj):
        return None
    else:
        return obj

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Flask to use custom JSON encoder
app.json_encoder = NumpyEncoder

# Configure upload settings
UPLOAD_FOLDER = tempfile.mkdtemp()
ALLOWED_EXTENSIONS = {'pkl', 'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50 MB max upload


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def fig_to_base64(fig):
    """Convert a matplotlib figure to a base64 encoded string."""
    buf = BytesIO()
    fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return img_str


def load_pickle_data(file_path):
    """Load data from a pickle file."""
    try:
        with open(file_path, 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        logger.error(f"Error loading pickle file: {str(e)}")
        raise ValueError(f"Invalid pickle file format: {str(e)}")


def load_csv_data(file_paths):
    """
    Load data from CSV files. Expects either:
    1. A single cycles file
    2. A set of three files: cycles, metadata, and metrics
    """
    data = {}
    
    # Check what files we have
    file_names = [os.path.basename(path) for path in file_paths]
    
    # Look for pattern: base_name_cycles.csv, base_name_metadata.csv, base_name_metrics.csv
    base_names = set()
    for file_name in file_names:
        if file_name.endswith('_cycles.csv'):
            base_name = file_name.replace('_cycles.csv', '')
            base_names.add(base_name)
        elif file_name.endswith('_metadata.csv'):
            base_name = file_name.replace('_metadata.csv', '')
            base_names.add(base_name)
        elif file_name.endswith('_metrics.csv'):
            base_name = file_name.replace('_metrics.csv', '')
            base_names.add(base_name)
    
    results = {}
    
    # Process each base_name set of files
    for base_name in base_names:
        cycles_path = None
        metadata_path = None
        metrics_path = None
        
        for path in file_paths:
            filename = os.path.basename(path)
            if filename == f"{base_name}_cycles.csv":
                cycles_path = path
            elif filename == f"{base_name}_metadata.csv":
                metadata_path = path
            elif filename == f"{base_name}_metrics.csv":
                metrics_path = path
        
        data = {}
        
        # Load cycles data
        if cycles_path:
            try:
                cycles_df = pd.read_csv(cycles_path)
                # Convert to structure similar to pickle format
                cycle_data = []
                for cycle_num in cycles_df['cycle_number'].unique():
                    cycle_df = cycles_df[cycles_df['cycle_number'] == cycle_num]
                    cycle_dict = {
                        'cycle_number': cycle_num,
                        'current_in_A': cycle_df['current_in_A'].tolist(),
                        'voltage_in_V': cycle_df['voltage_in_V'].tolist(),
                        'time_in_s': cycle_df['time_in_s'].tolist()
                    }
                    
                    if 'charge_capacity_in_Ah' in cycle_df.columns:
                        cycle_dict['charge_capacity_in_Ah'] = cycle_df['charge_capacity_in_Ah'].tolist()
                    
                    if 'discharge_capacity_in_Ah' in cycle_df.columns:
                        cycle_dict['discharge_capacity_in_Ah'] = cycle_df['discharge_capacity_in_Ah'].tolist()
                    
                    if 'temperature_in_C' in cycle_df.columns:
                        cycle_dict['temperature_in_C'] = cycle_df['temperature_in_C'].tolist()
                    
                    cycle_data.append(cycle_dict)
                
                data['cycle_data'] = cycle_data
            except Exception as e:
                logger.error(f"Error processing cycles CSV: {str(e)}")
                raise ValueError(f"Invalid cycles CSV format: {str(e)}")
        
        # Load metadata
        if metadata_path:
            try:
                metadata_df = pd.read_csv(metadata_path)
                if not metadata_df.empty:
                    # Convert first row to dictionary
                    metadata = metadata_df.iloc[0].to_dict()
                    # Add metadata to data dictionary (excluding cycle_data)
                    for key, value in metadata.items():
                        if key != 'cycle_data':
                            data[key] = value
            except Exception as e:
                logger.error(f"Error processing metadata CSV: {str(e)}")
                raise ValueError(f"Invalid metadata CSV format: {str(e)}")
        
        # Load metrics if available (not required)
        if metrics_path:
            try:
                metrics_df = pd.read_csv(metrics_path)
                data['metrics'] = metrics_df.to_dict(orient='records')
            except Exception as e:
                logger.warning(f"Could not load metrics CSV: {str(e)}")
        
        results[base_name] = data
    
    # If we have only one result, return it directly
    if len(results) == 1:
        return list(results.values())[0]
    
    # Otherwise return all results
    return results


def validate_battery_data(data):
    """Validate that data has required structure for battery analysis."""
    if not isinstance(data, dict):
        raise ValueError("Data must be a dictionary")
    
    if 'cycle_data' not in data:
        raise ValueError("Missing 'cycle_data' in battery data")
    
    if not isinstance(data['cycle_data'], list) or len(data['cycle_data']) == 0:
        raise ValueError("'cycle_data' must be a non-empty list")
    
    # Check first cycle has required keys
    first_cycle = data['cycle_data'][0]
    required_keys = ['cycle_number', 'voltage_in_V', 'current_in_A']
    for key in required_keys:
        if key not in first_cycle:
            raise ValueError(f"Missing required key '{key}' in cycle data")
    
    return True


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    API endpoint for uploading battery data files.
    Accepts .pkl files or sets of .csv files.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    files = request.files.getlist('file')
    if not files or all(file.filename == '' for file in files):
        return jsonify({'error': 'No files selected'}), 400
    
    # Check file types
    for file in files:
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed: {file.filename}'}), 400
    
    # Save files to temp location
    file_paths = []
    for file in files:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        file_paths.append(file_path)
    
    try:
        # Load data based on file type
        data = None
        if len(file_paths) == 1 and file_paths[0].endswith('.pkl'):
            data = load_pickle_data(file_paths[0])
        else:
            # Filter for CSV files
            csv_paths = [path for path in file_paths if path.endswith('.csv')]
            data = load_csv_data(csv_paths)
        
        # Validate the data structure
        validate_battery_data(data)
        
        # Process the data
        analytics_result = process_battery_data(data)
        
        # Convert NumPy types to Python native types
        analytics_result = convert_numpy_types(analytics_result)
        
        # Clean up temporary files
        for file_path in file_paths:
            try:
                os.remove(file_path)
            except:
                pass
        
        return jsonify(analytics_result)
    
    except Exception as e:
        # Clean up temporary files
        for file_path in file_paths:
            try:
                os.remove(file_path)
            except:
                pass
        
        logger.error(f"Error processing uploaded files: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 400


def process_battery_data(data):
    """
    Process battery data and return analytics results.
    This function orchestrates all the different analysis methods.
    """
    result = {
        'metadata': extract_metadata(data),
        'capacity_fade': analyze_capacity_fade(data),
        'voltage_profile': analyze_voltage_profiles(data),
        'temperature_analysis': analyze_temperature(data),
        'statistical_metrics': calculate_statistical_metrics(data),
        'battery_health': assess_battery_health(data)
    }
    
    return result


def extract_metadata(data):
    """Extract and format metadata from battery data."""
    metadata = {}
    
    # Extract standard metadata fields if present
    metadata_fields = [
        'cell_id', 'form_factor', 'anode_material', 'cathode_material',
        'electrolyte_material', 'nominal_capacity_in_Ah', 'depth_of_charge',
        'depth_of_discharge', 'already_spent_cycles', 'max_voltage_limit_in_V',
        'min_voltage_limit_in_V', 'max_current_limit_in_A', 'min_current_limit_in_A',
        'reference', 'description', 'charge_protocol', 'discharge_protocol'
    ]
    
    for field in metadata_fields:
        if field in data:
            value = data[field]
            # Convert NumPy types to Python types
            if isinstance(value, (np.integer, np.floating)):
                value = float(value) if isinstance(value, np.floating) else int(value)
            elif pd.isna(value):
                value = None
            metadata[field] = value
    
    # Add cycle count
    metadata['total_cycles'] = int(len(data['cycle_data']))
    
    # Add first and last cycle numbers
    cycle_numbers = [cycle.get('cycle_number') for cycle in data['cycle_data'] 
                    if cycle.get('cycle_number') is not None]
    if cycle_numbers:
        metadata['first_cycle_number'] = int(min(cycle_numbers))
        metadata['last_cycle_number'] = int(max(cycle_numbers))
    
    # Extract temperature if available in first cycle
    if data['cycle_data'] and 'temperature_in_C' in data['cycle_data'][0]:
        temps = data['cycle_data'][0]['temperature_in_C']
        if temps:
            metadata['test_temperature_C'] = float(np.mean(temps))
    
    # Try to extract temperature from cell_id if not found in data
    if 'test_temperature_C' not in metadata and 'cell_id' in metadata:
        cell_id = metadata['cell_id']
        if cell_id and cell_id.startswith('CALB_'):
            try:
                temp = int(cell_id.split('_')[1])
                metadata['test_temperature_C'] = float(temp)
            except:
                pass
    
    return metadata


def analyze_capacity_fade(data):
    """
    Analyze capacity fade over battery cycles.
    Returns capacity metrics and fade rate.
    """
    result = {
        'cycle_numbers': [],
        'charge_capacities': [],
        'discharge_capacities': [],
        'coulombic_efficiencies': [],
        'capacity_fade_percentage': None,
        'capacity_fade_rate_per_cycle': None,
        'capacity_retention_percentage': None,
        'capacity_plot': None
    }
    
    # Extract cycle data
    for cycle in data['cycle_data']:
        cycle_num = cycle.get('cycle_number')
        
        # Skip if no cycle number
        if cycle_num is None:
            continue
        
        # Get charge and discharge capacities
        charge_cap = max(cycle.get('charge_capacity_in_Ah', [0])) if cycle.get('charge_capacity_in_Ah') else None
        discharge_cap = max(cycle.get('discharge_capacity_in_Ah', [0])) if cycle.get('discharge_capacity_in_Ah') else None
        
        # Skip cycle if no capacity data
        if charge_cap is None and discharge_cap is None:
            continue
        
        # Calculate coulombic efficiency
        coulombic_efficiency = None
        if charge_cap and discharge_cap and charge_cap > 0:
            coulombic_efficiency = (discharge_cap / charge_cap) * 100
        
        result['cycle_numbers'].append(cycle_num)
        result['charge_capacities'].append(charge_cap)
        result['discharge_capacities'].append(discharge_cap)
        result['coulombic_efficiencies'].append(coulombic_efficiency)
    
    # Calculate capacity fade metrics if we have enough data
    if len(result['cycle_numbers']) > 1:
        # Calculate percentage capacity fade (from first to last cycle)
        if result['discharge_capacities'][0] is not None and result['discharge_capacities'][-1] is not None:
            initial_capacity = result['discharge_capacities'][0]
            final_capacity = result['discharge_capacities'][-1]
            
            if initial_capacity > 0:
                fade_percentage = ((initial_capacity - final_capacity) / initial_capacity) * 100
                result['capacity_fade_percentage'] = fade_percentage
                result['capacity_retention_percentage'] = 100 - fade_percentage
                
                # Calculate fade rate per cycle
                cycle_range = result['cycle_numbers'][-1] - result['cycle_numbers'][0]
                if cycle_range > 0:
                    result['capacity_fade_rate_per_cycle'] = fade_percentage / cycle_range
    
    # Generate capacity fade plot
    if len(result['cycle_numbers']) > 1:
        fig = plt.figure(figsize=(10, 8))
        
        # Plot capacities
        ax1 = fig.add_subplot(2, 1, 1)
        
        if all(cap is not None for cap in result['charge_capacities']):
            ax1.plot(result['cycle_numbers'], result['charge_capacities'], 'b-o', label='Charge Capacity')
        
        if all(cap is not None for cap in result['discharge_capacities']):
            ax1.plot(result['cycle_numbers'], result['discharge_capacities'], 'r-o', label='Discharge Capacity')
        
        ax1.set_xlabel('Cycle Number')
        ax1.set_ylabel('Capacity (Ah)')
        ax1.set_title('Capacity Fade Analysis')
        ax1.legend()
        ax1.grid(True)
        
        # Plot coulombic efficiency
        if all(eff is not None for eff in result['coulombic_efficiencies']):
            ax2 = fig.add_subplot(2, 1, 2)
            ax2.plot(result['cycle_numbers'], result['coulombic_efficiencies'], 'g-o')
            ax2.set_xlabel('Cycle Number')
            ax2.set_ylabel('Coulombic Efficiency (%)')
            ax2.set_title('Coulombic Efficiency')
            ax2.set_ylim([min(80, min(result['coulombic_efficiencies']) - 5), 105])
            ax2.grid(True)
        
        plt.tight_layout()
        result['capacity_plot'] = fig_to_base64(fig)
    
    return result


def analyze_voltage_profiles(data):
    """
    Analyze voltage profiles across battery cycles.
    Returns voltage curve metrics and visualizations.
    """
    result = {
        'voltage_curves': [],
        'voltage_stats': {
            'min_voltage': None,
            'max_voltage': None,
            'avg_voltage': None
        },
        'voltage_profile_plot': None,
        'differential_voltage_plot': None
    }
    
    # Extract all voltages across all cycles
    all_voltages = []
    
    # Extract voltage profiles for selected cycles (first, middle, last)
    cycle_count = len(data['cycle_data'])
    
    if cycle_count > 0:
        cycles_to_analyze = [0]  # First cycle
        
        if cycle_count > 2:
            cycles_to_analyze.append(cycle_count // 2)  # Middle cycle
        
        if cycle_count > 1:
            cycles_to_analyze.append(cycle_count - 1)  # Last cycle
        
        # Collect voltage data
        for idx in cycles_to_analyze:
            cycle = data['cycle_data'][idx]
            cycle_num = cycle.get('cycle_number', idx + 1)
            
            # Extract voltages
            voltages = cycle.get('voltage_in_V', [])
            all_voltages.extend(voltages)
            
            # Process charge and discharge voltage curves
            if 'voltage_in_V' in cycle:
                cycle_data = {
                    'cycle_number': cycle_num,
                    'charge_data': None,
                    'discharge_data': None
                }
                
                # Charge data
                if 'charge_capacity_in_Ah' in cycle and len(cycle['charge_capacity_in_Ah']) == len(cycle['voltage_in_V']):
                    cycle_data['charge_data'] = {
                        'capacities': cycle['charge_capacity_in_Ah'],
                        'voltages': cycle['voltage_in_V']
                    }
                
                # Discharge data
                if 'discharge_capacity_in_Ah' in cycle and len(cycle['discharge_capacity_in_Ah']) == len(cycle['voltage_in_V']):
                    # Filter out zero discharge capacity points
                    non_zero_indices = [i for i, cap in enumerate(cycle['discharge_capacity_in_Ah']) if cap > 0]
                    if non_zero_indices:
                        cycle_data['discharge_data'] = {
                            'capacities': [cycle['discharge_capacity_in_Ah'][i] for i in non_zero_indices],
                            'voltages': [cycle['voltage_in_V'][i] for i in non_zero_indices]
                        }
                
                result['voltage_curves'].append(cycle_data)
    
    # Calculate voltage statistics
    if all_voltages:
        result['voltage_stats']['min_voltage'] = min(all_voltages)
        result['voltage_stats']['max_voltage'] = max(all_voltages)
        result['voltage_stats']['avg_voltage'] = sum(all_voltages) / len(all_voltages)
    
    # Generate voltage profile plot
    if result['voltage_curves']:
        fig = plt.figure(figsize=(10, 6))
        ax = fig.add_subplot(1, 1, 1)
        
        for cycle_data in result['voltage_curves']:
            cycle_num = cycle_data['cycle_number']
            
            # Plot charge curve
            if cycle_data['charge_data']:
                ax.plot(cycle_data['charge_data']['capacities'], 
                        cycle_data['charge_data']['voltages'],
                        label=f'Cycle {cycle_num} (Charge)')
            
            # Plot discharge curve
            if cycle_data['discharge_data']:
                ax.plot(cycle_data['discharge_data']['capacities'], 
                        cycle_data['discharge_data']['voltages'],
                        linestyle='--', 
                        label=f'Cycle {cycle_num} (Discharge)')
        
        ax.set_xlabel('Capacity (Ah)')
        ax.set_ylabel('Voltage (V)')
        ax.set_title('Voltage Profiles')
        ax.legend()
        ax.grid(True)
        
        plt.tight_layout()
        result['voltage_profile_plot'] = fig_to_base64(fig)
        
        # Generate differential voltage analysis plot (dV/dQ)
        try:
            fig2 = plt.figure(figsize=(10, 6))
            ax2 = fig2.add_subplot(1, 1, 1)
            
            for cycle_data in result['voltage_curves']:
                cycle_num = cycle_data['cycle_number']
                
                # Calculate differential voltage for discharge
                if cycle_data['discharge_data'] and len(cycle_data['discharge_data']['capacities']) > 2:
                    cap = np.array(cycle_data['discharge_data']['capacities'])
                    volt = np.array(cycle_data['discharge_data']['voltages'])
                    
                    # Calculate dV/dQ using gradient
                    dv = np.gradient(volt)
                    dq = np.gradient(cap)
                    dvdq = dv / dq
                    
                    # Filter out extreme values and smooth
                    dvdq = np.clip(dvdq, -10, 10)  # Limit to reasonable range
                    
                    # Plot
                    ax2.plot(cap, dvdq, label=f'Cycle {cycle_num}')
            
            ax2.set_xlabel('Capacity (Ah)')
            ax2.set_ylabel('dV/dQ (V/Ah)')
            ax2.set_title('Differential Voltage Analysis')
            ax2.legend()
            ax2.grid(True)
            
            plt.tight_layout()
            result['differential_voltage_plot'] = fig_to_base64(fig2)
        except Exception as e:
            logger.warning(f"Could not generate differential voltage plot: {str(e)}")
    
    return result


def analyze_temperature(data):
    """
    Analyze temperature effects on battery performance.
    If temperature data is available, correlate with performance metrics.
    """
    result = {
        'has_temperature_data': False,
        'average_temperature': None,
        'temperature_range': None,
        'temperature_vs_capacity_plot': None,
        'temperature_stats': {}
    }
    
    # Check if we have temperature data in any cycle
    temp_data_found = False
    all_temps = []
    cycle_temps = []  # Average temp for each cycle
    cycle_capacities = []  # Discharge capacity for each cycle
    cycle_numbers = []  # Cycle numbers
    
    for cycle in data['cycle_data']:
        cycle_num = cycle.get('cycle_number')
        
        # Check if cycle has temperature data
        if 'temperature_in_C' in cycle and cycle['temperature_in_C']:
            temp_data_found = True
            cycle_temps_array = np.array(cycle['temperature_in_C'])
            all_temps.extend(cycle_temps_array)
            
            # Get average temperature for this cycle
            avg_temp = np.mean(cycle_temps_array)
            
            # Get max discharge capacity for this cycle
            discharge_cap = max(cycle.get('discharge_capacity_in_Ah', [0])) if cycle.get('discharge_capacity_in_Ah') else None
            
            if cycle_num is not None and discharge_cap is not None:
                cycle_temps.append(avg_temp)
                cycle_capacities.append(discharge_cap)
                cycle_numbers.append(cycle_num)
    
    # If no direct temperature data, try to get from metadata
    test_temp = None
    if not temp_data_found:
        # Try to extract from cell_id if available
        if 'cell_id' in data:
            cell_id = data['cell_id']
            if cell_id.startswith('CALB_'):
                try:
                    test_temp = int(cell_id.split('_')[1])
                except:
                    pass
    
    # Update result based on what we found
    if temp_data_found:
        result['has_temperature_data'] = True
        result['average_temperature'] = np.mean(all_temps)
        result['temperature_range'] = {
            'min': np.min(all_temps),
            'max': np.max(all_temps)
        }
        result['temperature_stats'] = {
            'mean': np.mean(all_temps),
            'median': np.median(all_temps),
            'std_dev': np.std(all_temps),
            'p10': np.percentile(all_temps, 10),
            'p90': np.percentile(all_temps, 90)
        }
    elif test_temp is not None:
        result['has_temperature_data'] = False  # No direct measurements
        result['average_temperature'] = test_temp
        result['temperature_range'] = {
            'min': test_temp,
            'max': test_temp
        }
        result['temperature_stats'] = {
            'mean': test_temp,
            'median': test_temp,
            'std_dev': 0,
            'p10': test_temp,
            'p90': test_temp
        }
    
    # Generate temperature vs capacity plot if we have both data
    if temp_data_found and cycle_temps and cycle_capacities:
        fig = plt.figure(figsize=(10, 6))
        ax = fig.add_subplot(1, 1, 1)
        
        # Create scatter plot colored by cycle number
        scatter = ax.scatter(cycle_temps, cycle_capacities, c=cycle_numbers, cmap='viridis')
        
        # Add colorbar
        cbar = plt.colorbar(scatter)
        cbar.set_label('Cycle Number')
        
        ax.set_xlabel('Temperature (°C)')
        ax.set_ylabel('Discharge Capacity (Ah)')
        ax.set_title('Temperature vs. Discharge Capacity')
        ax.grid(True)
        
        plt.tight_layout()
        result['temperature_vs_capacity_plot'] = fig_to_base64(fig)
    
    return result


def calculate_statistical_metrics(data):
    """
    Calculate various statistical metrics from the battery data.
    """
    result = {
        'charge_discharge_stats': {},
        'current_stats': {},
        'voltage_stats': {},
        'cycle_life_projection': None
    }
    
    # Collect data across all cycles
    all_charge_caps = []
    all_discharge_caps = []
    all_currents = []
    all_voltages = []
    cycle_numbers = []
    discharge_capacities = []
    
    for cycle in data['cycle_data']:
        cycle_num = cycle.get('cycle_number')
        
        # Get charge and discharge capacities
        charge_cap = max(cycle.get('charge_capacity_in_Ah', [0])) if cycle.get('charge_capacity_in_Ah') else None
        discharge_cap = max(cycle.get('discharge_capacity_in_Ah', [0])) if cycle.get('discharge_capacity_in_Ah') else None
        
        # Collect data
        if charge_cap is not None:
            all_charge_caps.append(charge_cap)
        
        if discharge_cap is not None:
            all_discharge_caps.append(discharge_cap)
        
        # Collect current and voltage data
        if 'current_in_A' in cycle:
            all_currents.extend(cycle['current_in_A'])
        
        if 'voltage_in_V' in cycle:
            all_voltages.extend(cycle['voltage_in_V'])
        
        # Collect cycle numbers and discharge capacities for trend analysis
        if cycle_num is not None and discharge_cap is not None:
            cycle_numbers.append(cycle_num)
            discharge_capacities.append(discharge_cap)
    
    # Calculate statistics and convert to Python types
    if all_charge_caps:
        result['charge_discharge_stats']['charge_capacity'] = {
            'mean': float(np.mean(all_charge_caps)),
            'median': float(np.median(all_charge_caps)),
            'min': float(np.min(all_charge_caps)),
            'max': float(np.max(all_charge_caps)),
            'std_dev': float(np.std(all_charge_caps))
        }
    
    if all_discharge_caps:
        result['charge_discharge_stats']['discharge_capacity'] = {
            'mean': float(np.mean(all_discharge_caps)),
            'median': float(np.median(all_discharge_caps)),
            'min': float(np.min(all_discharge_caps)),
            'max': float(np.max(all_discharge_caps)),
            'std_dev': float(np.std(all_discharge_caps))
        }
    
    if all_currents:
        result['current_stats'] = {
            'mean': float(np.mean(all_currents)),
            'median': float(np.median(all_currents)),
            'min': float(np.min(all_currents)),
            'max': float(np.max(all_currents)),
            'std_dev': float(np.std(all_currents))
        }
    
    if all_voltages:
        result['voltage_stats'] = {
            'mean': float(np.mean(all_voltages)),
            'median': float(np.median(all_voltages)),
            'min': float(np.min(all_voltages)),
            'max': float(np.max(all_voltages)),
            'std_dev': float(np.std(all_voltages))
        }
    
    # Calculate cycle life projection if we have enough data
    if len(cycle_numbers) > 5 and len(discharge_capacities) > 5:
        try:
            # Simple linear extrapolation of capacity fade
            from scipy import stats
            
            # Convert to numpy arrays
            x = np.array(cycle_numbers)
            y = np.array(discharge_capacities)
            
            # Fit linear regression
            slope, intercept, r_value, p_value, std_err = stats.linregress(x, y)
            
            # Calculate end of life (80% of initial capacity)
            if slope < 0 and len(discharge_capacities) > 0:  # Only if capacity is decreasing
                initial_capacity = discharge_capacities[0]
                eol_capacity = 0.8 * initial_capacity  # 80% of initial capacity
                
                # Calculate cycle where capacity reaches EOL
                eol_cycle = (eol_capacity - intercept) / slope
                
                result['cycle_life_projection'] = {
                    'fade_rate': float(slope),
                    'r_squared': float(r_value**2),
                    'initial_capacity': float(initial_capacity),
                    'eol_capacity': float(eol_capacity),
                    'projected_eol_cycle': int(eol_cycle) if eol_cycle > 0 else None,
                    'confidence': float(r_value**2)  # Use R² as confidence measure
                }
        except Exception as e:
            logger.warning(f"Could not calculate cycle life projection: {str(e)}")
    
    return result


def assess_battery_health(data):
    """
    Assess overall battery health based on various metrics.
    """
    result = {
        'health_score': None,
        'health_status': None,
        'capacity_retention': None,
        'degradation_indicators': []
    }
    
    # Extract first and last discharge capacities
    first_discharge_cap = None
    last_discharge_cap = None
    
    if data['cycle_data']:
        # Get first cycle with discharge capacity
        for cycle in data['cycle_data']:
            if 'discharge_capacity_in_Ah' in cycle and cycle['discharge_capacity_in_Ah']:
                first_discharge_cap = max(cycle['discharge_capacity_in_Ah'])
                break
        
        # Get last cycle with discharge capacity
        for cycle in reversed(data['cycle_data']):
            if 'discharge_capacity_in_Ah' in cycle and cycle['discharge_capacity_in_Ah']:
                last_discharge_cap = max(cycle['discharge_capacity_in_Ah'])
                break
    
    # Calculate capacity retention
    if first_discharge_cap and last_discharge_cap and first_discharge_cap > 0:
        retention = (last_discharge_cap / first_discharge_cap) * 100
        result['capacity_retention'] = retention
        
        # Assign health score (0-100)
        health_score = min(100, max(0, retention))
        result['health_score'] = health_score
        
        # Determine health status
        if health_score >= 95:
            result['health_status'] = 'Excellent'
        elif health_score >= 90:
            result['health_status'] = 'Good'
        elif health_score >= 80:
            result['health_status'] = 'Fair'
        elif health_score >= 70:
            result['health_status'] = 'Poor'
        else:
            result['health_status'] = 'Critical'
        
        # Check for degradation indicators
        if retention < 95:
            result['degradation_indicators'].append('Capacity Fade')
    
    # Check for other health indicators
    coulombic_efficiencies = []
    for cycle in data['cycle_data']:
        # Get charge and discharge capacities
        charge_cap = max(cycle.get('charge_capacity_in_Ah', [0])) if cycle.get('charge_capacity_in_Ah') else None
        discharge_cap = max(cycle.get('discharge_capacity_in_Ah', [0])) if cycle.get('discharge_capacity_in_Ah') else None
        
        # Calculate coulombic efficiency
        if charge_cap and discharge_cap and charge_cap > 0:
            ce = (discharge_cap / charge_cap) * 100
            coulombic_efficiencies.append(ce)
    
    # Check coulombic efficiency
    if coulombic_efficiencies:
        avg_ce = np.mean(coulombic_efficiencies)
        if avg_ce < 98:
            result['degradation_indicators'].append('Low Coulombic Efficiency')
    
    # Check voltage indicators (simplified version)
    all_voltages = []
    for cycle in data['cycle_data']:
        if 'voltage_in_V' in cycle:
            all_voltages.extend(cycle['voltage_in_V'])
    
    if all_voltages:
        max_voltage = max(all_voltages)
        min_voltage = min(all_voltages)
        
        # Check for extreme voltage values
        if 'max_voltage_limit_in_V' in data and max_voltage > data['max_voltage_limit_in_V']:
            result['degradation_indicators'].append('Overvoltage Detected')
        
        if 'min_voltage_limit_in_V' in data and min_voltage < data['min_voltage_limit_in_V']:
            result['degradation_indicators'].append('Undervoltage Detected')
    
    return result


@app.route('/')
def home():
    """Root endpoint that provides basic API information."""
    return jsonify({
        "name": "Battery Analytics API",
        "version": "1.0",
        "endpoints": {
            "/api/upload": "Upload battery data files for analysis (POST)"
        },
        "status": "running"
    })

if __name__ == '__main__':
    import sys
    
    # Get port from command line or use default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5000
    
    print(f"Starting Battery Analytics API on localhost:{port}")
    print(f"Local access only: http://localhost:{port}")
    print(f"Health check: http://localhost:{port}/")
    print(f"Upload endpoint: http://localhost:{port}/api/upload")
    print(f"To upload a file, use: python battery_analytics_client.py --file mock_battery_data.pkl")
    print("Note: This server is only accessible from localhost for security.")
    
    # Start the Flask app - IMPORTANT: bind to localhost only (127.0.0.1)
    app.run(host='127.0.0.1', port=port, debug=False, threaded=True)