#!/bin/bash

# RUL Prediction Analysis Script
# This script runs the battery RUL prediction analysis

echo "Battery RUL Prediction Analysis"
echo "=============================="

# Default model path (you can change this to your trained model)
MODEL_PATH="../checkpoints/CALB_CPTransformer/CPTransformer_sl1_lr0.0001_dm128_nh4_el6_dl2_df256_lradjconstant_datasetCALB_lossMSE_wd0.0_wlFalse_bs16_s2021-CALB_CPTransformer"

# Check if model path exists
if [ ! -d "$MODEL_PATH" ]; then
    echo "Model path not found: $MODEL_PATH"
    echo "Please update the MODEL_PATH in this script or provide a valid model path"
    exit 1
fi

echo "Using model: $MODEL_PATH"
echo "Starting RUL prediction analysis..."
echo ""

# Run the RUL prediction analysis
python predict_rul_simple.py \
    --model_path "$MODEL_PATH" \
    --dataset "CALB" \
    --model_type "CPTransformer" \
    --eval_cycle_min 1 \
    --eval_cycle_max 100

echo ""
echo "Analysis complete!"
echo ""
echo "Generated files:"
echo "   - rul_predictions_calb_detailed.csv     (Detailed predictions for each battery)"
echo "   - rul_analysis_summary_calb.json        (Summary statistics)"
echo ""
echo "To analyze a different model, update the MODEL_PATH variable in this script"
echo "To change evaluation parameters, modify the command line arguments above"