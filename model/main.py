from flask import Flask, request, jsonify
from funcs import *

app = Flask(__name__)

@app.route("/add_to_model", methods=["POST"])
def add_to_model():
    contents = request.json
    res = append_new_face_to_model(contents["username"], contents["photos"])
    if res:
        return jsonify({"status": "success"})

    return jsonify({"status": "error"})

@app.route("/match", methods=["POST"])
def match():
    contents = request.json
    username = recognize_face(contents["photo"], None)
    if username != contents["username"] or username is None:
        return jsonify({"status": "error"})

    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000, debug=True)
