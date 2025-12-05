# Dùng bản Python 3.9 Slim (nhẹ và ổn định)
FROM python:3.9-slim-bullseye

# 1. Cài thư viện hệ thống cơ bản (Vẫn cần cho opencv)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy file cấu hình
COPY requirements.txt .

# 3. CÀI ĐẶT THÔNG MINH (Tránh build dlib gốc)
# Bước A: Cài dlib-bin trước (Bản đã biên dịch, cài vèo cái là xong)
RUN pip install dlib-bin==19.24.2

# Bước B: Cài các thư viện phụ trợ khác
RUN pip install numpy<2.0.0 face_recognition_models==0.3.0 Pillow Click flask flask-cors gunicorn python-dotenv opencv-python-headless setuptools

# Bước C: Cài face_recognition nhưng CẤM nó cài dependencies (vì ta đã cài dlib-bin ở trên rồi)
# Nếu không có --no-deps, nó sẽ thấy thiếu 'dlib' (tên gốc) và lại lôi về build -> Lại lỗi OOM.
RUN pip install --no-deps face_recognition==1.3.0

# 4. Copy code
COPY . .

EXPOSE 5000

# 5. Chạy server (Tăng timeout lên để AI xử lý kịp)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--timeout", "120"]