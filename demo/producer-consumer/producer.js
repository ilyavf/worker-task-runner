const produceNonZero = () => Math.floor(Math.random() * 1000)

// producer.js – a worker that keeps producing non-zero data
self.onmessage = ev => {
  let i32 = ev.data;
  let i = 0;
  while (i < 5000) {
    let curr = Atomics.load(i32, i);             // load i32[i]
    if (curr != 0) Atomics.wait(i32, i, curr);   // wait till i32[i] != curr
    Atomics.store(i32, i, produceNonZero());     // store in i32[i]
    Atomics.wake(i32, i, 1);                     // wake 1 thread waiting on i32[i]
    i = (i + 1) % i32.length;
  }
}

self.postMessage('ready')
