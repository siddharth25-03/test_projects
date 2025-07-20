import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";

const executeWithLogging = (funcCode, callStr) => {
  const callLog = [];
  let callId = 0;

  try {
    // Extract function name
    const match = funcCode.match(/function\s+(\w+)\s*\(/);
    if (!match) throw new Error("Couldn't parse function name.");
    const funcName = match[1];

    // Create instrumented version of the function
    const funcBodyModified = funcCode.replace(
      `function ${funcName}(`,
      `function ${funcName}Impl(`
    );

    const wrappedCode = `
      const callLog = [];
      let callId = 0;
      let callStack = [];

      const logWrapper = (fn) => {
        return (...args) => {
          const currentId = callId++;
          const parentId = callStack.length > 0 ? callStack[callStack.length - 1] : null;
          
          // Log the call start
          callLog.push({ 
            id: currentId, 
            args: args.slice(), 
            parent: parentId,
            phase: 'call',
            timestamp: Date.now()
          });
          
          callStack.push(currentId);
          const result = fn(...args);
          callStack.pop();
          
          // Log the return
          callLog.push({
            id: currentId,
            args: args.slice(),
            parent: parentId,
            result: result,
            phase: 'return',
            timestamp: Date.now()
          });
          
          return result;
        };
      };

      ${funcBodyModified}

      const ${funcName} = logWrapper(${funcName}Impl);
      const finalResult = ${callStr};
      return { callLog, finalResult };
    `;

    const result = new Function(wrappedCode)();
    return result.callLog;
  } catch (err) {
    console.error("Execution error:", err);
    return [];
  }
};

const buildTreeFromLog = (log, maxStep) => {
  if (log.length === 0) return null;

  const nodeMap = new Map();
  const processedCalls = new Set();
  
  // Process calls up to maxStep
  for (let i = 0; i <= maxStep && i < log.length; i++) {
    const call = log[i];
    if (!call || call.id === undefined) continue;
    
    if (call.phase === 'call' && !processedCalls.has(call.id)) {
      processedCalls.add(call.id);
      nodeMap.set(call.id, {
        name: `${call.args.join(", ")}`,
        attributes: { 
          status: "calling...",
          phase: "call"
        },
        children: [],
        id: call.id
      });
    } else if (call.phase === 'return' && nodeMap.has(call.id)) {
      // Update existing node with return value
      const node = nodeMap.get(call.id);
      node.attributes = { 
        return: `→ ${call.result}`,
        phase: "return"
      };
    }
  }

  // Build tree structure
  let root = null;
  for (let [id, node] of nodeMap) {
    const callEntry = log.find(entry => entry.id === id && entry.phase === 'call');
    if (callEntry && callEntry.parent !== null && nodeMap.has(callEntry.parent)) {
      nodeMap.get(callEntry.parent).children.push(node);
    } else if (callEntry && callEntry.parent === null) {
      root = node;
    }
  }

  return root;
};

const demoFunctions = {
  fibonacci: {
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    call: "fibonacci(5)",
    description: "Classic Fibonacci sequence - great for seeing binary recursion"
  },
  factorial: {
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    call: "factorial(5)",
    description: "Factorial calculation - linear recursion example"
  },
  power: {
    code: `function power(base, exp) {
  if (exp === 0) return 1;
  if (exp === 1) return base;
  return base * power(base, exp - 1);
}`,
    call: "power(2, 4)",
    description: "Power calculation - another linear recursion"
  },
  gcd: {
    code: `function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}`,
    call: "gcd(48, 18)",
    description: "Greatest Common Divisor using Euclidean algorithm"
  },
  hanoi: {
    code: `function hanoiMoves(n) {
  if (n === 1) return 1;
  return 2 * hanoiMoves(n - 1) + 1;
}`,
    call: "hanoiMoves(4)",
    description: "Tower of Hanoi moves calculation"
  },
  binarySearch: {
    code: `function binarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] > target) return binarySearch(arr, target, left, mid - 1);
  return binarySearch(arr, target, mid + 1, right);
}`,
    call: "binarySearch([1,3,5,7,9,11,13], 7)",
    description: "Binary search algorithm - divide and conquer"
  }
};

export default function TreeVisualizer() {
  const [funcCode, setFuncCode] = useState(demoFunctions.fibonacci.code);
  const [funcCall, setFuncCall] = useState(demoFunctions.fibonacci.call);
  const [selectedDemo, setSelectedDemo] = useState('fibonacci');
  const [callLog, setCallLog] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800);

  const handleDemoChange = (demoKey) => {
    setSelectedDemo(demoKey);
    setFuncCode(demoFunctions[demoKey].code);
    setFuncCall(demoFunctions[demoKey].call);
    handleReset();
  };

  const handleRun = () => {
    const logs = executeWithLogging(funcCode, funcCall);
    setCallLog(logs);
    setCurrentStep(-1);
    setIsAnimating(true);

    // Animate through the logs
    let step = 0;
    const interval = setInterval(() => {
      if (step >= logs.length) {
        clearInterval(interval);
        setIsAnimating(false);
        return;
      }
      setCurrentStep(step);
      step++;
    }, animationSpeed);
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setCallLog([]);
    setIsAnimating(false);
  };

  const treeData = buildTreeFromLog(callLog, currentStep);

  const customNodeElement = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle 
        r={25} 
        fill={nodeDatum.attributes?.phase === 'return' ? '#4CAF50' : '#2196F3'}
        stroke="#333"
        strokeWidth="2"
      />
      <text 
        fill="white" 
        strokeWidth="0" 
        x="0" 
        y="5" 
        textAnchor="middle"
        fontSize="12px"
        fontWeight="normal"
      >
        {nodeDatum.name}
      </text>
      {nodeDatum.attributes?.return && (
        <text 
          fill="#333" 
          x="0" 
          y="45" 
          textAnchor="middle"
          fontSize="11px"
          fontWeight="normal"
        >
          {nodeDatum.attributes.return}
        </text>
      )}
      {nodeDatum.attributes?.status && (
        <text 
          fill="#666" 
          x="0" 
          y="45" 
          textAnchor="middle"
          fontSize="10px"
          fontStyle="italic"
        >
          {nodeDatum.attributes.status}
        </text>
      )}
    </g>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Control Panel */}
      <div className="p-6 bg-white shadow-lg border-b">
        <h1 className="text-3xl font-normal text-gray-800 mb-6">🌳 Recursive Function Tree Visualizer</h1>
        
        {/* Demo Function Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose a Demo Function:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {Object.entries(demoFunctions).map(([key, demo]) => (
              <button
                key={key}
                onClick={() => handleDemoChange(key)}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  selectedDemo === key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                disabled={isAnimating}
              >
                <div className="font-medium capitalize">{key}</div>
                <div className="text-xs opacity-75 mt-1">
                  {demo.call}
                </div>
              </button>
            ))}
          </div>
          {selectedDemo && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{selectedDemo}:</strong> {demoFunctions[selectedDemo].description}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function Code:
            </label>
            <textarea
              value={funcCode}
              onChange={(e) => setFuncCode(e.target.value)}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your recursive function here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Functions must be written in JavaScript syntax
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Function Call:
              </label>
              <input
                value={funcCall}
                onChange={(e) => setFuncCall(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., fibonacci(5)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animation Speed: {animationSpeed}ms per step
              </label>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={isAnimating}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Fast (200ms)</span>
                <span>Slow (2000ms)</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRun}
                disabled={isAnimating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isAnimating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Animating...
                  </>
                ) : (
                  <>
                    ▶️ Generate Tree
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>
        
        {callLog.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="text-sm text-gray-700">
              <strong>Progress:</strong> Step {currentStep + 1} of {callLog.length}
              {currentStep >= 0 && currentStep < callLog.length && (
                <span className="ml-4 font-mono bg-white px-2 py-1 rounded border">
                  {callLog[currentStep].phase === 'call' 
                    ? `📞 Calling with (${callLog[currentStep].args.join(', ')})` 
                    : `↩️ Returning ${callLog[currentStep].result}`}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tree Visualization - Much Larger */}
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50" style={{ height: 'calc(100vh - 400px)', minHeight: '600px' }}>
        {treeData ? (
          <Tree
            data={treeData}
            orientation="vertical"
            translate={{ x: window.innerWidth / 2, y: 100 }}
            collapsible={false}
            renderCustomNodeElement={customNodeElement}
            separation={{ siblings: 2, nonSiblings: 2.5 }}
            nodeSize={{ x: 200, y: 120 }}
            styles={{
              links: {
                stroke: '#4338ca',
                strokeWidth: 2,
              }
            }}
            zoom={0.8}
            scaleExtent={{ min: 0.3, max: 2 }}
            enableLegacyTransitions={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <div className="text-center max-w-md">
              <div className="text-8xl mb-6">🌳</div>
              <h2 className="text-2xl font-normal mb-4">Ready to Visualize Recursion!</h2>
              <p className="text-lg mb-6">Choose a demo function above or write your own recursive function</p>
              
              <div className="bg-white p-6 rounded-xl shadow-lg text-left">
                <h3 className="font-normal text-lg mb-3">📝 Function Requirements:</h3>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>✅ Must be written in <strong>JavaScript syntax</strong></li>
                  <li>✅ Must be a <strong>recursive function</strong> (calls itself)</li>
                  <li>✅ Must have a <strong>base case</strong> to stop recursion</li>
                  <li>✅ Can be from any programming paradigm (just use JS syntax)</li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                  <p className="text-xs text-gray-600">
                    <strong>💡 Pro Tip:</strong> Try the Fibonacci demo with fibonacci(6) or factorial(6) to see larger trees!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Legend */}
      <div className="fixed bottom-6 right-6 bg-white p-5 rounded-xl shadow-2xl border border-gray-200">
        <h3 className="font-normal text-base mb-3 text-gray-800">🔍 Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-gray-700"></div>
            <span><strong>Function Call</strong> - Going down the tree</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-gray-700"></div>
            <span><strong>Function Return</strong> - Coming back up</span>
          </div>
          <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
            Zoom and pan to explore large trees
          </div>
        </div>
      </div>
    </div>
  );
}