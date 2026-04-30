FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    wget \
    gnupg \
    lsb-release \
    software-properties-common

# Add LLVM repo (official script)
RUN wget https://apt.llvm.org/llvm.sh && \
    chmod +x llvm.sh && \
    ./llvm.sh 16   # use LLVM 16 (stable & available)

# Install MLIR tools from that repo
RUN apt-get update && apt-get install -y mlir-16-tools

RUN pip3 install flask flask-cors

WORKDIR /app
COPY . .

EXPOSE 5000

CMD ["python3", "app.py"]
