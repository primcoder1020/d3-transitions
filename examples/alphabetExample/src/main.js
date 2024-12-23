import 'babel-polyfill';
import React, { Component } from 'react'; // eslint-disable-line
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Example from './components';
import DataGenerator from './components/DataGenerator';

import configureStore from './store';
let store = configureStore();

class App extends Component {
  render() {
    return (
      <div 
        className='row'
        style={{
          backgroundImage: 'linear-gradient(#E9E0D1, #91A398)',
          height: 1000
        }}
      >
        <div className='col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1'>
          <DataGenerator />
          <Example />
        </div>
      </div>
    );
  }
}

render(
  <Provider store={store}>
    <App />
	</Provider>, document.getElementById('content')
);


