
import cv2
import numpy as np
import mediapipe as mp
import os

# Mediapipe Face Mesh setup
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)

classes = ["Oblong", "Oval", "Round", "Square", "Heart"]
DATASET_PATH = "data/face_Training_Set"

def extract_face_landmarks_safe(img_or_path):
    """
    Accept either:
      - img_or_path: path to image (str/PathLike)
      - img_or_path: numpy.ndarray image
    Returns 9D face features or None on failure.
    """
    try:
        # Load image
        if isinstance(img_or_path, np.ndarray):
            img = img_or_path.copy()
            src_name = "uploaded_image"
        else:
            img = cv2.imread(img_or_path)
            src_name = os.path.basename(img_or_path)

        if img is None:
            print(f"❌ Could not read image: {src_name}")
            return None

        # Resize large images to avoid memory issues
        h, w = img.shape[:2]
        max_dim = 600
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            img = cv2.resize(img, (int(w*scale), int(h*scale)))

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect face landmarks
        results = face_mesh.process(img_rgb)
        if not results.multi_face_landmarks:
            print(f"❌ No face detected in: {src_name}")
            return None

        landmarks = results.multi_face_landmarks[0].landmark

        # Map landmarks to image coordinates
        lm_coords = np.array([[int(lm.x*w), int(lm.y*h)] for lm in landmarks])

        # Basic geometric features (similar to your previous 9D features)
        left_eye = np.mean(lm_coords[33:133], axis=0)   # approx left eye
        right_eye = np.mean(lm_coords[362:462], axis=0) # approx right eye
        nose = lm_coords[1]                              # tip of nose
        mouth_left = lm_coords[61]                       # left mouth corner
        mouth_right = lm_coords[291]                     # right mouth corner

        # Bounding box
        x_min, y_min = lm_coords[:,0].min(), lm_coords[:,1].min()
        x_max, y_max = lm_coords[:,0].max(), lm_coords[:,1].max()
        width, height = x_max - x_min, y_max - y_min
        width, height = max(1, width), max(1, height)

        # 9D Features
        face_ratio = width / height
        jaw_width = abs(mouth_right[0] - mouth_left[0])
        jaw_ratio = jaw_width / height
        eye_distance = abs(right_eye[0] - left_eye[0])
        eye_face_ratio = eye_distance / width
        face_center_x = x_min + width / 2.0
        left_dist = abs(left_eye[0] - face_center_x)
        right_dist = abs(right_eye[0] - face_center_x)
        symmetry_score = abs(left_dist - right_dist) / width
        nose_mouth_dist = abs(mouth_left[1] - nose[1])
        nose_mouth_ratio = nose_mouth_dist / height
        cheekbone_width = eye_distance * 1.8
        cheek_jaw_ratio = cheekbone_width / jaw_width if jaw_width > 0 else 1.0
        face_area = width * height
        face_perimeter = 2*(width + height)
        roundness = (4*np.pi*face_area)/(face_perimeter**2) if face_perimeter > 0 else 0.0

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

        return np.array(features, dtype=np.float32)

    except Exception as e:
        print(f"⚠️ Error processing image {img_or_path}: {e}")
        return None

# Example function to process dataset
def process_dataset_safe():
    X, y = [], []
    total_processed, total_skipped = 0, 0

    for label, cls in enumerate(classes):
        folder = os.path.join(DATASET_PATH, cls)
        if not os.path.exists(folder):
            print(f"❌ Folder not found: {folder}")
            continue
        files = [f for f in os.listdir(folder) if f.lower().endswith(('.png','.jpg','.jpeg'))]
        print(f"📁 Processing {cls}: {len(files)} images")
        for fname in files:
            img_path = os.path.join(folder, fname)
            features = extract_face_landmarks_safe(img_path)
            if features is not None:
                X.append(features)
                y.append(label)
                total_processed += 1
            else:
                total_skipped += 1
    if X:
        X = np.array(X)
        y = np.array(y)
        np.save('X_face_features.npy', X)
        np.save('y_face_labels.npy', y)
        print(f"✅ Dataset ready. Processed: {total_processed}, Skipped: {total_skipped}")
        return True
    else:
        print("❌ No features extracted!")
        return False

if __name__ == "__main__":
    process_dataset_safe()














































































#OLD 

# import cv2
# import os
# import numpy as np
# from mtcnn import MTCNN
# import gc

# DATASET_PATH = "data/train"
# classes = ["Oblong", "Oval", "Round", "Square", "Heart"]

# # Simple MTCNN initialization - no parameters to avoid errors
# detector = MTCNN()

# def extract_face_landmarks_safe(img_path):
#     """Extract facial landmarks with memory safety"""
#     try:
#         img = cv2.imread(img_path)
#         if img is None:
#             print(f"❌ Could not read image: {img_path}")
#             return None
        
