/* eslint-disable react/jsx-curly-newline */
/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
// * * HEADER * fixed * number's column
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
// * * HEADER * content's column
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import {
  isCheckedRow,
  getTableWidth,
  getVisibleColumns,
  objectToString,
  dateToString,
} from '../utils/commonUtils';
import { headers, types } from '../services/const';
import './TableNew.css';

const sortText = ['pi-sort-amount-down', 'pi-sort-amount-down-alt', 'pi-sort-alt'];
const SHOW_FILTER_VALUE = false; // to avoid eslint-disable react/jsx-boolean-value

class TableNew extends React.Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.state = {
      scrollTop: 0,
      firstSelected: -1,
      selectedRows: [],
    };
  }

  onRowsSelectionChange = (event, rowId, realRowIndex) => {
    let { firstSelected } = this.state;
    if (!event.shiftKey && !event.ctrlKey) {
      // single click - allow only one row to be selected
      this.setState({ selectedRows: [rowId], firstSelected: realRowIndex });
    } else {
      /* eslint-disable react/destructuring-assignment */
      const selectedRows = [...this.state.selectedRows]; // not for this case
      /* eslint-enable react/destructuring-assignment */
      const firstClickProcess = () => {
        if (selectedRows.includes(rowId)) {
          selectedRows.splice(selectedRows.indexOf(rowId), 1);
        } else {
          selectedRows.push(rowId);
        }
      };
      if (event.shiftKey) {
        const { rows = [], filteredRowIndexes = [] } = this.props;
        if (firstSelected >= filteredRowIndexes.length) {
          // it's can be failed after filtering between first and second clicks
          firstSelected = -1;
        }
        if (firstSelected >= 0) {
          // to avoid eslint no-bitwise
          // known start of the selection list - second click
          const startRange = Math.min(realRowIndex, firstSelected);
          const endRange = Math.max(realRowIndex, firstSelected);
          const idOfUnselectedRows = filteredRowIndexes
            .filter((_, rowIndex) => rowIndex >= startRange && rowIndex <= endRange) // get real indexes of rows in selected range
            .map(filtredIndex => rows[filtredIndex].id);
          if (selectedRows.includes(rows[filteredRowIndexes[firstSelected]].id)) {
            idOfUnselectedRows.forEach(id => {
              if (!selectedRows.includes(id)) {
                selectedRows.push(id);
              }
            });
            this.setState({ selectedRows });
          } else {
            this.setState({
              selectedRows: selectedRows.filter(rowIndex => !idOfUnselectedRows.includes(rowIndex)),
            });
          }
        } else {
          // unknown start of the selection list - first click
          firstClickProcess();
          this.setState({ selectedRows, firstSelected: realRowIndex });
        }
      } else if (event.ctrlKey) {
        firstClickProcess();
        this.setState({ selectedRows, firstSelected: realRowIndex });
      }
    }
  };

  render() {
    const {
      defaultMenuText,
      saveToCsvButtonCaption,
      columnOrder,
      defaultFixedRowsColumnWidth,
      filteredRowIndexes = [],
      defaultRowHeight,
      defaultHeaderRowHeight,
      virtualization,
      rows,
      fixedColumnsCount,
      columnsSort,
      onChangeColumnList,
      onSaveCsv,
      columnsFilter,
      onColumnFilterChange,
      onSortChange,
      showFilters,
      onChangeFiltersVisibility,
      onRemoveSelectedRows,
    } = this.props;
    const { scrollTop, selectedRows } = this.state;
    const rowWidth = `${getTableWidth(columnOrder) + defaultFixedRowsColumnWidth}px`;
    let visibleRowCount;
    let firstVisibleRow;
    let lastVisibleRow;
    let headerStikyOfs = defaultFixedRowsColumnWidth;
    let stikyOfs = defaultFixedRowsColumnWidth;
    if (virtualization) {
      visibleRowCount = Math.ceil(document.body.clientHeight / defaultRowHeight);
      firstVisibleRow = Math.floor(scrollTop / defaultRowHeight);
      lastVisibleRow = firstVisibleRow + visibleRowCount + 2;
    } else {
      visibleRowCount = filteredRowIndexes.length - 1;
      firstVisibleRow = 0;
      lastVisibleRow = visibleRowCount;
    }

    const getSortType = forColumnName => {
      // desc, asc, none
      let result = 2;
      let index = '';
      if (Array.isArray(columnsSort)) {
        // multy sort - array of sort objects
        index = columnsSort.findIndex(({ columnName }) => columnName === forColumnName);
        if (index >= 0) {
          // to avoid eslint no-bitwise
          result = +columnsSort[index].isAscending;
          index += 1; // to avoid eslint no-plusplus. But why???
        } else {
          index = '';
        }
      } else if (columnsSort.columnName === forColumnName) {
        // single sort - simple sort object
        result = +columnsSort.isAscending;
      }
      return { text: sortText[result], index };
    };

    // * * HEADER * fixed * number's column
    const fixedColumnHeaderCell = () => {
      const optionsMenu = Object.keys(headers).map(value => ({
        label: headers[value].displayName,
        value,
      }));
      return (
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
            tooltip="Download csv file with visible columns & filtered row data"
            onClick={() => onSaveCsv(filteredRowIndexes)}
          />
          <MultiSelect
            value={columnOrder
              .filter(({ isVisible }) => isVisible)
              .map(({ columnName }) => columnName)}
            options={optionsMenu}
            placeholder={defaultMenuText}
            filter={false}
            maxSelectedLabels={0}
            selectedItemsLabel={defaultMenuText}
            onChange={event => onChangeColumnList(event.value)}
          />
        </div>
      );
    };

    // * * HEADER * content's column
    const getFilterText = checkColumnName => {
      const filterIndex = columnsFilter.findIndex(
        ({ columnName }) => columnName === checkColumnName
      );
      // to avoid eslint no-bitwise
      return filterIndex >= 0 ? columnsFilter[filterIndex].filterText : '';
    };

    const getLists = (curColumnHeader, columnName) =>
      Array.isArray(curColumnHeader.values)
        ? {
            list: curColumnHeader.values.map(value => ({ label: value, value })),
            value: getFilterText(columnName),
          }
        : {};

    const getFilterInput = columnName => {
      const curColumnHeader = headers[columnName];
      const { list, value } = getLists(curColumnHeader, columnName);
      switch (curColumnHeader.type) {
        case types.BOOLEAN:
          return (
            <SelectButton
              value={value}
              options={list}
              onChange={event => onColumnFilterChange(columnName, event.value)}
            />
          );
        case types.ENUM:
          return (
            <MultiSelect
              value={!value ? false : value.substr(1, value.length - 2).split('|')}
              options={list}
              filter={SHOW_FILTER_VALUE}
              onChange={event =>
                onColumnFilterChange(
                  columnName,
                  event.value.length ? `(${event.value.join('|')})` : ''
                )
              }
            />
          );
        default:
          return (
            <InputText
              type="text"
              value={getFilterText(columnName)}
              onChange={event => onColumnFilterChange(columnName, event.target.value)}
            />
          );
      }
    };

    const createTh = (columnName, isStiky) => {
      const sortType = getSortType(columnName);
      const curColumn = headers[columnName];
      headerStikyOfs += curColumn.colWidth;
      return (
        <div
          className={`th ${isStiky ? ' stiky' : ''}`}
          style={{
            left: `${headerStikyOfs - curColumn.colWidth}px`,
            width: `${curColumn.colWidth}px`,
            height: `${defaultHeaderRowHeight}px`,
          }}
          key={`th-${columnName}`}
        >
          <div
            className="th-filter"
            onClick={event => onSortChange(columnName, !(event.shiftKey || event.ctrlKey))}
          >
            {curColumn.displayName}
            <div className="hd-buttons">
              <i
                className={`pi ${
                  getFilterText(columnName)
                    ? 'pi-filter'
                    : `pi-search-${showFilters ? 'minus' : 'plus'}`
                }`}
                onClick={event => {
                  event.stopPropagation();
                  onChangeFiltersVisibility();
                }}
              />
              <i className={`pi ${sortType.text}`}>{`${sortType.index}`}</i>
            </div>
          </div>
          <div className={`${showFilters ? '' : 'hide'}`}>{getFilterInput(columnName)}</div>
        </div>
      );
    };

    // * * CONTENT * number's column
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
      <div className="table">
        <div
          className="scroll"
          ref={this.scrollRef}
          onScroll={() => this.setState({ scrollTop: this.scrollRef.current.scrollTop })}
        >
          <div
            className="container"
            style={{
              width: rowWidth,
              height: `${defaultHeaderRowHeight + filteredRowIndexes.length * defaultRowHeight}px`,
            }}
            position="relative"
          >
            {/* Header start */}
            <div
              className="tr stiky"
              style={{
                width: rowWidth,
                height: `${defaultHeaderRowHeight}px`,
              }}
            >
              {fixedColumnHeaderCell()}
              {getVisibleColumns(columnOrder).map(({ columnName }, columnIndex) =>
                createTh(columnName, fixedColumnsCount > columnIndex)
              )}
            </div>
            {/* Header end */}
            {/* Content start */}
            {filteredRowIndexes
              .filter(
                (_, filterIndex) => filterIndex >= firstVisibleRow && filterIndex <= lastVisibleRow
              )
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
                    }`}
                    style={{
                      width: `${getTableWidth(columnOrder) + defaultFixedRowsColumnWidth}px`,
                      height: `${defaultRowHeight}px`,
                      top: `${defaultHeaderRowHeight +
                        (firstVisibleRow + index) * defaultRowHeight}px`,
                    }}
                    onClick={event =>
                      this.onRowsSelectionChange(
                        event,
                        rows[filteredRowIndex].id,
                        index + firstVisibleRow
                      )
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
            {/* Content end */}
          </div>
        </div>
      </div>
    );
    /* eslint-enable no-bitwise */
  }
}

TableNew.propTypes = {
  defaultMenuText: PropTypes.string,
  saveToCsvButtonCaption: PropTypes.string,
  fixedColumnsCount: PropTypes.number,
  columnOrder: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChangeColumnList: PropTypes.func.isRequired,
  onSaveCsv: PropTypes.func.isRequired,
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
  columnsFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
  showFilters: PropTypes.bool.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onChangeFiltersVisibility: PropTypes.func.isRequired,
  onColumnFilterChange: PropTypes.func.isRequired,
  columnsSort: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)])
    .isRequired,
  onRemoveSelectedRows: PropTypes.func.isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  virtualization: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

TableNew.defaultProps = {
  fixedColumnsCount: 1,
  defaultMenuText: 'Columns',
  saveToCsvButtonCaption: 'Save to csv',
};

export default TableNew;
