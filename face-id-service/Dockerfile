# Dockerfile chuẩn cho Face ID Service
FROM python:3.9-slim

# 1. Cài đặt công cụ biên dịch C++ (để cài dlib)
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 2. Thiết lập thư mục làm việc
WORKDIR /app

# 3. Copy và cài đặt thư viện
COPY requirements.txt .
# Lưu ý: Tăng timeout và no-cache để tránh lỗi mạng khi tải model nặng
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# 4. Copy code
COPY . .

# 5. Mở port (Render sẽ tự map port này)
EXPOSE 5000

# 6. Chạy server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--timeout", "120"]