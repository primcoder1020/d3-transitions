import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import rootReducer from './reducers';

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(createLogger()));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
