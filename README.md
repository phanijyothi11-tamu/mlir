# 🚀 MLIR Playground

MLIR Playground is an interactive web-based system for experimenting with MLIR (Multi-Level Intermediate Representation) pipelines. It enables users to execute compiler passes, visualize transformations, and understand optimization behavior step-by-step.

---

## 📌 Overview

Modern compiler education requires understanding intermediate representations (IR), transformation passes, and optimization pipelines. MLIR provides powerful abstractions but is difficult to use due to command-line tooling and complex setup.

This project simplifies the process by providing a browser-based interface to:

- Run MLIR code
- Apply optimization pipelines
- Visualize IR transformations
- Debug errors with clear diagnostics

---

## ✨ Features

- Execute MLIR code using preset pipelines  
- Support for custom pipelines  
- Teaching Mode: view IR after each pass  
- Assignment Mode: restrict execution to preset pipelines  
- Clear diagnostics for syntax and semantic errors  
- Docker-based backend (no MLIR installation required)  
- Interactive UI using React  

---

## 🏗️ Project Structure

    mlir/
    │
    ├── backend/
    │   ├── app.py
    │   └── requirements.txt
    │
    ├── frontend/
    │   ├── src/
    │   │   └── App.js
    │   ├── public/
    │   ├── package.json
    │   └── package-lock.json
    │
    ├── Dockerfile
    ├── README.md
    └── .gitignore

---

## ⚙️ Prerequisites

Make sure you have:

- Git  
- Docker  
- Node.js and npm  

---

## 📦 Setup Instructions

### 1. Clone the repository

    git clone https://github.com/phanijyothi11-tamu/mlir.git
    cd mlir

---

### 2. Backend Setup (Docker)

The backend includes the MLIR toolchain inside Docker.  
No separate MLIR installation is required.

    docker build -t mlir-playground .
    docker run -p 5000:5000 mlir-playground

Backend runs at:

    http://localhost:5000

---

### 3. Frontend Setup

    cd frontend
    npm install
    npm start

Frontend runs at:

    http://localhost:3000

---

### 4. Running the Application

1. Open http://localhost:3000  
2. Enter MLIR code in the editor  
3. Select a pipeline  
4. Enable modes (optional)  
5. Click Run  

---

## 👩‍💻 Author

Phani Jyothi Kurada  
Texas A&M University  
Spring 2026
