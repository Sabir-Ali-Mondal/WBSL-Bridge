PS D:\Download\Projects\WBSL Bridge> (Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (& "d:\Download\Projects\WBSL Bridge\.venv\Scripts\Activate.ps1")
(.venv) PS D:\Download\Projects\WBSL Bridge> py model_training_zone\train_all_glosses.py                                                                             
======================================================================
           EXTRACTING ALL GLOSSES (61 CLASSES) + 3D SIM NPY           
======================================================================
INFO: Created TensorFlow Lite XNNPACK delegate for CPU.
WARNING: All log messages before absl::InitializeLog() is called are written to STDERR
W0000 00:00:1792087267.756961    8492 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
W0000 00:00:1792087267.777950   15708 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
W0000 00:00:1792087267.780254   18364 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
W0000 00:00:1792087267.780355   14852 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
W0000 00:00:1792087267.781453     648 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
W0000 00:00:1792087267.791388     648 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
W0000 00:00:1792087267.812224   19892 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
W0000 00:00:1792087267.814140   15708 inference_feedback_manager.cc:114] Feedback manager requires a model with a single signature inference. Disabling support for feedback tensors.
D:\Download\Projects\WBSL Bridge\.venv\Lib\site-packages\google\protobuf\symbol_database.py:55: UserWarning: SymbolDatabase.GetPrototype() is deprecated. Please use message_factory.GetMessageClass() instead. SymbolDatabase.GetPrototype() will be removed soon.
  warnings.warn('SymbolDatabase.GetPrototype() is deprecated. Please '
  DONE BEAR: 60/60 (3D .npy sidecars exported)
  DONE BREAK: 60/60 (3D .npy sidecars exported)
  DONE BRINJAL: 60/60 (3D .npy sidecars exported)
  DONE BUDGET: 60/60 (3D .npy sidecars exported)
  DONE BUSY: 57/60 (3D .npy sidecars exported)
  DONE CABBAGE: 60/60 (3D .npy sidecars exported)
  DONE CARROT: 60/60 (3D .npy sidecars exported)
  DONE CAULIFLOWER: 60/60 (3D .npy sidecars exported)
  DONE CHILLI: 60/60 (3D .npy sidecars exported)
  DONE CLEAN: 60/60 (3D .npy sidecars exported)
  DONE CLOSE: 60/60 (3D .npy sidecars exported)
  DONE COME: 60/60 (3D .npy sidecars exported)
  DONE COOK: 60/60 (3D .npy sidecars exported)
  DONE CROCODILE: 60/60 (3D .npy sidecars exported)
  DONE CRY: 60/60 (3D .npy sidecars exported)
  DONE CUCUMBER: 60/60 (3D .npy sidecars exported)
  DONE DEER: 60/60 (3D .npy sidecars exported)
  DONE DRINK: 60/60 (3D .npy sidecars exported)
  DONE ELEPHANT: 60/60 (3D .npy sidecars exported)
  DONE EXAM: 60/60 (3D .npy sidecars exported)
  DONE FEDUP: 60/60 (3D .npy sidecars exported)
  DONE FEVER: 60/60 (3D .npy sidecars exported)
  DONE GIRAFFE: 60/60 (3D .npy sidecars exported)
  DONE GIVE: 60/60 (3D .npy sidecars exported)
  DONE GOOD_MORNING: 60/60 (3D .npy sidecars exported)
  DONE GOOD_AFTERNOON: 60/60 (3D .npy sidecars exported)
  DONE HELLO: 60/60 (3D .npy sidecars exported)
  DONE HUG: 60/60 (3D .npy sidecars exported)
  DONE INJURY: 60/60 (3D .npy sidecars exported)
  DONE INTERVIEW: 60/60 (3D .npy sidecars exported)
  DONE JUMP: 60/60 (3D .npy sidecars exported)
  DONE KARNATAKA: 60/60 (3D .npy sidecars exported)
  DONE KEY: 60/60 (3D .npy sidecars exported)
  DONE KNIFE: 60/60 (3D .npy sidecars exported)
  DONE LEMON: 60/60 (3D .npy sidecars exported)
  DONE LION: 60/60 (3D .npy sidecars exported)
  DONE MAN: 60/60 (3D .npy sidecars exported)
  DONE MATHS: 60/60 (3D .npy sidecars exported)
  DONE MAYBE: 60/60 (3D .npy sidecars exported)
  DONE MONKEY: 60/60 (3D .npy sidecars exported)
  DONE ONION: 60/60 (3D .npy sidecars exported)
  DONE PEACOCK: 60/60 (3D .npy sidecars exported)
  DONE PIGEON: 60/60 (3D .npy sidecars exported)
  DONE POUR: 60/60 (3D .npy sidecars exported)
  DONE RADISH: 60/60 (3D .npy sidecars exported)
  DONE SPARROW: 60/60 (3D .npy sidecars exported)
  DONE STILL: 28/30 (3D .npy sidecars exported)
  DONE SWITCH: 60/60 (3D .npy sidecars exported)
  DONE TEA: 60/60 (3D .npy sidecars exported)
  DONE TEMPLE: 60/60 (3D .npy sidecars exported)
  DONE THANK_YOU: 60/60 (3D .npy sidecars exported)
  DONE TIGER: 60/60 (3D .npy sidecars exported)
  DONE TURTLE: 60/60 (3D .npy sidecars exported)
  DONE UMBRELLA: 60/60 (3D .npy sidecars exported)
  DONE UNCLE: 60/60 (3D .npy sidecars exported)
  DONE VEGETABLES: 60/60 (3D .npy sidecars exported)
  DONE VOLCANO: 60/60 (3D .npy sidecars exported)
  DONE WHAT_IS_YOUR_NAME: 60/60 (3D .npy sidecars exported)
  DONE WIFE: 60/60 (3D .npy sidecars exported)
  DONE WRITER: 60/60 (3D .npy sidecars exported)
  DONE WRONG: 60/60 (3D .npy sidecars exported)
  extraction finished in 8820.2s
======================================================================
                TRAINING ALL-GLOSSES LSTM (62 CLASSES)                
======================================================================
  CLASSES : 62 | DEVICE: CPU
  Epoch  1/15 | val  58.3% | best  -1.0% |  26.7s
  Epoch  2/15 | val  92.6% | best  58.3% |  51.4s
  Epoch  3/15 | val  93.6% | best  92.6% |  76.9s
  Epoch  4/15 | val  99.2% | best  93.6% | 101.9s
  Epoch  5/15 | val  98.9% | best  99.2% | 127.1s
  Epoch  6/15 | val  99.6% | best  99.2% | 151.9s
  Epoch  7/15 | val  99.6% | best  99.6% | 176.4s
  Epoch  8/15 | val  99.6% | best  99.6% | 201.5s
  Epoch  9/15 | val  99.9% | best  99.6% | 226.0s
  Epoch 10/15 | val  99.9% | best  99.9% | 250.9s
  Epoch 11/15 | val  99.9% | best  99.9% | 276.0s
  Epoch 12/15 | val 100.0% | best  99.9% | 301.2s
  Epoch 13/15 | val 100.0% | best 100.0% | 327.1s
  Epoch 14/15 | val 100.0% | best 100.0% | 352.2s
  Epoch 15/15 | val 100.0% | best 100.0% | 377.4s
D:\Download\Projects\WBSL Bridge\model_training_zone\train_all_glosses.py:335: UserWarning: # 'dynamic_axes' is not recommended when dynamo=True, and may lead to 'torch._dynamo.exc.UserError: Constraints violated.' Supply the 'dynamic_shapes' argument instead if export is unsuccessful.
  torch.onnx.export(model, torch.randn(1, SEQ_T, DIM), str(out / "sign_daily_lstm.onnx"), opset_version=18, input_names=["sequence"], output_names=["logits"], dynamic_axes={"sequence": {0: "batch"}, "logits": {0: "batch"}})
W1016 02:04:28.303000 2688 .venv\Lib\site-packages\torch\onnx\_internal\exporter\_registration.py:107] torchvision is not installed. Skipping torchvision::nms
W1016 02:04:28.305000 2688 .venv\Lib\site-packages\torch\onnx\_internal\exporter\_registration.py:107] torchvision is not installed. Skipping torchvision::roi_align
W1016 02:04:28.306000 2688 .venv\Lib\site-packages\torch\onnx\_internal\exporter\_registration.py:107] torchvision is not installed. Skipping torchvision::roi_pool
W1016 02:04:28.307000 2688 .venv\Lib\site-packages\torch\onnx\_internal\exporter\_registration.py:107] torchvision is not installed. Skipping torchvision::deform_conv2d
[torch.onnx] Obtain model graph for `DailyNet([...]` with `torch.export.export(..., strict=False)`...
D:\Download\Projects\WBSL Bridge\.venv\Lib\site-packages\torch\_dynamo\utils.py:4415: FutureWarning: _check_is_size will be removed in a future PyTorch release alongwith guard_size_oblivious.     Use _check(i >= 0) instead.
  return node.target(*args, **kwargs)  # type: ignore[operator]
