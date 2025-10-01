import subprocess
import os
import re
import shutil
import zipfile
import numpy as np
import pandas as pd

from tqdm import tqdm
from numba import njit
from typing import List
from pathlib import Path
from scipy.signal import medfilt

from batteryml import BatteryData, CycleData
from batteryml.builders import PREPROCESSORS
from batteryml.preprocess.base import BasePreprocessor

preprocess_commands = [
    'batteryml preprocess CALB ./datasets/raw/CALB ./datasets/processed/CALB/'
]

for command in preprocess_commands:
    subprocess.run(command, shell=True)
