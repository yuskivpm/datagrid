import { headers } from '../services/const';

// ** global table function **
export const getVisibleColumns = (columnOrder) => columnOrder.filter(({ isVisible }) => isVisible);


export const isCheckedRow = (rows, selectedRows, filteredRowIndex) =>
  selectedRows.includes(rows[filteredRowIndex].id);

export const getCellValueAsString = (cell, columnName) => {
  try {
    switch (headers[columnName].type) {
      case 'object':
        return JSON.stringify(cell);
      case 'instant':
        return new Date(cell).toISOString();
      case 'boolean':
        return headers[columnName].values[+cell];
      default:
        return cell;
    }
  } catch (error) {
    return cell;
  }
};

export const getTableWidth = columnOrder =>
  getVisibleColumns(columnOrder).reduce((width, { columnName }) => width + headers[columnName].colWidth, 0);

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

/* eslint-disable no-param-reassign, prefer-destructuring */
// Fix filters list (invalid case in column names, deleting non-existent values from enum and boolean lists)
const correctColumnsFilters = columnsFilter =>
  columnsFilter
    .map(({ columnName: oldColumnName, filterText }) => {
      const columnName = lowerCaseHeaders.get(oldColumnName.toLowerCase());
      if (typeof columnName !== 'undefined') {
        const curColumn = headers[columnName];
        switch (curColumn.type) {
          case 'enum':
          case 'boolean':
            filterText = `${removeFailedValues(removeParentheses(filterText), curColumn.values)}`;
            if (filterText && curColumn.type === 'enum') {
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
  columnOrder.map(colObject =>
    ({ ...colObject, columnName: lowerCaseHeaders.get(colObject.columnName.toLowerCase()) })
  ).filter(col => col);

const correctColumnSort = columnSortAsArray =>
  columnSortAsArray
    .map(item => ({ ...item, columnName: lowerCaseHeaders.get(item.columnName.toLowerCase()) }))
    .filter(({ columnName }) => columnName);

export const checkAndCorrectStateValues = state => {
  lowerCaseHeaders = new Map(Object.keys(headers).map(key => [key.toLowerCase(), key]));
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
    state.columnsSort = correctColumnSort(
      Array.isArray(state.columnsSort) ? state.columnsSort : [state.columnsSort]
    );
    switch (state.columnsSort.length) {
      case 0:
        state.columnsSort = {};
        break;
      case 1:
        state.columnsSort = state.columnsSort[0];
        break;
      default:
    }
  }
  return state;
};
/* eslint-enable no-param-reassign, prefer-destructuring */
