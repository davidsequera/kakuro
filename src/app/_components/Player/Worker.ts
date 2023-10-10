// Define a function to be run in the worker
function workerFunction() {
    console.log('Worker function running');
}

// Create a new worker and pass in the function to run
const worker = new Worker(URL.createObjectURL(new Blob([`(${workerFunction})()`])));

// Listen for messages from the worker
worker.onmessage = (event) => {
    console.log(`Received message from worker: ${event.data}`);
};

// Send a message to the worker
worker.postMessage('Hello from main thread!');
