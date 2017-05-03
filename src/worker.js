/* eslint-env serviceworker */

/**
 * @module worker Worker
 *
 * A worker script that can run the given task on the given data
 *
 * ## Examples:
 *
 *  A low-level example:
 *  ```
 *  const worker = new Worker("worker-task-runner/src/worker.js")
 *  const taskUrl = "demo/task.js"
 *  const data = [1, 2, 3, 4]
 *
 *  const myCallback = result => console.log('Web Worker sent the result', result)
 *
 *  worker.onmessage = ev => {
 *    if (ev.data === "ready") {
 *      // Send a task script URL to worker along with data. Note: type has to be `run-task`
 *      worker.postMessage({
 *        type: "run-task",
 *        taskUrl,
 *        taskData
 *      })
 *    }
 *    if (ev.data && ev.data.type === "task-result"){
 *      myCallback(ev.data.result)
 *    }
 *  }
 *  ```
 *
 *  You can use the following helpers to work with a Task:
 *  ```
 *  // Import helpers:
 *  const { create, runTask, execTask } = require('../src/helpers')
 *
 *  // Define your task URL and data:
 *  const workerUrl = "worker-task-runner/src/worker.js"
 *  const taskUrl = "demo/task.js"
 *  const data = [1, 2, 3, 4]
 *
 *  // Define your main app that creates a worker and runs a task:
 *  const app =
 *    create(workerUrl)
 *    .chain(worker => runTask(worker, taskUrl)(data))
 *
 *  // Execute the application (see `data.task`):
 *  execTask(app)
 *
 *  ```
 *
 *  Or if you prefer a Promise:
 *  ```
 *  // TODO :)
 *  ```
 */

const Task = require('data.task')
const { READY, RUN_TASK, TASK_RESULT, PING, PONG } = require('./constants')

// Note: self is worker's `DedicatedWorkerGlobalScope`.
self.onmessage = ev => {
  // console.log(`Worker: received message ${ev.data.type}`, ev.data)
  switch (ev.data.type) {
    case RUN_TASK:
      // console.log('Worker: running a task! ...');
      runTask(ev.data.taskUrl, ev.data.taskData)
      break
    case PING:
      self.postMessage({type: PONG})
      break
    default:
      console.log('Worker: not sure what to do with this task: ' + ev.data.type, ev.data);
  }
}

// runTask :: String -> a -> IO()
const runTask = (url, data) =>
  loadModule(url)
  .chain(m => m(data))
  .fork(error => console.log(error),
        result => self.postMessage({
          type: TASK_RESULT,
          result
        })
  )

// loadModule :: String -> Task m
const loadModule = url =>
  new Task((reject, resolve) =>
    self.steal.import(url).then(resolve)
  )

// console.log('Worker is ready!')
self.postMessage(READY)
