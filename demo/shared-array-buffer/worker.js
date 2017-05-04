const { READY, TASK_RESULT } = require('worker-task-runner/src/constants')

console.log('worker buffer')

self.onmessage =  ev => {
  console.log('event', ev)
  if (ev.data.buffer){
    const sharedArray = new self[ev.data.type]( ev.data.buffer );
    sharedArray.forEach((a, i) => sharedArray[i] = i * 2)
    console.log('Worker: postMessage result...')
    self.postMessage({
      type: TASK_RESULT,
      result: {
        buffer: ev.data.buffer,
        type: ev.data.type
      }
    })
  }
}

self.postMessage( READY )