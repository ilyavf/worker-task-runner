const Task = require('data.task')
const { create, execTask, createBuffer, bufferToArray } = require('worker-task-runner/src/helpers')
const { TASK_RESULT } = require('worker-task-runner/src/constants')

// sendMessage :: Object -> Worker -> Worker
const sendMessage = (message, worker) => {
  worker.postMessage(message)
  return worker
}

// shareData :: ArrayBuffer -> Worker -> Worker
const shareData = buffer => worker =>
  sendMessage({ buffer, type: 'Int32Array' }, worker)

// Result = Object <type, buffer>
// getResult :: Worker -> Task Result
const getResult = worker =>
  new Task((reject, resolve) => {
    worker.onmessage = ev => {
      if (ev.data.type === TASK_RESULT) {
        resolve(ev.data.result)
      }
    }
  })

// Main app:
const app =
  create('demo/shared-array-buffer/worker')
  .map(shareData(createBuffer(100)))
  .chain(getResult)
  .map(bufferToArray)

console.log('Starting app...');
execTask(app)