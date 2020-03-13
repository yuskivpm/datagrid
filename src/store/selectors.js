import { createSelector } from '@reduxjs/toolkit';
import { getCellValueAsString } from '../utils/commonUtils';
import { headers } from '../services/const';

const getDefaultIndexesArray = rowsCount => [...Array(rowsCount)].map((_, index) => index);

// * START * Global filter
//
const applayGlobalFilter = (rows = [], filteredRowIndexes = [], globalFilter = '') => {
  if (globalFilter) {
    try {
      const filterRegex = new RegExp(globalFilter.trim(), 'i');
      return rows.reduce((result, row, index) => {
        if (
          Object.entries(row).find(([columnName, cellValue]) =>
            filterRegex.test(`${getCellValueAsString(cellValue, columnName)}`)
          )
        ) {
          result.push(index);
        }
        return result;
      }, []);
    } catch (e) {
      // ignore
    }
  }
  return filteredRowIndexes;
};
//
// * END * Global filter

// * START * Columns filter
//
const applayColumnFilters = (rows = [], filteredRowIndexes = [], columnsFilter = []) => {
  if (columnsFilter && columnsFilter.length) {
    try {
      const regExArray = columnsFilter.map(({ filterText }) => new RegExp(filterText.trim(), 'i'));
      return filteredRowIndexes.reduce((result, rowIndexValue) => {
        if (
          columnsFilter.every(({ columnName }, index) =>
            regExArray[index].test(
              `${getCellValueAsString(rows[rowIndexValue][columnName], columnName)}`
            )
          )
        ) {
          result.push(rowIndexValue);
        }
        return result;
      }, []);
    } catch (e) {
      // ignore
    }
  }
  return filteredRowIndexes;
};
//
// * END * Columns filter

// * START * Sort filter
//
const cmpSingle = (firstRow, secondRow, { columnName, isAscending }) => {
  let firstCell = firstRow[columnName];
  let secondCell = secondRow[columnName];
  if (firstCell === secondCell) {
    return 0;
  }
  switch (headers[columnName].type) {
    case 'object':
      try {
        firstCell = JSON.stringify(firstCell);
        secondCell = JSON.stringify(secondCell);
      } catch (error) {
        firstCell = firstRow[columnName];
        secondCell = secondRow[columnName];
      }
      break;
    default:
  }
  const cmp = firstCell < secondCell ? -1 : 1;
  return isAscending ? cmp : -cmp;
};
//
const cmpMultiply = (firstRow, secondRow, columnsSort) => {
  let result = 0;
  /* eslint-disable no-return-assign */
  columnsSort.find(sortCell => (result = cmpSingle(firstRow, secondRow, sortCell)));
  /* eslint-enable no-return-assign */
  return result;
};
//
const applayColumnSort = (rows = [], columnsSort = []) => {
  const filteredRowIndexes = getDefaultIndexesArray(rows.length);
  if (columnsSort.length || columnsSort.columnName) {
    const cmpFunc = Array.isArray(columnsSort) ? cmpMultiply : cmpSingle;
    return filteredRowIndexes.sort((first, second) =>
      cmpFunc(rows[first], rows[second], columnsSort)
    );
  }
  return filteredRowIndexes;
};
//
// * END *  filter

// * START * Selectors
//
// sort by columns
const rowsSortSelector = createSelector(
  state => state.tableData.rows,
  state => state.tableData.columnsSort,
  (rows, columnsSort) => applayColumnSort(rows, columnsSort)
);
//
// global filter
const globalFilterSelector = createSelector(
  state => state.tableData.rows,
  rowsSortSelector,
  state => state.tableData.globalFilter,
  (rows, filteredRowIndexes, globalFilter) =>
    applayGlobalFilter(rows, filteredRowIndexes, globalFilter)
);
//
// filter by columns
const allFiltersSelector = createSelector(
  state => state.tableData.rows,
  globalFilterSelector,
  state => state.tableData.columnsFilter,
  (rows, filteredRowIndexes, columnsFilter) =>
    applayColumnFilters(rows, filteredRowIndexes, columnsFilter)
);
//
// * END *  Selectors

export default allFiltersSelector;