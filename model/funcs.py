import face_recognition as fr
from PIL import Image
import io
from pathlib import Path
import pickle
import numpy as np
import base64

DEFAULT_ENC_LOC = Path("encodings/enc.pkl")

def encode_face(img_base64):
    image_data = io.BytesIO(base64.b64decode(img_base64.split(",")[1]))
    image = Image.open(image_data)
    image_np = np.array(image)
    return fr.face_encodings(image_np)

def append_new_face_to_model(username, user_imgs_base64):
    encodings = []
    for user_img in user_imgs_base64:
        state = True
        enc = encode_face(user_img)
        for value in enc:
            if value.all() != 0:
                state = False
        if state:
            return False
        encodings.append(enc)


    user_encoding = {"username": username, "encodings": encodings}
    
    with DEFAULT_ENC_LOC.open("rb") as f:
        try:
            encodings_list = pickle.load(f)
        except EOFError:
            encodings_list = []

    with DEFAULT_ENC_LOC.open("wb") as f:
        encodings_list.append(user_encoding)
        pickle.dump(encodings_list, f)

    return True

def recognize_face(img_base64):
    with DEFAULT_ENC_LOC.open("rb") as f:
        encodings = pickle.load(f)
        
    new_enc = encode_face(img_base64)
    matches = {}

    for encoding in encodings:
        matches[encoding["username"]] = [a.all() for a in fr.compare_faces(np.array(encoding["encodings"][0]), new_enc, tolerance=0.6)].count(np.True_)

    sorted_matches = dict(sorted(matches.items(), key=lambda item: item[1]))
    print(sorted_matches)
    username = list(sorted_matches.keys())[-1]

    if sorted_matches[username] != 0:
        return username

    return None

def encode_img(img_path):
    try:
        with open(img_path, "rb") as f:
            b64_bytes = base64.b64encode(f.read())
            return f"data:image/jpeg;base64,{b64_bytes.decode('utf-8')}"
    except FileNotFoundError:
        return None

def train_test_model(name):
    encs = []
    for i in range(3):
        encs.append(encode_img(f'train/{name}/{name}{str(i+1)}.jpg'))
    append_new_face_to_model(name, encs)

if __name__ == "__main__":
    tymon = encode_img("train/tyler.jpg")
    print(recognize_face(tymon))
