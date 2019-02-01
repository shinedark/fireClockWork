import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase';
import reducers from './src/reducers';
import Router from './src/Router';

export default class App extends React.Component {
  
  componentWillMount(){
    const config = {
    apiKey: "AIzaSyCjKXQzdexPXzwnzUGws3ozgE1P0P_1eTA",
    authDomain: "fireclock-24f83.firebaseapp.com",
    databaseURL: "https://fireclock-24f83.firebaseio.com",
    projectId: "fireclock-24f83",
    storageBucket: "fireclock-24f83.appspot.com",
    messagingSenderId: "744715117658"
  };
  firebase.initializeApp(config);
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store = {store}>
        <Router/>
      </Provider>
    );
  }
}


