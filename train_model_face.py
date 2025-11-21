
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import os

def load_data():
    """Load preprocessed face data"""
    try:
        X = np.load('X_face_features.npy')
        y = np.load('y_face_labels.npy')
        print(f"✅ Loaded data: X{X.shape}, y{y.shape}")
        return X, y
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return None, None

def train_face_model():
    print("🚀 TRAINING FACE SHAPE MODEL (XGBOOST + SCALER)")
    X_face, y_face = load_data()
    if X_face is None or len(X_face) == 0:
        print("❌ No data found.")
        return

    classes = ["Oblong", "Oval", "Round", "Square", "Heart"]
    print(f"📊 Dataset: {X_face.shape}, Classes: {classes}")

    X_train, X_test, y_train, y_test = train_test_split(
        X_face, y_face, test_size=0.2, random_state=42, stratify=y_face
    )

    # Scale features
    face_scaler = StandardScaler()
    X_face_scaled = face_scaler.fit_transform(X_face)
    X_train_scaled, X_test_scaled = train_test_split(
        X_face_scaled, test_size=0.2, random_state=42, stratify=y_face
    )

    # Train model
    face_model = XGBClassifier(
        n_estimators=300,
        max_depth=8,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        random_state=42,
        use_label_encoder=False,
        eval_metric="mlogloss"
    )

    print("🚀 Training Face Shape XGBoost model...")
    face_model.fit(X_train_scaled, y_train, eval_set=[(X_test_scaled, y_test)], verbose=False)

    # Evaluate
    y_pred = face_model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"✅ Face Model Accuracy: {acc:.4f}\n")
    print("📊 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=classes))
    print("📌 Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save model and scaler
    joblib.dump(face_model, "face_shape_model.pkl")
    joblib.dump(face_scaler, "face_scaler.pkl")
    print("🎉 Model saved as face_shape_model.pkl and face_scaler.pkl")

    # Feature importance visualization
    importances = face_model.feature_importances_
    plt.figure(figsize=(10, 5))
    sns.barplot(x=np.arange(len(importances)), y=importances)
    plt.title("XGBoost Feature Importances - Face Shape")
    plt.savefig("face_feature_importance.png")
    print("📊 Saved face_feature_importance.png")

if __name__ == "__main__":
    train_face_model()
































































# # train_model_xgboost.py
# import numpy as np
# from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
# from sklearn.preprocessing import StandardScaler
# from xgboost import XGBClassifier
# from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
# import joblib
# import os

# def load_data():
#     """Load preprocessed data"""
#     try:
#         X = np.load('X_face_features.npy')
#         y = np.load('y_face_labels.npy')
#         print(f"✅ Loaded data: X{X.shape}, y{y.shape}")
#         return X, y
#     except Exception as e:
#         print(f"❌ Error loading data: {e}")
#         return None, None

# def train_model_with_xgboost():
#     print("🚀 TRAINING FACE SHAPE CLASSIFIER WITH XGBOOST ONLY")
#     print("============================================================")
    
#     # Load data
#     X, y = load_data()
    
#     if X is None or len(X) == 0:
#         print("❌ No data available for training! Please run preprocessing first.")
#         return
    
#     classes = ["Oblong", "Oval", "Round", "Square", "Heart"]
    
#     print(f"📊 Dataset: {X.shape}")
#     print(f"🎯 Classes: {classes}")
#     print(f"📈 Class distribution: {np.bincount(y)}")
    
#     if len(X) < 50:
#         print("❌ Not enough data for training. Need at least 50 samples.")
#         return
    
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y, test_size=0.2, random_state=42, stratify=y
#     )
    
#     print(f"📚 Training set: {X_train.shape[0]} samples")
#     print(f"🧪 Test set: {X_test.shape[0]} samples")
    
#     scaler = StandardScaler()
#     X_train_scaled = scaler.fit_transform(X_train)
#     X_test_scaled = scaler.transform(X_test)
    
#     models = {
#         'XGBoost (Raw Features)': XGBClassifier(
#             n_estimators=100,
#             max_depth=6,
#             learning_rate=0.1,
#             random_state=42,
#             eval_metric='mlogloss'
#         ),
#         'XGBoost (Scaled Features)': XGBClassifier(
#             n_estimators=100,
#             max_depth=6,
#             learning_rate=0.1,
#             random_state=42,
#             eval_metric='mlogloss'
#         )
#     }
    
#     best_model = None
#     best_score = 0
#     best_name = ""
#     best_scaler = None
#     use_scaling = False
    
#     print("\n🎯 Training XGBoost models...")
#     for name, model in models.items():
#         print(f"\nTraining {name}...")
        
#         if name == 'XGBoost (Raw Features)':
#             model.fit(X_train, y_train)
#             cv_scores = cross_val_score(model, X_train, y_train, cv=5)
#             test_score = model.score(X_test, y_test)
#             current_scaler = None
#             current_use_scaling = False
#         else:
#             model.fit(X_train_scaled, y_train)
#             cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
#             test_score = model.score(X_test_scaled, y_test)
#             current_scaler = scaler
#             current_use_scaling = True
        
#         print(f"✅ {name} - CV Accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
#         print(f"✅ {name} - Test Accuracy: {test_score:.3f}")
        
#         if test_score > best_score:
#             best_score = test_score
#             best_model = model
#             best_name = name
#             best_scaler = current_scaler
#             use_scaling = current_use_scaling
    
#     print(f"\n🏆 Best XGBoost configuration: {best_name} with {best_score:.3f} accuracy")
    
#     # Predictions for report
#     if use_scaling:
#         y_pred = best_model.predict(X_test_scaled)
#     else:
#         y_pred = best_model.predict(X_test)
    
#     print("\n📊 Classification Report:")
#     print(classification_report(y_test, y_pred, target_names=classes))
    
#     # Confusion Matrix summary (no plot)
#     cm = confusion_matrix(y_test, y_pred)
#     print("\n🧩 Confusion Matrix:")
#     print(cm)
    
#     # Save model and scaler
#     joblib.dump(best_model, 'face_shape_model.pkl')
#     if best_scaler is not None:
#         joblib.dump(best_scaler, 'scaler.pkl')
#         print("💾 Scaler saved as 'scaler.pkl'")
#     else:
#         joblib.dump(StandardScaler(), 'scaler.pkl')
#         print("💾 Dummy scaler saved for compatibility")
    
#     model_info = {
#         'model_name': 'XGBoost',
#         'accuracy': best_score,
#         'classes': classes,
#         'uses_scaling': use_scaling,
#         'configuration': best_name
#     }
#     joblib.dump(model_info, 'model_info.pkl')
#     print("💾 Model info saved as 'model_info.pkl'")
    
#     print(f"\n🎉 XGBOOST TRAINING COMPLETED")
#     print(f"Final Test Accuracy: {best_score:.3f}")
#     print(f"Best Configuration: {best_name}")
#     print(f"Uses Feature Scaling: {use_scaling}")
#     print(f"Total training samples: {X_train.shape[0]}")
#     print(f"Total test samples: {X_test.shape[0]}")
    
#     return best_model, use_scaling

# def optimize_xgboost():
#     print("\n" + "="*50)
#     print("🔧 XGBOOST HYPERPARAMETER OPTIMIZATION")
#     print("="*50)
    
#     X, y = load_data()
#     if X is None:
#         return
    
#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
#     param_grid = {
#         'n_estimators': [50, 100, 200],
#         'max_depth': [3, 6, 9],
#         'learning_rate': [0.01, 0.1, 0.2],
#         'subsample': [0.8, 0.9, 1.0]
#     }
    
#     xgb = XGBClassifier(random_state=42, eval_metric='mlogloss')
#     grid_search = GridSearchCV(xgb, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
#     grid_search.fit(X_train, y_train)
    
#     print("🎯 Best XGBoost parameters:", grid_search.best_params_)
#     print("🎯 Best cross-validation score:", grid_search.best_score_)
    
#     best_xgb = grid_search.best_estimator_
#     test_score = best_xgb.score(X_test, y_test)
#     print("🎯 Test score with optimized parameters:", test_score)
    
#     joblib.dump(best_xgb, 'face_shape_model_optimized.pkl')
#     print("💾 Optimized model saved as 'face_shape_model_optimized.pkl'")
    
#     return best_xgb

# if __name__ == "__main__":
#     model, uses_scaling = train_model_with_xgboost()
#     # Optional: Uncomment to run hyperparameter optimization
#     # optimize_xgboost()
