# # uvicorn app:app --reload





import numpy as np
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.utils.class_weight import compute_class_weight
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE

# =====================
# Load preprocessed skin data
# =====================
from preprocess import X as X_skin, y as y_skin  # your existing preprocessed features

print(f"✅ Loaded dataset: X{X_skin.shape}, y{y_skin.shape}")

# =====================
# Step 1: Balance Dataset using SMOTE
# =====================
print("🔄 Balancing dataset using SMOTE...")
smote = SMOTE(random_state=42)
X_skin_res, y_skin_res = smote.fit_resample(X_skin, y_skin)
print(f"✅ After SMOTE: X{X_skin_res.shape}, y{y_skin_res.shape}")

# =====================
# Step 2: Scale Features using MinMaxScaler
# =====================
print("🔄 Scaling features with MinMaxScaler...")
skin_scaler = MinMaxScaler()
X_skin_scaled = skin_scaler.fit_transform(X_skin_res)

# =====================
# Step 3: Train/Test Split
# =====================
X_train, X_test, y_train, y_test = train_test_split(
    X_skin_scaled, y_skin_res, test_size=0.2, random_state=42, stratify=y_skin_res
)
print(f"✅ Train/Test split: {X_train.shape}/{X_test.shape}")

# =====================
# Step 4: Compute Class Weights
# =====================
classes = np.unique(y_train)
weights = compute_class_weight(class_weight="balanced", classes=classes, y=y_train)
class_weights = dict(zip(classes, weights))
print("⚖️ Initial Class Weights:", class_weights)

# Boost medium and dark classes if needed
class_weights[1] *= 1.5  # medium
class_weights[2] *= 2.0  # dark
print("⚖️ Updated Class Weights:", class_weights)

sample_weights = np.array([class_weights[label] for label in y_train])

# =====================
# Step 5: Train XGBoost Model
# =====================
skin_model = XGBClassifier(
    n_estimators=1000,
    max_depth=8,
    learning_rate=0.05,
    subsample=0.9,
    colsample_bytree=0.9,
    random_state=42,
    use_label_encoder=False,
    eval_metric="mlogloss"
)

print("🚀 Training Skin Tone XGBoost model...")
skin_model.fit(X_train, y_train, sample_weight=sample_weights, eval_set=[(X_test, y_test)], verbose=50)

# =====================
# Step 6: Evaluation
# =====================
y_pred = skin_model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"\n✅ Test Accuracy: {acc:.4f}")
print("📊 Classification Report:")
print(classification_report(y_test, y_pred, target_names=["light", "medium", "dark"]))
print("📌 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

cv_scores = cross_val_score(skin_model, X_skin_scaled, y_skin_res, cv=5, scoring="accuracy")
print("\n🔄 5-Fold CV Scores:", cv_scores)
print("Mean CV Accuracy:", cv_scores.mean())

# =====================
# Step 7: Save Model + Scaler
# =====================
joblib.dump(skin_model, "skin_tone_model_xgb.pkl")
joblib.dump(skin_scaler, "skin_scaler.pkl")
print("🎉 Model saved as skin_tone_model_xgb.pkl and skin_scaler.pkl")














































































# # #71 % accuracy
# import sys
# import site
# from xgboost.callback import EarlyStopping


# # =====================
# # Debugging Environment
# # =====================
# print("🔎 Debug Info:")
# print("Python executable:", sys.executable)
# print("Python version:", sys.version)
# print("Site-packages paths:", site.getsitepackages())
# print("=" * 60)

# import numpy as np
# from sklearn.model_selection import train_test_split, cross_val_score
# from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
# from sklearn.preprocessing import StandardScaler
# import joblib
# from xgboost import XGBClassifier
# from sklearn.utils.class_weight import compute_class_weight

# # Load preprocessed features
# from preprocess import X, y

# # =====================
# # Step 1: Scale Features
# # =====================
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # =====================
# # Step 2: Train/Test Split
# # =====================
# X_train, X_test, y_train, y_test = train_test_split(
#     X_scaled, y, test_size=0.2, random_state=42, stratify=y
# )

# # =====================
# # Step 3: Compute Class Weights
# # =====================
# classes = np.unique(y_train)
# weights = compute_class_weight(class_weight="balanced", classes=classes, y=y_train)
# class_weights = dict(zip(classes, weights))

# # 🔥 Boost medium class weight manually
# class_weights[1] *= 1.5

# print("⚖️ Class Weights:", class_weights)

# # Assign sample weights
# sample_weights = np.array([class_weights[label] for label in y_train])

# # =====================
# # Step 4: XGBoost Model with Early Stopping
# # =====================
# model = XGBClassifier(
#     n_estimators=1000,
#     max_depth=8,
#     learning_rate=0.05,
#     subsample=0.9,
#     colsample_bytree=0.9,
#     random_state=42,
#     use_label_encoder=False,
#     eval_metric="mlogloss"
# )

# print("🚀 Training XGBoost model with class weights + early stopping...")
# model.fit(
#     X_train, y_train,
#     sample_weight=sample_weights,
#     eval_set=[(X_test, y_test)],
#     verbose=False,
#    #early_stopping_rounds=30   # ✅ stops when no improvement
# )

# # =====================
# # Step 5: Predictions
# # =====================
# y_pred = model.predict(X_test)

# # =====================
# # Step 6: Evaluation
# # =====================
# acc = accuracy_score(y_test, y_pred)
# print(f"✅ Test Accuracy: {acc:.4f}\n")

# print("📊 Classification Report:")
# print(classification_report(y_test, y_pred, target_names=["light", "medium", "dark"]))

# print("📌 Confusion Matrix:")
# print(confusion_matrix(y_test, y_pred))

# # =====================
# # Step 7: Cross-validation
# # =====================
# print("\n🔄 Running 5-fold Cross Validation...")
# cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring="accuracy")
# print("CV Scores:", cv_scores)
# print("Mean CV Accuracy:", cv_scores.mean())

# # =====================
# # Step 8: Save Model + Scaler
# # =====================
# joblib.dump(model, "skin_tone_model_xgb.pkl")
# joblib.dump(scaler, "scaler.pkl")
# print("🎉 Model saved as skin_tone_model_xgb.pkl and scaler.pkl")
