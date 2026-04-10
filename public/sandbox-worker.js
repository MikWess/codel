// Web Worker that executes user code in a sandbox
// This runs in a separate thread — can't touch the DOM or main app

self.onmessage = function (e) {
  const { code } = e.data;
  const output = [];

  // Override console.log to capture output
  const originalLog = console.log;
  console.log = function (...args) {
    output.push(args.map(String).join(" "));
  };

  try {
    // Create a function from the code and execute it
    const fn = new Function(code);
    fn();
    self.postMessage({ success: true, output: output.join("\n") });
  } catch (err) {
    self.postMessage({ success: false, output: err.message });
  } finally {
    console.log = originalLog;
  }
};
