import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import tableData from './reducer';
import { loadState, saveState } from '../utils/localState';
import { prepareFiltersFromUrl } from '../utils/urlEncoder';

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

const getStore = location => {
  const locationHistory = prepareFiltersFromUrl(location.search)
  const loadedState = loadState();
  let preloadedState;
  if (loadedState || locationHistory) {
    const defaultFetchTableData = {
      rows: [],
      globalFilter: '',
      columnsFilter: [],
      columnsSort: {},
      columnOrder: [],
      virtualization: true,
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
