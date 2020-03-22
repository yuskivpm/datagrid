/* eslint-disable react/jsx-curly-newline, jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { InputText } from 'primereact/inputtext';
import { getVisibleColumns } from '../utils/commonUtils';
import { headers, types } from '../services/const';

const sortText = ['pi-sort-amount-down', 'pi-sort-amount-down-alt', 'pi-sort-alt'];
const SHOW_FILTER_VALUE = false; // to avoid eslint react/jsx-boolean-value

const TableHeader = ({
  columnOrder,
  fixedColumnsCount,
  defaultHeaderRowHeight,
  columnsSort,
  onSortChange,
  showFilters,
  onChangeFiltersVisibility,
  defaultFixedRowsColumnWidth,
  onColumnFilterChange,
  columnsFilter,
}) => {
  let headerStikyOfs = defaultFixedRowsColumnWidth;

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

  const getFilterText = checkColumnName => {
    const filterIndex = columnsFilter.findIndex(({ columnName }) => columnName === checkColumnName);
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
            onChange={event => onColumnFilterChange({ columnName, filterText: event.value })}
          />
        );
      case types.ENUM:
        return (
          <MultiSelect
            value={!value ? false : value.substr(1, value.length - 2).split('|')}
            options={list}
            filter={SHOW_FILTER_VALUE}
            onChange={event =>
              onColumnFilterChange({
                columnName,
                filterText: event.value.length ? `(${event.value.join('|')})` : '',
              })
            }
          />
        );
      default:
        return (
          <InputText
            type="text"
            value={getFilterText(columnName)}
            onChange={event => onColumnFilterChange({ columnName, filterText: event.target.value })}
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
          onClick={event =>
            onSortChange({ columnName, isSingle: !(event.shiftKey || event.ctrlKey) })
          }
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

  return (
    <>
      {getVisibleColumns(columnOrder).map(({ columnName }, columnIndex) =>
        createTh(columnName, fixedColumnsCount > columnIndex)
      )}
    </>
  );
};

TableHeader.propTypes = {
  columnOrder: PropTypes.arrayOf(PropTypes.object).isRequired,
  fixedColumnsCount: PropTypes.number,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  columnsSort: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)])
    .isRequired,
  onSortChange: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  onChangeFiltersVisibility: PropTypes.func.isRequired,
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  onColumnFilterChange: PropTypes.func.isRequired,
  columnsFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
};

TableHeader.defaultProps = {
  fixedColumnsCount: 1,
};

export default TableHeader;
