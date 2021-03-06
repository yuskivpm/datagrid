import React from 'react';
import { Provider } from 'react-redux';
import getStore from './store/store';
import ConnectedMainPage from './containers/ConnectForMainPage';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const App = () => {
  const store = getStore();
  return (
    <Provider store={store}>
      <div className="App">
        <ConnectedMainPage />
      </div>
    </Provider>
  );
};

export default App;
