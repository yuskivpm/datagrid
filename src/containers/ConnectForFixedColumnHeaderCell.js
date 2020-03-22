import { connect } from 'react-redux';
import FixedColumnHeaderCell from '../components/FixedColumnHeaderCell';
import rowsSortAndFilterSelector from '../store/selectors';
import * as actions from '../store/actions';

const mapStateToProps = state => {
  const { columnOrder = [], defaultFixedRowsColumnWidth, defaultHeaderRowHeight } = state.tableData;
  return {
    columnOrder,
    defaultFixedRowsColumnWidth,
    defaultHeaderRowHeight,
    filteredRowIndexes: rowsSortAndFilterSelector(state),
  };
};

const mapDispatchToProps = {
  onChangeColumnList: actions.changeColumnList,
  onSaveCsv: actions.saveCsvTableData,
};

export default connect(mapStateToProps, mapDispatchToProps)(FixedColumnHeaderCell);
