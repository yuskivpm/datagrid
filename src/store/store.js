import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import tableData from './reducer';
import { loadState, saveState } from '../utils/localState';

const getPresets = (loadedState, locationHistory) => {
  // to avoid linter error "not nestet ternary" ((
  if (!loadedState) {
    return locationHistory;
  }
  if (locationHistory) {
    return Object.assign(loadedState, locationHistory);
  }
  return loadedState;
};

const getStore = locationHistory => {
  const loadedState = loadState();
  let preloadedState;
  if (loadedState || locationHistory) {
    const defaultFetchTableData = {
      rows: [],
      globalFilter: '',
      columnsFilter: [],
      columnsSort: {},
      columnOrder: [],
    };
    preloadedState = {
      tableData: {
        ...defaultFetchTableData,
        ...getPresets(loadedState, locationHistory),
      },
    };
  }
  const reducer = { tableData };
  const store = configureStore({
    reducer,
    preloadedState,
    middleware: [...getDefaultMiddleware()],
  });
  store.subscribe(() => {
    saveState(store.getState());
  });
  return store;
};

export default getStore;
