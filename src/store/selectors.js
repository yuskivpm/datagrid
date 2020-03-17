import { createSelector } from '@reduxjs/toolkit';
import { getCellValueAsString } from '../utils/commonUtils';
import { headers, types } from '../services/const';

const getDefaultIndexesArray = rowsCount => [...Array(rowsCount)].map((_, index) => index);

const genereteSkippedList = (rows, filterFailed) =>
  rows.reduce((skippedIndexesList, row, index) => {
    if (filterFailed(row)) {
      skippedIndexesList.push(index);
    }
    return skippedIndexesList;
  }, []);

// * START * Global filter
//
const applayGlobalFilter = (rows = [], globalFilter = '') => {
  if (globalFilter) {
    try {
      const filterRegex = new RegExp(globalFilter.trim(), 'i');
      const filterFailed = row =>
        !Object.entries(row).find(([columnName, cellValue]) =>
          filterRegex.test(`${getCellValueAsString(cellValue, columnName)}`)
        );
      return genereteSkippedList(rows, filterFailed);
    } catch (e) {
      // ignore
    }
  }
  return [];
};
//
// * END * Global filter

// * START * Columns filter
//
const applayColumnFilters = (rows = [], columnsFilter = []) => {
  if (columnsFilter && columnsFilter.length) {
    try {
      const regExArray = columnsFilter.map(({ filterText }) => new RegExp(filterText.trim(), 'i'));
      const filterFailed = row =>
        !columnsFilter.every(({ columnName }, index) =>
          regExArray[index].test(`${getCellValueAsString(row[columnName], columnName)}`)
        );
      return genereteSkippedList(rows, filterFailed);
    } catch (e) {
      // ignore
    }
  }
  return [];
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
    case types.OBJECT:
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
  columnsSort.find(sortCell => {
    result = cmpSingle(firstRow, secondRow, sortCell);
    return result; // to avoid eslint no-return-assign
  });
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

// * START * Join all sort & filter's selectors
//
const applayFiltersAndSort = (sortedIndexes, skippedByGlobalFilter, skippedByColumnsFilter) =>
  sortedIndexes.filter(
    index => !skippedByGlobalFilter.includes(index) && !skippedByColumnsFilter.includes(index)
  );
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
  state => state.tableData.globalFilter,
  (rows, globalFilter) => applayGlobalFilter(rows, globalFilter)
);
//
// filter by columns
const columnsFilterSelector = createSelector(
  state => state.tableData.rows,
  state => state.tableData.columnsFilter,
  (rows, columnsFilter) => applayColumnFilters(rows, columnsFilter)
);
//
// global filter&sort selector
const allFiltersAndSortSelector = createSelector(
  rowsSortSelector,
  globalFilterSelector,
  columnsFilterSelector,
  (sortedIndexes, skippedByGlobalFilter, skippedByColumnsFilter) =>
    applayFiltersAndSort(sortedIndexes, skippedByGlobalFilter, skippedByColumnsFilter)
);
//
// * END *  Selectors

export default allFiltersAndSortSelector;
