import { headers } from '../services/const';

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
  columnOrder.reduce((width, columnName) => width + headers[columnName].colWidth, 0);
