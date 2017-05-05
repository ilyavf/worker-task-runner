/**
 * https://en.wikipedia.org/wiki/Producer%E2%80%93consumer_problem
 *
 * The producer's job is to generate data, put it into the buffer, and start again. At the same time,
 * the consumer is consuming the data (i.e., removing it from the buffer), one piece at a time.
 * The problem is to make sure that the producer won't try to add data into the buffer if it's full
 * and that the consumer won't try to remove data from an empty buffer.
 */

// Note: steal adds `process` to global, and Task checks it.
window.process.nextTick = setTimeout

const Task = require('data.task')
const { List } = require('immutable-ext')
const { create, runTask, createBuffer, bufferToArray } = require('../../src/helpers')
const execTask = require('../../src/utils/exec')

const sendMessage = msg => worker =>
(
  console.log('sendMessage', msg, worker),
  worker.postMessage(msg)
)

const producerUrl = 'demo/producer-consumer/producer'
const consumerUrl = 'demo/producer-consumer/consumer'

let buffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 1000);
let array = new Int32Array(buffer);

window.array = array;

// Define the main app: create a worker and run a task:
const app =
  List([producerUrl, consumerUrl])
  .traverse(Task.of, create)
  .map(ws => ws.map(sendMessage(array)))

// Execute the application (see `data.task`):
execTask(app)