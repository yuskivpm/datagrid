import { connect } from 'react-redux';
import ContentTable from '../components/ContentTable';
import rowsSortAndFilterSelector from '../store/selectors';

const mapStateToProps = state => {
  const {
    defaultRowHeight,
    defaultHeaderRowHeight,
    rows = [],
    columnOrder = [],
    virtualization = true,
  } = state.tableData;
  return {
    rows,
    columnOrder,
    virtualization,
    defaultHeaderRowHeight,
    defaultRowHeight,
    filteredRowIndexes: rowsSortAndFilterSelector(state),
  };
};

export default connect(mapStateToProps)(ContentTable);