<eval_with_key>.1:6: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size = torch._check_is_size(item);  _check_is_size = None
<eval_with_key>.1:7: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size_1 = torch._check_is_size(item, max = 31);  _check_is_size_1 = None
<eval_with_key>.7:10: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size = torch._check_is_size(item);  _check_is_size = None
<eval_with_key>.7:11: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size_1 = torch._check_is_size(item, max = 31);  _check_is_size_1 = None
<eval_with_key>.9:6: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size = torch._check_is_size(item);  _check_is_size = None
<eval_with_key>.9:7: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size_1 = torch._check_is_size(item, max = 31);  _check_is_size_1 = None
<eval_with_key>.15:10: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size = torch._check_is_size(item);  _check_is_size = None
<eval_with_key>.15:11: FutureWarning: _check_is_size will be removed in a future PyTorch release along with guard_size_oblivious.     Use _check(i >= 0) instead.
  _check_is_size_1 = torch._check_is_size(item, max = 31);  _check_is_size_1 = None
C:\Users\Sabir Ali Mondal\AppData\Local\Programs\Python\Python311\Lib\contextlib.py:144: UserWarning: The tensor attributes self.lstm._flat_weights[0], self.lstm._flat_weights[1], self.lstm._flat_weights[2], self.lstm._flat_weights[3], self.lstm._flat_weights[4], self.lstm._flat_weights[5], self.lstm._flat_weights[6], self.lstm._flat_weights[7], self.lstm._flat_weights[8], self.lstm._flat_weights[9], self.lstm._flat_weights[10], self.lstm._flat_weights[11], self.lstm._flat_weights[12], self.lstm._flat_weights[13], self.lstm._flat_weights[14], self.lstm._flat_weights[15] were assigned during export. Such attributes must be registered as buffers using the `register_buffer` API (https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.register_buffer).
  next(self.gen)
[torch.onnx] Obtain model graph for `DailyNet([...]` with `torch.export.export(..., strict=False)`... ✅
[torch.onnx] Run decompositions...
[torch.onnx] Run decompositions... ✅
[torch.onnx] Translate the graph into ONNX...
[torch.onnx] Translate the graph into ONNX... ✅
[torch.onnx] Optimize the ONNX graph...
[torch.onnx] Optimize the ONNX graph... ✅
  saved models/onnx_models/3/  (best 100.0%)
(.venv) PS D:\Download\Projects\WBSL Bridge> 