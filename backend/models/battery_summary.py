#!/usr/bin/env python3
"""
battery_summary.py

CLI utility to load a single battery .pkl (as used by the project) and
report SOH per-cycle, estimated EOL (end of life, cycle where SOH <= 0.8),
and remaining useful life (RUL) relative to the last recorded cycle.

This follows the same logic as `Extract_life_labels.ipynb`:
- If last cycle SOH >= 0.825: excluded from dataset (no EOL)
- If last cycle SOH in (0.8, 0.825): estimate EOL with linear regression
  on the last 20 cycles' SOH -> predict cycle where SOH == 0.8
- Else: find first cycle with SOH <= 0.8

The script prints a human-readable summary and can save a JSON report.
"""
import argparse
import os
import pickle
import json
from typing import Optional, Dict, Any, List, Tuple

import numpy as np
from sklearn.linear_model import LinearRegression


def compute_soh_list(data: Dict[str, Any], file_name: Optional[str] = None) -> Tuple[List[float], float]:
    """Compute SOH list per cycle and return (soh_list, nominal_capacity)

    The function mirrors the logic in the notebook: use `nominal_capacity_in_Ah`
    when available. For some datasets we fallback to dataset-specific values
    based on file name.
    """
    cycle_data = data.get('cycle_data')
    if cycle_data is None:
        raise ValueError('Input .pkl missing key "cycle_data"')

    # Determine nominal capacity
    nominal_capacity = None
    if file_name:
        if file_name.startswith('RWTH'):
            nominal_capacity = 1.85
        elif file_name.startswith('SNL_18650_NCA_25C_20-80'):
            nominal_capacity = 3.2

    if nominal_capacity is None:
        nominal_capacity = data.get('nominal_capacity_in_Ah')
    if nominal_capacity is None:
        raise ValueError('Could not determine nominal capacity. Provide .pkl with "nominal_capacity_in_Ah" or use a known file prefix')

    SOC_interval = data.get('SOC_interval')
    # If SOC_interval is missing or malformed, assume full scale (1.0)
    if SOC_interval is None:
        SOC_interval_value = 1.0
    else:
        try:
            SOC_interval_value = float(SOC_interval[1] - SOC_interval[0])
        except Exception:
            SOC_interval_value = 1.0

    soh_list = []
    for cyc in cycle_data:
        Qd = max(cyc.get('discharge_capacity_in_Ah', [0]))
        soh = Qd / nominal_capacity / SOC_interval_value
        soh_list.append(float(soh))

    return soh_list, float(nominal_capacity)


def estimate_eol_from_soh_list(soh_list: List[float]) -> Dict[str, Any]:
    """Estimate EOL and related metrics using notebook logic.

    Returns dict with keys: eol (int or None), method (str), eol_pred_float (if regression),
    last_soh (float), last_cycle_index (int)
    """
    last_cycle_soh = soh_list[-1]
    last_cycle_idx = len(soh_list)

    if last_cycle_soh >= 0.825:
        return {
            'eol': None,
            'method': 'excluded_last_soh>=0.825',
            'last_soh': last_cycle_soh,
            'last_cycle': last_cycle_idx
        }

    if last_cycle_soh > 0.8:
        # Use linear regression over last up-to-20 cycles
        regress_cycle_num = min(20, len(soh_list))
        ys = np.array(soh_list[-regress_cycle_num:]).reshape(-1, 1)
        xs = np.array([i + 1 for i in range(len(soh_list) - regress_cycle_num, len(soh_list))])
        model = LinearRegression()
        model.fit(ys, xs)
        # Predict cycle when SOH reaches 0.8
        eol_pred = model.predict(np.array([0.80]).reshape(-1, 1))[0]
        try:
            eol_int = int(np.floor(eol_pred))
        except Exception:
            eol_int = int(eol_pred)
        return {
            'eol': eol_int,
            'method': 'regression_last_cycles',
            'eol_pred_float': float(eol_pred),
            'last_soh': last_cycle_soh,
            'last_cycle': last_cycle_idx
        }

    # Else find first cycle where soh <= 0.8
    eol = None
    for idx, soh in enumerate(soh_list):
        if soh <= 0.8:
            eol = idx + 1
            break

    return {
        'eol': eol,
        'method': 'first_soh_leq_0.8',
        'last_soh': last_cycle_soh,
        'last_cycle': last_cycle_idx
    }


