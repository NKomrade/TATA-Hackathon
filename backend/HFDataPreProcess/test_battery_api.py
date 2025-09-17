#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import io
import pickle
import tempfile
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import json
import traceback
import logging
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

"""
Test script for the Battery Analytics API

This script creates a mock battery data file and processes it using the API directly.
It's useful for testing the API functionality without making HTTP requests.

Usage:
    python test_battery_api.py
"""

# Import the API functions
from battery_analytics_api import (
    load_pickle_data,
    load_csv_data,
    validate_battery_data,
    process_battery_data,
    extract_metadata,
    analyze_capacity_fade,
    analyze_voltage_profiles,
    analyze_temperature,
    calculate_statistical_metrics,
    assess_battery_health,
    fig_to_base64
)

def create_mock_battery_data():
    """Create a mock battery data structure for testing."""
    
    # Create mock data
    data = {
        'cell_id': 'TEST_25_B001',
        'form_factor': 'Prismatic',
        'anode_material': 'graphite',
        'cathode_material': 'NMC',
        'electrolyte_material': 'standard',
        'nominal_capacity_in_Ah': 50.0,
        'depth_of_charge': 1.0,
        'depth_of_discharge': 1.0,
        'already_spent_cycles': 0,
        'max_voltage_limit_in_V': 4.2,
        'min_voltage_limit_in_V': 2.8,
        'cycle_data': []
    }
    
    # Generate cycle data
    num_cycles = 100
    points_per_cycle = 200
    
    for cycle_num in range(1, num_cycles + 1):
        # Create decreasing capacity to simulate degradation
        max_capacity = 50.0 * (1.0 - 0.001 * cycle_num)  # 0.1% fade per cycle
        
        # Generate time points
        times = np.linspace(0, 3600, points_per_cycle)
        
        # Generate current profile (constant current, then tapering)
        current = np.ones(points_per_cycle) * 50.0
        current[int(points_per_cycle * 0.8):] = np.linspace(50.0, 0, int(points_per_cycle * 0.2))
        
        # Generate voltage profile (increasing during charge)
        voltage = np.linspace(3.0, 4.2, points_per_cycle)
        
        # Generate capacity profiles
        charge_capacity = np.linspace(0, max_capacity, points_per_cycle)
        discharge_capacity = np.linspace(max_capacity, 0, points_per_cycle)
        
        # Generate temperature data
        temperature = np.ones(points_per_cycle) * 25.0 + np.random.normal(0, 0.5, points_per_cycle)
        
        # Create cycle dictionary
        cycle = {
            'cycle_number': cycle_num,
            'current_in_A': current.tolist(),
            'voltage_in_V': voltage.tolist(),
            'charge_capacity_in_Ah': charge_capacity.tolist(),
            'discharge_capacity_in_Ah': discharge_capacity.tolist(),
            'time_in_s': times.tolist(),
            'temperature_in_C': temperature.tolist()
        }
        
        data['cycle_data'].append(cycle)
    
    return data

def save_mock_data_to_pickle(data, filename="mock_battery_data.pkl"):
    """Save mock battery data to a pickle file."""
    with open(filename, 'wb') as f:
        pickle.dump(data, f)
    print(f"Mock data saved to {filename}")
    return filename

def save_mock_data_to_csv(data, base_filename="mock_battery_data"):
    """Save mock battery data to CSV files."""
    # Create directory if it doesn't exist
    os.makedirs("test_data", exist_ok=True)
    
    # Export metadata
    metadata = {k: v for k, v in data.items() if k != 'cycle_data'}
    metadata_df = pd.DataFrame([metadata])
    metadata_path = f"test_data/{base_filename}_metadata.csv"
    metadata_df.to_csv(metadata_path, index=False)
    
    # Export cycle data
    cycle_dfs = []
    for cycle in data['cycle_data']:
        cycle_df = pd.DataFrame({
            'cycle_number': [cycle['cycle_number']] * len(cycle['time_in_s']),
            'current_in_A': cycle['current_in_A'],
            'voltage_in_V': cycle['voltage_in_V'],
            'charge_capacity_in_Ah': cycle['charge_capacity_in_Ah'],
            'discharge_capacity_in_Ah': cycle['discharge_capacity_in_Ah'],
            'time_in_s': cycle['time_in_s'],
            'temperature_in_C': cycle['temperature_in_C']
        })
        cycle_dfs.append(cycle_df)
    
    all_cycles = pd.concat(cycle_dfs, ignore_index=True)
    cycles_path = f"test_data/{base_filename}_cycles.csv"
    all_cycles.to_csv(cycles_path, index=False)
    
    # Extract cycle metrics
    cycle_metrics = []
    for cycle in data['cycle_data']:
        cycle_num = cycle['cycle_number']
        max_voltage = max(cycle['voltage_in_V'])
        max_current = max(cycle['current_in_A'])
        charge_cap = max(cycle['charge_capacity_in_Ah'])
        discharge_cap = max(cycle['discharge_capacity_in_Ah'])
        coulombic_efficiency = (discharge_cap / charge_cap) * 100
        
        cycle_metrics.append({
            'cycle_number': cycle_num,
            'max_voltage_V': max_voltage,
            'max_current_A': max_current,
            'charge_capacity_Ah': charge_cap,
            'discharge_capacity_Ah': discharge_cap,
            'coulombic_efficiency_%': coulombic_efficiency
        })
    
    metrics_df = pd.DataFrame(cycle_metrics)
    metrics_path = f"test_data/{base_filename}_metrics.csv"
    metrics_df.to_csv(metrics_path, index=False)
    
    print(f"Mock data exported to CSV files in test_data directory")
    return [cycles_path, metadata_path, metrics_path]

def test_pickle_processing():
    """Test processing a pickle file."""
    # Create and save mock data
    mock_data = create_mock_battery_data()
    pickle_path = save_mock_data_to_pickle(mock_data)
    
    # Load and process the data
    loaded_data = load_pickle_data(pickle_path)
    validate_battery_data(loaded_data)
    results = process_battery_data(loaded_data)
    
    # Save results to JSON
    with open("test_results_pickle.json", "w") as f:
        # Convert numpy types to Python types
        json_str = json.dumps(results, default=lambda o: float(o) if isinstance(o, np.number) else str(o), indent=2)
        f.write(json_str)
    
    print("Pickle processing test completed. Results saved to test_results_pickle.json")
    return results

def test_csv_processing():
    """Test processing CSV files."""
    # Create and save mock data
    mock_data = create_mock_battery_data()
    csv_paths = save_mock_data_to_csv(mock_data)
    
    # Load and process the data
    loaded_data = load_csv_data(csv_paths)
    validate_battery_data(loaded_data)
    results = process_battery_data(loaded_data)
    
    # Save results to JSON
    with open("test_results_csv.json", "w") as f:
        # Convert numpy types to Python types
        json_str = json.dumps(results, default=lambda o: float(o) if isinstance(o, np.number) else str(o), indent=2)
        f.write(json_str)
    
    print("CSV processing test completed. Results saved to test_results_csv.json")
    return results

def main():
    """Run all tests."""
    print("Starting Battery Analytics API tests...")
    
    # Test pickle processing
    pickle_results = test_pickle_processing()
    
    # Test CSV processing
    csv_results = test_csv_processing()
    
    print("All tests completed successfully!")

if __name__ == "__main__":
    main()