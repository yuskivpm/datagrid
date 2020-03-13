import React from 'react';
import PropTypes from 'prop-types';
import { SelectButton } from 'primereact/selectbutton';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { getTableWidth } from '../utils/commonUtils';
import { headers } from '../services/const';

const sortText = ['pi-sort-amount-down', 'pi-sort-amount-down-alt', 'pi-sort-alt'];

const ContentTableHeader = props => {
  const {
    showFilters,
    onSortChange,
    onChangeFiltersVisibility,
    onColumnFilterChange,
    defaultHeaderRowHeight,
    scrollLeft,
    columnOrder = [],
    columnsSort = {},
    columnsFilter = [],
  } = props;

  const getFilterText = checkColumnName => {
    const filterIndex = columnsFilter.findIndex(({ columnName }) => columnName === checkColumnName);
    /* eslint-disable no-bitwise */
    return ~filterIndex ? columnsFilter[filterIndex].filterText : '';
    /* eslint-enable no-bitwise */
  };

  const getSortType = forColumnName => {
    // desc, asc, none
    let result = 2;
    let index = '';
    if (Array.isArray(columnsSort)) {
      // multy sort - array of sort objects
      index = columnsSort.findIndex(({ columnName }) => columnName === forColumnName);
      /* eslint-disable no-bitwise */
      if (~index) {
        /* eslint-enable no-bitwise */
        result = +columnsSort[index].isAscending;
        /* eslint-disable no-plusplus */
        ++index;
        /* eslint-enable no-plusplus */
      } else {
        index = '';
      }
    } else if (columnsSort.columnName === forColumnName) {
      // single sort - simple sort object
      result = +columnsSort.isAscending;
    }
    return { text: sortText[result], index };
  };

  const getLists = (curColumnHeader, columnName) => ({
    list: curColumnHeader.values.map(value => ({ label: value, value })),
    value: getFilterText(columnName),
  });

  const getFilterInput = columnName => {
    const curColumnHeader = headers[columnName];
    switch (curColumnHeader.type) {
      case 'boolean':
        /* eslint-disable no-case-declarations */
        const { list: booleanList, value: booleanValue } = getLists(curColumnHeader, columnName);
        /* eslint-enable no-case-declarations */
        return (
          <SelectButton
            value={booleanValue}
            options={booleanList}
            onChange={event => onColumnFilterChange(columnName, event.value)}
          />
        );
      case 'enum':
        /* eslint-disable no-case-declarations */
        const { list: enumList, value: enumFilterText } = getLists(curColumnHeader, columnName);
        const enumValue = !enumFilterText
          ? false
          : enumFilterText.substr(1, enumFilterText.length - 2).split('|');
        /* eslint-enable no-case-declarations */
        /* eslint-disable react/jsx-boolean-value, react/jsx-curly-newline */
        return (
          <MultiSelect
            value={enumValue}
            options={enumList}
            filter={false}
            onChange={event =>
              onColumnFilterChange(
                columnName,
                event.value.length ? `(${event.value.join('|')})` : ''
              )
            }
          />
        );
      /* eslint-enable react/jsx-boolean-value */
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

  const createTh = columnName => {
    const sortType = getSortType(columnName);
    /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    return (
      <div
        className="th th-container"
        key={`th-${columnName}`}
        style={{ width: `${headers[columnName].colWidth}px` }}
      >
        <div
          className="th-filter"
          onClick={event => onSortChange(columnName, !(event.shiftKey || event.ctrlKey))}
        >
          {headers[columnName].displayName}
          <div className="hd-buttons">
            <i
              className={`pi ${
                getFilterText(columnName)
                  ? 'pi-filter'
                  : `pi-search-${showFilters ? 'minus' : 'plus'}`
                }`
              }
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
    /* eslint-enable react/jsx-curly-newline */
    /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
  };

  return (
    <div
      className="table-header table-value"
      style={{
        width: `${getTableWidth(columnOrder)}px`,
        flex: `0 0 ${defaultHeaderRowHeight}px`,
      }}
    >
      <div
        className="table table-content"
        style={{
          height: `${defaultHeaderRowHeight}px`,
          left: scrollLeft,
        }}
      >
        {columnOrder.map(createTh)}
      </div>
    </div>
  );
};

ContentTableHeader.propTypes = {
  columnOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnsFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
  showFilters: PropTypes.bool.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onChangeFiltersVisibility: PropTypes.func.isRequired,
  onColumnFilterChange: PropTypes.func.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  scrollLeft: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  columnsSort: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default ContentTableHeader;
