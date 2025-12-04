# Lệnh này tạo một folder tên là 'venv' chứa môi trường riêng biệt (Tạo Môi trường ảo)
python -m venv venv

# Kích hoạt Môi trường ảo
source venv/bin/activate

pip install "numpy<2.3.0" 

pip install dlib

# Cài đặt các Package
pip install -r requirements.txt

# Cài đặt các mô hình (models) đã được huấn luyện sẵn cho thư viện "bộ não"
pip install --no-cache-dir face_recognition_models