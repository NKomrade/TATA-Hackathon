# Model training tutorial

This tutorial will guide you through the steps to train the models on the CALB dataset. We provide scripts to facilitate the training process. Please follow the instructions below to train the models and evaluate their performance.

First, you should run the following script:

```shell
sh ./train_eval_scripts/CPTransformer.sh # set "seed" as 2021 in the script. set "dataset" as CALB.
```

```shell
sh ./train_eval_scripts/CPTransformer.sh # set seed as 42 in the script. Train the model using the best hyperparameters. set "dataset" as CALB42.
```

```shell
sh ./train_eval_scripts/CPTransformer.sh # set seed as 2024 in the script. Train the model using the best hyperparameters. set "dataset" as CALB2024.
```

You can tune the hyperparameters like `d_ff` and `d_model` until you obtain a satisfactory set of hyperparameters that perform the best on the validation sets.

You will see the model performance at the end of model training. After that you can report the mean±standard deviation of MAPE and 15%-Acc.