#         # Resize large images to prevent memory issues
#         h, w = img.shape[:2]
#         max_dim = 600
#         if w > max_dim or h > max_dim:
#             scale = min(max_dim/w, max_dim/h)
#             new_w, new_h = int(w * scale), int(h * scale)
#             img = cv2.resize(img, (new_w, new_h))
        
#         # Convert to RGB for MTCNN
#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
#         # Detect face with error handling
#         results = detector.detect_faces(img_rgb)
#         if len(results) == 0:
#             print(f"❌ No face detected in: {os.path.basename(img_path)}")
#             return None
        
#         # Get the most confident detection only
#         best_result = max(results, key=lambda x: x['confidence'])
#         keypoints = best_result['keypoints']
#         x, y, width, height = best_result['box']
        
#         # Ensure positive dimensions
#         width, height = max(1, width), max(1, height)
        
#         # Extract landmark coordinates
#         left_eye = keypoints['left_eye']
#         right_eye = keypoints['right_eye']
#         nose = keypoints['nose']
#         mouth_left = keypoints['mouth_left']
#         mouth_right = keypoints['mouth_right']
        
#         # Calculate geometric features
#         features = []
        
#         # 1. Face aspect ratio
#         face_ratio = width / height
        
#         # 2. Jaw width to face height ratio
#         jaw_width = abs(mouth_right[0] - mouth_left[0])
#         jaw_ratio = jaw_width / height
        
#         # 3. Eye distance to face width ratio
#         eye_distance = abs(right_eye[0] - left_eye[0])
#         eye_face_ratio = eye_distance / width
        
#         # 4. Face symmetry
#         face_center_x = x + width / 2
#         left_dist = abs(left_eye[0] - face_center_x)
#         right_dist = abs(right_eye[0] - face_center_x)
#         symmetry_score = abs(left_dist - right_dist) / width
        
#         # 5. Vertical proportions
#         forehead_y = min(left_eye[1], right_eye[1]) - height * 0.1
#         chin_y = max(mouth_left[1], mouth_right[1]) + height * 0.1
#         face_height = max(chin_y - forehead_y, height)
        
#         # 6. Nose to mouth distance ratio
#         nose_mouth_dist = abs(mouth_left[1] - nose[1])
#         nose_mouth_ratio = nose_mouth_dist / face_height
        
#         # 7. Cheekbone approximation
#         cheekbone_width = eye_distance * 1.8
#         cheek_jaw_ratio = cheekbone_width / jaw_width if jaw_width > 0 else 1.0
        
#         # 8. Face roundness
#         face_area = width * height
#         face_perimeter = 2 * (width + height)
#         roundness = (4 * np.pi * face_area) / (face_perimeter ** 2) if face_perimeter > 0 else 0
        
#         features = [
#             face_ratio,
#             jaw_ratio,
#             cheek_jaw_ratio,
#             eye_face_ratio,
#             nose_mouth_ratio,
#             roundness,
#             symmetry_score,
#             width / 200.0,
#             height / 200.0
#         ]
        
#         print(f"✅ Extracted features from {os.path.basename(img_path)}")
#         return np.array(features, dtype=np.float32)
        
#     except Exception as e:
#         print(f"⚠️ Error processing {os.path.basename(img_path)}: {str(e)}")
#         return None


# def extract_face_landmarks_safe_from_img(img):
#     """Extract facial features directly from an already loaded OpenCV image."""
#     try:
#         if img is None:
#             print("❌ No image data provided")
#             return None

#         h, w = img.shape[:2]
#         max_dim = 600
#         if w > max_dim or h > max_dim:
#             scale = min(max_dim / w, max_dim / h)
#             new_w, new_h = int(w * scale), int(h * scale)
#             img = cv2.resize(img, (new_w, new_h))

#         img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#         results = detector.detect_faces(img_rgb)
#         if len(results) == 0:
#             print("❌ No face detected in uploaded image")
#             return None

#         best_result = max(results, key=lambda x: x['confidence'])
#         keypoints = best_result['keypoints']
#         x, y, width, height = best_result['box']

#         width, height = max(1, width), max(1, height)
#         left_eye = keypoints['left_eye']
#         right_eye = keypoints['right_eye']
#         nose = keypoints['nose']
#         mouth_left = keypoints['mouth_left']
#         mouth_right = keypoints['mouth_right']

