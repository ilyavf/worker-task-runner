const { create, runTask, createBuffer, bufferToArray } = require('../../src/helpers')
const execTask = require('../../src/utils/exec')

// Create shared array buffer to send to worker:
const data = { buffer: createBuffer(50, window.Int32Array), type: 'Int32Array'}

// Define the main app: create a worker and run a task:
const app =
  create('src/worker')
  .chain(worker => runTask(worker, 'demo/shared-array-task/task')(data))
  .map(bufferToArray)

// Execute the application (see `data.task`):
execTask(app)
