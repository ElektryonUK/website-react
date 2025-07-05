import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faDollarSign, faClock, faPercent, faCube, faStar, faBell } from '@fortawesome/free-solid-svg-icons';
import './Pool.scss';

export default function Pool({ id, pool, onNavigate, userSettings }) {
  const navigate = useNavigate();
  const [selectedData, setSelectedData] = useState(pool.payoutDefault === 'PPLNS' ? pool.poolPplns : pool.poolSolo);
  const [isFavourite, setIsFavourite] = useState(userSettings?.favourites.includesThis ? true : false);
  const [isAlert, setIsAlert] = useState(userSettings?.alerts.includesThis ? true : false);
  const displayData = [
    { label: 'Miners', icon: faUser, value: selectedData.poolStats?.connectedMiners },
    { label: 'Min. Pay', icon: faDollarSign, value: selectedData.paymentProcessing?.minimumPayment },
    { label: 'Effort', icon: faClock, value: (selectedData.poolEffort * 100).toFixed(2) },
    { label: 'Fee', icon: faPercent, value: selectedData.poolFeePercent },
    { label: 'Blocks', icon: faCube, value: selectedData.totalBlocks },
  ];
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
    { value: 1e21, symbol: 'Z' },
    { value: 1e24, symbol: 'Y' },
  ];

  function formatNetworkHashrate(value, decimal) {
    if (value === 0) {
      return '0';
    } else {
      for (var i = si.length - 1; i > 0; i--) {
        if (value >= si[i].value) {
          break;
        }
      }
      return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
    }
  }

  function formatNetworkHashrateUnits(value) {
    for (var i = si.length - 1; i > 0; i--) {
      if (value >= si[i].value) {
        break;
      }
    }
    return si[i].symbol;
  }

  function getImageSource(type) {
    try {
      const src = require(`../../oldwebsite/coinlogo/${type.toLowerCase()}.png`);
      return src;
    } catch (error) {
      const srcAlt = require('../../assets/img/alt-coin-logo.png');
      return srcAlt;
    }
  }

  const handleCheckbox = (event) => {
    setSelectedData(event.target.checked ? pool.poolSolo : pool.poolPplns);
  };

  const handleFavourite = () => {
    setIsFavourite(!isFavourite);
  };

  const handleAlert = () => {
    setIsAlert(!isAlert);
  };

  const handleScryptButton = (selectedData) => {
    navigate(`/${selectedData.id}/Wallet`);
    onNavigate?.(selectedData);
  };

  return (
    <Fragment>
      <div className="pool-container">
        <div className="header-container">
          <div className="main-container">
            <div className="img-container">
              <img src={getImageSource(selectedData.coin.type)} alt="Coin Logo" />
            </div>
            <div className="text-container">
              <h2 className="coin-name text-bold text-italic">{selectedData.coin.name}</h2>
            </div>
          </div>
          <div className="footer-container">
            <div className="btn-container" title="Payout">
              <label className="switch btn-color-mode-switch">
                <input
                  type="checkbox"
                  name={`color_mode_${id}`}
                  id={`color_mode_${id}`}
                  value="1"
                  onChange={(event) => handleCheckbox(event)}
                  disabled={pool.payouts === 1}
                  defaultChecked={pool.payoutDefault === 'SOLO'}
                />
                <label
                  htmlFor={`color_mode_${id}`}
                  data-on="SOLO"
                  data-off="PPLNS"
                  className={`btn-color-mode-switch-inner ${pool.payouts === 1 ? 'disabled' : null}`}
                ></label>
              </label>
            </div>
            <div className="badge-container">
              <span className={`badge${isAlert ? ' selected' : ''}`} onClick={() => handleAlert()} title="Alert">
                <FontAwesomeIcon icon={faBell} />
              </span>
              <span className={`badge${isFavourite ? ' selected' : ''}`} onClick={() => handleFavourite()} title="Favourite">
                <FontAwesomeIcon icon={faStar} />
              </span>
            </div>
          </div>
        </div>
        <div className="card-table">
          <table>
            <thead>
              {displayData.map((data, index) => (
                <tr key={index}>
                  <td className="table-icon">
                    <FontAwesomeIcon icon={data.icon} />
                  </td>
                  <td className="table-label">{data.label}</td>
                  <td className="table-value">{data.value}</td>
                </tr>
              ))}
            </thead>
          </table>
        </div>
        <div className="footer-container">
          <div className="input-container">
            <button className="btn-scrypt" onClick={() => handleScryptButton(selectedData)}>
              SCRYPT
            </button>
          </div>
          <div className="networkHashrate-container">
            <div className="data-metric">
              <h3 className="secondary text-medium">{formatNetworkHashrate(selectedData.networkStats?.networkHashrate, 3)}</h3>
              <h3 className="secondary-faded text-medium">{formatNetworkHashrateUnits(selectedData.networkStats?.networkHashrate)}H/s</h3>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
