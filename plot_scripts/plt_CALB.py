import os
import pickle
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm

# Path to your dataset folder
dataset_path = "./dataset"  # Change this if your dataset is elsewhere

sns.set_style("whitegrid")
sns.set_context("talk")

def set_ax_linewidth(ax, width=1.5):
    """Set axis line width for better visibility."""
    for spine in ax.spines.values():
        spine.set_linewidth(width)

def draw_CALB_sequence(fig):
    # Automatically find a CALB file to plot
    calb_folder = os.path.join(dataset_path, "CALB")
    calb_files = [f for f in os.listdir(calb_folder) if f.endswith(".pkl")]

    if not calb_files:
        raise FileNotFoundError("No CALB dataset files found!")
    
    # Pick the first CALB file for plotting
    calb_file = os.path.join(calb_folder, calb_files[0])
    print(f"Loading dataset: {calb_file}")

    # Load dataset
    with open(calb_file, "rb") as f:
        MATR_data = pickle.load(f)

    length = len(MATR_data["cycle_data"])
    total_current = []
    total_voltage = []
    total_time = []

    plus_time = 0

    for i in tqdm(range(length)):
        if i < 1:
            continue

        cycle_data = MATR_data["cycle_data"][i]

        # Extract current, voltage, and time values
        current = cycle_data["current_in_A"]
        indices = [i for i, x in enumerate(current) if x == 0]
        current = [i for i in current if i not in indices]

        voltage = cycle_data["voltage_in_V"]
        voltage = [i for i in voltage if i not in indices]

        times = cycle_data["time_in_s"]
        times = [i for i in times if i not in indices]

        new_times = []
        for time in times:
            if isinstance(time, str):
                # If time is stored as a string like "2021-05-12 13:24:52"
                time = time.split(" ")[1]
                h = float(time.split(":")[0])
                m = float(time.split(":")[1])
                s = float(time.split(":")[2])
                seconds = h * 3600 + m * 60 + s
            else:
                # If time is already a float (seconds)
                seconds = float(time)
            new_times.append(seconds)

        # Continuous time axis adjustment
        time = [t + plus_time for t in new_times]
        plus_time = max(time)

        total_time += time
        total_current += current
        total_voltage += voltage

        # Limit to first 3 cycles for faster visualization
        if i == 3:
            break

    # -------------------------------
    # Voltage vs Time
    # -------------------------------
    ax1 = plt.subplot(4, 1, 1)
    color = sns.color_palette()[0]
    ax1.plot(total_time, total_voltage, '-', color=color)
    ax1.set_xlabel("Time (s)", fontsize=15)
    ax1.set_ylabel("Voltage (V)", color=color, fontsize=15)
    ax1.tick_params("y", colors=color)
    ax1.set_ylim(1.0, 4.5)
    set_ax_linewidth(ax1)

    # -------------------------------
    # Current vs Time (twin axis)
    # -------------------------------
    ax2 = ax1.twinx()
    color = sns.color_palette()[3]
    ax2.plot(total_time, total_current, '-', color=color)
    ax2.set_ylabel("Current (A)", color=color, fontsize=15)
    ax2.tick_params("y", colors=color)
    ax2.set_ylim(-80, 120)
    set_ax_linewidth(ax2)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    fig = plt.figure(figsize=(12, 8))
    draw_CALB_sequence(fig)
