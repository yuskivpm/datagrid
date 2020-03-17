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

const mapDispatchToProps = dispatch => ({
  onChangeColumnList: selectedColumns => dispatch(actions.changeColumnList(selectedColumns)),
  onSaveCsv: filteredRowIndexes => dispatch(actions.saveCsvTableData(filteredRowIndexes)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FixedColumnHeaderCell);
