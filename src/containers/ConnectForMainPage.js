import { connect } from 'react-redux';
import MainPage from '../components/MainPage';
import {
  tableGlobalFilter,
  changeTableVirtualization,
  fetchTableData,
  fetchTableDataReceive,
  fetchTableDataError,
  changeFixedColumnsCount,
} from '../store/actions';
import rowsSortAndFilterSelector from '../store/selectors';

const mapStateToProps = state => {
  const {
    tableLoaded,
    error,
    globalFilter,
    columnsFilter,
    defaultRowHeight,
    virtualization = true,
    fixedColumnsCount = 1,
    columnOrder,
    rows,
  } = state.tableData;
  return {
    tableLoaded,
    error,
    globalFilter,
    columnsFilter,
    defaultRowHeight,
    virtualization,
    fixedColumnsCount,
    columnOrder,
    currentAllRowsCount: rows.length,
    filteredRowsCount: rowsSortAndFilterSelector(state).length,
  };
};

const mapDispatchToProps = dispatch => ({
  onGlobalFilterChange: searchText => dispatch(tableGlobalFilter(searchText)),
  onChangeTableVirtualization: () => dispatch(changeTableVirtualization()),
  onFixedColumnsCountChange: newFixedColumnsCount =>
    dispatch(changeFixedColumnsCount(newFixedColumnsCount)),
  onNeedFetch: (rowCount, loadUiConst) =>
    dispatch(
      fetchTableData(rowCount, loadUiConst, (data, error) =>
        dispatch(data ? fetchTableDataReceive(data) : fetchTableDataError(error))
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
