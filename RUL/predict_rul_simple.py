#!/usr/bin/env python3
"""
Battery RUL (Remaining Useful Life) Prediction Analysis Script
Direct prediction analysis that shows actual RUL predictions vs ground truth
"""

import sys
import os
# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import torch
import numpy as np
import pandas as pd
import json
import joblib
from transformers import AutoTokenizer
from models import CPTransformer, CPBiLSTM, CPBiGRU, CPLSTM, CPMLP
from data_provider.data_factory import data_provider_evaluate
from accelerate import Accelerator, DeepSpeedPlugin, load_checkpoint_in_model
from accelerate import DistributedDataParallelKwargs
from tqdm import tqdm
import argparse
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import warnings
warnings.filterwarnings('ignore')

def analyze_predictions_in_detail(predictions, ground_truth, dataset_ids, seen_unseen_ids, cycles_seen, 
                                dataset_name="CALB", save_outputs=True):
    """Analyze predictions in detail and create comprehensive reports"""
    
    # Create DataFrame
    df = pd.DataFrame({
        'Battery_ID': dataset_ids,
        'True_RUL': ground_truth,
        'Predicted_RUL': predictions,
        'Cycles_Seen': cycles_seen,
        'Seen_Unseen': seen_unseen_ids,
        'Absolute_Error': np.abs(np.array(predictions) - np.array(ground_truth)),
        'Relative_Error': np.abs(np.array(predictions) - np.array(ground_truth)) / np.array(ground_truth) * 100
    })
    
    # Calculate metrics
    mae = mean_absolute_error(ground_truth, predictions)
    rmse = np.sqrt(mean_squared_error(ground_truth, predictions))
    mape = mean_absolute_percentage_error(ground_truth, predictions) * 100
    
    # Alpha accuracy (within 15% and 10%)
    alpha_15_acc = (df['Relative_Error'] <= 15).mean() * 100
    alpha_10_acc = (df['Relative_Error'] <= 10).mean() * 100
    
    # Seen vs Unseen analysis
    seen_data = df[df['Seen_Unseen'] == 1]
    unseen_data = df[df['Seen_Unseen'] == 0]
    
    print("BATTERY RUL PREDICTION ANALYSIS RESULTS")
    print("=" * 60)
    print(f"Dataset: {dataset_name}")
    print(f"Total Samples: {len(df)}")
    print(f"Seen Conditions: {len(seen_data)} samples")
    print(f"Unseen Conditions: {len(unseen_data)} samples")
    print()
    
    print("OVERALL PERFORMANCE METRICS")
    print("-" * 30)
    print(f"MAE (Mean Absolute Error):     {mae:.2f} cycles")
    print(f"RMSE (Root Mean Square Error): {rmse:.2f} cycles")
    print(f"MAPE (Mean Absolute Percentage Error): {mape:.2f}%")
    print(f"15%-Accuracy: {alpha_15_acc:.1f}%")
    print(f"10%-Accuracy: {alpha_10_acc:.1f}%")
    print()
    
    if len(seen_data) > 0:
        seen_mae = mean_absolute_error(seen_data['True_RUL'], seen_data['Predicted_RUL'])
        seen_mape = mean_absolute_percentage_error(seen_data['True_RUL'], seen_data['Predicted_RUL']) * 100
        seen_15_acc = (seen_data['Relative_Error'] <= 15).mean() * 100
        seen_10_acc = (seen_data['Relative_Error'] <= 10).mean() * 100
        
        print("SEEN CONDITIONS PERFORMANCE")
        print("-" * 30)
        print(f"MAE: {seen_mae:.2f} cycles")
        print(f"MAPE: {seen_mape:.2f}%")
        print(f"15%-Accuracy: {seen_15_acc:.1f}%")
        print(f"10%-Accuracy: {seen_10_acc:.1f}%")
        print()
    
    if len(unseen_data) > 0:
        unseen_mae = mean_absolute_error(unseen_data['True_RUL'], unseen_data['Predicted_RUL'])
        unseen_mape = mean_absolute_percentage_error(unseen_data['True_RUL'], unseen_data['Predicted_RUL']) * 100
        unseen_15_acc = (unseen_data['Relative_Error'] <= 15).mean() * 100
        unseen_10_acc = (unseen_data['Relative_Error'] <= 10).mean() * 100
        
        print("UNSEEN CONDITIONS PERFORMANCE")
        print("-" * 30)
        print(f"MAE: {unseen_mae:.2f} cycles")
        print(f"MAPE: {unseen_mape:.2f}%")
        print(f"15%-Accuracy: {unseen_15_acc:.1f}%")
        print(f"10%-Accuracy: {unseen_10_acc:.1f}%")
        print()
    
    # Cycle-wise analysis summary
    print("CYCLE-WISE PERFORMANCE SUMMARY")
    print("-" * 30)
    cycle_groups = df.groupby('Cycles_Seen').agg({
        'Relative_Error': ['mean', 'count'],
        'Absolute_Error': 'mean'
    }).round(2)
    
    print("Most frequent cycle observations (Top 5):")
    top_cycles = df['Cycles_Seen'].value_counts().head(5)
    for cycles, count in top_cycles.items():
        cycle_data = df[df['Cycles_Seen'] == cycles]
        avg_error = cycle_data['Relative_Error'].mean()
        print(f"  {int(cycles):3d} cycles: {count:3d} samples, Avg Error: {avg_error:.2f}%")
    print()
    
    # Best and worst predictions
    print("BEST PREDICTIONS (Top 5 by accuracy)")
    print("-" * 40)
    best_predictions = df.nsmallest(5, 'Relative_Error')
    for idx, row in best_predictions.iterrows():
        print(f"Battery {int(row['Battery_ID']):3d}, Cycles: {int(row['Cycles_Seen']):3d}, "
              f"True: {row['True_RUL']:6.1f}, Pred: {row['Predicted_RUL']:6.1f}, "
              f"Error: {row['Relative_Error']:.2f}%")
    print()
    
    print("WORST PREDICTIONS (Top 5 by error)")
    print("-" * 40)
    worst_predictions = df.nlargest(5, 'Relative_Error')
    for idx, row in worst_predictions.iterrows():
        print(f"Battery {int(row['Battery_ID']):3d}, Cycles: {int(row['Cycles_Seen']):3d}, "
              f"True: {row['True_RUL']:6.1f}, Pred: {row['Predicted_RUL']:6.1f}, "
              f"Error: {row['Relative_Error']:.2f}%")
    print()
    
    if save_outputs:
        # Save detailed results
        output_file = f"./rul_predictions_{dataset_name.lower()}_detailed.csv"
        df.to_csv(output_file, index=False)
        print(f"Detailed predictions saved to: {output_file}")
        
        # Save summary statistics
        summary_stats = {
            'dataset': dataset_name,
            'total_samples': len(df),
            'seen_samples': len(seen_data),
            'unseen_samples': len(unseen_data),
            'overall_mae': float(mae),
            'overall_rmse': float(rmse),
            'overall_mape': float(mape),
            'overall_15_acc': float(alpha_15_acc),
            'overall_10_acc': float(alpha_10_acc)
        }
        
        if len(seen_data) > 0:
            summary_stats.update({
                'seen_mae': float(seen_mae),
                'seen_mape': float(seen_mape),
                'seen_15_acc': float(seen_15_acc),
                'seen_10_acc': float(seen_10_acc)
            })
        
        if len(unseen_data) > 0:
            summary_stats.update({
                'unseen_mae': float(unseen_mae),
                'unseen_mape': float(unseen_mape),
                'unseen_15_acc': float(unseen_15_acc),
                'unseen_10_acc': float(unseen_10_acc)
            })
        
        with open(f"./rul_analysis_summary_{dataset_name.lower()}.json", 'w') as f:
            json.dump(summary_stats, f, indent=2)
        print(f"Summary statistics saved to: ./rul_analysis_summary_{dataset_name.lower()}.json")
    
    return df

