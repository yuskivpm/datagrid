import { getCellValueAsString } from './commonUtils';
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

const getHead = columnOrder => joinRow(columnOrder.map(col => `"${headers[col].displayName}"`));

const getBodyRow = (columnOrder, row) =>
  joinRow(
    columnOrder.map(
      col => `"${`${getCellValueAsString(row[col], col)}`.replace(new RegExp('"', 'g'), '""')}"`
    )
  );

const getBody = (filteredRowIndexdata, columnOrder, rows) =>
  filteredRowIndexdata.map(filteredRowIndex => getBodyRow(columnOrder, rows[filteredRowIndex]));

export const prepareAndSaveCsvFile = (columnOrder, rows, filteredRowIndexdata) => {
  saveFileAs(
    [...getHead(columnOrder), ...getBody(filteredRowIndexdata, columnOrder, rows)],
    'data.csv',
    'text/csv'
  );
};
