import React from 'react';
import PropTypes from 'prop-types';
import ConnectForFixedRowHeader from '../containers/ConnectForFixedRowHeader';
import ConnectForFixedRowsTable from '../containers/ConnectForFixedRowsTable';
import ConnectForContentTableHeader from '../containers/ConnectForContentTableHeader';
import ConnectForContentTable from '../containers/ConnectForContentTable';
import './PureTable.css';
import './scroll.css';

class PureTable extends React.Component {
  constructor(props) {
    super(props);
    const { defaultHeaderRowHeight, defaultFixedRowsColumnWidth } = props;
    this.state = {
      firstSelected: -1,
      selectedRows: [],
      scrollTop: defaultHeaderRowHeight,
      scrollLeft: `${defaultFixedRowsColumnWidth}px`,
    };
  }

  onRowsSelectionChange = (event, rowId, realRowIndex) => {
    const { firstSelected } = this.state;
    if (!event.shiftKey && !event.ctrlKey) {
      // single click - allow only one row to be selected
      this.setState({ selectedRows: [rowId], firstSelected: realRowIndex });
    } else {
      /* eslint-disable react/no-access-state-in-setstate, react/destructuring-assignment */
      const selectedRows = [...this.state.selectedRows];
      /* eslint-enable react/no-access-state-in-setstate, react/destructuring-assignment */
      const firstClickProcess = () => {
        if (selectedRows.includes(rowId)) {
          selectedRows.splice(selectedRows.indexOf(rowId), 1);
        } else {
          selectedRows.push(rowId);
        }
      };
      if (event.shiftKey) {
        const { rows = [], filteredRowIndexes = [] } = this.props;
        /* eslint-disable no-bitwise */
        if (~firstSelected) {
          /* eslint-enable no-bitwise */
          // known start of the selection list - second click
          const startRange = Math.min(realRowIndex, firstSelected);
          const endRange = Math.max(realRowIndex, firstSelected);
          const idOfUnselectedRows = filteredRowIndexes
            .filter((_, rowIndex) => rowIndex >= startRange && rowIndex <= endRange) // get real indexes of rows in selected range
            .map(filtredIndex => rows[filtredIndex].id);
          if (selectedRows.includes(rows[filteredRowIndexes[firstSelected]].id)) {
            idOfUnselectedRows.forEach(id => {
              if (!selectedRows.includes(id)) {
                selectedRows.push(id);
              }
            });
            this.setState({ selectedRows });
          } else {
            this.setState({
              selectedRows: selectedRows.filter(rowIndex => !idOfUnselectedRows.includes(rowIndex)),
            });
          }
        } else {
          // unknown start of the selection list - first click
          firstClickProcess();
          this.setState({ selectedRows, firstSelected: realRowIndex });
        }
      } else if (event.ctrlKey) {
        firstClickProcess();
        this.setState({ selectedRows, firstSelected: realRowIndex });
      }
    }
  };

  handleScroll = ({ scrollTop, scrollLeft }) => {
    const { defaultHeaderRowHeight, defaultFixedRowsColumnWidth } = this.props;
    this.setState({
      scrollTop: defaultHeaderRowHeight - scrollTop,
      scrollLeft: `${defaultFixedRowsColumnWidth - scrollLeft}px`,
    });
  };

  render() {
    const { defaultFixedRowsColumnWidth } = this.props;
    const { selectedRows, scrollTop, scrollLeft } = this.state;
    return (
      <main style={{ userSelect: `none` }}>
        <div className="area-fixed-rows" style={{ flex: `0 0 ${defaultFixedRowsColumnWidth}px` }}>
          <ConnectForFixedRowHeader
            defaultMenuText="Columns"
            saveToCsvButtonCaption="Save to csv"
          />
          <ConnectForFixedRowsTable
            selectedRows={selectedRows}
            onRowsSelectionChange={this.onRowsSelectionChange}
            scrollTop={scrollTop}
          />
        </div>
        <div className="area-table-content">
          <ConnectForContentTableHeader scrollLeft={scrollLeft} />
          <ConnectForContentTable
            onHandleScroll={this.handleScroll}
            scrollTop={scrollTop}
            selectedRows={selectedRows}
            onRowsSelectionChange={this.onRowsSelectionChange}
          />
        </div>
      </main>
    );
  }
}

PureTable.propTypes = {
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
  /* eslint-disable react/forbid-prop-types */
  rows: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default PureTable;
