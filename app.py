
import requests
import os
from flask import Flask, request, jsonify




import numpy as np
from preprocess_face import extract_face_landmarks_safe
import cv2
import joblib
from flask_cors import CORS
import requests 


GEMINI_API_KEY = os.environ.get("AIzaSyCaJxMO0AwT0nRlHAiiZLL9uPa2XldVGxo")
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
os.environ["MEDIAPIPE_DISABLE_TF_IMPORT"] = "1"

app = Flask(__name__)
CORS(app)  # 👈 And this line

# =====================
# Load Models + Scalers
# =====================
skin_model = joblib.load("skin_tone_model_xgb.pkl")
skin_scaler = joblib.load("skin_scaler.pkl")

face_model = joblib.load("face_shape_model.pkl")
face_scaler = joblib.load("face_scaler.pkl")

# Labels
skin_labels = ["light", "medium", "dark"]
face_labels = ["Oblong", "Oval", "Round", "Square", "Heart"]

# =====================
# Feature extraction functions
# =====================
import cv2
import numpy as np

def extract_skin_features(image):
    import os
    os.environ["MEDIAPIPE_DISABLE_TF_IMPORT"] = "1"
    import mediapipe as mp
    """
    Extract 51 skin features to match training data:
    - 3 HSV channel means
    - 8-bin histograms for H, S, V channels (24)
    - 3 HSV std deviations
    - 5 extra derived features (ratios, normalized stats)
    - Fill zeros if needed to reach 51
    """
    # Convert to HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # 1️⃣ HSV Means
    h_mean = np.mean(hsv[:, :, 0])
    s_mean = np.mean(hsv[:, :, 1])
    v_mean = np.mean(hsv[:, :, 2])
    
    # 2️⃣ HSV Histograms (8 bins each)
    h_hist = cv2.calcHist([hsv], [0], None, [8], [0, 180]).flatten()
    s_hist = cv2.calcHist([hsv], [1], None, [8], [0, 256]).flatten()
    v_hist = cv2.calcHist([hsv], [2], None, [8], [0, 256]).flatten()
    
    # 3️⃣ HSV Standard Deviations
    h_std = np.std(hsv[:, :, 0])
    s_std = np.std(hsv[:, :, 1])
    v_std = np.std(hsv[:, :, 2])
    
    # 4️⃣ Derived features (ratios / normalized stats)
    h_s_ratio = h_mean / (s_mean + 1e-5)
    s_v_ratio = s_mean / (v_mean + 1e-5)
    v_h_ratio = v_mean / (h_mean + 1e-5)
    hsv_range_ratio = (np.max(hsv) - np.min(hsv)) / (np.mean(hsv) + 1e-5)
    skin_pixel_ratio = np.count_nonzero((hsv[:, :, 0] > 0) & (hsv[:, :, 1] > 0)) / (image.shape[0]*image.shape[1])
    
    # 5️⃣ Concatenate all features
    features = np.concatenate([
        [h_mean, s_mean, v_mean],
        h_hist, s_hist, v_hist,
        [h_std, s_std, v_std],
        [h_s_ratio, s_v_ratio, v_h_ratio, hsv_range_ratio, skin_pixel_ratio]
    ])
    
    # 6️⃣ Fill zeros if features < 51 (just in case)
    if features.shape[0] < 51:
        extra = np.zeros(51 - features.shape[0])
        features = np.concatenate([features, extra])
    
    return features


import cv2
import numpy as np
import mediapipe as mp

# MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)

# MediaPipe landmark indices for key points
LEFT_EYE_IDX = [33, 133, 160, 159, 158, 157, 173]
RIGHT_EYE_IDX = [362, 263, 387, 386, 385, 384, 398]
MOUTH_IDX = [61, 291]  # left and right corners
NOSE_IDX = [1]         # nose tip
JAW_IDX = [152, 234, 454]  # top, left jaw, right jaw

