const Task = require('data.task')
const { create, execTask, createBuffer, bufferToArray } = require('../../src/helpers')
const { TASK_RESULT } = require('../../src/constants')

// sendMessage :: Object -> Worker -> Worker
const sendMessage = (message, worker) => {
  worker.postMessage(message)
  return worker
}

// shareData :: ArrayBuffer -> Worker -> Worker
const shareData = buffer => worker =>
  sendMessage({ taskData: { buffer, type: 'Int32Array' } }, worker)

// Result = Object <type, buffer>
// getResult :: Worker -> Task Result
const getResult = worker =>
  new Task((reject, resolve) => {
    worker.onmessage = ev => {
      console.log('onmessage', ev.data);
      if (ev.data.type === TASK_RESULT) {
        resolve(ev.data.result)
      }
    }
  })

// Main app:
const app =
  create('demo/shared-array-buffer/worker')
  .map(shareData(createBuffer(100, window.Int32Array)))
  .chain(getResult)
  .map(bufferToArray)

console.log('Starting app...');
execTask(app)