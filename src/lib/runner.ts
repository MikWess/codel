export interface RunResult {
  success: boolean;
  output: string;
}

export function runCode(code: string, timeoutMs = 5000): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker("/sandbox-worker.js");

    const timer = setTimeout(() => {
      worker.terminate();
      resolve({ success: false, output: "Timed out — possible infinite loop." });
    }, timeoutMs);

    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };

    worker.onerror = () => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ success: false, output: "Something went wrong running your code." });
    };

    worker.postMessage({ code });
  });
}
