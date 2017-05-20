const EVT_QUERY_CHANGE = 'pagefu-query-change';

const history = {
  push(path) {
    window.history.replaceState(null, null, path)
    window.dispatchEvent(new Event(EVT_QUERY_CHANGE))
  },

  listen(callback) {
    window.addEventListener(EVT_QUERY_CHANGE, callback);

    return function stopListening() {
      window.removeEventListener(EVT_QUERY_CHANGE, callback);
    }
  },
}

export default history;