def extract_face_features(img_or_path):
    """
    Returns 9D face features from MediaPipe landmarks.
    """
    try:
        # Load image
        if isinstance(img_or_path, np.ndarray):
            img = img_or_path.copy()
        else:
            img = cv2.imread(img_or_path)
        if img is None:
            print("❌ Could not read image")
            return None

        h, w = img.shape[:2]
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(img_rgb)
        if not results.multi_face_landmarks:
            print("❌ No face detected")
            return None

        landmarks = results.multi_face_landmarks[0].landmark
        lm_coords = np.array([[int(lm.x*w), int(lm.y*h)] for lm in landmarks])

        # Compute key points
        left_eye = np.mean(lm_coords[LEFT_EYE_IDX], axis=0)
        right_eye = np.mean(lm_coords[RIGHT_EYE_IDX], axis=0)
        mouth_left = lm_coords[MOUTH_IDX[0]]
        mouth_right = lm_coords[MOUTH_IDX[1]]
        nose_tip = lm_coords[NOSE_IDX[0]]
        jaw_top = lm_coords[JAW_IDX[0]]
        jaw_left = lm_coords[JAW_IDX[1]]
        jaw_right = lm_coords[JAW_IDX[2]]

        # Face dimensions
        face_width = np.linalg.norm(jaw_left - jaw_right)
        face_height = np.linalg.norm(jaw_top - ((jaw_left + jaw_right)/2))

        # Features
        eye_distance = np.linalg.norm(left_eye - right_eye)
        jaw_width = face_width
        face_ratio = face_width / face_height
        jaw_ratio = jaw_width / face_height
        eye_face_ratio = eye_distance / face_width
        nose_mouth_ratio = abs(nose_tip[1] - ((mouth_left[1]+mouth_right[1])/2)) / face_height
        symmetry_score = abs(left_eye[0] + right_eye[0] - jaw_left[0] - jaw_right[0]) / face_width
        cheek_jaw_ratio = eye_distance / jaw_width
        roundness = (4*np.pi*(face_width*face_height)) / ((2*(face_width + face_height))**2)

        features = [
            face_ratio,
            jaw_ratio,
            cheek_jaw_ratio,
            eye_face_ratio,
            nose_mouth_ratio,
            roundness,
            symmetry_score,
            face_width / 200.0,
            face_height / 200.0
        ]

        return np.array(features, dtype=np.float32)

    except Exception as e:
        print(f"⚠️ Error processing image: {e}")
        return None


