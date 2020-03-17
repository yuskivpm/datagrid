import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { Slider } from 'primereact/slider';
import { Growl } from 'primereact/growl';
import ConnectForTable from '../containers/ConnectForTable';
import spinner from '../assets/spinner.svg';
import { generateUrl } from '../utils/urlEncoder';

const DEFAULT_ROW_COUNT = 1100;
const WARNING_ROW_COUNT = 5000;
const MAX_ROW_COUNT = 10000;
const FIXED_COLUMNS_WIDTH_STYLE = { width: '8em' };

class MainPage extends React.Component {
  showSticky = () => {
    const { globalFilter, columnsFilter } = this.props;
    this.growl.show({
      severity: 'info',
      summary: 'Copy this sample of URL search part',
      detail: generateUrl(globalFilter, columnsFilter),
      sticky: true,
    });
  };

  handleGrowl = el => {
    this.growl = el;
  }

  render() {
    const { error } = this.props;
    if (error) {
      return (
        <p>
          Fetch error:
          {error}
        </p>
      );
    }

    const { tableLoaded, onNeedFetch } = this.props;
    if (tableLoaded) {
      const {
        virtualization,
        globalFilter,
        filteredRowsCount,
        onGlobalFilterChange,
        onChangeTableVirtualization,
        fixedColumnsCount,
        onFixedColumnsCountChange,
        onChangePossibleAllRowsCount,
        columnOrder,
        allRowsCount,
      } = this.props;

      /* eslint-disable jsx-a11y/label-has-associated-control */ // <- Primereact need it
      return (
        <>
          <header>
            <Growl
              ref={this.handleGrowl}
            />
            <ToggleButton
              onLabel="Turbo ON"
              offLabel="Turbo OFF"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              checked={virtualization}
              onChange={onChangeTableVirtualization}
              tooltip={
                virtualization
                  ? 'Turn off to show table inhibition'
                  : 'Turn it on when you are bored with a slowed table'
              }
            />
            <span className="p-float-label">
              <InputText
                id="float-input"
                type="text"
                size="20"
                value={globalFilter}
                onChange={e => onGlobalFilterChange(e.target.value)}
              />
              <label htmlFor="float-input">All columns search</label>
            </span>
            <Button
              label="Generate uri"
              tooltip="Generate search part of url, based on current filters"
              onClick={this.showSticky}
            />
            <div className="sliders">
              <span className="p-float-label">
                <InputText
                  id="fix-col-count"
                  type="number"
                  style={FIXED_COLUMNS_WIDTH_STYLE}
                  value={fixedColumnsCount}
                  onChange={e => onFixedColumnsCountChange(e.target.value)}
                />
                <label htmlFor="fix-col-count">Fixed columns count</label>
              </span>
              <Slider
                value={fixedColumnsCount}
                min={0}
                max={columnOrder.length - 1}
                style={FIXED_COLUMNS_WIDTH_STYLE}
                onChange={e => onFixedColumnsCountChange(e.value)}
              />
            </div>
            <div className="sliders">
              <span className="p-float-label">
                <InputText
                  id="all-rows-count"
                  type="number"
                  style={FIXED_COLUMNS_WIDTH_STYLE}
                  value={allRowsCount}
                  tooltip={allRowsCount > WARNING_ROW_COUNT ? 'Avoid to turn off virtualization' : ''}
                  onChange={e => onChangePossibleAllRowsCount(e.target.value)}
                />
                <label htmlFor="all-rows-count">Rows count</label>
              </span>
              <Slider
                value={allRowsCount}
                min={0}
                max={MAX_ROW_COUNT}
                style={FIXED_COLUMNS_WIDTH_STYLE}
                onChange={e => onChangePossibleAllRowsCount(e.value)}
              />
            </div>
            <Button
              label="Fetch new data"
              tooltip="Generate new table"
              onClick={() => onNeedFetch(allRowsCount, false)}
            />
            <p>
              Founded rows:&nbsp;
              <b>{filteredRowsCount}</b>
            </p>
          </header>
          <ConnectForTable />
        </>
      );
      /* eslint-enable jsx-a11y/label-has-associated-control */
    }

    if (typeof tableLoaded === 'undefined') {
      const { defaultRowHeight } = this.props;
      onNeedFetch(DEFAULT_ROW_COUNT, typeof defaultRowHeight === 'undefined');
    }
    return <img src={spinner} className="table-spinner" alt="Waiting for the requested data" />;
  }
}

MainPage.propTypes = {
  tableLoaded: PropTypes.bool,
  error: PropTypes.string,
  globalFilter: PropTypes.string,
  virtualization: PropTypes.bool.isRequired,
  onGlobalFilterChange: PropTypes.func.isRequired,
  onChangeTableVirtualization: PropTypes.func.isRequired,
  onNeedFetch: PropTypes.func.isRequired,
  onChangePossibleAllRowsCount: PropTypes.func.isRequired,
  defaultRowHeight: PropTypes.number,
  filteredRowsCount: PropTypes.number.isRequired,
  columnsFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
  fixedColumnsCount: PropTypes.number,
  allRowsCount: PropTypes.number,
  columnOrder: PropTypes.arrayOf(PropTypes.object).isRequired,
};

MainPage.defaultProps = {
  tableLoaded: undefined,
  defaultRowHeight: undefined,
  error: '',
  globalFilter: '',
  fixedColumnsCount: 1,
  allRowsCount: 0,
};

export default MainPage;
