import { headers, types } from '../services/const';

// ** global table function **

export const getVisibleColumns = columnOrder => columnOrder.filter(({ isVisible }) => isVisible);

export const isCheckedRow = (rows, selectedRows, filteredRowIndex) =>
  selectedRows.includes(rows[filteredRowIndex].id);

export const getCellValueAsString = (cell, columnName) => {
  try {
    switch (headers[columnName].type) {
      case types.OBJECT:
        return JSON.stringify(cell);
      case types.INSTANT:
        return new Date(cell).toISOString();
      case types.BOOLEAN:
        return headers[columnName].values[+cell];
      default:
        return cell;
    }
  } catch (error) {
    return cell;
  }
};

export const objectToString = cell => {
  try {
    return JSON.stringify(cell, null, 2);
  } catch (_) {
    return '';
  }
};

export const dateToString = cell => {
  try {
    return new Date(cell).toISOString();
  } catch (_) {
    return '';
  }
};

export const getTableWidth = columnOrder =>
  getVisibleColumns(columnOrder).reduce(
    (width, { columnName }) => width + headers[columnName].colWidth,
    0
  );

// ** global state correction function **

let lowerCaseHeaders;

// helper functions
const removeFailedValues = (list, values) =>
  list
    .split('|')
    .filter(item => values.includes(item))
    .join('|');

const removeParentheses = text =>
  text.startsWith('(') && text.endsWith(')') ? text.substr(1, text.length - 2) : text;

// Fix filters list (invalid case in column names, deleting non-existent values from enum and boolean lists)
const correctColumnsFilters = columnsFilter =>
  columnsFilter
    .map(({ columnName: oldColumnName, filterText: localFilterText }) => {
      const columnName = lowerCaseHeaders.get(oldColumnName.toLowerCase());
      let filterText = localFilterText; // to avoid eslint no-param-reassign
      if (typeof columnName !== 'undefined') {
        const curColumn = headers[columnName];
        switch (curColumn.type) {
          case types.ENUM:
          case types.BOOLEAN:
            filterText = `${removeFailedValues(removeParentheses(filterText), curColumn.values)}`;
            if (filterText && curColumn.type === types.ENUM) {
              filterText = `(${filterText})`;
            }
            break;
          default:
        }
        return { columnName, filterText };
      }
      return { columnName, filterText: '' };
    })
    .filter(({ filterText }) => filterText);

// Fix column order list (invalid case in column names, deleting non-existent namess)
const correctColumns = columnOrder =>
  columnOrder
    .map(colObject => ({
      ...colObject,
      columnName: lowerCaseHeaders.get(colObject.columnName.toLowerCase()),
    }))
    .filter(({ columnName }) => columnName);

const correctColumnSort = columnSortAsArray =>
  columnSortAsArray
    .map(item => ({ ...item, columnName: lowerCaseHeaders.get(item.columnName.toLowerCase()) }))
    .filter(({ columnName }) => columnName);

export const checkAndCorrectStateValues = oldState => {
  lowerCaseHeaders = new Map(Object.keys(headers).map(key => [key.toLowerCase(), key]));
  const state = { ...oldState }; // to avoid eslint no-param-reassign
  // remove incorrect values from columnsFilter
  if (state.columnsFilter) {
    state.columnsFilter = correctColumnsFilters(state.columnsFilter);
  }
  // remove incorrect values columnOrder
  if (state.columnOrder && state.columnOrder.length) {
    state.columnOrder = correctColumns(state.columnOrder);
  }
  // remove incorrect values from columnsSort
  if (state.columnsSort) {
    if (Array.isArray(state.columnsSort)) {
      state.columnsSort = correctColumnSort(state.columnsSort);
    } else if (state.columnsSort.columnName) {
      state.columnsSort = correctColumnSort([state.columnsSort]);
    }
    switch (state.columnsSort.length) {
      case 0:
        state.columnsSort = {};
        break;
      case 1:
        [state.columnsSort] = state.columnsSort; // to avoid eslint prefer-destructuring
        break;
      default:
    }
  }
  return state;
};

export const convertToNumber = text => parseInt(`0${text}`, 10);