# =====================
# Prediction Route
# =====================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]
        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        # Extract features
        skin_features = extract_skin_features(img)
        face_features = extract_face_features(img)

        # Scale features
        skin_features_scaled = skin_scaler.transform([skin_features])
        face_features_scaled = face_scaler.transform([face_features])

        # Predict using correct models
        skin_pred_idx = skin_model.predict(skin_features_scaled)[0]
        face_pred_idx = face_model.predict(face_features_scaled)[0]

        skin_pred_label = skin_labels[skin_pred_idx]
        face_pred_label = face_labels[face_pred_idx]

        # 🎨 Simple recommendations based on predictions
        foundation_suggestions = {
            "light": "Ivory or Porcelain",
            "medium": "Beige or Honey",
            "dark": "Mocha or Cocoa"
        }

        lipstick_suggestions = {
            "light": "Rose Pink or Coral",
            "medium": "Berry or Mauve",
            "dark": "Plum or Red"
        }

        hair_partition_suggestions = {
            "Oval": "Middle Partition",
            "Round": "Side Partition",
            "Square": "Soft Waves with Side Partition",
            "Heart": "Curtain Bangs",
            "Oblong": "Long Layers with Center Partition"
        }

        clothing_suggestions = {
            "light": "Soft pastels or light blue",
            "medium": "Warm earthy tones or navy",
            "dark": "Bright or bold colors like yellow and red"
        }

        foundation = foundation_suggestions.get(skin_pred_label, "Natural Beige")
        lipstick = lipstick_suggestions.get(skin_pred_label, "Neutral Pink")
        hair_partition = hair_partition_suggestions.get(face_pred_label, "Classic Side Partition")
        clothing = clothing_suggestions.get(skin_pred_label, "Neutral tones")

        # ✅ Return everything to frontend
        return jsonify({
            "skin_tone": skin_pred_label,
            "face_shape": face_pred_label,
            "foundation": foundation,
            "lipstick": lipstick,
            "hair_partition": hair_partition,
            "clothing": clothing
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500




# def analyze_alias():
#     try:
#         if 'file' not in request.files:
#          return jsonify({"error": "No image uploaded"}), 400

#         file = request.files["file"]


       
#         npimg = np.frombuffer(file.read(), np.uint8)
#         img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

#         if img is None:
#             return jsonify({"error": "Invalid image"}), 400

#         # Extract features
#         skin_features = extract_skin_features(img)
#         face_features = extract_face_features(img)

#         # Scale features
#         skin_features_scaled = skin_scaler.transform([skin_features])
#         face_features_scaled = face_scaler.transform([face_features])

#         # Predict using correct models
#         skin_pred_idx = skin_model.predict(skin_features_scaled)[0]
#         face_pred_idx = face_model.predict(face_features_scaled)[0]

#         skin_pred_label = skin_labels[skin_pred_idx]
#         face_pred_label = face_labels[face_pred_idx]

#         # 🎨 Simple recommendations based on predictions
#         foundation_suggestions = {
#             "light": "Ivory or Porcelain",
#             "medium": "Beige or Honey",
#             "dark": "Mocha or Cocoa"
#         }

#         lipstick_suggestions = {
#             "light": "Rose Pink or Coral",
#             "medium": "Berry or Mauve",
#             "dark": "Plum or Red"
#         }

#         hair_partition_suggestions = {
#             "Oval": "Middle Partition",
#             "Round": "Side Partition",
#             "Square": "Soft Waves with Side Partition",
#             "Heart": "Curtain Bangs",
#             "Oblong": "Long Layers with Center Partition"
#         }

#         clothing_suggestions = {
#             "light": "Soft pastels or light blue",
#             "medium": "Warm earthy tones or navy",
#             "dark": "Bright or bold colors like yellow and red"
#         }

#         foundation = foundation_suggestions.get(skin_pred_label, "Natural Beige")
#         lipstick = lipstick_suggestions.get(skin_pred_label, "Neutral Pink")
#         hair_partition = hair_partition_suggestions.get(face_pred_label, "Classic Side Partition")
#         clothing = clothing_suggestions.get(skin_pred_label, "Neutral tones")

#         # ✅ Return everything to frontend
#         return jsonify({
#     "skin_tone": skin_pred_label,
#     "face_shape": face_pred_label,
#     "recommendations": {
#         "foundation": foundation,
#         "lipstick": lipstick,
#         "hairstyle": hair_partition,
#         "clothing": [clothing]  # send as list for color palette display
#     }
# })


#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route("/analyze/", methods=["POST"])
# def analyze_alias():
#     try:
#         if 'file' not in request.files:
#             return jsonify({"error": "No image uploaded"}), 400

#         file = request.files["file"]
#         npimg = np.frombuffer(file.read(), np.uint8)
#         img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

#         if img is None:
#             return jsonify({"error": "Invalid image"}), 400

#         # Extract features
#         skin_features = extract_skin_features(img)
#         face_features = extract_face_features(img)

#         # Scale features
#         skin_features_scaled = skin_scaler.transform([skin_features])
#         face_features_scaled = face_scaler.transform([face_features])

#         # Predict using models
#         skin_pred_idx = skin_model.predict(skin_features_scaled)[0]
#         face_pred_idx = face_model.predict(face_features_scaled)[0]

#         skin_pred_label = skin_labels[skin_pred_idx]
#         face_pred_label = face_labels[face_pred_idx]

#         # 🎨 Recommendations
#         foundation_suggestions = {
#             "light": "Ivory or Porcelain",
#             "medium": "Beige or Honey",
#             "dark": "Mocha or Cocoa"
#         }

#         lipstick_suggestions_female = {
#             "light": "Rose Pink or Coral",
#             "medium": "Berry or Mauve",
#             "dark": "Plum or Red"
#         }
#         lipstick_suggestions_male = {
#             "light": "Neutral Balm",
#             "medium": "Subtle Mauve",
#             "dark": "Beige or Nude"
#         }

#         hair_partition_suggestions_female = {
#             "Oval": "Middle Partition",
#             "Round": "Side Partition",
#             "Square": "Soft Waves with Side Partition",
#             "Heart": "Curtain Bangs",
#             "Oblong": "Long Layers with Center Partition"
#         }
#         hair_partition_suggestions_male = {
#             "Oval": "Short Crop",
#             "Round": "Side Part",
#             "Square": "Classic Crew Cut",
#             "Heart": "Textured Fringe",
#             "Oblong": "Short Quiff"
#         }

#         clothing_suggestions = {
#             "light": "Soft pastels or light blue",
#             "medium": "Warm earthy tones or navy",
#             "dark": "Bright or bold colors like yellow and red"
#         }

#         # Compose combined recommendations
#         foundation = foundation_suggestions.get(skin_pred_label, "Natural Beige")
#         lipstick = f" Females: {lipstick_suggestions_female.get(skin_pred_label)}   Males: {lipstick_suggestions_male.get(skin_pred_label)}"
#         hair_partition = f"Females: {hair_partition_suggestions_female.get(face_pred_label)} Males: {hair_partition_suggestions_male.get(face_pred_label)}"
#         clothing = clothing_suggestions.get(skin_pred_label, "Neutral tones")

#         return jsonify({
#             "skin_tone": skin_pred_label,
#             "face_shape": face_pred_label,
#             "recommendations": {
#                 "foundation": foundation,
#                 "lipstick": lipstick,
#                 "hairstyle": hair_partition,
#                 "clothing": [clothing]  # list for color palette display
#             }
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



@app.route("/analyze/", methods=["POST"])
def analyze_alias():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["file"]
        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"error": "Invalid image"}), 400

        # Extract features
        skin_features = extract_skin_features(img)
        face_features = extract_face_features(img)

        # Scale
        skin_scaled = skin_scaler.transform([skin_features])
        face_scaled = face_scaler.transform([face_features])

        # Predict
        skin_pred = skin_labels[skin_model.predict(skin_scaled)[0]]
        face_pred = face_labels[face_model.predict(face_scaled)[0]]

        # --- FOUNDATION ---
        foundation_suggestions = {
            "light": "Ivory, Porcelain or Cool Beige",
            "medium": "Warm Beige or Honey",
            "dark": "Mocha, Chestnut or Cocoa"
        }

        # --- LIPSTICK ---
        lipstick_suggestions_female = {
            "light": "Soft pinks, corals, and rosy nudes",
            "medium": "Berry, mauve, or rosewood tones",
            "dark": "Plum, brick red, or deep burgundy"
        }
        lipstick_suggestions_male = {
            "light": "Lip balm or light nude tint",
            "medium": "Natural beige or soft brown tint",
            "dark": "Deep brown or neutral balm shades"
        }

        # --- HAIR PARTITION + HAIRSTYLES ---
        hair_partition_suggestions_female = {
            "Round": "💇‍♀️ **Side Partition** — adds length and defines cheeks.<br>✨ Best Hairstyles: Long layers, side-swept bangs, wavy cuts.",
            "Oval": "💇‍♀️ **Middle Partition** — balanced symmetry.<br>✨ Best Hairstyles: Any style suits you! Layer cut, feather, curtain bangs.",
            "Square": "💇‍♀️ **Side Partition** — softens jawline.<br>✨ Best Hairstyles: Layered or feather cut, side bangs, soft curls.",
            "Heart": "💇‍♀️ **Deep Side Partition** — balances wide forehead.<br>✨ Best Hairstyles: Bob/lob, side bangs, curtain fringe.",
            "Oblong": "💇‍♀️ **Middle Partition** or **Curtain Bangs** — adds width.<br>✨ Best Hairstyles: Shoulder-length layers, wavy lob.",
            "Diamond": "💇‍♀️ **Side Partition** — highlights cheekbones.<br>✨ Best Hairstyles: Chin-length bob, soft waves."
        }
        hair_partition_suggestions_male = {
            "Round": "💇‍♂️ **Side Partition** — defines structure.<br>✨ Best Hairstyles: Pompadour, fade, or quiff.",
            "Oval": "💇‍♂️ **Middle or Side Partition** — any style suits you.<br>✨ Best Hairstyles: Crew cut, classic taper, slick back.",
            "Square": "💇‍♂️ **Side Partition** — balances sharp jawline.<br>✨ Best Hairstyles: Undercut, side sweep, textured crop.",
            "Heart": "💇‍♂️ **Side Partition** — adds volume to top.<br>✨ Best Hairstyles: Quiff, messy top, layered cut.",
            "Oblong": "💇‍♂️ **Middle Partition** — reduces length.<br>✨ Best Hairstyles: Medium waves, fringe cuts.",
            "Diamond": "💇‍♂️ **Side Partition** — highlights cheekbones.<br>✨ Best Hairstyles: Textured side fade, comb-over."
        }

        clothing_suggestions = {
            "light": ["Soft pastels", "Light blue", "Mint", "Lavender"],
            "medium": ["Earthy tones", "Olive", "Navy", "Maroon","black"],
            "dark": ["Coral", "Fuchsia", "Royal blue", "Red", "White"]
        }
        # clothing_suggestions = {
        #     "light": ["Baby Blue", "Pastel Pink", "Lavender", "Mint Green"],
        #     "medium": ["Olive Green", "Mustard Yellow", "Teal", "Cobalt Blue","black"],
        #     "dark": ["Crimson Red", "Royal blue", "Canary Yellow", "White"]
        # }

        foundation = foundation_suggestions.get(skin_pred, "Neutral Beige")
        lipstick = f"<b>Female:</b> {lipstick_suggestions_female.get(skin_pred)}<br><br><b>Male:</b> {lipstick_suggestions_male.get(skin_pred)}"
        hair_partition = f"<b>Female:</b> {hair_partition_suggestions_female.get(face_pred)}<br><br><b>Male:</b> {hair_partition_suggestions_male.get(face_pred)}"
        clothing = clothing_suggestions.get(skin_pred, ["Neutral tones"])

        return jsonify({
    "skin_tone": skin_pred,
    "face_shape": face_pred,
    "recommendations": {
        "foundation": foundation,
        "lipstickFemale": lipstick_suggestions_female.get(skin_pred),
        "lipstickMale": lipstick_suggestions_male.get(skin_pred),
        "hairstyleFemale": hair_partition_suggestions_female.get(face_pred),
        "hairstyleMale": hair_partition_suggestions_male.get(face_pred),
        "clothing": clothing
    }
})


    except Exception as e:
        return jsonify({"error": str(e)}), 500









GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

@app.route("/ask-gemini", methods=["POST"])
def ask_gemini():
    try:
        data = request.get_json()
        message = data.get("message", "")
        if not message:
            return jsonify({"answer": "No message provided"}), 400

        url = "https://gemini.googleapis.com/v1/complete"  # Make sure this is correct
        headers = {
            "Authorization": f"Bearer {GEMINI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "prompt": message,
            "max_tokens": 200
        }

        resp = requests.post(url, headers=headers, json=payload)
        print("Status code:", resp.status_code)
        print("Response text:", resp.text)  # <--- THIS WILL SHOW RAW RESPONSE

        # Try parsing JSON only if status code is 200
        if resp.status_code == 200:
            resp_data = resp.json()
            ai_answer = resp_data.get("choices", [{}])[0].get("text", "Sorry, no response generated.")
        else:
            ai_answer = f"Error: Received status {resp.status_code}"

        return jsonify({"answer": ai_answer})

    except Exception as e:
        print("Exception:", e)
        return jsonify({"answer": "Error processing request"}), 500

if __name__ == "__main__":
    app.run(debug=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)




















































































#OLD
# # app.py
# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# import joblib, cv2, numpy as np, traceback, os, time
# from sklearn.exceptions import NotFittedError


# # Import your preprocess modules (they must be in the same folder or on PYTHONPATH)
# from preprocess_face import extract_face_landmarks_safe     # path-based extractor
# from preprocess import extract_features                     # path-based extractor

