import React from 'react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router-dom';
import getStore from './store/store';
import ConnectedMainPage from './containers/ConnectForMainPage';
// styles
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

const App = () => {
  const store = getStore(useLocation() || {});
  return (
    <Provider store={store}>
      <div className="App">
        <ConnectedMainPage />
      </div>
    </Provider>
  );
};

export default App;