def load_model_and_predict(model_path, dataset='CALB', model_type='CPTransformer', eval_cycle_min=1, eval_cycle_max=100):
    """Load model and make RUL predictions on test data"""
    
    print(f"LOADING MODEL AND MAKING RUL PREDICTIONS")
    print("=" * 60)
    print(f"Model path: {model_path}")
    print(f"Dataset: {dataset}")
    print(f"Model type: {model_type}")
    print(f"Evaluation cycles: {eval_cycle_min}-{eval_cycle_max}")
    print()
    
    # Change to parent directory to access data files
    original_dir = os.getcwd()
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(parent_dir)
    
    # Adjust model path if it starts with ../
    if model_path.startswith('../'):
        model_path = model_path[3:]  # Remove '../' prefix
    
    try:
        # Load model arguments
        args_file = os.path.join(model_path, 'args.json')
        if not os.path.exists(args_file):
            print(f"ERROR: args.json not found at {args_file}")
            return None
            
        with open(args_file, 'r') as f:
            args_dict = json.load(f)
        
        # Create a simple namespace object
        class Args:
            def __init__(self, **kwargs):
                self.__dict__.update(kwargs)
        
        args = Args(**args_dict)
        args.eval_dataset = dataset
        args.dataset = dataset
        args.model = model_type
        args.batch_size = 16
        args.num_workers = 0
        args.data = 'Dataset_original'
        
        # Setup accelerator
        ddp_kwargs = DistributedDataParallelKwargs(find_unused_parameters=True)
        deepspeed_plugin = DeepSpeedPlugin(hf_ds_config='./ds_config_zero2_baseline.json')
        accelerator = Accelerator(kwargs_handlers=[ddp_kwargs], deepspeed_plugin=deepspeed_plugin)
        
        # Load model
        print(f"Loading {model_type} model...")
        if model_type == 'CPTransformer':
            model = CPTransformer.Model(args).float()
        elif model_type == 'CPBiLSTM':
            model = CPBiLSTM.Model(args).float()
        elif model_type == 'CPLSTM':
            model = CPLSTM.Model(args).float()
        elif model_type == 'CPMLP':
            model = CPMLP.Model(args).float()
        elif model_type == 'CPBiGRU':
            model = CPBiGRU.Model(args).float()
        else:
            print(f"ERROR: Unsupported model type: {model_type}")
            return None
        
        # Load tokenizer (required by data provider but not actually used)
        tokenizer = AutoTokenizer.from_pretrained(
            'deepset/sentence_bert',
            trust_remote_code=True
        )
        if tokenizer.eos_token:
            tokenizer.pad_token = tokenizer.eos_token
        else:
            tokenizer.add_special_tokens({'pad_token': '[PAD]'})
        
        # Load scalers
        label_scaler = joblib.load(os.path.join(model_path, 'label_scaler'))
        life_class_scaler = joblib.load(os.path.join(model_path, 'life_class_scaler'))
        
        std = np.sqrt(label_scaler.var_[-1])
        mean_value = label_scaler.mean_[-1]
        
        # Load test data
        print(f"Loading test data...")
        test_data, test_loader = data_provider_evaluate(
            args, 'test', tokenizer,
            label_scaler=label_scaler,
            eval_cycle_min=eval_cycle_min,
            eval_cycle_max=eval_cycle_max,
            life_class_scaler=life_class_scaler
        )
        
        # Load model weights
        load_checkpoint_in_model(model, model_path)
        
        # Prepare model
        model_optim = torch.optim.Adam(model.parameters(), lr=0.0001)
        test_loader, model, model_optim = accelerator.prepare(test_loader, model, model_optim)
        
        print(f"Model loaded! Test set size: {len(test_data)}")
        print()
        
        # Make predictions
        print("Making RUL predictions...")
        total_preds = []
        total_references = []
        total_dataset_ids = []
        total_seen_unseen_ids = []
        total_seen_cycles = []
        
        model.eval()
        with torch.no_grad():
            for i, batch_data in tqdm(enumerate(test_loader), total=len(test_loader)):
                cycle_curve_data, curve_attn_mask, labels, life_class, scaled_life_class, weights, dataset_ids, seen_unseen_ids = batch_data
                
                cycle_curve_data = cycle_curve_data.float().to(accelerator.device)
                curve_attn_mask = curve_attn_mask.float().to(accelerator.device)
                labels = labels.float().to(accelerator.device)
                seen_number_of_cycles = torch.sum(curve_attn_mask, dim=1)
                
                # Get RUL predictions
                outputs = model(cycle_curve_data, curve_attn_mask)
                
                # Transform back to original scale (actual RUL values)
                transformed_preds = outputs * std + mean_value
                transformed_labels = labels * std + mean_value
                
                # Gather results
                gathered = accelerator.gather_for_metrics((
                    transformed_preds, transformed_labels, dataset_ids, 
                    seen_unseen_ids, seen_number_of_cycles
                ))
                
                total_preds.extend(gathered[0].detach().cpu().numpy().reshape(-1).tolist())
                total_references.extend(gathered[1].detach().cpu().numpy().reshape(-1).tolist())
                total_dataset_ids.extend(gathered[2].detach().cpu().numpy().reshape(-1).tolist())
                total_seen_unseen_ids.extend(gathered[3].detach().cpu().numpy().reshape(-1).tolist())
                total_seen_cycles.extend(gathered[4].detach().cpu().numpy().reshape(-1).tolist())
        
        print("RUL predictions complete!")
        print()
        
        # Change back to RUL directory for output files
        os.chdir(original_dir)
        
        # Analyze predictions
        results_df = analyze_predictions_in_detail(
            total_preds, total_references, total_dataset_ids,
            total_seen_unseen_ids, total_seen_cycles,
            dataset_name=dataset, save_outputs=True
        )
        
        return results_df
        
    finally:
        # Always change back to original directory
        os.chdir(original_dir)

