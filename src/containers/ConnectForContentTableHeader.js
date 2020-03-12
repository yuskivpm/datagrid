import { connect } from 'react-redux';
import ContentTableHeader from '../components/ContentTableHeader';
import * as actions from '../store/actions';

const mapStateToProps = ({
  tableData: {
    defaultHeaderRowHeight,
    columnOrder = [],
    columnsSort = {},
    columnsFilter = [],
    showFilters = false,
  },
}) => ({
  columnOrder,
  columnsSort,
  columnsFilter,
  showFilters,
  defaultHeaderRowHeight,
});

const mapDispatchToProps = dispatch => ({
  onSortChange: (columnName, isSingle) => dispatch(actions.tableSort({ columnName, isSingle })),
  onChangeFiltersVisibility: () => dispatch(actions.changeFiltersVisibility()),
  onColumnFilterChange: (columnName, filterText) =>
    dispatch(actions.tableColumnFilter({ columnName, filterText })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentTableHeader);
