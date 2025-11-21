# import cv2
# import numpy as np
# import joblib

# # Load trained components
# model = joblib.load("skin_tone_model_xgb.pkl")
# scaler = joblib.load("scaler.pkl")

# # Map numeric labels → class names
# label_map = {0: "light", 1: "medium", 2: "dark"}

# # -------------------------
# # Feature Extraction (mean HSV only, same as training)
# # -------------------------

# def extract_features(image):
#     image = cv2.resize(image, (64, 64))
#     hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#     # Apply skin mask
#     lower = np.array([0, 40, 60], dtype="uint8")
#     upper = np.array([25, 255, 255], dtype="uint8")
#     mask = cv2.inRange(hsv, lower, upper)

#     skin = cv2.bitwise_and(hsv, hsv, mask=mask)

#     # Mean HSV using mask
#     mean_vals = cv2.mean(skin, mask=mask)[:3]

#     # Histograms using mask
#     h_hist = cv2.calcHist([skin], [0], mask, [16], [0,180])
#     s_hist = cv2.calcHist([skin], [1], mask, [16], [0,256])
#     v_hist = cv2.calcHist([skin], [2], mask, [16], [0,256])

#     # Normalize histograms
#     h_hist = cv2.normalize(h_hist, h_hist).flatten()
#     s_hist = cv2.normalize(s_hist, s_hist).flatten()
#     v_hist = cv2.normalize(v_hist, v_hist).flatten()

#     # Final feature vector
#     features = np.concatenate([mean_vals, h_hist, s_hist, v_hist])
#     return features

# # def extract_features(image):
# #     image = cv2.resize(image, (64, 64))
# #     hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# #     # Mean HSV
# #     mean = np.mean(hsv.reshape(-1, 3), axis=0)

# #     # Histogram (16 bins each channel)
# #     hist_h = cv2.calcHist([hsv], [0], None, [16], [0,180])
# #     hist_s = cv2.calcHist([hsv], [1], None, [16], [0,256])
# #     hist_v = cv2.calcHist([hsv], [2], None, [16], [0,256])
# #     hist = np.concatenate([hist_h, hist_s, hist_v]).flatten()
# #     hist = hist / np.sum(hist)

# #     return np.concatenate([mean, hist])

# # -------------------------
# # Webcam Setup
# # -------------------------
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
# cap = cv2.VideoCapture(0)

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         break

#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#     for (x, y, w, h) in faces:
#         cv2.rectangle(frame, (x,y), (x+w, y+h), (255,0,0), 2)

#         face_roi = frame[y:y+h, x:x+w]

#         # Extract features
#         feats = extract_features(face_roi).reshape(1, -1)

#         # Scale
#         feats_scaled = scaler.transform(feats)

#         # Predict
#         pred_class = model.predict(feats_scaled)[0]
#         pred_label = label_map.get(pred_class, "Unknown")

#         # Show result
#         cv2.putText(frame, f"Skin Tone: {pred_label}", (x, y-10),
#                     cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

#     cv2.imshow("Skin Tone Detector", frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()





# import cv2
# import numpy as np
# import joblib

# # Load trained components
# try:
#     model = joblib.load("skin_tone_model_xgb.pkl")
#     scaler = joblib.load("scaler.pkl")
# except FileNotFoundError as e:
#     print("Error:", e)
#     exit()

# # Map numeric labels → class names
# label_map = {0: "light", 1: "medium", 2: "dark"}

# # -------------------------
# # Feature Extraction (mean HSV only, same as training)
# # -------------------------

# def extract_features(image):
#     image = cv2.resize(image, (64, 64))
#     hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#     # Apply skin mask
#     lower = np.array([0, 40, 60], dtype="uint8")
#     upper = np.array([25, 255, 255], dtype="uint8")
#     mask = cv2.inRange(hsv, lower, upper)

#     skin = cv2.bitwise_and(hsv, hsv, mask=mask)

