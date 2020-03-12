import React from 'react';
import PropTypes from 'prop-types';
import { isCheckedRow, getTableWidth } from '../utils/commonUtils';
import { headers } from '../services/const';

const objectToString = cell => {
  try {
    return JSON.stringify(cell, null, 2);
  } catch (_) {
    return '';
  }
};

const dateToString = cell => {
  try {
    return new Date(cell).toISOString();
  } catch (_) {
    return '';
  }
};

const ContentTable = props => {
  const {
    columnOrder,
    virtualization,
    defaultRowHeight,
    defaultHeaderRowHeight,
    selectedRows,
    onRowsSelectionChange,
    onHandleScroll,
    scrollTop,
    rows = [],
    filteredRowIndexes = [],
  } = props;
  const scrollRef = React.createRef();
  let visibleRowCount;
  let firstVisibleRow;
  let lastVisibleRow;
  if (virtualization) {
    visibleRowCount = Math.ceil(document.body.clientHeight / defaultRowHeight);
    firstVisibleRow = Math.floor((-scrollTop + defaultHeaderRowHeight) / defaultRowHeight);
    lastVisibleRow = firstVisibleRow + visibleRowCount + 2;
  } else {
    visibleRowCount = filteredRowIndexes.length - 1;
    firstVisibleRow = 0;
    lastVisibleRow = visibleRowCount;
  }

  const createCell = (columnName, row, cellKey) => {
    const cell = row[columnName];
    const curColumnHeader = headers[columnName];
    let cellValue;
    switch (curColumnHeader.type) {
      case 'boolean':
        cellValue = curColumnHeader.values[+cell];
        break;
      case 'object':
        cellValue = objectToString(cell);
        break;
      case 'instant':
        cellValue = dateToString(cell);
        break;
      default:
        cellValue = cell;
    }
    return (
      <div
        key={cellKey}
        className={`td ${curColumnHeader.type}`}
        style={{ width: `${curColumnHeader.colWidth}px` }}
      >
        {`${cellValue}`}
      </div>
    );
  };

  const createRow = (filteredRowIndex, realRowIndex) => {
    const row = rows[filteredRowIndex];
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    return (
      <div
        style={{ height: `${defaultRowHeight}px` }}
        key={row.id}
        className={`tr tr-values ${
          isCheckedRow(rows, selectedRows, filteredRowIndex) ? 'selected-row' : ''
          }`
        }
        onClick={event => onRowsSelectionChange(event, row.id, realRowIndex)}
      >
        {columnOrder.map((columnName, index) => createCell(columnName, row, `${row.id}.${index}`))}
      </div>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
  };

  return (
    <div className="scroll-area" ref={scrollRef} onScroll={() => onHandleScroll(scrollRef.current)}>
      <div
        style={{
          height: `${defaultRowHeight * filteredRowIndexes.length}px`,
          width: `${getTableWidth(columnOrder)}px`,
        }}
      >
        <div style={{ height: `${firstVisibleRow * defaultRowHeight}px` }} />
        {filteredRowIndexes
          .filter((_, index) => index >= firstVisibleRow && index <= lastVisibleRow)
          .map((el, index) => createRow(el, index + firstVisibleRow))}
      </div>
    </div>
  );
};

ContentTable.propTypes = {
  columnOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
  onHandleScroll: PropTypes.func.isRequired,
  onRowsSelectionChange: PropTypes.func.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  virtualization: PropTypes.bool.isRequired,
  scrollTop: PropTypes.number.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  /* eslint-disable react/forbid-prop-types */
  rows: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default ContentTable;
