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
