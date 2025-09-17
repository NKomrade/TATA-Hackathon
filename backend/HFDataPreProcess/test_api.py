#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import requests
import json

def test_api_root():
    """Test the API's root endpoint."""
    try:
        response = requests.get('http://localhost:5000')
        print(f"Status code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def upload_file(file_path):
    """Upload a file to the API."""
    print(f"Uploading {file_path}...")
    
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} does not exist.")
        return None
    
    try:
        # Create file object
        files = {'file': open(file_path, 'rb')}
        
        # Send POST request
        print("Sending request to http://localhost:5000/api/upload...")
        response = requests.post('http://localhost:5000/api/upload', files=files)
        
        # Check response
        print(f"Status code: {response.status_code}")
        
        if response.status_code == 200:
            print("Upload successful!")
            result = response.json()
            
            # Print a summary of the response
            print("\nAPI Response Summary:")
            print(f"  Battery Cell ID: {result.get('metadata', {}).get('cell_id', 'N/A')}")
            print(f"  Total Cycles: {result.get('metadata', {}).get('total_cycles', 'N/A')}")
            print(f"  Test Temperature: {result.get('metadata', {}).get('test_temperature_C', 'N/A')}°C")
            print(f"  Health Score: {result.get('battery_health', {}).get('health_score', 'N/A')}")
            print(f"  Health Status: {result.get('battery_health', {}).get('health_status', 'N/A')}")
            
            # Check if plots are included
            plots = []
            if 'capacity_plot' in result.get('capacity_fade', {}):
                plots.append('Capacity Fade Plot')
            if 'voltage_profile_plot' in result.get('voltage_profile', {}):
                plots.append('Voltage Profile Plot')
            if 'differential_voltage_plot' in result.get('voltage_profile', {}):
                plots.append('Differential Voltage Plot')
            if 'temperature_vs_capacity_plot' in result.get('temperature_analysis', {}):
                plots.append('Temperature vs Capacity Plot')
            
            print(f"\n  Included Plots: {', '.join(plots)}")
            
            # Save response to file
            output_file = f"{os.path.splitext(file_path)[0]}_api_response.json"
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\nFull response saved to: {output_file}")
            
            return result
        else:
            print(f"Error: {response.text}")
            return None
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    
    finally:
        # Close file if it was opened
        try:
            files['file'].close()
        except:
            pass

if __name__ == "__main__":
    print("Battery Analytics API Test")
    print("=========================\n")
    
    # Test API root endpoint
    print("Testing API root endpoint...")
    if not test_api_root():
        print("Could not connect to API server. Is it running?")
        sys.exit(1)
    
    print("\n")
    
    # Upload a file
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "mock_battery_data.pkl"
    
    upload_file(file_path)