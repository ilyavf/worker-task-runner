# worker-task-runner
Run a task inside a web worker

Your app can send to Web Worker a message with a script URL and data. Worker will execute the task and return the result back.

Worker uses [StealJS](http://stealjs.com) module loader to asynchronously load the task module. Data is
sent via `postMessage`.

The package also provides helpers for sending `SharedArrayBuffer` to the worker task runner.
See demo `demo/shared-array-task/demo.js` for an example.

## API

### Message format

- `type` message type, values are defined in `src/constants.js`:
  - from Worker: `ready`, `task-result`
  - to Worker: `run-task`
- `taskUrl` {String} represents a URL to a task file that Worker will load and execute.
- `taskData` {Any} data to sent to Worker to pass to the given task.
- `result` {Any} contains data that worker produced as a result of executing the given task.

### Helpers

- Main:
  - `create` - creates a worker, returns a Task that will be resolved when the worker sends the READY event.
  - `runTask` - runs a task in a worker. Expects: a worker instance and a URL of a task module that will be run in the worker.
- Utils:
  - `execTask` - forks a task and prints out how much time it took to execute it.
- SharedArrayBuffer:
  - `createBuffer`
  - `bufferToArray`

Example:
```js
worker.postMessage({
  type: "run-task",
  taskUrl: "src/my-task.js",
  taskData: [1,2,3]
})

worker.onmessage = ev => {
  if (ev.data.type === 'ready') {
    console.log('Worker is ready!')
  }
  if (ev.data.type === 'task-result') {
    console.log('Worker finished task:', ev.data.result)
  }
}
```

## Example:

### Low-level

You can use `Worker` directly and just use the message API
```js
const worker = new Worker("worker-task-runner/src/worker.js")
const taskUrl = "demo/task"   // <<< your task module name without `.js` extension
const data = [1, 2, 3, 4]

const myCallback = result => console.log("Web worker finished: ", result)

worker.onmessage = ev => {
  if (ev.data === "ready") {
    // Send a task script URL to worker along with data. Note: type has to be `run-task`
    worker.postMessage({
      type: "run-task",
      taskUrl,
      taskData
    })
  }
  if (ev.data && ev.data.type === "task-result"){
    myCallback(ev.data.result)
  }
}
```

### Functional-style with Tasks
You can use the following helpers to work in a functiona style using `data.task`'s Task:
```js
// Import helpers:
const { create, runTask, execTask } = require('worker-task-runner')
const workerUrl = "worker-task-runner/src/worker.js"

// Define your task URL and data:
const taskUrl = "demo/task"    // <<< your task module name without `.js` extension
const data = [1, 2, 3, 4]

// Define your main app that creates a worker and runs a task:
const app =
  create(workerUrl)
  .chain(worker => runTask(worker, taskUrl)(data))

// Execute the application (see `data.task`):
app.fork(err => console.log("Error: ", error),
         res => console.log("Result: ", res))

```

Or if you prefer a Promise:
```
// TODO :)
```

### SharedArrayBuffer

Main app may look like this:
```js
const { create, runTask, createBuffer, bufferToArray } = require('worker-task-runner')
const execTask = require('worker-task-runner/src/utils/exec')

// Create shared array buffer to send to worker:
const data = { buffer: createBuffer(50, 'Int32Array'), type: 'Int32Array'}

// Define the main app: create a worker and run a task:
const app =
  create('src/worker')
  .chain(worker => runTask(worker, 'demo/shared-array-task/task')(data))
  .map(bufferToArray)

// Execute the application (see `data.task`):
execTask(app)
```

The worker task may look like:
```js
const Task = require('data.task')
const { bufferToArray } = require('worker-task-runner')

// testTask :: a -> Task b
const testTask = ({ buffer, type }) =>
  new Task((reject, resolve) => {

    // Convert the buffer array to a typed array:
    let array = bufferToArray({ buffer, type })

    // Do some actions that will update the buffer array:
    array.forEach((a, i) => array[i] = i * 3)

    // Resolve the task:
    resolve({ buffer, type })
  })

module.exports = testTask

```

## Release Notes

- `0.0.2` Helpers and demo for using SharedArrayBuffer. Also define the helpers module to be package's main script.
  - `createBuffer`
  - `bufferToArray`
- `0.0.1` Initial version:
  - Send data via `postMessage`.
  - Worker loads the given task script using StealJS module loader.
  - Helpers for using `data.task` Task.
