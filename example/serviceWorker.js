let count = 0

const broadcast = new BroadcastChannel('count-channel');
broadcast.onmessage = (event) => {
  if (event.data && event.data.type === 'INCREASE_COUNT') {
    broadcast.postMessage({ payload: ++count });
  }
};
