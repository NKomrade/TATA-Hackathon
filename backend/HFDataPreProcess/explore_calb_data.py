import os
import pickle
import glob
import pandas as pd
import numpy as np

# Path to the directory containing pickle files
data_dir = "CALB"

# Get list of all pickle files
pickle_files = glob.glob(os.path.join(data_dir, "*.pkl"))
print(f"Found {len(pickle_files)} pickle files in {data_dir} directory.")

# Function to safely examine pickle file content
def examine_pickle_file(file_path):
    try:
        with open(file_path, 'rb') as f:
            data = pickle.load(f)
            
        print(f"\nFile: {os.path.basename(file_path)}")
        print(f"Type: {type(data)}")
        
        # For different data types, show appropriate information
        if isinstance(data, dict):
            print(f"Dictionary with {len(data)} keys: {', '.join(str(k) for k in data.keys())}")
            # Show a sample of the first key-value pair
            if data:
                first_key = next(iter(data))
                print(f"Sample value for key '{first_key}':")
                first_value = data[first_key]
                if isinstance(first_value, (pd.DataFrame, np.ndarray)):
                    print(f"  Type: {type(first_value)}")
                    if isinstance(first_value, pd.DataFrame):
                        print(f"  Shape: {first_value.shape}")
                        print(f"  Columns: {first_value.columns.tolist()}")
                        print("  Sample data:")
                        print(first_value.head(3))
                    elif isinstance(first_value, np.ndarray):
                        print(f"  Shape: {first_value.shape}")
                        print(f"  Sample: {first_value.flatten()[:5]} ...")
                else:
                    print(f"  {first_value}")
                
        elif isinstance(data, pd.DataFrame):
            print(f"DataFrame with shape {data.shape}")
            print(f"Columns: {data.columns.tolist()}")
            print("Sample data:")
            print(data.head(3))
            
        elif isinstance(data, np.ndarray):
            print(f"NumPy array with shape {data.shape} and dtype {data.dtype}")
            print(f"Sample: {data.flatten()[:5]} ...")
            
        elif isinstance(data, list):
            print(f"List with {len(data)} items")
            if data:
                print(f"First item type: {type(data[0])}")
                print(f"Sample: {data[:3]}")
                
        else:
            print(f"Content: {data}")
            
        return True
    except Exception as e:
        print(f"Error examining {file_path}: {str(e)}")
        return False

# Examine a sample of files (up to 3)
sample_files = pickle_files[:3]
for file_path in sample_files:
    examine_pickle_file(file_path)

# Ask user if they want to see more details
print("\n" + "="*50)
print("Would you like to examine a specific file in more detail?")
print("To do so, run this script again and add the filename as argument.")
print("Example: python explore_calb_data.py CALB_0_B182.pkl")

# Check if specific file is requested through command line
import sys
if len(sys.argv) > 1:
    requested_file = sys.argv[1]
    full_path = os.path.join(data_dir, requested_file)
    if os.path.exists(full_path):
        print(f"\nExamining requested file: {requested_file}")
        examine_pickle_file(full_path)
    else:
        print(f"File not found: {requested_file}")
        print("Available files:")
        for i, f in enumerate(pickle_files):
            print(f"  {i+1}. {os.path.basename(f)}")