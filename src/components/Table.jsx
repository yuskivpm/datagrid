import React from 'react';
import PropTypes from 'prop-types';
import ConnectForFixedColumnHeaderCell from '../containers/ConnectForFixedColumnHeaderCell';
import ConnectForTableHeader from '../containers/ConnectForTableHeader';
import ConnectForTableContent from '../containers/ConnectForTableContent';
import { getTableWidth } from '../utils/commonUtils';
import './Table.css';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.state = {
      scrollTop: 0,
      firstSelected: -1,
      selectedRows: [],
    };
  }

  onRowsSelectionChange = (event, rowId, realRowIndex) => {
    let { firstSelected } = this.state;
    if (!event.shiftKey && !event.ctrlKey) {
      // single click - allow only one row to be selected
      this.setState({ selectedRows: [rowId], firstSelected: realRowIndex });
    } else {
      /* eslint-disable react/destructuring-assignment */
      const selectedRows = [...this.state.selectedRows]; // not for this case
      /* eslint-enable react/destructuring-assignment */
      const firstClickProcess = () => {
        if (selectedRows.includes(rowId)) {
          selectedRows.splice(selectedRows.indexOf(rowId), 1);
        } else {
          selectedRows.push(rowId);
        }
      };
      if (event.shiftKey) {
        const { rows = [], filteredRowIndexes = [] } = this.props;
        if (firstSelected >= filteredRowIndexes.length) {
          // it's can be failed after filtering between first and second clicks
          firstSelected = -1;
        }
        if (firstSelected >= 0) {
          // known start of the selection list - second click
          const startRange = Math.min(realRowIndex, firstSelected);
          const endRange = Math.max(realRowIndex, firstSelected);
          const idOfUnselectedRows = filteredRowIndexes
            .filter((_, rowIndex) => rowIndex >= startRange && rowIndex <= endRange) // get real indexes of rows in selected range
            .map(filteredIndex => rows[filteredIndex].id);
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

  render() {
    const {
      columnOrder,
      defaultFixedRowsColumnWidth,
      filteredRowIndexes = [],
      defaultRowHeight,
      defaultHeaderRowHeight,
      virtualization,
    } = this.props;
    const { scrollTop, selectedRows } = this.state;
    const rowWidth = `${getTableWidth(columnOrder) + defaultFixedRowsColumnWidth}px`;

    let visibleRowCount;
    let firstVisibleRow;
    let lastVisibleRow;
    if (virtualization) {
      visibleRowCount = Math.ceil(document.body.clientHeight / defaultRowHeight);
      firstVisibleRow = Math.floor(scrollTop / defaultRowHeight);
      lastVisibleRow = firstVisibleRow + visibleRowCount + 2;
    } else {
      visibleRowCount = filteredRowIndexes.length - 1;
      firstVisibleRow = 0;
      lastVisibleRow = visibleRowCount;
    }

    return (
      <div className="table">
        <div
          className="scroll"
          ref={this.scrollRef}
          onScroll={() => this.setState({ scrollTop: this.scrollRef.current.scrollTop })}
        >
          <div
            className="container"
            style={{
              width: rowWidth,
              height: `${defaultHeaderRowHeight + filteredRowIndexes.length * defaultRowHeight}px`,
            }}
          >
            {/* Header start */}
            <div
              className="tr sticky"
              style={{
                width: rowWidth,
                height: `${defaultHeaderRowHeight}px`,
              }}
            >
              <ConnectForFixedColumnHeaderCell
                defaultMenuText="Columns"
                saveToCsvButtonCaption="Save to csv"
                buttonTooltip="Download csv file with visible columns & filtered row data"
              />
              <ConnectForTableHeader />
            </div>
            {/* Header end */}
            <ConnectForTableContent
              firstVisibleRow={firstVisibleRow}
              lastVisibleRow={lastVisibleRow}
              onRowsSelectionChange={this.onRowsSelectionChange}
              selectedRows={selectedRows}
            />
          </div>
        </div>
      </div>
    );
  }
}

Table.propTypes = {
  columnOrder: PropTypes.arrayOf(PropTypes.object).isRequired,
  defaultFixedRowsColumnWidth: PropTypes.number.isRequired,
  filteredRowIndexes: PropTypes.arrayOf(PropTypes.number).isRequired,
  defaultRowHeight: PropTypes.number.isRequired,
  defaultHeaderRowHeight: PropTypes.number.isRequired,
  virtualization: PropTypes.bool.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
