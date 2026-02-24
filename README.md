# 🧠 MLIR Playground – Interactive Compiler IR Visualization Platform

MLIR Playground is an interactive platform designed to help students and developers understand compiler intermediate representations (IR) and transformation pipelines through real-time experimentation.

---

## 🚀 Overview

Modern compiler frameworks like MLIR are powerful but difficult to learn due to complex toolchains and lack of visibility into intermediate transformations.

This project provides a **web-based playground** where users can:
- Write MLIR code
- Apply compiler pass pipelines
- Visualize IR transformations step-by-step

---

## 💡 Motivation

- Compiler IR transformations are hard to visualize
- MLIR toolchain setup is complex
- Students lack intuitive understanding of pass pipelines

This project enables **interactive learning similar to Compiler Explorer**.

---

## ✨ Key Features

- 🔹 Real-time MLIR execution using `mlir-opt`
- 🔹 Pass-by-pass IR visualization (trace mode)
- 🔹 Predefined pipeline presets (canonicalize, CSE, etc.)
- 🔹 Error diagnostics and debugging support
- 🔹 Interactive UI with Monaco editor
- 🔹 Safe execution with timeouts and input limits

---

## 🏗️ Architecture

### Backend
- C++ (HTTP server)
- Executes MLIR pipelines via `mlir-opt`
- Returns structured IR outputs and diagnostics

### Frontend
- React + Monaco Editor
- Pipeline selector + output panels
- Step-by-step IR visualization

### Execution
- Local MLIR toolchain / Docker sandbox

---

## 🔄 Workflow

1. Write MLIR code
2. Select pipeline (or custom)
3. Run execution
4. View:
   - Final IR
   - Errors/diagnostics
   - IR after each pass (trace mode)

---

## 🧠 Tech Stack

- C++17
- LLVM / MLIR
- React
- Monaco Editor
- Docker (optional)

---

## ⚙️ How to Run

```bash
# Clone repo
git clone https://github.com/yourusername/mlir-playground.git
cd mlir-playground

# Setup MLIR toolchain (LLVM required)

# Run backend
./server

# Run frontend
cd frontend
npm install
npm run dev
