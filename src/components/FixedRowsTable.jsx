import React from 'react';
import PropTypes from 'prop-types';
import { isCheckedRow } from '../utils/commonUtils';

const FixedRowsTable = props => {
  const {
    virtualization,
    onRemoveSelectedRows,
    defaultRowHeight,
    defaultHeaderRowHeight,
    defaultFixedRowsColumnWidth,
    onRowsSelectionChange,
    scrollTop,
    selectedRows = [],
    rows = [],
    filteredRowIndexes = [],
  } = props;
  /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
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
  /* eslint-disable react/jsx-curly-newline */
  return (
    <div
      className="table"
      style={{
        top: `${scrollTop + firstVisibleRow * defaultRowHeight}px`,
        width: `${defaultFixedRowsColumnWidth}px`,
      }}
    >
      {filteredRowIndexes
        .filter((_, index) => index >= firstVisibleRow && index <= lastVisibleRow)
        .map((filteredRowIndex, index) => (
          <div
            key={rows[filteredRowIndex].id}
            className={`tr ${
              isCheckedRow(rows, selectedRows, filteredRowIndex) ? 'selected-row' : ''
              }`
            }
            onClick={event =>
              onRowsSelectionChange(event, rows[filteredRowIndex].id, index + firstVisibleRow)
            }
          >
            <div className="td" style={{ height: `${defaultRowHeight}px` }}>
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
          </div>
        ))}
    </div>
  );
  /* eslint-enable react/jsx-curly-newline */
  /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
};

FixedRowsTable.propTypes = {
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
  onRemoveSelectedRows: PropTypes.func.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  onRowsSelectionChange: PropTypes.func.isRequired,
  scrollTop: PropTypes.number.isRequired,
  virtualization: PropTypes.bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  rows: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default FixedRowsTable;
