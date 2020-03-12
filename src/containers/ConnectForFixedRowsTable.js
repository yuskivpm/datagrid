import { connect } from 'react-redux';
import FixedRowsTable from '../components/FixedRowsTable';
import * as actions from '../store/actions';
import rowsSortAndFilterSelector from '../store/selectors';

const mapStateToProps = state => {
  const {
    defaultRowHeight,
    defaultHeaderRowHeight,
    defaultFixedRowsColumnWidth,
    rows = [],
    virtualization = true,
  } = state.tableData;
  return {
    rows,
    virtualization,
    defaultRowHeight,
    defaultHeaderRowHeight,
    defaultFixedRowsColumnWidth,
    filteredRowIndexes: rowsSortAndFilterSelector(state),
  };
};

const mapDispatchToProps = dispatch => ({
  onRemoveSelectedRows: selectedRows => dispatch(actions.removeSelectedRows(selectedRows)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FixedRowsTable);
