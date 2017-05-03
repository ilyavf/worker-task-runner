const { create, runTask } = require('../src/helpers')
const execTask = require('../src/utils/exec')

// Mapper task will be executed per element:
const data = [1, 2, 3, 4, 5]

// Define the main app: create a worker and run a task:
const app =
  create('src/worker')
  .chain(worker => runTask(worker, 'demo/task')(data))

// Execute the application (see `data.task`):
execTask(app)
