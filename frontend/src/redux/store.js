import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {  
  return createStore(
    rootReducer,
    undefined,
    composeEnhancers(
      applyMiddleware(thunk)
    )
  );
}
