import { checkAndCorrectStateValues } from './commonUtils';

const localStorageItemName = 'state';

export const loadState = () => {
  try {
    const localData = localStorage.getItem(localStorageItemName);
    if (localData === null) {
      return undefined;
    }
    return checkAndCorrectStateValues(JSON.parse(localData));
  } catch (_) {
    return undefined;
  }
};

export const saveState = ({
  tableData: { globalFilter, columnsFilter, columnsSort, columnOrder, showFilters, fixedColumnsCount },
}) => {
  try {
    localStorage.setItem(
      localStorageItemName,
      JSON.stringify({ globalFilter, columnsFilter, columnsSort, columnOrder, showFilters, fixedColumnsCount })
    );
  } catch (_) {
    // ignore it
  }
};
