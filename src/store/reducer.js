/* eslint-disable no-bitwise, no-param-reassign */
import { createReducer } from '@reduxjs/toolkit';
import * as actions from './actions';

const defaultFetchTableData = {
  rows: [],
  globalFilter: '',
  columnsFilter: [],
  columnsSort: {},
  columnOrder: [],
};

const getIndexByColumnName = (array, searchForColumnName) =>
  array.findIndex(({ columnName }) => columnName === searchForColumnName);

const tableData = createReducer(defaultFetchTableData, {
  [actions.fetchTableDataStart]: state => {
    state.tableLoaded = false;
  },
  [actions.fetchTableDataReceive]: (state, action) => {
    return {
      ...state,
      ...action.payload,
      tableLoaded: true,
    };
  },
  [actions.fetchTableDataError]: (state, action) => {
    state.tableLoaded = true;
    state.error = action.payload;
  },
  [actions.tableGlobalFilter]: (state, action) => {
    state.globalFilter = action.payload;
  },
  [actions.tableColumnFilter]: (state, action) => {
    const filterValue = action.payload.filterText;
    const indexInList = getIndexByColumnName(state.columnsFilter, action.payload.columnName);
    if (filterValue) {
      if (~indexInList) {
        state.columnsFilter[indexInList].filterText = filterValue;
      } else {
        state.columnsFilter.push({
          columnName: action.payload.columnName,
          filterText: filterValue,
        });
      }
    } else if (~indexInList) {
      // remove filter if empty string
      state.columnsFilter.splice(indexInList, 1);
    }
  },
  [actions.tableSort]: (state, action) => {
    const IsCurrentSortBySingleColumn = !Array.isArray(state.columnsSort);
    const defSort = { columnName: action.payload.columnName, isAscending: true };
    if (action.payload.isSingle) {
      if (
        IsCurrentSortBySingleColumn &&
        state.columnsSort.columnName === action.payload.columnName
      ) {
        state.columnsSort.isAscending = !state.columnsSort.isAscending;
      } else {
        state.columnsSort = defSort;
      }
    } else if (IsCurrentSortBySingleColumn) {
      state.columnsSort = [defSort];
    } else {
      const indexInList = getIndexByColumnName(state.columnsSort, action.payload.columnName);
      if (~indexInList) {
        state.columnsSort[indexInList].isAscending = !state.columnsSort[indexInList].isAscending;
      } else {
        state.columnsSort.push(defSort);
      }
    }
  },
  [actions.changeFiltersVisibility]: state => {
    state.showFilters = !state.showFilters;
  },
  [actions.changeTableVirtualization]: state => {
    state.virtualization = !state.virtualization;
  },
  [actions.removeSelectedRows]: (state, action) => {
    state.rows = state.rows.filter(row => !action.payload.includes(row.id));
  },
  [actions.changeColumnList]: (state, action) => {
    state.columnOrder = action.payload;
  },
});

export default tableData;