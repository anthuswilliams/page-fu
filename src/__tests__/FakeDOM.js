const FakeDOM = {};
const Event = function Event(name) {
  this.name = name;
};

const location = {
  pathname: '',
  search: '',
};

const history = {
  pushState(state, title, path) {
    this.replaceState(state, title, path);
  },
  replaceState(state, title, path) {
    location.pathname = path.slice(0, Math.max(0, path.indexOf('?')))
    location.search = path.slice(location.pathname.length)
  },
};

FakeDOM.window = {
  Event,
  listeners: [],
  dispatchEvent(event) {
    this.listeners
      .filter(x => x.name === event.name)
      .map(x => x.callback)
      .forEach(x => x(event))
    ;
  },
  addEventListener(name, callback) {
    this.listeners.push({ name, callback });
  },
  removeEventListener(name, callback) {
    this.listeners = this.listeners.filter(x => !(x.name === name && x.callback === callback));
  },
  history,
  location,
};

FakeDOM.history = history;
FakeDOM.location = location;

FakeDOM.document = {
  addEventListener() {},
  removeEventListener() {},
};

FakeDOM.Event = Event;

export default FakeDOM;