# # Run using: python -m uvicorn app:app --reload



# app = FastAPI()


# # Allow frontend (localhost)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # restrict for production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load trained models (wrap loads with helpful errors)
# def safe_joblib_load(path):
#     if not os.path.exists(path):
#         raise FileNotFoundError(f"Model file not found: {path}")
#     return joblib.load(path)

# try:
#     face_model = safe_joblib_load("face_shape_model.pkl")
# except Exception as e:
#     print("⚠️ face model load failed:", e)
#     face_model = None

# try:
#     skin_model = safe_joblib_load("skin_tone_model_xgb.pkl")
# except Exception as e:
#     print("⚠️ skin model load failed:", e)
#     skin_model = None

# # Scalers (could be None or not-fitted)
# face_scaler = None
# skin_scaler = None
# try:
#     if os.path.exists("scaler.pkl"):
#         face_scaler = joblib.load("scaler.pkl")
#         skin_scaler = face_scaler
# except Exception as e:
#     print("⚠️ scaler load failed (continuing without scaler):", e)
#     face_scaler = None
#     skin_scaler = None

# face_classes = ["Oblong", "Oval", "Round", "Square", "Heart"]
# skin_classes = ["light", "medium", "dark"]

# # ---------------- Helper wrappers ----------------
# def extract_face_landmarks_safe_from_img(img):
#     """Save uploaded image temporarily and call the path-based extractor."""
#     if img is None:
#         return None
#     tmp = f"temp_face_{int(time.time()*1000)}.jpg"
#     try:
#         ok = cv2.imwrite(tmp, img)
#         if not ok:
#             print("⚠️ cv2.imwrite returned False for", tmp)
#             return None
#         return extract_face_landmarks_safe(tmp)
#     finally:
#         # try to remove temporary file if exists
#         try:
#             if os.path.exists(tmp):
#                 os.remove(tmp)
#         except Exception:
#             pass

