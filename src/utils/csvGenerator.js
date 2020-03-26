import { getCellValueAsString, getVisibleColumns } from './commonUtils';
import { headers } from '../services/const';

export const saveFileAs = (data, filename, type) => {
  try {
    const file = new Blob(data, { type });
    if (window.navigator.msSaveOrOpenBlob) {
      // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
      // Others
      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  } catch (error) {
    // ignore
  }
};

const joinRow = row => `${row.join(',')}\r\n`;

const getHead = columnOrderNames =>
  joinRow(columnOrderNames.map(col => `"${headers[col].displayName}"`));

const getBodyRow = (columnOrderNames, row) =>
  joinRow(
    columnOrderNames.map(
      col => `"${`${getCellValueAsString(row[col], col)}`.replace(new RegExp('"', 'g'), '""')}"`
    )
  );

const getBody = (filteredRowIndexes, columnOrderNames, rows) =>
  filteredRowIndexes.map(filteredRowIndex => getBodyRow(columnOrderNames, rows[filteredRowIndex]));

export const prepareAndSaveCsvFile = (columnOrder, rows, filteredRowIndexes) => {
  const columnOrderNames = getVisibleColumns(columnOrder).map(({ columnName }) => columnName);
  saveFileAs(
    [...getHead(columnOrderNames), ...getBody(filteredRowIndexes, columnOrderNames, rows)],
    'data.csv',
    'text/csv'
  );
};
