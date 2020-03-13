import React from 'react';
import PropTypes from 'prop-types';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { headers } from '../services/const';

const fixedRowsHeader = props => {
  const {
    onChangeColumnList,
    defaultFixedRowsColumnWidth,
    defaultHeaderRowHeight,
    onSaveCsv,
    saveToCsvButtonCaption,
    defaultMenuText,
    columnOrder = [],
    filteredRowIndexes = [],
  } = props;

  const optionsMenu = Object.keys(headers).map(value => ({
    label: headers[value].displayName,
    value,
  }));

  return (
    <div
      className="table table-header th"
      style={{
        height: `${defaultHeaderRowHeight}px`,
        width: `${defaultFixedRowsColumnWidth}px`,
      }}
    >
      <MultiSelect
        value={columnOrder}
        options={optionsMenu}
        placeholder={defaultMenuText}
        filter={false}
        maxSelectedLabels={0}
        selectedItemsLabel={defaultMenuText}
        onChange={event => onChangeColumnList(event.value)}
      />
      <Button
        label={saveToCsvButtonCaption}
        tooltip="Download csv file with visible columns & filtered row data"
        onClick={() => onSaveCsv(filteredRowIndexes)}
      />
    </div>
  );
};

fixedRowsHeader.propTypes = {
  columnOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChangeColumnList: PropTypes.func.isRequired,
  onSaveCsv: PropTypes.func.isRequired,
  saveToCsvButtonCaption: PropTypes.string.isRequired,
  defaultMenuText: PropTypes.string.isRequired,
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default fixedRowsHeader;
