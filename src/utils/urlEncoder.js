import { headers } from '../services/const';

const querystring = require('querystring');

export const prepareFiltersFromUrl = search => {
  const query = querystring.parse(
    search.startsWith('?') || search.startsWith('#') ? search.substr(1) : search
  );
  let globalFilter = '';
  const columnsFilter = [];
  Object.keys(query).forEach(key => {
    if (key === 'q') {
      globalFilter = query[key];
    } else if (Array.isArray(query[key])) {
      columnsFilter.push({ columnName: key, filterText: query[key].join('|') });
    } else {
      columnsFilter.push({ columnName: key, filterText: query[key] });
    }
  });
  if (globalFilter || columnsFilter.length) {
    return { globalFilter, columnsFilter };
  }
  return undefined;
};

export const generateUrl = (globalFilter, columnsFilter) => {
  if (!globalFilter && !columnsFilter.length) {
    return 'Fill in the filters to generate a direct link';
  }
  const result = [];
  if (globalFilter) {
    result.push(`q=${globalFilter}`);
  }
  columnsFilter.forEach(({ columnName, filterText }) => {
    switch (headers[columnName].type) {
      case 'enum':
        result.push(
          filterText
            .substr(1, filterText.length - 2)
            .split('|')
            .map(part => `${columnName}=${part}`)
            .join('&')
        );
        break;
      default:
        result.push(`${columnName}=${filterText}`);
    }
  });
  return `/?${result.join('&')}`;
};
