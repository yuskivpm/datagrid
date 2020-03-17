/* eslint-disable react/jsx-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import {
  isCheckedRow,
  getTableWidth,
  getVisibleColumns,
  objectToString,
  dateToString,
} from '../utils/commonUtils';
import { headers, types } from '../services/const';

const TableContent = props => {
  const {
    columnOrder,
    defaultFixedRowsColumnWidth,
    filteredRowIndexes = [],
    defaultRowHeight,
    defaultHeaderRowHeight,
    rows,
    fixedColumnsCount,
    onRemoveSelectedRows,
    firstVisibleRow,
    lastVisibleRow,
    onRowsSelectionChange,
    selectedRows,
  } = props;

  let stikyOfs = defaultFixedRowsColumnWidth;

  const fixedRowCell = (filteredRowIndex, index) => {
    return (
      <div
        className="td stiky fix-num"
        style={{
          width: `${defaultFixedRowsColumnWidth}px`,
        }}
        key={rows[filteredRowIndex].id}
      >
        <label htmlFor={`cb${index + firstVisibleRow + 1}`} className="p-checkbox-label">
          {index + firstVisibleRow + 1}
        </label>
        <i
          className="pi pi-trash"
          onClick={event => {
            event.stopPropagation();
            onRemoveSelectedRows(selectedRows);
          }}
        />
      </div>
    );
  };

  const createCell = (columnName, row, cellKey, classNamePref) => {
    const cell = row[columnName];
    const curColumnHeader = headers[columnName];
    stikyOfs += curColumnHeader.colWidth;
    let cellValue;
    switch (curColumnHeader.type) {
      case types.BOOLEAN:
        cellValue = curColumnHeader.values[+cell];
        break;
      case types.OBJECT:
        cellValue = objectToString(cell);
        break;
      case types.INSTANT:
        cellValue = dateToString(cell);
        break;
      default:
        cellValue = cell;
    }
    return (
      <div
        key={cellKey}
        className={`td value ${curColumnHeader.type} ${classNamePref}`}
        style={{
          width: `${curColumnHeader.colWidth}px`,
          left: `${stikyOfs - curColumnHeader.colWidth}px`,
        }}
      >
        {`${cellValue}`}
      </div>
    );
  };

  /* eslint-disable no-bitwise */
  // <- using "&" is the simplest way to test odd/even values
  return (
    <>
      {filteredRowIndexes
        .filter((_, filterIndex) => filterIndex >= firstVisibleRow && filterIndex <= lastVisibleRow)
        .map((filteredRowIndex, index) => {
          const isSelected = isCheckedRow(rows, selectedRows, filteredRowIndex)
            ? 'selected-row'
            : '';
          stikyOfs = defaultFixedRowsColumnWidth;
          return (
            <div
              key={rows[filteredRowIndex].id}
              className={`tr content ${isSelected} ${
                (firstVisibleRow + index) & 1 ? 'odd' : 'even'
                }`
              }
              style={{
                width: `${getTableWidth(columnOrder) + defaultFixedRowsColumnWidth}px`,
                height: `${defaultRowHeight}px`,
                top: `${defaultHeaderRowHeight + (firstVisibleRow + index) * defaultRowHeight}px`,
              }}
              onClick={event =>
                onRowsSelectionChange(event, rows[filteredRowIndex].id, index + firstVisibleRow)
              }
            >
              {fixedRowCell(filteredRowIndex, index)}
              {getVisibleColumns(columnOrder).map(({ columnName }, columnIndex) =>
                createCell(
                  columnName,
                  rows[filteredRowIndex],
                  `${rows[filteredRowIndex].id}.${columnIndex}`,
                  `${fixedColumnsCount > columnIndex ? ' stiky' : ''}`
                )
              )}
            </div>
          );
        })}
    </>
  );
};

TableContent.propTypes = {
  columnOrder: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  fixedColumnsCount: PropTypes.number,
  onRemoveSelectedRows: PropTypes.func.isRequired,
  firstVisibleRow: PropTypes.number.isRequired,
  lastVisibleRow: PropTypes.number.isRequired,
  onRowsSelectionChange: PropTypes.func.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
};

TableContent.defaultProps = {
  fixedColumnsCount: 1,
};

export default TableContent;
