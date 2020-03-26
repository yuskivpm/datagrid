import { createSelector } from '@reduxjs/toolkit';
import { getCellValueAsString } from '../utils/commonUtils';
import { headers, types } from '../services/const';

const getDefaultIndexesArray = rowsCount => [...Array(rowsCount)].map((_, index) => index);

const getIgnoredIndexes = (rows, ignoreIt) =>
  rows.reduce((skippedIndexesList, row, index) => {
    if (ignoreIt(row)) {
      skippedIndexesList.push(index);
    }
    return skippedIndexesList;
  }, []);

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

const cmpMultiply = (firstRow, secondRow, columnsSort) => {
  let result = 0;
  columnsSort.find(sortCell => {
    result = cmpSingle(firstRow, secondRow, sortCell);
    return result; // to avoid eslint no-return-assign
  });
  return result;
};

const getSortedIndexes = createSelector(
  state => state.tableData.rows,
  state => state.tableData.columnsSort,
  (rows = [], columnsSort = []) => {
    const filteredRowIndexes = getDefaultIndexesArray(rows.length);
    if (!columnsSort.length && !columnsSort.columnName) {
      return filteredRowIndexes;
    }
    const cmpFunc = Array.isArray(columnsSort) ? cmpMultiply : cmpSingle;
    return filteredRowIndexes.sort((first, second) =>
      cmpFunc(rows[first], rows[second], columnsSort)
    );
  }
);

const getIgnoredByGlobalFilter = createSelector(
  state => state.tableData.rows,
  state => state.tableData.globalFilter,
  (rows = [], globalFilter = '') => {
    if (!globalFilter) {
      return [];
    }
    try {
      const filterRegex = new RegExp(globalFilter.trim(), 'i');
      const ignoreIt = row =>
        !Object.entries(row).find(([columnName, cellValue]) =>
          filterRegex.test(`${getCellValueAsString(cellValue, columnName)}`)
        );
      return getIgnoredIndexes(rows, ignoreIt);
    } catch (_) {
      return [];
    }
  }
);

const getIgnoredByColumnsFilter = createSelector(
  state => state.tableData.rows,
  state => state.tableData.columnsFilter,
  (rows = [], columnsFilter = []) => {
    if (!columnsFilter || !columnsFilter.length) {
      return [];
    }
    try {
      const regExArray = columnsFilter.map(({ filterText }) => new RegExp(filterText.trim(), 'i'));
      const ignoreIt = row =>
        !columnsFilter.every(({ columnName }, index) =>
          regExArray[index].test(`${getCellValueAsString(row[columnName], columnName)}`)
        );
      return getIgnoredIndexes(rows, ignoreIt);
    } catch (_) {
      return [];
    }
  }
);

const allFiltersAndSortSelector = createSelector(
  getSortedIndexes,
  getIgnoredByGlobalFilter,
  getIgnoredByColumnsFilter,
  (sortedIndexes, ignoredByGlobalFilter, ignoredByColumnsFilter) =>
    sortedIndexes.filter(
      index => !(ignoredByGlobalFilter.includes(index) || ignoredByColumnsFilter.includes(index))
    )
);

export default allFiltersAndSortSelector;