def main():
    parser = argparse.ArgumentParser(description='Battery RUL Prediction Analysis')
    parser.add_argument('--model_path', type=str, 
                       default="../checkpoints/CALB_CPTransformer/CPTransformer_sl1_lr0.0001_dm128_nh4_el6_dl2_df256_lradjconstant_datasetCALB_lossMSE_wd0.0_wlFalse_bs16_s2021-CALB_CPTransformer",
                       help='Path to the trained model checkpoint')
    parser.add_argument('--dataset', type=str, default='CALB', help='Dataset name')
    parser.add_argument('--model_type', type=str, default='CPTransformer', 
                       choices=['CPTransformer', 'CPBiLSTM', 'CPBiGRU', 'CPLSTM', 'CPMLP'],
                       help='Model architecture type')
    parser.add_argument('--eval_cycle_min', type=int, default=1, help='Minimum evaluation cycle')
    parser.add_argument('--eval_cycle_max', type=int, default=100, help='Maximum evaluation cycle')
    
    args = parser.parse_args()
    
    print("BATTERY RUL PREDICTION ANALYSIS")
    print("=" * 60)
    
    results = load_model_and_predict(
        model_path=args.model_path,
        dataset=args.dataset,
        model_type=args.model_type,
        eval_cycle_min=args.eval_cycle_min,
        eval_cycle_max=args.eval_cycle_max
    )
    
    if results is not None:
        print("\nANALYSIS COMPLETE!")
        print("Files generated:")
        print(f"   - rul_predictions_{args.dataset.lower()}_detailed.csv")
        print(f"   - rul_analysis_summary_{args.dataset.lower()}.json")
        print("\nYou can now see the actual RUL predicted values vs ground truth!")
        print("\nMetric explanations:")
        print("   - MAE: Average error in RUL prediction (cycles)")
        print("   - MAPE: Average percentage error in RUL prediction")
        print("   - 15%-Accuracy: Percentage of predictions within 15% of true RUL")
        print("   - Seen/Unseen: Performance on batteries with seen vs unseen aging conditions")
    else:
        print("ERROR: Analysis failed. Check the model path and try again.")

if __name__ == "__main__":
    main()