import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { ToggleButton } from 'primereact/togglebutton';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import ConnectForTable from '../containers/ConnectForTableNew';
import spinner from '../assets/spinner.svg';
import { generateUrl } from '../utils/urlEncoder';

const ROW_COUNT = 2000;

class PureMainPage extends React.Component {
  showSticky = () => {
    const { globalFilter, columnsFilter } = this.props;
    this.growl.show({
      severity: 'info',
      summary: 'Copy this sample of URL search part',
      detail: generateUrl(globalFilter, columnsFilter),
      sticky: true,
    });
  };

  render() {
    const {
      tableLoaded,
      error,
      virtualization,
      globalFilter,
      defaultRowHeight,
      filteredRowsCount,
      onGlobalFilterChange,
      onChangeTableVirtualization,
      onNeedFetch,
    } = this.props;
    if (error) {
      return (
        <p>
          Fetch error:
          {error}
        </p>
      );
    }
    if (tableLoaded) {
      /* eslint-disable jsx-a11y/label-has-associated-control */ // <- Primereact need it
      return (
        <>
          <header>
            <Growl
              ref={el => {
                this.growl = el;
                return el; // to avoid eslint no-return-assign
              }}
            />
            <ToggleButton
              onLabel="Turbo ON"
              offLabel="Turbo OFF"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              checked={virtualization}
              onChange={() => onChangeTableVirtualization()}
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
                size="50"
                value={globalFilter}
                onChange={e => onGlobalFilterChange(e.target.value)}
              />
              <label htmlFor="float-input">Search across all columns</label>
            </span>
            <Button
              label="Generate uri"
              tooltip="Generate search part of url, based on current filters"
              onClick={this.showSticky}
            />
            <p>
              Founded rows count:&nbsp;
              <b>{filteredRowsCount}</b>
            </p>
          </header>
          <ConnectForTable defaultMenuText="Columns" saveToCsvButtonCaption="Save to csv" />
        </>
      );
      /* eslint-enable jsx-a11y/label-has-associated-control */
    }
    if (typeof tableLoaded === 'undefined') {
      onNeedFetch(ROW_COUNT, typeof defaultRowHeight === 'undefined');
    }
    return <img src={spinner} className="table-spinner" alt="Waiting for the requested data" />;
  }
}

PureMainPage.propTypes = {
  tableLoaded: PropTypes.bool,
  error: PropTypes.string,
  globalFilter: PropTypes.string,
  virtualization: PropTypes.bool.isRequired,
  onGlobalFilterChange: PropTypes.func.isRequired,
  onChangeTableVirtualization: PropTypes.func.isRequired,
  onNeedFetch: PropTypes.func.isRequired,
  defaultRowHeight: PropTypes.number,
  filteredRowsCount: PropTypes.number.isRequired,
  columnsFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
};

PureMainPage.defaultProps = {
  tableLoaded: undefined,
  defaultRowHeight: undefined,
  error: '',
  globalFilter: '',
};

export default PureMainPage;
