import { connect } from 'react-redux';
import PureTable from '../components/PureTable';
import rowsSortAndFilterSelector from '../store/selectors';

const mapStateToProps = state => {
  const { defaultFixedRowsColumnWidth, defaultHeaderRowHeight, rows = [] } = state.tableData;
  return {
    defaultFixedRowsColumnWidth,
    defaultHeaderRowHeight,
    rows,
    filteredRowIndexes: rowsSortAndFilterSelector(state),
  };
};

export default connect(mapStateToProps)(PureTable);
