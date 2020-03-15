import { connect } from 'react-redux';
import TableNew from '../components/TableNew';
import rowsSortAndFilterSelector from '../store/selectors';
import * as actions from '../store/actions';

const mapStateToProps = state => {
  const {
    fixedColumnsCount,
    // header fixed number
    defaultFixedRowsColumnWidth,
    defaultHeaderRowHeight,
    columnOrder = [],
    // header content
    columnsSort = {},
    columnsFilter = [],
    showFilters = false,
    // rows fixed number
    defaultRowHeight,
    virtualization = true,
    rows = [],
    // rows content
  } = state.tableData;
  return {
    fixedColumnsCount,
    columnOrder,
    defaultFixedRowsColumnWidth,
    defaultHeaderRowHeight,
    rows,
    columnsSort,
    columnsFilter,
    showFilters,
    defaultRowHeight,
    virtualization,
    filteredRowIndexes: rowsSortAndFilterSelector(state),
  };
};

const mapDispatchToProps = dispatch => ({
  // header fixed number
  onChangeColumnList: selectedColumns => dispatch(actions.changeColumnList(selectedColumns)),
  onSaveCsv: filteredRowIndexes => dispatch(actions.saveCsvTableData(filteredRowIndexes)),
  // header content
  onSortChange: (columnName, isSingle) => dispatch(actions.tableSort({ columnName, isSingle })),
  onChangeFiltersVisibility: () => dispatch(actions.changeFiltersVisibility()),
  onColumnFilterChange: (columnName, filterText) =>
    dispatch(actions.tableColumnFilter({ columnName, filterText })),
  // rows fixed number
  onRemoveSelectedRows: selectedRows => dispatch(actions.removeSelectedRows(selectedRows)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableNew);
