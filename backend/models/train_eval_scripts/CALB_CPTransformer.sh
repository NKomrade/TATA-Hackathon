#!/bin/bash

# --------------------
# Hyperparameters
# --------------------
model_name=CPTransformer
dataset=CALB
train_epochs=100
early_cycle_threshold=100
learning_rate=0.0001
master_port=25215
num_process=1
batch_size=16
n_heads=4
seq_len=1
accumulation_steps=2
lstm_layers=6
e_layers=6
d_layers=2
d_model=128
d_ff=256
dropout=0.1
charge_discharge_length=300
patience=10
lradj=constant
loss=MSE
seed=2021

# --------------------
# Paths and configs
# --------------------
checkpoints=./checkpoints/CALB_CPTransformer
data=Dataset_original
root_path=./dataset
comment='CALB_CPTransformer'
task_name=classification

# --------------------
# Prepare directories
# --------------------
mkdir -p $checkpoints
mkdir -p ./logs

# --------------------
# Log file with timestamp
# --------------------
timestamp=$(date +"%Y%m%d_%H%M%S")
log_file=./logs/train_${model_name}_${dataset}_${timestamp}.txt

# --------------------
# Run training and log output
# --------------------
python run_main.py \
  --task_name $task_name \
  --data $data \
  --is_training 1 \
  --root_path $root_path \
  --model_id CPTransformer \
  --model $model_name \
  --features MS \
  --seq_len $seq_len \
  --label_len 50 \
  --factor 3 \
  --enc_in 3 \
  --seed $seed \
  --dec_in 1 \
  --c_out 1 \
  --des 'Exp' \
  --itr 1 \
  --d_model $d_model \
  --d_ff $d_ff \
  --batch_size $batch_size \
  --learning_rate $learning_rate \
  --train_epochs $train_epochs \
  --model_comment $comment \
  --accumulation_steps $accumulation_steps \
  --charge_discharge_length $charge_discharge_length \
  --dataset $dataset \
  --num_workers 0 \
  --e_layers $e_layers \
  --lstm_layers $lstm_layers \
  --d_layers $d_layers \
  --patience $patience \
  --n_heads $n_heads \
  --early_cycle_threshold $early_cycle_threshold \
  --dropout $dropout \
  --lradj $lradj \
  --loss $loss \
  --checkpoints $checkpoints \
  > $log_file 2>&1

echo "Training finished! Logs saved to $log_file"
