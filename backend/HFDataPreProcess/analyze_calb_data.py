import os
import pickle
import glob
import pandas as pd
import numpy as np
import argparse
import matplotlib.pyplot as plt

def load_pickle(file_path):
    """Load a pickle file and return its contents."""
    with open(file_path, 'rb') as f:
        return pickle.load(f)

def describe_object(obj, name="Object", max_items=5, level=0):
    """Recursively describe a Python object."""
    indent = "  " * level
    print(f"{indent}{name} (Type: {type(obj).__name__})")
    
    if isinstance(obj, dict):
        print(f"{indent}Dictionary with {len(obj)} keys:")
        for i, (key, value) in enumerate(obj.items()):
            if i >= max_items:
                print(f"{indent}  ... ({len(obj) - max_items} more keys)")
                break
            describe_object(value, f"['{key}']", max_items, level+1)
    
    elif isinstance(obj, pd.DataFrame):
        print(f"{indent}DataFrame with shape {obj.shape}")
        print(f"{indent}Columns: {obj.columns.tolist()}")
        if not obj.empty:
            print(f"{indent}Sample data:")
            pd_str = str(obj.head(3)).split('\n')
            for line in pd_str:
                print(f"{indent}  {line}")
            print(f"{indent}Data types:")
            for col, dtype in obj.dtypes.items():
                print(f"{indent}  {col}: {dtype}")
    
    elif isinstance(obj, np.ndarray):
        print(f"{indent}NumPy array with shape {obj.shape} and dtype {obj.dtype}")
        flat_sample = obj.flatten()[:5]
        if len(flat_sample) > 0:
            print(f"{indent}Sample values: {flat_sample} ...")
    
    elif isinstance(obj, list) or isinstance(obj, tuple):
        container_type = "List" if isinstance(obj, list) else "Tuple"
        print(f"{indent}{container_type} with {len(obj)} items")
        if obj:
            print(f"{indent}First item type: {type(obj[0]).__name__}")
            for i, item in enumerate(obj):
                if i >= max_items:
                    print(f"{indent}... ({len(obj) - max_items} more items)")
                    break
                describe_object(item, f"[{i}]", max_items, level+1)
    
    else:
        # For basic types, just print the value
        if isinstance(obj, str) and len(obj) > 100:
            print(f"{indent}String: '{obj[:100]}...' (length: {len(obj)})")
        else:
            print(f"{indent}Value: {obj}")

def plot_dataframe(df, file_name):
    """Plot common patterns for battery data."""
    if df.empty:
        print("DataFrame is empty, nothing to plot.")
        return
    
    # Try to find common battery data columns
    time_cols = [col for col in df.columns if 'time' in str(col).lower()]
    voltage_cols = [col for col in df.columns if 'voltage' in str(col).lower() or 'volt' in str(col).lower()]
    current_cols = [col for col in df.columns if 'current' in str(col).lower() or 'curr' in str(col).lower()]
    capacity_cols = [col for col in df.columns if 'capacity' in str(col).lower() or 'cap' in str(col).lower()]
    
    # If time column exists, use it for x-axis
    x_col = time_cols[0] if time_cols else None
    
    plt.figure(figsize=(14, 10))
    
    # Create subplots based on what data is available
    subplot_count = sum([bool(voltage_cols), bool(current_cols), bool(capacity_cols)])
    plot_idx = 1
    
    if voltage_cols:
        plt.subplot(subplot_count, 1, plot_idx)
        for col in voltage_cols[:3]:  # Limit to first 3 voltage columns
            if x_col:
                plt.plot(df[x_col], df[col], label=col)
            else:
                plt.plot(df[col], label=col)
        plt.title(f'Voltage data from {file_name}')
        plt.legend()
        plot_idx += 1
    
    if current_cols:
        plt.subplot(subplot_count, 1, plot_idx)
        for col in current_cols[:3]:  # Limit to first 3 current columns
            if x_col:
                plt.plot(df[x_col], df[col], label=col)
            else:
                plt.plot(df[col], label=col)
        plt.title('Current data')
        plt.legend()
        plot_idx += 1
    
    if capacity_cols:
        plt.subplot(subplot_count, 1, plot_idx)
        for col in capacity_cols[:3]:  # Limit to first 3 capacity columns
            if x_col:
                plt.plot(df[x_col], df[col], label=col)
            else:
                plt.plot(df[col], label=col)
        plt.title('Capacity data')
        plt.legend()
    
    plt.tight_layout()
    plt.savefig(f"{file_name}_plot.png")
    print(f"Plot saved as {file_name}_plot.png")
    plt.close()

