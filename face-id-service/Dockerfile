# 1. Dùng bản Bullseye (Ổn định nhất cho dlib/opencv)
FROM python:3.9-slim-bullseye

# 2. Thiết lập môi trường để không bị hỏi Yes/No khi cài
ENV DEBIAN_FRONTEND=noninteractive

# 3. Cài đặt thư viện hệ thống (Thêm clean và fix-missing để chống lỗi mạng)
RUN apt-get clean && \
    apt-get update --fix-missing && \
    apt-get install -y --no-install-recommends \
    cmake \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. Setup App
WORKDIR /app

# 5. Copy và cài đặt thư viện
COPY requirements.txt .

# 6. Cài thư viện Python (Tăng timeout để tải dlib 100MB không bị ngắt)
RUN pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

# 7. Copy code
COPY . .

# 8. Mở port (Render sẽ tự map port này)
EXPOSE 5000

# 9. Tăng timeout cho Gunicorn (để AI có thời gian xử lý ảnh nặng)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--timeout", "120"]