#         # Calculate same geometric features as before
#         face_ratio = width / height
#         jaw_width = abs(mouth_right[0] - mouth_left[0])
#         jaw_ratio = jaw_width / height
#         eye_distance = abs(right_eye[0] - left_eye[0])
#         eye_face_ratio = eye_distance / width
#         face_center_x = x + width / 2
#         left_dist = abs(left_eye[0] - face_center_x)
#         right_dist = abs(right_eye[0] - face_center_x)
#         symmetry_score = abs(left_dist - right_dist) / width
#         forehead_y = min(left_eye[1], right_eye[1]) - height * 0.1
#         chin_y = max(mouth_left[1], mouth_right[1]) + height * 0.1
#         face_height = max(chin_y - forehead_y, height)
#         nose_mouth_dist = abs(mouth_left[1] - nose[1])
#         nose_mouth_ratio = nose_mouth_dist / face_height
#         cheekbone_width = eye_distance * 1.8
#         cheek_jaw_ratio = cheekbone_width / jaw_width if jaw_width > 0 else 1.0
#         face_area = width * height
#         face_perimeter = 2 * (width + height)
#         roundness = (4 * np.pi * face_area) / (face_perimeter ** 2) if face_perimeter > 0 else 0

#         features = [
#             face_ratio, jaw_ratio, cheek_jaw_ratio, eye_face_ratio,
#             nose_mouth_ratio, roundness, symmetry_score,
#             width / 200.0, height / 200.0
#         ]

#         print("✅ Extracted face features from image upload")
#         return np.array(features, dtype=np.float32)

#     except Exception as e:
#         print(f"⚠️ Error extracting from uploaded image: {e}")
#         return None


# def process_dataset_safe():
#     """Process dataset with memory management"""
#     X = []
#     y = []
    
#     print("🔄 Processing dataset with MEMORY-SAFE face landmarks...")
    
#     total_processed = 0
#     total_skipped = 0
    
#     for label, cls in enumerate(classes):
#         folder = os.path.join(DATASET_PATH, cls)
#         if not os.path.exists(folder):
#             print(f"❌ Folder not found: {folder}")
#             continue
            
#         print(f"📁 Processing {cls}...")
#         count = 0
#         skipped = 0
        
#         # Get image files
#         image_files = [f for f in os.listdir(folder) 
#                       if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
#         print(f"   Found {len(image_files)} images")
        
#         # Process in smaller batches with garbage collection
#         batch_size = 20
#         max_images = 200
        
#         for i in range(0, min(max_images, len(image_files)), batch_size):
#             batch_files = image_files[i:i + batch_size]
            
#             for filename in batch_files:
#                 if count >= max_images:
#                     break
                    
#                 file_path = os.path.join(folder, filename)
#                 features = extract_face_landmarks_safe(file_path)
                
#                 if features is not None:
#                     X.append(features)
#                     y.append(label)
#                     count += 1
#                     total_processed += 1
#                 else:
#                     skipped += 1
#                     total_skipped += 1
            
#             # Clear memory after each batch
#             gc.collect()
            
#             if count > 0 and count % 20 == 0:
#                 print(f"   Processed {count} images, skipped {skipped}...")
        
#         print(f"✅ {cls}: {count} successful, {skipped} failed")
    
#     # Convert to numpy arrays if we have data
#     if X:
#         X = np.array(X)
#         y = np.array(y)
        
#         print(f"\n✅ Dataset prepared successfully:")
#         print(f"Features shape: {X.shape}")
#         print(f"Labels shape: {y.shape}")
#         print(f"Class distribution: {np.bincount(y)}")
#         print(f"Total processed: {total_processed}, Total skipped: {total_skipped}")
        
#         # Save the data
#         np.save('X_face_features.npy', X)
#         np.save('y_face_labels.npy', y)
#         print("💾 Features saved to X_face_features.npy and y_face_labels.npy")
        
#         return True
#     else:
#         print("❌ No features were extracted! Check your dataset and MTCNN installation.")
#         return False

# def load_existing_data():
#     """Load existing preprocessed data"""
#     try:
#         X = np.load('X_face_features.npy')
#         y = np.load('y_face_labels.npy')
#         print(f"✅ Loaded existing data: X{X.shape}, y{y.shape}")
#         return X, y
#     except:
#         print("❌ No existing data found. Please run preprocessing first.")
#         return None, None

# if __name__ == "__main__":
#     print("🚀 FACE SHAPE DETECTION - DATA PREPROCESSING")
#     print("=" * 50)
    
#     # Try to load existing data first
#     existing_X, existing_y = load_existing_data()
    
#     if existing_X is not None:
#         print("✅ Using existing preprocessed data")
#     else:
#         # If no existing data, process new data
#         print("🔄 Starting new data processing...")
#         success = process_dataset_safe()
#         if success:
#             print("\n🎊 PREPROCESSING COMPLETED! Ready for training.")
#         else:
#             print("\n💥 PREPROCESSING FAILED! Check the issues above.")