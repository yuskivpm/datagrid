import { connect } from 'react-redux';
import TableHeader from '../components/TableHeader';
import * as actions from '../store/actions';

const mapStateToProps = ({
  tableData: {
    columnOrder = [],
    fixedColumnsCount,
    defaultHeaderRowHeight,
    columnsSort = {},
    showFilters = false,
    defaultFixedRowsColumnWidth,
    columnsFilter = [],
  },
}) => ({
  columnOrder,
  fixedColumnsCount,
  defaultHeaderRowHeight,
  columnsSort,
  showFilters,
  defaultFixedRowsColumnWidth,
  columnsFilter,
});

const mapDispatchToProps = {
  onSortChange: actions.tableSort,
  onChangeFiltersVisibility: actions.changeFiltersVisibility,
  onColumnFilterChange: actions.tableColumnFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(TableHeader);
