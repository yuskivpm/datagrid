import { connect } from 'react-redux';
import TableContent from '../components/TableContent';
import rowsSortAndFilterSelector from '../store/selectors';
import * as actions from '../store/actions';

const mapStateToProps = state => {
  const {
    columnOrder = [],
    defaultFixedRowsColumnWidth,
    defaultRowHeight,
    defaultHeaderRowHeight,
    rows = [],
    fixedColumnsCount,
  } = state.tableData;
  return {
    columnOrder,
    defaultFixedRowsColumnWidth,
    filteredRowIndexes: rowsSortAndFilterSelector(state),
    defaultRowHeight,
    defaultHeaderRowHeight,
    rows,
    fixedColumnsCount,
  };
};

const mapDispatchToProps = { onRemoveSelectedRows: actions.removeSelectedRows };

export default connect(mapStateToProps, mapDispatchToProps)(TableContent);
