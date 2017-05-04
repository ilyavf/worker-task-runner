const { READY, TASK_RESULT } = require('worker-task-runner/src/constants')

console.log('worker buffer')

self.onmessage =  ev => {
  console.log('event', ev)
  if (ev.data.taskData){
    let buffer = ev.data.taskData.buffer
    let type = ev.data.taskData.type
    const sharedArray = new self[type]( buffer );
    sharedArray.forEach((a, i) => sharedArray[i] = i * 2)
    console.log('Worker: postMessage result...')
    self.postMessage({
      type: TASK_RESULT,
      result: {
        buffer,
        type
      }
    })
  }
}

self.postMessage( READY )