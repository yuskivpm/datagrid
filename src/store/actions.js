import { createAction } from '@reduxjs/toolkit';
import * as types from './actionTypes';
import fetchData from '../services/dataApi';
import { prepareAndSaveCsvFile } from '../utils/csvGenerator';

// ** START ** Fetch table data from server **
//
export const fetchTableDataStart = createAction(types.FETCH_TABLE_DATA);
//
export const fetchTableDataReceive = createAction(types.FETCH_TABLE_DATA_OK);
//
export const fetchTableDataError = createAction(types.FETCH_TABLE_DATA_ERROR);
//
// thunk action creator
export function fetchTableData(rowCount, loadUiConst, onFinishFetching) {
  return function callback(dispatch) {
    dispatch(fetchTableDataStart());
    fetchData(rowCount, loadUiConst, onFinishFetching);
  };
}
//
// ** END ** fetch table data from server **

// ** START ** Table sort & filtering **
//
// filter in any columns of the table
export const tableGlobalFilter = createAction(types.TABLE_GLOBAL_FILTER);
//
// fill array of columns with its filter values
export const tableColumnFilter = createAction(types.TABLE_COLUMN_FILTER);
//
// fill array of columns with its sort directions
export const tableSort = createAction(types.TABLE_SORT_BY_COLUMN);
//
// fill array of columns with its sort directions
export const changeFiltersVisibility = createAction(types.TABLE_CHANGE_FILTERS_VISIBILITY);
//
// ** END ** Table sort & filtering **

// ** START ** Table ui **
//
// change table virtualization type of row drawing
export const changeTableVirtualization = createAction(types.TABLE_CHANGE_VIRTUALIZATION);
//
// remove selected rows
export const removeSelectedRows = createAction(types.TABLE_REMOVE_ROWS);
//
// change list of visible columns
export const changeColumnList = createAction(types.TABLE_CHANGE_COLUMN_LIST);
//
// thunk action creator
export function saveCsvTableData(filteredRowIndexes) {
  return function callback(_, getState) {
    const {
      tableData: { columnOrder, rows },
    } = getState();
    prepareAndSaveCsvFile(columnOrder, rows, filteredRowIndexes);
  };
}
//
// ** END ** Table ui **
