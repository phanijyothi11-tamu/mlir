from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)

MLIR_PATH = "/usr/lib/llvm-16/bin/mlir-opt"

PIPELINE_PRESETS = {
    "canonicalize": "canonicalize",
    "cse": "cse",
    "cleanup": "canonicalize,cse",
    "inline": "inline",
    "interprocedural": "inline,canonicalize,cse"
}

MAX_INPUT_SIZE = 2000
TIMEOUT_SECONDS = 10


def build_pipeline(pipeline):
    if "inline" in pipeline:
        passes = pipeline.split(",")
        remaining = [p for p in passes if p != "inline"]
        if remaining:
            return f"builtin.module(inline, func.func({','.join(remaining)}))"
        return "builtin.module(inline)"
    return f"builtin.module(func.func({pipeline}))"


def run_mlir(mlir_code, pipeline_key, trace=False, expected=None, assignment_mode=False):
    if assignment_mode and pipeline_key not in PIPELINE_PRESETS:
        return {
            "output": "",
            "diagnostics": "Custom pipelines not allowed in assignment mode",
            "trace": [],
            "match": False
        }

    if len(mlir_code) > MAX_INPUT_SIZE:
        return {
            "output": "",
            "diagnostics": "Input too large",
            "trace": [],
            "match": False
        }

    pipeline = PIPELINE_PRESETS.get(pipeline_key, pipeline_key)
    full_pipeline = build_pipeline(pipeline)

    if not os.path.exists(MLIR_PATH):
        return {
            "output": "",
            "diagnostics": f"MLIR not found at {MLIR_PATH}",
            "trace": [],
            "match": False
        }

    file_path = "/tmp/temp.mlir"
    with open(file_path, "w") as f:
        f.write(mlir_code)

    cmd = [MLIR_PATH, file_path, f"-pass-pipeline={full_pipeline}"]

    if trace:
        cmd.append("--mlir-print-ir-after-all")

    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=TIMEOUT_SECONDS
        )

        diagnostics = []
        trace_lines = []

        for line in result.stderr.splitlines():
            if "error:" in line or "warning:" in line:
                diagnostics.append(line)
            else:
                trace_lines.append(line)

        trace_blocks = []
        current_block = {"pass": "Initial", "ir": ""}

        for line in trace_lines:
            if line.startswith("// -----// IR Dump After"):
                if current_block["ir"]:
                    trace_blocks.append(current_block)
                pass_name = line.split("After")[-1].strip()
                current_block = {"pass": pass_name, "ir": ""}
            else:
                current_block["ir"] += line + "\n"

        if current_block["ir"]:
            trace_blocks.append(current_block)

        match_result = expected in result.stdout if expected else None

        return {
            "output": result.stdout.strip(),
            "diagnostics": "\n".join(diagnostics),
            "trace": trace_blocks,
            "match": match_result
        }

    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "diagnostics": "Execution timed out",
            "trace": [],
            "match": False
        }

    except Exception as e:
        return {
            "output": "",
            "diagnostics": str(e),
            "trace": [],
            "match": False
        }


@app.route("/run", methods=["POST"])
def run():
    data = request.json

    return jsonify(run_mlir(
        data.get("mlir", ""),
        data.get("pipeline", "cleanup"),
        data.get("trace", False),
        data.get("expected", None),
        data.get("assignment_mode", False)
    ))


@app.route("/health")
def health():
    return "OK"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
