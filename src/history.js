const EVT_QUERY_CHANGE = 'pagefu-query-change';
const createEventForIE11 = name => {
  const event = document.createEvent('Event');

  event.initEvent(name, true, true);

  return event;
}

const createEvent = name => {
  if (typeof window.Event === 'function') {
    return new Event(name);
  }
  else {
    return createEventForIE11(name);
  }
}

const history = {
  push(path) {
    window.history.replaceState(null, null, path)
    window.dispatchEvent(createEvent(EVT_QUERY_CHANGE))
  },

  listen(callback) {
    window.addEventListener(EVT_QUERY_CHANGE, callback);

    return function stopListening() {
      window.removeEventListener(EVT_QUERY_CHANGE, callback);
    }
  },
}

export default history;