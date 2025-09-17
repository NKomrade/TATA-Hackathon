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

def export_to_csv(data, file_name, output_dir="exported_data"):
    """Export battery data to CSV format."""
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    base_name = os.path.basename(file_name).split('.')[0]
    
    # If data is a dictionary with cycle_data
    if isinstance(data, dict) and 'cycle_data' in data:
        # Export metadata
        metadata = {k: v for k, v in data.items() if k != 'cycle_data'}
        metadata_df = pd.DataFrame([metadata])
        metadata_df.to_csv(f"{output_dir}/{base_name}_metadata.csv", index=False)
        print(f"Exported metadata to {output_dir}/{base_name}_metadata.csv")
        
        # Export each cycle as a separate CSV or as a single file
        cycle_dfs = []
        for cycle_idx, cycle in enumerate(data['cycle_data']):
            cycle_df = pd.DataFrame({
                'cycle_number': cycle.get('cycle_number', cycle_idx),
                'current_in_A': cycle.get('current_in_A', []),
                'voltage_in_V': cycle.get('voltage_in_V', []),
                'charge_capacity_in_Ah': cycle.get('charge_capacity_in_Ah', []),
                'discharge_capacity_in_Ah': cycle.get('discharge_capacity_in_Ah', []),
                'time_in_s': cycle.get('time_in_s', [])
            })
            cycle_dfs.append(cycle_df)
        
        # Combine all cycles into one dataframe
        all_cycles = pd.concat(cycle_dfs, ignore_index=True)
        all_cycles.to_csv(f"{output_dir}/{base_name}_cycles.csv", index=False)
        print(f"Exported cycle data to {output_dir}/{base_name}_cycles.csv")
        
        # Extract key metrics for each cycle
        cycle_metrics = []
        for cycle in data['cycle_data']:
            cycle_num = cycle.get('cycle_number', None)
            
            # Get max voltage and current
            max_voltage = max(cycle.get('voltage_in_V', [0])) if cycle.get('voltage_in_V') else None
            max_current = max(cycle.get('current_in_A', [0])) if cycle.get('current_in_A') else None
            
            # Get charge and discharge capacities
            charge_cap = max(cycle.get('charge_capacity_in_Ah', [0])) if cycle.get('charge_capacity_in_Ah') else None
            discharge_cap = max(cycle.get('discharge_capacity_in_Ah', [0])) if cycle.get('discharge_capacity_in_Ah') else None
            
            # Calculate coulombic efficiency if both charge and discharge capacity are available
            coulombic_efficiency = None
            if charge_cap and discharge_cap and charge_cap > 0:
                coulombic_efficiency = (discharge_cap / charge_cap) * 100
            
            cycle_metrics.append({
                'cycle_number': cycle_num,
                'max_voltage_V': max_voltage,
                'max_current_A': max_current,
                'charge_capacity_Ah': charge_cap,
                'discharge_capacity_Ah': discharge_cap,
                'coulombic_efficiency_%': coulombic_efficiency
            })
        
        # Save cycle metrics to CSV
        metrics_df = pd.DataFrame(cycle_metrics)
        metrics_df.to_csv(f"{output_dir}/{base_name}_metrics.csv", index=False)
        print(f"Exported cycle metrics to {output_dir}/{base_name}_metrics.csv")
        
        return True
    
    elif isinstance(data, pd.DataFrame):
        # Export DataFrame directly
        data.to_csv(f"{output_dir}/{base_name}.csv", index=False)
        print(f"Exported DataFrame to {output_dir}/{base_name}.csv")
        return True
    
    else:
        print(f"Cannot export data of type {type(data)} to CSV")
        return False

