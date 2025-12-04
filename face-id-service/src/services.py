import face_recognition
import numpy as np

def get_face_encoding_from_image(image_file):
    try:
        # Đọc ảnh từ file upload
        image = face_recognition.load_image_file(image_file)

        # Tìm khuôn mặt(có thể 1 hoặc nhiều trên 1 image), mã hóa, trả về mảng numpy 128 số
        # [ <mã hóa mặt người 1>, <mã hóa mặt người 2>, <mã hóa mặt người 3> ]
        encodings = face_recognition.face_encodings(image)

        if len(encodings) == 0:
            return None
        if len(encodings) > 1:
            # Trả về một lỗi cụ thể ở đây
            # ví dụ: raise ValueError("Ảnh chứa nhiều hơn một khuôn mặt")
            # Hoặc return một mã lỗi đặc biệt
            return "MULTIPLE_FACES_ERROR" 

        # encodings[0] có ý nghĩa là <mã hóa mặt người 1>
        return encodings[0].tolist() # Chuyển numpy array thành list thường để trả JSON
    except Exception as e:
        print(f"Lỗi xử lý ảnh: {e}")
        return None

def find_best_match_in_db(unknown_encoding, know_faces_db):
    # known_faces_db: List các object [{'studentId': '1', 'encoding': [...]}, ...]
    if not know_faces_db:
        return None
    
    known_encodings = [np.array(face['encoding']) for face in know_faces_db]
    student_ids = [face['studentId'] for face in know_faces_db]

    # numpy array sai số
    distance = face_recognition.face_distance(known_encodings, np.array(unknown_encoding))

    # Tìm vị trí có sai số nhỏ nhất
    best_match_index = np.argmin(distance)
    min_distance = distance[best_match_index]

    if (min_distance < 0.5):
        return {
            "studentId": student_ids[best_match_index],
            "confidence": round((1 - min_distance), 2) # Độ tin cậy
        }
    return None
