import { checkAndCorrectStateValues } from './commonUtils';

const localStorageItemName = 'state';

export const loadState = () => {
  try {
    const localData = localStorage.getItem(localStorageItemName);
    if (localData === null) {
      return undefined;
    }
    return checkAndCorrectStateValues(JSON.parse(localData));
  } catch (e) {
    return undefined;
  }
};

export const saveState = ({
  tableData: { globalFilter, columnsFilter, columnsSort, columnOrder, showFilters },
}) => {
  try {
    localStorage.setItem(
      localStorageItemName,
      JSON.stringify({ globalFilter, columnsFilter, columnsSort, columnOrder, showFilters })
    );
  } catch (e) {
    // ignore
  }
};
