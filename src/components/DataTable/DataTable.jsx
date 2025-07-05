import { Fragment } from 'react';
import Tile from '../Tile/Tile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './DataTable.scss';

export default function DataTable({ showCount, showTitle, showHeaders, showIcons, trafficLights, table, index, tableClass, tileClass }) {
  function formatHeader(header) {
    const withSpaces = header.replace(/([A-Z])/g, ' $1');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  function setTrafficLights(tableItem, value, index) {
    const keyItem = trafficLights?.includes(Object.keys(tableItem)[index]);
    if (keyItem) {
      if (value <= 100 || value === 'Confirmed') {
        return 'traffic-light-green';
      }
      if ((value > 100 && value <= 200) || value === 'Pending') {
        return 'traffic-light-amber';
      }
    }
  }

  return (
    <Fragment>
      <Tile key={index} classes={tileClass}>
        <div className="data-table-container">
          {showTitle && (
            <h3 className="secondary text-italic">
              {showCount && <b>{table.array.length}</b>} {table.label}
            </h3>
          )}
          <div className={tableClass}>
            <table className={tableClass}>
              {showHeaders && (
                <thead>
                  <tr>
                    <th />
                    {Object.keys(table.array[0]).map((key) => (
                      <th key={key}>{formatHeader(key)}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {table.array.map((miner, rowIndex) => (
                  <tr key={rowIndex}>
                    {showIcons && (
                      <td className="table-icon">
                        <FontAwesomeIcon icon={table.icon} />
                      </td>
                    )}
                    {Object.keys(miner).map((key, index) => (
                      <td className={trafficLights ? setTrafficLights(table.array[0], miner[key], index) : ''} key={key}>
                        {miner[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Tile>
    </Fragment>
  );
}
