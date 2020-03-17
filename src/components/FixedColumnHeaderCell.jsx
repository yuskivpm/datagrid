import React from 'react';
import PropTypes from 'prop-types';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { headers } from '../services/const';

const optionsMenu = Object.keys(headers).map(value => ({
  label: headers[value].displayName,
  value,
}));

const FixedColumnHeaderCell = ({
  defaultMenuText,
  saveToCsvButtonCaption,
  buttonTooltip,
  columnOrder,
  defaultFixedRowsColumnWidth,
  filteredRowIndexes = [],
  defaultHeaderRowHeight,
  onChangeColumnList,
  onSaveCsv,
}) => (
  <div
    className="th stiky fix-num"
    style={{
      height: `${defaultHeaderRowHeight}px`,
      width: `${defaultFixedRowsColumnWidth}px`,
      flex: `0 0 ${defaultFixedRowsColumnWidth}px`,
    }}
  >
    <Button
      label={saveToCsvButtonCaption}
      tooltip={buttonTooltip}
      onClick={() => onSaveCsv(filteredRowIndexes)}
    />
    <MultiSelect
      value={columnOrder.filter(({ isVisible }) => isVisible).map(({ columnName }) => columnName)}
      options={optionsMenu}
      placeholder={defaultMenuText}
      filter={false}
      maxSelectedLabels={0}
      selectedItemsLabel={defaultMenuText}
      onChange={event => onChangeColumnList(event.value)}
    />
  </div>
);

FixedColumnHeaderCell.propTypes = {
  defaultMenuText: PropTypes.string,
  saveToCsvButtonCaption: PropTypes.string,
  buttonTooltip: PropTypes.string,
  columnOrder: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  onChangeColumnList: PropTypes.func.isRequired,
  onSaveCsv: PropTypes.func.isRequired,
};

FixedColumnHeaderCell.defaultProps = {
  defaultMenuText: 'Columns',
  saveToCsvButtonCaption: 'Save to csv',
  buttonTooltip: '',
};

export default FixedColumnHeaderCell;