def main():
    parser = argparse.ArgumentParser(description='Explore CALB pickle files')
    parser.add_argument('file', nargs='?', help='Specific pickle file to analyze (optional)')
    parser.add_argument('--list', action='store_true', help='List all available pickle files')
    parser.add_argument('--plot', action='store_true', help='Generate plots for the data')
    parser.add_argument('--detail', action='store_true', help='Show detailed information about the data')
    args = parser.parse_args()
    
    # Path to the directory containing pickle files
    data_dir = "CALB"
    
    # Get list of all pickle files
    pickle_files = glob.glob(os.path.join(data_dir, "*.pkl"))
    print(f"Found {len(pickle_files)} pickle files in {data_dir} directory.")
    
    if args.list:
        print("\nAvailable pickle files:")
        for i, file_path in enumerate(pickle_files):
            print(f"  {i+1}. {os.path.basename(file_path)}")
        return
    
    if args.file:
        # Analyze specific file
        file_path = os.path.join(data_dir, args.file) if not os.path.isabs(args.file) else args.file
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return
        
        print(f"\nAnalyzing: {os.path.basename(file_path)}")
        try:
            data = load_pickle(file_path)
            
            if args.detail:
                describe_object(data, name=os.path.basename(file_path))
            else:
                # Basic info
                print(f"Data type: {type(data).__name__}")
                if isinstance(data, dict):
                    print(f"Dictionary with {len(data)} keys: {', '.join(str(k) for k in data.keys())}")
                elif isinstance(data, pd.DataFrame):
                    print(f"DataFrame with shape {data.shape}")
                    print(f"Columns: {data.columns.tolist()}")
                    print("Sample data:")
                    print(data.head(3))
                elif isinstance(data, np.ndarray):
                    print(f"NumPy array with shape {data.shape}")
                    print(f"Sample values: {data.flatten()[:5]}")
                elif isinstance(data, list):
                    print(f"List with {len(data)} items")
                    if data:
                        print(f"First item type: {type(data[0]).__name__}")
            
            # If plotting is requested and data is a DataFrame
            if args.plot:
                if isinstance(data, pd.DataFrame):
                    plot_dataframe(data, os.path.basename(file_path).split('.')[0])
                elif isinstance(data, dict):
                    # Try to find DataFrames in dictionary
                    for key, value in data.items():
                        if isinstance(value, pd.DataFrame):
                            print(f"\nPlotting DataFrame from key: {key}")
                            plot_dataframe(value, f"{os.path.basename(file_path).split('.')[0]}_{key}")
                else:
                    print("Data is not in a format that can be plotted directly.")
        
        except Exception as e:
            print(f"Error analyzing {file_path}: {str(e)}")
    
    else:
        # No specific file, analyze a sample
        print("\nAnalyzing a sample of files:")
        for file_path in pickle_files[:3]:
            try:
                data = load_pickle(file_path)
                print(f"\nFile: {os.path.basename(file_path)}")
                print(f"Type: {type(data).__name__}")
                
                if isinstance(data, dict):
                    print(f"Keys: {', '.join(str(k) for k in data.keys())}")
                elif isinstance(data, pd.DataFrame):
                    print(f"DataFrame shape: {data.shape}")
                    print(f"Columns: {data.columns.tolist()[:10]}")
                    if len(data.columns) > 10:
                        print(f"  ... and {len(data.columns) - 10} more columns")
                elif isinstance(data, np.ndarray):
                    print(f"NumPy array shape: {data.shape}")
                
            except Exception as e:
                print(f"Error with {os.path.basename(file_path)}: {str(e)}")
        
        print("\n" + "="*50)
        print("Usage examples:")
        print("  List all files: python analyze_calb_data.py --list")
        print("  Analyze specific file: python analyze_calb_data.py CALB_0_B182.pkl")
        print("  Generate plots: python analyze_calb_data.py CALB_0_B182.pkl --plot")
        print("  Detailed analysis: python analyze_calb_data.py CALB_0_B182.pkl --detail")

if __name__ == "__main__":
    main()