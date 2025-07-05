import { Fragment } from 'react';
import { faUser, faDollarSign, faCube } from '@fortawesome/free-solid-svg-icons';
import DataGraph from '../../components/DataGraph/DataGraph';
import DataTable from '../../components/DataTable/DataTable';
import testData from '../../_test/test-data.json';
import './PoolData.scss';

export default function PoolData() {
  const poolGraphs = [
    { label: 'Pool Hash Rate', array: testData.poolHashRate },
    { label: 'Network Hash Rate', array: testData.networkHashRate },
    { label: 'Network Difficulty', array: testData.networkDifficulty },
  ];
  const poolTables = [
    { label: 'Details', array: testData.poolConnections },
    { label: 'Statistics', array: testData.poolStatistics },
  ];
  const poolTables2 = [
    { label: 'Top Miners', icon: faUser, array: testData.miners },
    { label: 'Latest Blocks', icon: faCube, array: testData.blocks, trafficLights: ['luck', 'status', 'complete'] },
    { label: 'Recent Payouts', icon: faDollarSign, array: testData.payouts },
  ];

  return (
    <Fragment>
      <div className="data-container">
        <div className="column-1">
          <div className="column-inner-1">
            {poolTables.map((table, index) => (
              <DataTable key={index} table={table} index={index} showTitle tableClass={'data-table info-table'} tileClass={'statistics-data'} />
            ))}
          </div>
          <div className="column-inner-2">
            {poolGraphs.map((graph, index) => (
              <DataGraph key={index} graph={graph} index={index} showCurrentValue graphClass={'data-graph'} />
            ))}
          </div>
        </div>
        <div className="column-2">
          {poolTables2.map((table, index) => (
            <DataTable
              key={index}
              table={table}
              index={index}
              showCount
              showTitle
              showHeaders
              showIcons
              trafficLights={table.trafficLights}
              tableClass={'data-table top-table'}
              tileClass={'statistics-data'}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
}
