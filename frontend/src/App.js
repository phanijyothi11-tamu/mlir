import Editor from "@monaco-editor/react";
import { useState } from "react";

function App() {

  const [code, setCode] = useState(`func.func @main(%arg0: i32) -> i32 {
  %c1 = arith.constant 1 : i32
  %0 = arith.addi %arg0, %c1 : i32
  return %0 : i32
}`);

  const [pipeline, setPipeline] = useState("cleanup");
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const [trace, setTrace] = useState(true);
  const [assignmentMode, setAssignmentMode] = useState(true);
  const [expected, setExpected] = useState("");

  const [output, setOutput] = useState("");
  const [diagnostics, setDiagnostics] = useState("");
  const [traceBlocks, setTraceBlocks] = useState([]);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "40px",
        height: "20px",
        borderRadius: "20px",
        background: checked ? "#2563eb" : "#ccc",
        position: "relative",
        cursor: "pointer"
      }}
    >
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: "1px",
          left: checked ? "20px" : "2px"
        }}
      />
    </div>
  );

  const runCode = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/run", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          mlir: code,
          pipeline: useCustom ? custom : pipeline,
          trace,
          expected,
          assignment_mode: assignmentMode
        })
      });

      const data = await res.json();

      setOutput(data.output);
      setDiagnostics(data.diagnostics);
      setTraceBlocks(data.trace || []);
      setMatch(data.match);

    } catch {
      setDiagnostics("Connection failed");
    }

    setLoading(false);
  };

  const getDescription = () => {
    if (pipeline === "cleanup") return "Simplifies code by removing redundant operations.";
    if (pipeline === "interprocedural") return "Inlines functions and optimizes across them.";
    if (pipeline === "canonicalize") return "Rewrites operations into standard form.";
    if (pipeline === "cse") return "Eliminates duplicate computations.";
    return "";
  };

  return (
    <div style={{padding:20, fontFamily:"sans-serif", background:"#f4f6f8"}}>

      <h1>🚀 MLIR Playground</h1>

      <div style={{background:"#fff", padding:15, borderRadius:10, marginBottom:15}}>

        <div style={{display:"flex", gap:10, flexWrap:"wrap", alignItems:"center"}}>

          <select onChange={e=>setUseCustom(e.target.value==="custom")}>
            <option value="preset">Preset</option>
            <option value="custom">Custom</option>
          </select>

          {!useCustom ? (
            <select value={pipeline} onChange={e=>setPipeline(e.target.value)}>
              <option value="cleanup">Cleanup (Simplify)</option>
              <option value="interprocedural">Interprocedural (Inline + Optimize)</option>
              <option value="canonicalize">Canonicalize</option>
              <option value="cse">CSE</option>
            </select>
          ) : (
            <input
              value={custom}
              onChange={e=>setCustom(e.target.value)}
              placeholder="e.g. canonicalize,cse"
            />
          )}

          <div style={{display:"flex", alignItems:"center", gap:5}}>
            <Toggle checked={trace} onChange={setTrace}/>
            <span>Teaching Mode</span>
          </div>

          <div style={{display:"flex", alignItems:"center", gap:5}}>
            <Toggle checked={assignmentMode} onChange={setAssignmentMode}/>
            <span>Assignment Mode</span>
          </div>

          <button
  onClick={runCode}
  disabled={loading}
  style={{
    padding: "8px 18px",
    borderRadius: "8px",
    border: "none",
    background: loading ? "#93c5fd" : "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.2s ease"
  }}
  onMouseOver={e => {
    if (!loading) e.target.style.background = "#1d4ed8";
  }}
  onMouseOut={e => {
    if (!loading) e.target.style.background = "#2563eb";
  }}
>
  {loading ? "Running..." : "Run"}
</button>
        </div>

        <p style={{fontSize:12, color:"#555", marginTop:8}}>
          {getDescription()}
        </p>

        <input
          placeholder="Expected output pattern"
          value={expected}
          onChange={e=>setExpected(e.target.value)}
          style={{marginTop:10, width:"100%"}}
        />

        {match !== null && (
          <p style={{color: match ? "green" : "red"}}>
            {match ? "✔ Match" : "✘ No Match"}
          </p>
        )}
      </div>

      <div style={{display:"flex", gap:15}}>

        <div style={{flex:1}}>
          <div style={{background:"#fff", padding:10, borderRadius:10}}>
            <h3>Editor</h3>
            <Editor height="350px" value={code} onChange={setCode}/>
          </div>
        </div>

        <div style={{flex:1}}>

          <div style={{background:"#fff", padding:10, borderRadius:10, marginBottom:10}}>
            <h3>Output</h3>
            <pre>{output}</pre>
          </div>

          <div style={{background:"#fff", padding:10, borderRadius:10, marginBottom:10}}>
            <h3>Diagnostics</h3>
            <pre style={{color:"red"}}>{diagnostics}</pre>
          </div>

          <div style={{background:"#fff", padding:10, borderRadius:10}}>
            <h3>Trace</h3>

            {traceBlocks.length === 0 ? (
              <p>Enable Teaching Mode to see steps</p>
            ) : (
              traceBlocks.map((b,i)=>(
                <details key={i}>
                  <summary>{b.pass}</summary>
                  <pre>{b.ir}</pre>
                </details>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
