import { createAction } from '@reduxjs/toolkit';
import * as types from './actionTypes';
import fetchData from '../services/dataApi';
import { prepareAndSaveCsvFile } from '../utils/csvGenerator';

export const fetchTableDataStart = createAction(types.FETCH_TABLE_DATA);

export const fetchTableDataReceive = createAction(types.FETCH_TABLE_DATA_OK);

export const fetchTableDataError = createAction(types.FETCH_TABLE_DATA_ERROR);

// thunk action creator
export function fetchTableData(rowCount, loadUiConst, onFinishFetching) {
  return function callback(dispatch) {
    dispatch(fetchTableDataStart());
    fetchData(rowCount, loadUiConst, onFinishFetching);
  };
}

export const tableGlobalFilter = createAction(types.TABLE_GLOBAL_FILTER);

export const tableColumnFilter = createAction(types.TABLE_COLUMN_FILTER);

export const tableSort = createAction(types.TABLE_SORT_BY_COLUMN);

export const changeFiltersVisibility = createAction(types.TABLE_CHANGE_FILTERS_VISIBILITY);

export const changeTableVirtualization = createAction(types.TABLE_CHANGE_VIRTUALIZATION);

export const removeSelectedRows = createAction(types.TABLE_REMOVE_ROWS);

export const changeColumnList = createAction(types.TABLE_CHANGE_COLUMN_LIST);

export const changeFixedColumnsCount = createAction(types.TABLE_CHANGE_FIXED_COLUMNS_COUNT);

// thunk action creator
export function saveCsvTableData(filteredRowIndexes) {
  return function callback(_, getState) {
    const {
      tableData: { columnOrder, rows },
    } = getState();
    prepareAndSaveCsvFile(columnOrder, rows, filteredRowIndexes);
  };
}
