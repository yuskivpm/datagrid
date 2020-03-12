import { connect } from 'react-redux';
import FixedRowHeader from '../components/FixedRowHeader';
import * as actions from '../store/actions';
import rowsSortAndFilterSelector from '../store/selectors';

const mapStateToProps = state => {
  const { defaultFixedRowsColumnWidth, defaultHeaderRowHeight, columnOrder = [] } = state.tableData;
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

export default connect(mapStateToProps, mapDispatchToProps)(FixedRowHeader);