# def extract_features_from_img(img):
#     """Save uploaded image temporarily and call the path-based extractor for skin."""
#     if img is None:
#         return None
#     tmp = f"temp_skin_{int(time.time()*1000)}.jpg"
#     try:
#         ok = cv2.imwrite(tmp, img)
#         if not ok:
#             print("⚠️ cv2.imwrite returned False for", tmp)
#             return None
#         return extract_features(tmp)
#     finally:
#         try:
#             if os.path.exists(tmp):
#                 os.remove(tmp)
#         except Exception:
#             pass

# # ---------------- Rule-based recommendations ----------------
# def get_foundation(tone):
#     mapping = {
#         "light": "Porcelain with cool undertone",
#         "medium": "Warm beige with yellow undertone",
#         "dark": "Rich mocha with golden undertone",
#     }
#     return mapping.get(tone, "Neutral shade")

# def get_clothing_colors(tone):
#     mapping = {
#         "light": ["pastel pink", "sky blue", "mint"],
#         "medium": ["olive", "mustard", "coral"],
#         "dark": ["emerald", "ruby", "gold"],
#     }
#     return mapping.get(tone, ["black", "white", "grey"])

# def get_hairstyle(shape):
#     mapping = {
#         "Oval": "Loose waves or layered cut",
#         "Round": "Long layers or side-part",
#         "Square": "Soft curls, shoulder length",
#         "Heart": "Chin-length bob or side bangs",
#         "Oblong": "Voluminous curls or curtain bangs",
#     }
#     return mapping.get(shape, "Balanced layered hairstyle")