#     # Mean HSV using mask
#     mean_vals = cv2.mean(skin, mask=mask)[:3]

#     # Histograms using mask
#     h_hist = cv2.calcHist([skin], [0], mask, [16], [0,180])
#     s_hist = cv2.calcHist([skin], [1], mask, [16], [0,256])
#     v_hist = cv2.calcHist([skin], [2], mask, [16], [0,256])

#     # Normalize histograms
#     h_hist = cv2.normalize(h_hist, h_hist).flatten()
#     s_hist = cv2.normalize(s_hist, s_hist).flatten()
#     v_hist = cv2.normalize(v_hist, v_hist).flatten()

#     # Final feature vector
#     features = np.concatenate([mean_vals, h_hist, s_hist, v_hist])
#     return features

# # -------------------------
# # Webcam Setup
# # -------------------------
# face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
# cap = cv2.VideoCapture(0)

# if not cap.isOpened():
#     print("Error: Cannot open webcam")
#     exit()

# while True:
#     ret, frame = cap.read()
#     if not ret:
#         print("Error: Failed to grab frame")
#         break

#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, 1.3, 5)

#     for (x, y, w, h) in faces:
#         cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

#         face_roi = frame[y:y+h, x:x+w]

#         # Extract features
#         feats = extract_features(face_roi).reshape(1, -1)

#         # Scale
#         feats_scaled = scaler.transform(feats)

#         # Predict
#         pred_class = model.predict(feats_scaled)[0]
#         pred_label = label_map.get(pred_class, "Unknown")

#         # Show result
#         cv2.putText(frame, f"Skin Tone: {pred_label}", (x, y - 10),
#                     cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

#         break  # Only process the first detected face

#     cv2.imshow("Skin Tone Detector", frame)

#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         print("Quitting...")
#         break

# cap.release()
# cv2.destroyAllWindows()




import cv2
import numpy as np
import joblib

# Load trained components
model = joblib.load("skin_tone_model_xgb.pkl")
scaler = joblib.load("scaler.pkl")

# Map numeric labels → class names
label_map = {0: "light", 1: "medium", 2: "dark"}

# -------------------------
# Feature Extraction (same as preprocess.py → 51 features)
# -------------------------
def extract_features(image):
    image = cv2.resize(image, (64, 64))
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Apply skin mask
    lower = np.array([0, 40, 60], dtype="uint8")
    upper = np.array([25, 255, 255], dtype="uint8")
    mask = cv2.inRange(hsv, lower, upper)

    skin = cv2.bitwise_and(hsv, hsv, mask=mask)

    # Mean HSV using mask
    mean_vals = cv2.mean(skin, mask=mask)[:3]

    # Histograms using mask
    h_hist = cv2.calcHist([skin], [0], mask, [16], [0,180])
    s_hist = cv2.calcHist([skin], [1], mask, [16], [0,256])
    v_hist = cv2.calcHist([skin], [2], mask, [16], [0,256])

    # Normalize histograms
    h_hist = cv2.normalize(h_hist, h_hist).flatten()
    s_hist = cv2.normalize(s_hist, s_hist).flatten()
    v_hist = cv2.normalize(v_hist, v_hist).flatten()

    # Final feature vector (51 features)
    features = np.concatenate([mean_vals, h_hist, s_hist, v_hist])
    return features


# -------------------------
# Upload + Predict
# -------------------------
def predict_skin_tone(image_path):
    image = cv2.imread(image_path)
    if image is None:
        print("❌ Error: Could not read image.")
        return
    
    feats = extract_features(image).reshape(1, -1)
    feats_scaled = scaler.transform(feats)
    pred_class = model.predict(feats_scaled)[0]
    pred_label = label_map.get(pred_class, "Unknown")
    print(f"✅ Predicted Skin Tone: {pred_label}")


# Example usage
if __name__ == "__main__":
    img_path = "img1.webp"   # replace with your image filename
    predict_skin_tone(img_path)
