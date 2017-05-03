const Task = require('data.task')
const simulateCalc = require('../src/utils/simulate-calc')

// testTask :: a -> Task b
const testTask = data =>
  new Task((reject, resolve) => {
    // Simulate an expensive calculation, 1sec:
    simulateCalc(1000);

    // Resolve the task:
    resolve('Your data.length is ' + data)
  })

module.exports = testTask
