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
import { convertToNumber } from '../utils/commonUtils';

const DEFAULT_ROW_COUNT = 1100;
const WARNING_ROW_COUNT = 2000;
const MAX_ROW_COUNT = 10000;
const FIXED_COLUMNS_WIDTH_STYLE = { width: '8em' };

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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
  };

  onChangePossibleAllRowsCount = allRowsCount =>
    this.setState({ allRowsCount: convertToNumber(allRowsCount) });

  handleFixedColumnsCountChange = newValue => {
    const { fixedColumnsCount, onFixedColumnsCountChange } = this.props;
    if (newValue !== fixedColumnsCount) {
      onFixedColumnsCountChange(newValue);
    }
  };

  handleEventTargetValue = event => this.handleFixedColumnsCountChange(event.target.value);

  handleEventValue = event => this.handleFixedColumnsCountChange(event.value);

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

    const { tableLoaded, onNeedFetch, fakerSeed } = this.props;

    if (!tableLoaded) {
      if (typeof tableLoaded === 'undefined') {
        const { columnOrder } = this.props;
        onNeedFetch(DEFAULT_ROW_COUNT, columnOrder.length === 0, fakerSeed);
      }
      return <img src={spinner} className="table-spinner" alt="Waiting for the requested data" />;
    }

    const {
      virtualization,
      globalFilter,
      filteredRowsCount,
      onGlobalFilterChange,
      onChangeTableVirtualization,
      onChangeFakerSeed,
      fixedColumnsCount,
      columnOrder,
      currentAllRowsCount,
    } = this.props;
    const { allRowsCount = currentAllRowsCount } = this.state;
    /* eslint-disable jsx-a11y/label-has-associated-control */
    // It's for PrimeReact
    return (
      <>
        <header>
          <Growl ref={this.handleGrowl} />
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
                onChange={this.handleEventTargetValue}
              />
              <label htmlFor="fix-col-count">Fixed columns count</label>
            </span>
            <Slider
              value={fixedColumnsCount}
              min={0}
              max={Math.min(4, columnOrder.length - 1)}
              style={FIXED_COLUMNS_WIDTH_STYLE}
              onChange={this.handleEventValue}
            />
          </div>
          <div className="sliders">
            <span className="p-float-label">
              <InputText
                id="all-rows-count"
                type="number"
                style={FIXED_COLUMNS_WIDTH_STYLE}
                value={allRowsCount}
                tooltip={
                  allRowsCount >= WARNING_ROW_COUNT ? 'Avoid to turn off virtualization' : ''
                }
                onChange={e => this.onChangePossibleAllRowsCount(e.target.value)}
              />
              <label htmlFor="all-rows-count">Rows count</label>
            </span>
            <Slider
              value={allRowsCount}
              min={0}
              max={MAX_ROW_COUNT}
              style={FIXED_COLUMNS_WIDTH_STYLE}
              onChange={e => this.onChangePossibleAllRowsCount(e.value)}
            />
          </div>
          <span className="p-float-label">
            <InputText
              id="faker-seed"
              type="number"
              style={FIXED_COLUMNS_WIDTH_STYLE}
              value={fakerSeed}
              onChange={e => onChangeFakerSeed(e.target.value)}
            />
            <label htmlFor="faker-seed">Faker seed</label>
          </span>
          <Button
            label="Fetch new data"
            tooltip={
              allRowsCount >= WARNING_ROW_COUNT
                ? 'Avoid to turn off virtualization'
                : 'Generate new table'
            }
            onClick={() => onNeedFetch(allRowsCount, false, fakerSeed)}
          />
          <p>
            Found rows:&nbsp;
            <b>{filteredRowsCount}</b>
          </p>
        </header>
        <ConnectForTable />
      </>
    );
  }
}

MainPage.propTypes = {
  tableLoaded: PropTypes.bool,
  error: PropTypes.string,
  globalFilter: PropTypes.string,
  virtualization: PropTypes.bool.isRequired,
  onGlobalFilterChange: PropTypes.func.isRequired,
  onChangeTableVirtualization: PropTypes.func.isRequired,
  onFixedColumnsCountChange: PropTypes.func.isRequired,
  onChangeFakerSeed: PropTypes.func.isRequired,
  onNeedFetch: PropTypes.func.isRequired,
  filteredRowsCount: PropTypes.number.isRequired,
  columnsFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
  fixedColumnsCount: PropTypes.number,
  currentAllRowsCount: PropTypes.number,
  columnOrder: PropTypes.arrayOf(PropTypes.object).isRequired,
  fakerSeed: PropTypes.number,
};

MainPage.defaultProps = {
  tableLoaded: undefined,
  error: '',
  globalFilter: '',
  fixedColumnsCount: 1,
  currentAllRowsCount: 0,
  fakerSeed: 0,
};

export default MainPage;
