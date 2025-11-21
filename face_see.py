

# see_xgboost.py
import cv2
import numpy as np
import joblib
from mtcnn import MTCNN
import os
import sys

# Load model, scaler, and model info
try:
    model = joblib.load("face_shape_model.pkl")
    scaler = joblib.load("scaler.pkl")
    model_info = joblib.load("model_info.pkl")
    print(f"✅ {model_info['model_name']} model loaded successfully!")
    print(f"✅ Model accuracy: {model_info['accuracy']:.3f}")
    print(f"✅ Uses scaling: {model_info['uses_scaling']}")
except FileNotFoundError:
    print("❌ Model files not found! Please train the model first.")
    print("Run: python train_model_xgboost.py")
    exit()
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit()

# Initialize face detector
detector = MTCNN()

# Use classes from model info or default
classes = model_info.get('classes', ["Oblong", "Oval", "Round", "Square", "Heart"])
uses_scaling = model_info.get('uses_scaling', True)

def extract_face_landmarks_for_prediction(img):
    """Extract facial landmarks from image for prediction"""
    try:
        # Convert to RGB for MTCNN
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Detect face
        results = detector.detect_faces(img_rgb)
        if len(results) == 0:
            return None, None
        
        # Get the most confident detection
        best_result = max(results, key=lambda x: x['confidence'])
        keypoints = best_result['keypoints']
        x, y, width, height = best_result['box']
        
        # Ensure positive dimensions
        x, y = max(0, x), max(0, y)
        width, height = max(1, width), max(1, height)
        
        # Extract landmark coordinates
        left_eye = keypoints['left_eye']
        right_eye = keypoints['right_eye']
        nose = keypoints['nose']
        mouth_left = keypoints['mouth_left']
        mouth_right = keypoints['mouth_right']
        
        # Calculate the same features as in training
        face_ratio = width / height
        jaw_width = abs(mouth_right[0] - mouth_left[0])
        jaw_ratio = jaw_width / height
        eye_distance = abs(right_eye[0] - left_eye[0])
        eye_face_ratio = eye_distance / width
        
        face_center_x = x + width / 2
        left_dist = abs(left_eye[0] - face_center_x)
        right_dist = abs(right_eye[0] - face_center_x)
        symmetry_score = abs(left_dist - right_dist) / width
        
        forehead_y = min(left_eye[1], right_eye[1]) - height * 0.1
        chin_y = max(mouth_left[1], mouth_right[1]) + height * 0.1
        face_height = max(chin_y - forehead_y, height)
        
        nose_mouth_dist = abs(mouth_left[1] - nose[1])
        nose_mouth_ratio = nose_mouth_dist / face_height
        
        cheekbone_width = eye_distance * 1.8
        cheek_jaw_ratio = cheekbone_width / jaw_width if jaw_width > 0 else 1.0
        
        face_area = width * height
        face_perimeter = 2 * (width + height)
        roundness = (4 * np.pi * face_area) / (face_perimeter ** 2) if face_perimeter > 0 else 0
        
        features = [
            face_ratio,
            jaw_ratio,
            cheek_jaw_ratio,
            eye_face_ratio,
            nose_mouth_ratio,
            roundness,
            symmetry_score,
            width / 200.0,
            height / 200.0
        ]
        
        return np.array(features, dtype=np.float32), (x, y, width, height)
        
    except Exception as e:
        print(f"⚠️ Error extracting features: {e}")
        return None, None

def predict_face_shape_command_line(image_path):
    """Predict face shape and display result in command line only"""
    # Load image
    image = cv2.imread(image_path)
    if image is None:
        print(f"❌ Error: Could not read image from {image_path}")
        return
    
    print(f"🖼️  Processing image: {os.path.basename(image_path)}")
    print("🔍 Detecting face...")
    
    # Extract features and face bounding box
    features, bbox = extract_face_landmarks_for_prediction(image)
    
    if features is None:
        print("❌ No face detected in the image!")
        print("💡 Please try with a different image that clearly shows a face")
        return
    
    print("✅ Face detected successfully!")
    print("📊 Analyzing facial features...")
    
    # Process features based on model requirements
    if uses_scaling:
        features_processed = scaler.transform([features])
    else:
        features_processed = [features]
    
    # Predict
    pred_class = model.predict(features_processed)[0]
    pred_proba = model.predict_proba(features_processed)[0]
    confidence = pred_proba[pred_class]
    
    pred_label = classes[pred_class]
    
    # Display results in command line
    print("\n" + "═" * 50)
    print("🎯 FACE SHAPE ANALYSIS RESULT")
    print("═" * 50)
    print(f"📁 Image: {os.path.basename(image_path)}")
    print(f"🤖 Model: {model_info['model_name']}")
    print(f"🎭 Face Shape: {pred_label}")
    print(f"📊 Confidence: {confidence:.2%}")
    print("═" * 50)
    
    # Show all probabilities with visual bars
    print("\n📈 DETAILED PROBABILITIES:")
    max_prob = max(pred_proba)
    for i, prob in enumerate(pred_proba):
        bar = "█" * int(prob * 30)  # Visual bar
        if prob == max_prob:
            print(f"   ▶ {classes[i]}: {prob:.2%} {bar} (Highest)")
        else:
            print(f"     {classes[i]}: {prob:.2%} {bar}")
    
    print(f"\n💡 Result: Your face shape is **{pred_label}**")
    
    return pred_label

def main():
    """Main function - handles image input"""
    print("🤖 FACE SHAPE DETECTOR - COMMAND LINE VERSION")
    print("=" * 50)
    
    # Check command line arguments
    if len(sys.argv) > 1:
        # Use image from command line argument
        img_path = sys.argv[1]
    else:
        # Use default image or ask user
        default_images = ["imgface.png"]
        img_path = None
        
        # Check for default images
        for test_img in default_images:
            if os.path.exists(test_img):
                img_path = test_img
                break
        
        if img_path is None:
            print("❌ No image specified and no default images found!")
            print("\n📝 Usage: python see_xgboost.py <image_path>")
            print("\n💡 Examples:")
            print("   python see_xgboost.py my_face.jpg")
            print("   python see_xgboost.py C:/Users/Name/Pictures/face.png")
            print("\n📌 Or place your image in the same folder and name it:")
            print("   sq.jpg, test.jpg, face.jpg, image.jpg, or photo.jpg")
            return
    
    # Process the image
    predict_face_shape_command_line(img_path)

if __name__ == "__main__":
    main()