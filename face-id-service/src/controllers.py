from flask import jsonify
import json
from src.services import get_face_encoding_from_image, find_best_match_in_db

def register_face(request):
    if 'file' not in request.files:
        return jsonify({"error": "Chưa cung cấp file"}), 400

    file = request.files['file']

    encoding = get_face_encoding_from_image(file)

    if encoding is None:
        return jsonify({"error": "Không tìm thấy khuôn mặt nào trong ảnh"}), 400

    if encoding == "MULTIPLE_FACES_ERROR":
        return jsonify({"error": "Ảnh chứa nhiều khuôn mặt. Vui lòng tải lên ảnh chân dung chỉ có một người"}), 400

    return jsonify({
        "status": "success",
        "encoding": encoding
    })
    
def recognize_face(request):
    if 'file' not in request.files:
        return jsonify({"error": "Chưa cung cấp file"}), 400
        
    # Python stateless (No DB), nhờ nodeJS gửi data qua form.
    if 'known_faces' not in request.form:
        return jsonify({"error": "Thiếu dữ liệu known_faces"}), 400

    file = request.files['file']

    try:
        # Công dụng của json.loads(): (Load String -> Python List/Dict)
        # const faces = [{ studentId: "A", encoding: [0.1, 0.2] }];
        # JSON.stringify(faces)
        # const stringToSend = '[{"studentId":"A","encoding":[0.1,0.2]}]';
        # request.form['known_faces'] = stringToSend
        # Output json.loads(request.form['known_faces']):
        # [
        #   { 'studentId': 'A', 'encoding': [0.1, 0.2] }
        # ]
        known_faces_db = json.loads(request.form['known_faces'])
    except:
        return jsonify({"error": "Dữ liệu known_faces sai định dạng"}), 400
    
    # Lấy encoding ảnh mới
    unknown_encoding = get_face_encoding_from_image(file)

    if unknown_encoding is None:
        return jsonify({"error": "Không tìm thấy khuôn mặt nào trong ảnh để so sánh"}), 400
    
    if unknown_encoding == "MULTIPLE_FACES_ERROR":
        return jsonify({"error": "Ảnh chứa nhiều khuôn mặt. Vui lòng chỉ nhận diện một người mỗi lần"}), 400
    
    match_result = find_best_match_in_db(unknown_encoding, known_faces_db)

    if match_result:
        return jsonify({
            "status": "success",
            "data": match_result
        })
    else:
        return jsonify({
            "status": "fail",
            "message": "Không nhận diện được học sinh (Người lạ à?)"
        }), 404