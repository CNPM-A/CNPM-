FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy file requirements và cài đặt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy full code vào
COPY . .

# Mở port
EXPOSE 5000

# Lệnh chạy server (Dùng Gunicorn cho môi trường Production)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]