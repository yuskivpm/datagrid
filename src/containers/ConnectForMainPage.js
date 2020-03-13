import { connect } from 'react-redux';
import PureMainPage from '../components/PureMainPage';
import {
  tableGlobalFilter,
  changeTableVirtualization,
  fetchTableData,
  fetchTableDataReceive,
  fetchTableDataError
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
  } = state.tableData;
  return {
    tableLoaded,
    error,
    globalFilter,
    columnsFilter,
    defaultRowHeight,
    virtualization,
    filteredRowsCount: rowsSortAndFilterSelector(state).length,
  };
};

const mapDispatchToProps = dispatch => ({
  onGlobalFilterChange: searchText => dispatch(tableGlobalFilter(searchText)),
  onChangeTableVirtualization: () => dispatch(changeTableVirtualization()),
  onNeedFetch: (rowCount, loadUiConst) => dispatch(
    fetchTableData(
      rowCount,
      loadUiConst,
      (data, error) => dispatch(
        data
          ? fetchTableDataReceive(data)
          : fetchTableDataError(error)
      )
    )
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PureMainPage);
