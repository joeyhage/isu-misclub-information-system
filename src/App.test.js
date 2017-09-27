import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { checkinApp } from './reducers';
import App from './App';

let store = createStore(
	checkinApp,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

it('renders without crashing', () => {
  	const div = document.createElement('div');
  	ReactDOM.render(
  		<Provider store={store}>
  			<App />
		</Provider>,
  		div
	);
});
