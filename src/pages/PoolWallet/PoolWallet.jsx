import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faUser, faDollarSign, faBolt, faFileAlt, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import Tile from '../../components/Tile/Tile';
import DataGraph from '../../components/DataGraph/DataGraph';
import DataTable from '../../components/DataTable/DataTable';
import testData from '../../_test/test-data.json';
import './PoolWallet.scss';

export default function PoolWallet() {
  const [walletInputValue, setWalletInputValue] = useState('');
  const walletDetails = [
    { label: 'Pending Shares', icon: faFileAlt },
    { label: 'Pending Balance', icon: faCoins },
    { label: 'Paid Balance', icon: faDollarSign },
    { label: 'Lifetime Balance', icon: faMoneyCheckDollar },
  ];
  const walletGraphs = [{ label: 'Miner Hash Rate', array: testData.minerHashRate }];
  const walletTables = [
    { label: 'Working Miners', icon: faUser, array: testData.workingMiners },
    { label: 'Recent Payouts', icon: faDollarSign, array: testData.recentPayouts },
  ];

  const handleWalletSubmit = (e) => {
    e.preventDefault();
    alert(`Wallet: ${walletInputValue}`);
  };

  return (
    <Fragment>
      <div className="wallet-container">
        <div className="wallet-address-container">
          <Tile classes={'wallet'}>
            <h3 className="text-italic">Wallet Address</h3>
            <form className="form-group" onSubmit={handleWalletSubmit}>
              <input type="text" value={walletInputValue} onChange={(e) => setWalletInputValue(e.target.value)} placeholder="XXXXXXXXXXXXXX" />
              <button type="submit" title="Connect">
                <FontAwesomeIcon icon={faBolt} className="submit-icon"></FontAwesomeIcon>
              </button>
            </form>
          </Tile>
        </div>
        <div className="wallet-details-container">
          {walletDetails.map((detail, index) => (
            <Tile key={index} classes={'wallet-detail'}>
              <div className="wallet-detail-container">
                <div>
                  <h3 className="text-italic">{detail.label}</h3>
                  <h1 className="secondary">1400.014</h1>
                </div>
                <FontAwesomeIcon icon={detail.icon} className="fa-4x wallet-icon"></FontAwesomeIcon>
              </div>
            </Tile>
          ))}
          {walletGraphs.map((graph, index) => (
            <DataGraph key={index} graph={graph} index={index} showCurrentValue graphClass={'wallet-graph'} />
          ))}
          {walletTables.map((table, index) => (
            <DataTable
              key={index}
              table={table}
              showCount
              showTitle
              showHeaders
              showIcons
              index={index}
              tableClass={'wallet-table'}
              tileClass={'wallet-data'}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
}
