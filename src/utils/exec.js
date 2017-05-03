/**
 * @module {Function} execTask
 * @parent utils
 *
 * Executes a task and prints out the result and the time that it took
 *
 * @signature `execTask( task )`
 *
 *  @param {Task} task An instance of `data.task`
 */

// execTask :: Task a -> IO()
let start;
const execTask = task =>
(
  start = Date.now(),
  task
  .fork(e => console.log('error: ', e),
        x => {
          const time = (Date.now() - start) / 1000
          console.log(`Exec: took ${time} seconds. \nResult:`, x)
        })
)

module.exports = execTask
