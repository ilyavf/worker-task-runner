# worker-task-runner
Run a task inside a web worker

Your app can send to Web Worker a message with a script URL and data. Worker will execute the task and return the result back.

Worker uses [StealJS](http://stealjs.com) module loader to asynchronously load the task module. Right now data is
transferred via `postMessage`.

## API

Message format:

- `type` message type, values are defined in `src/constants.js`:
  - from Worker: `ready`, `task-result`
  - to Worker: `run-task`
- `taskUrl` {String} represents a URL to a task file that Worker will load and execute.
- `taskData` {Any} data to sent to Worker to pass to the given task.
- `result` {Any} contains data that worker produced as a result of executing the given task.

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
const taskUrl = "demo/task.js"
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
const { create, runTask, execTask } = require('../src/helpers')

// Define your task URL and data:
const workerUrl = "worker-task-runner/src/worker.js"
const taskUrl = "demo/task.js"
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

## Release Notes

- `0.0.1` Initial version:
  - Send data via `postMessage`.
  - Worker loads the given task script using StealJS module loader.
  - Helpers for using `data.task` Task.