
## Quick start

### Install

```
pip install -r requirements.txt
```


### Train the model [[tutorial](./assets/Model_training.md)]

Before you start training, please move all **processed datasets** folders and **Life labels** folder into `./dataset` folder under the root folder.

After that, just feel free to run any benchmark method. For example:

```sh
sh ./train_eval_scripts/CPTransformer.sh
```

### Evaluate the model

If you want to evaluate a model in detail. We have provided the evaluation script. You can use it as follows:

```sh
sh ./train_eval_scripts/evaluate.sh
```
