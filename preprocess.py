






import cv2
import os
import numpy as np

# Path to your dataset
DATASET_PATH = "data/train"

# Classes (folder names)
classes = ["light", "medium", "dark"]

# Lists to hold features and labels
X = []
y = []

# Function to extract histogram + mean HSV features
def extract_features(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return None
    
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Skin color range
    lower = np.array([0, 40, 60], dtype="uint8")
    upper = np.array([25, 255, 255], dtype="uint8")
    mask = cv2.inRange(hsv, lower, upper)

    skin = cv2.bitwise_and(hsv, hsv, mask=mask)

    # Mean HSV values
    mean_vals = cv2.mean(skin, mask=mask)[:3]  # (H, S, V)

    # Histograms (16 bins each for H, S, V → 48 features)
    h_hist = cv2.calcHist([skin], [0], mask, [16], [0, 180])
    s_hist = cv2.calcHist([skin], [1], mask, [16], [0, 256])
    v_hist = cv2.calcHist([skin], [2], mask, [16], [0, 256])

    # Normalize histograms
    h_hist = cv2.normalize(h_hist, h_hist).flatten()
    s_hist = cv2.normalize(s_hist, s_hist).flatten()
    v_hist = cv2.normalize(v_hist, v_hist).flatten()

    # Final feature vector = mean HSV (3) + histograms (48) → 51 features
    features = np.concatenate([mean_vals, h_hist, s_hist, v_hist])
    return features


def extract_features_from_img(img):
    """Extract features directly from an OpenCV image instead of a file path."""
    try:
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower = np.array([0, 40, 60], dtype="uint8")
        upper = np.array([25, 255, 255], dtype="uint8")
        mask = cv2.inRange(hsv, lower, upper)
        skin = cv2.bitwise_and(hsv, hsv, mask=mask)
        mean_vals = cv2.mean(skin, mask=mask)[:3]
        h_hist = cv2.calcHist([skin], [0], mask, [16], [0, 180])
        s_hist = cv2.calcHist([skin], [1], mask, [16], [0, 256])
        v_hist = cv2.calcHist([skin], [2], mask, [16], [0, 256])
        h_hist = cv2.normalize(h_hist, h_hist).flatten()
        s_hist = cv2.normalize(s_hist, s_hist).flatten()
        v_hist = cv2.normalize(v_hist, v_hist).flatten()
        features = np.concatenate([mean_vals, h_hist, s_hist, v_hist])
        print("✅ Extracted skin features from uploaded image")
        return features
    except Exception as e:
        print(f"⚠️ Error extracting skin features: {e}")
        return None


# Loop through dataset
for label, cls in enumerate(classes):
    folder = os.path.join(DATASET_PATH, cls)
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        features = extract_features(file_path)
        if features is not None:
            X.append(features)
            y.append(label)

X = np.array(X)
y = np.array(y)

print("Dataset prepared with mean HSV + histogram features:")
print("Features shape:", X.shape)  # should be (num_samples, 51)
print("Labels shape:", y.shape)
















































































#OLD



# import cv2
# import os
# import numpy as np

# # Path to your dataset
# DATASET_PATH = "data/train"

# # Classes (folder names)
# classes = ["light", "medium", "dark"]

# # Lists to hold features and labels
# X = []
# y = []

# # Function to extract histogram + mean HSV features
# def extract_features(img_path):
#     img = cv2.imread(img_path)
#     if img is None:
#         return None
    
#     hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

#     # Skin color range
#     lower = np.array([0, 40, 60], dtype="uint8")
#     upper = np.array([25, 255, 255], dtype="uint8")
#     mask = cv2.inRange(hsv, lower, upper)

#     skin = cv2.bitwise_and(hsv, hsv, mask=mask)

#     # Mean HSV values
#     mean_vals = cv2.mean(skin, mask=mask)[:3]  # (H, S, V)

#     # Histograms (16 bins each for H, S, V → 48 features)
#     h_hist = cv2.calcHist([skin], [0], mask, [16], [0, 180])
#     s_hist = cv2.calcHist([skin], [1], mask, [16], [0, 256])
#     v_hist = cv2.calcHist([skin], [2], mask, [16], [0, 256])

#     # Normalize histograms
#     h_hist = cv2.normalize(h_hist, h_hist).flatten()
#     s_hist = cv2.normalize(s_hist, s_hist).flatten()
#     v_hist = cv2.normalize(v_hist, v_hist).flatten()

#     # Final feature vector = mean HSV (3) + histograms (48) → 51 features
#     features = np.concatenate([mean_vals, h_hist, s_hist, v_hist])
#     return features


# def extract_features_from_img(img):
#     """Extract features directly from an OpenCV image instead of a file path."""
#     try:
#         hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
#         lower = np.array([0, 40, 60], dtype="uint8")
#         upper = np.array([25, 255, 255], dtype="uint8")
#         mask = cv2.inRange(hsv, lower, upper)
#         skin = cv2.bitwise_and(hsv, hsv, mask=mask)
#         mean_vals = cv2.mean(skin, mask=mask)[:3]
#         h_hist = cv2.calcHist([skin], [0], mask, [16], [0, 180])
#         s_hist = cv2.calcHist([skin], [1], mask, [16], [0, 256])
#         v_hist = cv2.calcHist([skin], [2], mask, [16], [0, 256])
#         h_hist = cv2.normalize(h_hist, h_hist).flatten()
#         s_hist = cv2.normalize(s_hist, s_hist).flatten()
#         v_hist = cv2.normalize(v_hist, v_hist).flatten()
#         features = np.concatenate([mean_vals, h_hist, s_hist, v_hist])
#         print("✅ Extracted skin features from uploaded image")
#         return features
#     except Exception as e:
#         print(f"⚠️ Error extracting skin features: {e}")
#         return None


# # Loop through dataset
# for label, cls in enumerate(classes):
#     folder = os.path.join(DATASET_PATH, cls)
#     for filename in os.listdir(folder):
#         file_path = os.path.join(folder, filename)
#         features = extract_features(file_path)
#         if features is not None:
#             X.append(features)
#             y.append(label)

# X = np.array(X)
# y = np.array(y)

# print("Dataset prepared with mean HSV + histogram features:")
# print("Features shape:", X.shape)  # should be (num_samples, 51)
# print("Labels shape:", y.shape)