def plot_battery_metrics(file_path, output_dir="plots"):
    """Generate detailed battery performance plots from pickle data."""
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    base_name = os.path.basename(file_path).split('.')[0]
    data = load_pickle(file_path)
    
    if not isinstance(data, dict) or 'cycle_data' not in data:
        print("Data format not suitable for battery metrics plotting")
        return False
    
    # Extract key metrics for each cycle
    cycle_numbers = []
    charge_capacities = []
    discharge_capacities = []
    coulombic_efficiencies = []
    
    for cycle in data['cycle_data']:
        cycle_num = cycle.get('cycle_number', None)
        if cycle_num is None:
            continue
        
        cycle_numbers.append(cycle_num)
        
        # Get charge and discharge capacities
        charge_cap = max(cycle.get('charge_capacity_in_Ah', [0])) if cycle.get('charge_capacity_in_Ah') else 0
        discharge_cap = max(cycle.get('discharge_capacity_in_Ah', [0])) if cycle.get('discharge_capacity_in_Ah') else 0
        
        charge_capacities.append(charge_cap)
        discharge_capacities.append(discharge_cap)
        
        # Calculate coulombic efficiency
        if charge_cap > 0:
            coulombic_efficiency = (discharge_cap / charge_cap) * 100
        else:
            coulombic_efficiency = 0
        coulombic_efficiencies.append(coulombic_efficiency)
    
    # Create capacity fade plot
    plt.figure(figsize=(12, 8))
    
    plt.subplot(2, 1, 1)
    plt.plot(cycle_numbers, charge_capacities, 'b-o', label='Charge Capacity')
    plt.plot(cycle_numbers, discharge_capacities, 'r-o', label='Discharge Capacity')
    plt.xlabel('Cycle Number')
    plt.ylabel('Capacity (Ah)')
    plt.title(f'Capacity Fade for {base_name}')
    plt.legend()
    plt.grid(True)
    
    plt.subplot(2, 1, 2)
    plt.plot(cycle_numbers, coulombic_efficiencies, 'g-o')
    plt.xlabel('Cycle Number')
    plt.ylabel('Coulombic Efficiency (%)')
    plt.title('Coulombic Efficiency')
    plt.ylim([0, 105])  # Efficiency typically between 0-100%
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig(f"{output_dir}/{base_name}_capacity_fade.png")
    print(f"Saved capacity fade plot to {output_dir}/{base_name}_capacity_fade.png")
    
    # Plot voltage curves for selected cycles
    plt.figure(figsize=(12, 8))
    
    # Choose a few cycles to plot (first, middle, last)
    if len(data['cycle_data']) > 0:
        cycles_to_plot = [0, len(data['cycle_data'])//2, -1]  # First, middle, last
        
        for idx in cycles_to_plot:
            if idx < 0:
                idx = len(data['cycle_data']) + idx  # Convert negative index
            
            cycle = data['cycle_data'][idx]
            cycle_num = cycle.get('cycle_number', idx)
            
            # Check if we have voltage and capacity data
            if 'voltage_in_V' in cycle and 'charge_capacity_in_Ah' in cycle:
                plt.plot(cycle['charge_capacity_in_Ah'], cycle['voltage_in_V'], 
                        label=f'Cycle {cycle_num} (Charge)')
            
            # If we have discharge data, plot it too
            if 'voltage_in_V' in cycle and 'discharge_capacity_in_Ah' in cycle:
                # Filter out zero discharge capacity points
                non_zero_indices = [i for i, cap in enumerate(cycle['discharge_capacity_in_Ah']) if cap > 0]
                if non_zero_indices:
                    discharge_capacities = [cycle['discharge_capacity_in_Ah'][i] for i in non_zero_indices]
                    discharge_voltages = [cycle['voltage_in_V'][i] for i in non_zero_indices]
                    plt.plot(discharge_capacities, discharge_voltages, 
                            linestyle='--', label=f'Cycle {cycle_num} (Discharge)')
    
    plt.xlabel('Capacity (Ah)')
    plt.ylabel('Voltage (V)')
    plt.title(f'Voltage Curves for {base_name}')
    plt.legend()
    plt.grid(True)
    plt.savefig(f"{output_dir}/{base_name}_voltage_curves.png")
    print(f"Saved voltage curves plot to {output_dir}/{base_name}_voltage_curves.png")
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Convert CALB pickle files to CSV and generate analysis')
    parser.add_argument('--file', help='Specific pickle file to convert/analyze')
    parser.add_argument('--all', action='store_true', help='Process all pickle files')
    parser.add_argument('--export', action='store_true', help='Export data to CSV format')
    parser.add_argument('--plot', action='store_true', help='Generate battery metrics plots')
    parser.add_argument('--output-dir', default='battery_data_export', help='Output directory for exports')
    args = parser.parse_args()
    
    # Path to the directory containing pickle files
    data_dir = "CALB"
    
    # Get list of all pickle files
    pickle_files = glob.glob(os.path.join(data_dir, "*.pkl"))
    print(f"Found {len(pickle_files)} pickle files in {data_dir} directory.")
    
    # Create output directory
    if not os.path.exists(args.output_dir):
        os.makedirs(args.output_dir)
    
    if args.file:
        # Process specific file
        file_path = os.path.join(data_dir, args.file) if not os.path.isabs(args.file) else args.file
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return
        
        print(f"\nProcessing: {os.path.basename(file_path)}")
        try:
            data = load_pickle(file_path)
            
            if args.export:
                export_to_csv(data, file_path, output_dir=os.path.join(args.output_dir, 'csv'))
            
            if args.plot:
                plot_battery_metrics(file_path, output_dir=os.path.join(args.output_dir, 'plots'))
                
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
    
    elif args.all:
        # Process all files
        for file_path in pickle_files:
            print(f"\nProcessing: {os.path.basename(file_path)}")
            try:
                data = load_pickle(file_path)
                
                if args.export:
                    export_to_csv(data, file_path, output_dir=os.path.join(args.output_dir, 'csv'))
                
                if args.plot:
                    plot_battery_metrics(file_path, output_dir=os.path.join(args.output_dir, 'plots'))
                    
            except Exception as e:
                print(f"Error processing {file_path}: {str(e)}")
    
    else:
        # No file specified, show help
        print("\nNo files specified for processing. Use --file or --all options.")
        print("Examples:")
        print("  Export a single file to CSV: python convert_calb_data.py --file CALB_35_B249.pkl --export")
        print("  Generate plots for all files: python convert_calb_data.py --all --plot")
        print("  Export all files to CSV and generate plots: python convert_calb_data.py --all --export --plot")

if __name__ == "__main__":
    main()