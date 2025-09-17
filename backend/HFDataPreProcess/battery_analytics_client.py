#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import requests
import json
import argparse
import time
from tqdm import tqdm

def upload_file(file_path, url='http://localhost:5000/api/upload'):
    """Upload a file to the battery analytics API."""
    print(f"Uploading {file_path}...")
    
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} does not exist.")
        return None
    
    # Check file type
    if not file_path.endswith(('.pkl', '.csv')):
        print(f"Error: File {file_path} is not a .pkl or .csv file.")
        return None
    
    # Create file object
    files = {'file': open(file_path, 'rb')}
    
    try:
        # Send POST request to API
        print(f"Sending request to {url}...")
        response = requests.post(url, files=files)
        
        # Check response status
        if response.status_code == 200:
            print(f"Upload successful!")
            return response.json()
        else:
            print(f"Error: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return None
    
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to connect to API: {str(e)}")
        return None
    
    finally:
        # Close file
        files['file'].close()


def upload_multiple_files(file_paths, url='http://localhost:5000/api/upload'):
    """Upload multiple files to the battery analytics API."""
    print(f"Uploading {len(file_paths)} files...")
    
    # Verify all files exist
    for file_path in file_paths:
        if not os.path.exists(file_path):
            print(f"Error: File {file_path} does not exist.")
            return None
    
    # Create file objects
    files = [('file', open(path, 'rb')) for path in file_paths]
    
    try:
        # Send POST request to API
        response = requests.post(url, files=files)
        
        # Check response status
        if response.status_code == 200:
            print(f"Upload successful!")
            return response.json()
        else:
            print(f"Error: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return None
    
    except requests.exceptions.RequestException as e:
        print(f"Error: Failed to connect to API: {str(e)}")
        return None
    
    finally:
        # Close all files
        for _, file_obj in files:
            file_obj.close()


def save_results(results, output_path=None):
    """Save API results to a JSON file."""
    if output_path is None:
        # Generate default output path
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        output_path = f"battery_analytics_{timestamp}.json"
    
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Results saved to {output_path}")
    return output_path


def main():
    parser = argparse.ArgumentParser(description='Battery Analytics API Client')
    parser.add_argument('--file', help='Path to a .pkl or .csv file to analyze')
    parser.add_argument('--files', nargs='+', help='Paths to multiple files to analyze together')
    parser.add_argument('--url', default='http://localhost:5000/api/upload', help='API endpoint URL')
    parser.add_argument('--output', help='Output JSON file path')
    parser.add_argument('--show-plots', action='store_true', help='Display plots (requires matplotlib)')
    
    args = parser.parse_args()
    
    if args.file:
        # Single file upload
        results = upload_file(args.file, args.url)
        if results:
            output_path = save_results(results, args.output)
            
            # Show plots if requested
            if args.show_plots:
                try:
                    import matplotlib.pyplot as plt
                    import base64
                    import io
                    
                    # Display capacity fade plot
                    if 'capacity_fade' in results and 'capacity_plot' in results['capacity_fade']:
                        plot_data = base64.b64decode(results['capacity_fade']['capacity_plot'])
                        img = plt.imread(io.BytesIO(plot_data))
                        plt.figure(figsize=(10, 8))
                        plt.imshow(img)
                        plt.axis('off')
                        plt.title('Capacity Fade')
                        plt.show()
                    
                    # Display voltage profile plot
                    if 'voltage_profile' in results and 'voltage_profile_plot' in results['voltage_profile']:
                        plot_data = base64.b64decode(results['voltage_profile']['voltage_profile_plot'])
                        img = plt.imread(io.BytesIO(plot_data))
                        plt.figure(figsize=(10, 6))
                        plt.imshow(img)
                        plt.axis('off')
                        plt.title('Voltage Profiles')
                        plt.show()
                
                except Exception as e:
                    print(f"Error displaying plots: {str(e)}")
    
    elif args.files:
        # Multiple files upload
        results = upload_multiple_files(args.files, args.url)
        if results:
            output_path = save_results(results, args.output)
    
    else:
        parser.print_help()


if __name__ == '__main__':
    main()