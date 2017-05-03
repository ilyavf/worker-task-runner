/**
 * @module {Object} helpers
 *
 * Helpers for creating a worker and running a task
 */

const Task = require('data.task')
const execTask = require('./utils/exec')
const { READY, RUN_TASK, TASK_RESULT } = require('./constants')

/**
 * @function create Creates a Web Worker
 * @param {String} url A URL of a script file that a Web Worker will be initialized with
 * @return {Task<Worker>} A worker wrapped in a task (`data.task`)
 *
 * Note: uses StealJS module loader.
 */
// create :: String -> Task Worker
const create =  url =>
  new Task((reject, resolve) => {
    if (!window.System){
      reject('This helper requires StealJS module loader. Check out http://stealjs.com')
    }
    const worker = new window.Worker(window.System.stealURL + '?main=' + url)
    worker.onmessage = ev => {
      if (ev.data === READY) {
        resolve(worker)
      }
    }
  })

/**
 * @function runTask Runs a task in a worker
 * @param {Worker} worker
 * @param {String} taskUrl A URL of a script that exports a task to be run
 */
// runTask :: Worker -> String -> a -> Task b
const runTask = (worker, taskUrl) => taskData => {
  return new Task((reject, resolve) => {
    // console.log('runTask.task for ' + taskData)
    worker.onmessage = ev => {
      // console.log(`runTask.task.onmessage for taskData=${taskData}`, ev.data)
      if (ev.data && ev.data.type === TASK_RESULT) {
        // console.log('Worker returned a taskResult', ev.data.result)
        // TODO: should the worker be returned along with the result?
        resolve(ev.data.result)
      }
    }
    worker.postMessage({
      type: RUN_TASK,
      taskUrl,
      taskData
    })
  })
}

module.exports = {
  create,
  runTask,
  execTask
}
