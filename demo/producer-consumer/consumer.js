const consumeNonZero = n => console.log('n')

// consumer.js – a worker that keeps consuming and replacing data with 0
onmessage = ev => {
  let i32 = ev.data;
  let i = 0;
  while (i < 5000) {
    Atomics.wait(i32, i, 0);                     // wait till i32[i] != 0
    consumeNonZero(Atomics.exchange(i32, i, 0)); // exchange value of i32[i] with 0
    Atomics.wake(i32, i, 1);                     // wake 1 thread waiting on i32[i]
    i = (i + 1) % i32.length;
  }
}

self.postMessage('ready')
