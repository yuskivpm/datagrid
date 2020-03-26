import { connect } from 'react-redux';
import Table from '../components/Table';
import rowsSortAndFilterSelector from '../store/selectors';

const mapStateToProps = state => {
  const {
    columnOrder = [],
    defaultFixedRowsColumnWidth,
    defaultRowHeight,
    defaultHeaderRowHeight,
    virtualization = true,
    rows = [],
  } = state.tableData;
  return {
    columnOrder,
    defaultFixedRowsColumnWidth,
    defaultRowHeight,
    defaultHeaderRowHeight,
    virtualization,
    rows,
    filteredRowIndexes: rowsSortAndFilterSelector(state),
  };
};

export default connect(mapStateToProps)(Table);
