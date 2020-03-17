import { connect } from 'react-redux';
import TableHeader from '../components/TableHeader';
import * as actions from '../store/actions';

const mapStateToProps = state => {
  const {
    columnOrder = [],
    fixedColumnsCount,
    defaultHeaderRowHeight,
    columnsSort = {},
    showFilters = false,
    defaultFixedRowsColumnWidth,
    columnsFilter = [],
  } = state.tableData;
  return {
    columnOrder,
    fixedColumnsCount,
    defaultHeaderRowHeight,
    columnsSort,
    showFilters,
    defaultFixedRowsColumnWidth,
    columnsFilter,
  };
};

const mapDispatchToProps = dispatch => ({
  onSortChange: (columnName, isSingle) => dispatch(actions.tableSort({ columnName, isSingle })),
  onChangeFiltersVisibility: () => dispatch(actions.changeFiltersVisibility()),
  onColumnFilterChange: (columnName, filterText) =>
    dispatch(actions.tableColumnFilter({ columnName, filterText })),
});

export default connect(mapStateToProps, mapDispatchToProps)(TableHeader);