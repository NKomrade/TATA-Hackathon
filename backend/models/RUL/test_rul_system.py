#!/usr/bin/env python3
"""
Quick test script to verify the RUL prediction system
"""

import os
import sys

def test_rul_prediction():
    """Test the RUL prediction system"""
    
    print("TESTING RUL PREDICTION SYSTEM")
    print("=" * 40)
    
    # Check if model exists
    model_path = "./checkpoints/CALB_CPTransformer/CPTransformer_sl1_lr0.0001_dm128_nh4_el6_dl2_df256_lradjconstant_datasetCALB_lossMSE_wd0.0_wlFalse_bs16_s2021-CALB_CPTransformer"
    
    if not os.path.exists(model_path):
        print("ERROR: Default model not found!")
        print("Available checkpoints:")
        checkpoints_dir = "./checkpoints"
        if os.path.exists(checkpoints_dir):
            for item in os.listdir(checkpoints_dir):
                if os.path.isdir(os.path.join(checkpoints_dir, item)):
                    print(f"   {item}/")
                    subdir = os.path.join(checkpoints_dir, item)
                    for subitem in os.listdir(subdir):
                        if os.path.isdir(os.path.join(subdir, subitem)):
                            print(f"      {subitem}/")
        else:
            print("   ERROR: No checkpoints directory found")
        
        print("\nTo run RUL analysis:")
        print("1. Update the model path in run_rul_analysis.sh")
        print("2. Or run: python predict_rul_simple.py --model_path <your_model_path>")
        return False
    
    print("SUCCESS: Model found!")
    print(f"Model path: {model_path}")
    
    # Check required files
    required_files = ['args.json', 'label_scaler', 'life_class_scaler', 'model.safetensors']
    missing_files = []
    
    for file in required_files:
        if not os.path.exists(os.path.join(model_path, file)):
            missing_files.append(file)
    
    if missing_files:
        print(f"ERROR: Missing required files: {missing_files}")
        return False
    
    print("SUCCESS: All required model files found!")
    
    # Check dependencies
    try:
        import torch
        import numpy as np
        import pandas as pd
        import sklearn
        import transformers
        import accelerate
        import joblib
        print("SUCCESS: All dependencies available!")
    except ImportError as e:
        print(f"ERROR: Missing dependency: {e}")
        return False
    
    print("\nRUL prediction system ready!")
    print("\nTo run analysis:")
    print("   bash run_rul_analysis.sh")
    print("\nOr customize with:")
    print("   python predict_rul_simple.py --model_path <path> --dataset CALB --model_type CPTransformer")
    
    return True

if __name__ == "__main__":
    test_rul_prediction()