def summarize_from_pkl(pkl_path: str, save_json: Optional[str] = None) -> Dict[str, Any]:
    if not os.path.exists(pkl_path):
        raise FileNotFoundError(pkl_path)

    file_name = os.path.basename(pkl_path)
    with open(pkl_path, 'rb') as f:
        data = pickle.load(f)

    soh_list, nominal_capacity = compute_soh_list(data, file_name)
    eol_info = estimate_eol_from_soh_list(soh_list)

    last_cycle = eol_info.get('last_cycle')
    eol = eol_info.get('eol')
    rul = None
    if eol is not None:
        rul = int(eol - last_cycle)

    report = {
        'file': file_name,
        'nominal_capacity_in_Ah': nominal_capacity,
        'num_cycles_recorded': len(soh_list),
        'last_soh': float(eol_info.get('last_soh')),
        'eol': eol,
        'eol_method': eol_info.get('method'),
        'eol_pred_float': eol_info.get('eol_pred_float') if 'eol_pred_float' in eol_info else None,
        'rul_cycles_from_last_record': rul,
        'soh_list': soh_list
    }

    # If save_json is not provided, default to './out/<pkl_basename>.json'
    if save_json is None:
        # Default output folder is inside the tools directory next to this script
        tools_dir = os.path.dirname(os.path.abspath(__file__))
        out_dir = os.path.join(tools_dir, 'out')
        os.makedirs(out_dir, exist_ok=True)
        save_json = os.path.join(out_dir, os.path.splitext(file_name)[0] + '.json')

    # Ensure directory exists for provided save_json
    save_dir = os.path.dirname(save_json)
    if save_dir:
        os.makedirs(save_dir, exist_ok=True)

    if save_json:
        with open(save_json, 'w') as f:
            json.dump(report, f, indent=2)

    return report


def human_print_report(report: Dict[str, Any]):
    print('\nBATTERY SUMMARY')
    print('=' * 50)
    print(f"File: {report['file']}")
    print(f"Nominal capacity (Ah): {report['nominal_capacity_in_Ah']}")
    print(f"Recorded cycles: {report['num_cycles_recorded']}")
    print(f"Last recorded SOH: {report['last_soh']:.4f}")
    print(f"EOL (cycle where SOH <= 0.8): {report['eol']}")
    print(f"EOL estimation method: {report['eol_method']}")
    if report.get('eol_pred_float') is not None:
        print(f"EOL (regression float prediction): {report['eol_pred_float']:.2f}")
    print(f"RUL (cycles from last record): {report['rul_cycles_from_last_record']}")
    print('\nSOH (last 10 cycles shown):')
    for i, soh in enumerate(report['soh_list'][-10:], start=max(1, report['num_cycles_recorded'] - 9)):
        print(f"  Cycle {i:3d}: SOH={soh:.4f}")
    print('=' * 50)


def main():
    parser = argparse.ArgumentParser(description='Compute SOH/EOL/RUL from a battery .pkl file')
    parser.add_argument('pkl', type=str, help='Path to the .pkl file for a single battery')
    parser.add_argument('--save-json', type=str, default=None, help='Optional path to save JSON report')
    args = parser.parse_args()

    try:
        report = summarize_from_pkl(args.pkl, save_json=args.save_json)
        human_print_report(report)
        if args.save_json:
            print(f"\nReport saved to: {args.save_json}")
    except Exception as e:
        print(f"ERROR: {e}")


if __name__ == '__main__':
    main()
