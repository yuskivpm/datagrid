const localStorageItemName = 'state';

export const loadState = () => {
  try {
    const localData = localStorage.getItem(localStorageItemName);
    if (localData === null) {
      return undefined;
    }
    return JSON.parse(localData);
  } catch (e) {
    return undefined;
  }
};

export const saveState = ({
  tableData: { error, rows, tableLoaded, virtualization, ...restState },
}) => {
  try {
    localStorage.setItem(localStorageItemName, JSON.stringify(restState));
  } catch (e) {
    // ignore
  }
};