# # ---------------- Main endpoint ----------------
# @app.post("/analyze/")
# async def analyze_image(file: UploadFile = File(...)):
#     debug = {}
#     try:
#         contents = await file.read()
#         print(f"📥 Received: {file.filename}, size = {len(contents)} bytes, type = {file.content_type}")

#         npimg = np.frombuffer(contents, np.uint8)
#         img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
#     except Exception as e:
#         tb = traceback.format_exc()
#         print("❌ Error reading uploaded file:", tb)
#         raise HTTPException(status_code=400, detail="Invalid image upload")

#     if img is None:
#         print("❌ cv2.imdecode returned None for uploaded file")
#         raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")

#     debug['image_shape'] = img.shape
#     print("✅ Image loaded successfully:", img.shape)

#     # FACE features
#     face_features = None
#     try:
#         face_features = extract_face_landmarks_safe_from_img(img)
#         debug['face_features'] = None if face_features is None else face_features.tolist()
#     except Exception:
#         debug['face_features_error'] = traceback.format_exc()
#         print("❌ extract_face_landmarks error:\n", debug['face_features_error'])

#     face_shape = "Unknown"
#     if face_features is not None and face_model is not None:
#         try:
#             X_face = face_features.reshape(1, -1) if hasattr(face_features, "reshape") else [face_features]
#             if face_scaler is not None:
#                 try:
#                     X_face = face_scaler.transform(X_face)
#                 except Exception as e:
#                     debug['face_scaler_error'] = traceback.format_exc()
#                     print("⚠️ face_scaler.transform failed:", debug['face_scaler_error'])
#                     # fallback: use unscaled
#             pred_face = face_model.predict(X_face)[0]
#             face_shape = face_classes[int(pred_face)]
#             debug['pred_face_raw'] = int(pred_face)
#             print("🎯 Predicted face shape:", face_shape)
#         except Exception:
#             debug['face_predict_error'] = traceback.format_exc()
#             print("❌ face predict failed:\n", debug['face_predict_error'])
#     else:
#         if face_model is None:
#             debug['face_model'] = "not loaded"

#     # SKIN features
#     skin_features = None
#     try:
#         skin_features = extract_features_from_img(img)
#         debug['skin_features'] = None if skin_features is None else skin_features.tolist()
#     except Exception:
#         debug['skin_features_error'] = traceback.format_exc()
#         print("❌ extract_skin_features error:\n", debug['skin_features_error'])

#     skin_tone = "Unknown"
#     if skin_features is not None and skin_model is not None:
#         try:
#             X_skin = skin_features.reshape(1, -1) if hasattr(skin_features, "reshape") else [skin_features]
#             if skin_scaler is not None:
#                 try:
#                     X_skin = skin_scaler.transform(X_skin)
#                 except Exception:
#                     debug['skin_scaler_error'] = traceback.format_exc()
#                     print("⚠️ skin_scaler.transform failed:", debug['skin_scaler_error'])
#             pred_skin = skin_model.predict(X_skin)[0]
#             skin_tone = skin_classes[int(pred_skin)]
#             debug['pred_skin_raw'] = int(pred_skin)
#             print("🎯 Predicted skin tone:", skin_tone)
#         except Exception:
#             debug['skin_predict_error'] = traceback.format_exc()
#             print("❌ skin predict failed:\n", debug['skin_predict_error'])
#     else:
#         if skin_model is None:
#             debug['skin_model'] = "not loaded"

#     recommendations = {
#         "foundation": get_foundation(skin_tone),
#         "clothing": get_clothing_colors(skin_tone),
#         "hairstyle": get_hairstyle(face_shape),
#     }

#     response = {
#         "face_shape": face_shape,
#         "skin_tone": skin_tone,
#         "recommendations": recommendations,
#         "debug": debug,
#     }
#     return response
