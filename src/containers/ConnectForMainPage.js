import { connect } from 'react-redux';
import MainPage from '../components/MainPage';
import {
  tableGlobalFilter,
  changeTableVirtualization,
  fetchTableData,
  fetchTableDataReceive,
  fetchTableDataError,
  changeFixedColumnsCount,
  changeFakerSeed,
} from '../store/actions';
import rowsSortAndFilterSelector from '../store/selectors';

const mapStateToProps = state => {
  const {
    tableLoaded,
    error,
    globalFilter,
    columnsFilter,
    virtualization = true,
    fixedColumnsCount = 1,
    columnOrder,
    rows,
    fakerSeed = 0,
  } = state.tableData;
  return {
    tableLoaded,
    error,
    globalFilter,
    columnsFilter,
    virtualization,
    fixedColumnsCount,
    columnOrder,
    fakerSeed,
    currentAllRowsCount: rows.length,
    filteredRowsCount: rowsSortAndFilterSelector(state).length,
  };
};

const mapDispatchToProps = dispatch => ({
  onGlobalFilterChange: searchText => dispatch(tableGlobalFilter(searchText)),
  onChangeTableVirtualization: () => dispatch(changeTableVirtualization()),
  onChangeFakerSeed: newFakerSeed => dispatch(changeFakerSeed(newFakerSeed)),
  onFixedColumnsCountChange: newFixedColumnsCount =>
    dispatch(changeFixedColumnsCount(newFixedColumnsCount)),
  onNeedFetch: (rowCount, loadUiConst, fakerSeed) =>
    dispatch(
      fetchTableData(
        rowCount,
        loadUiConst,
        (data, error) => dispatch(data ? fetchTableDataReceive(data) : fetchTableDataError(error)),
        fakerSeed
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
