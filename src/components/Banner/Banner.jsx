import { Fragment, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faWallet, faCheck, faArrowRotateRight, faTableCells, faChartColumn, faQuestion, faGear, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Loader from '../Loader/Loader';
import logo from '../../oldwebsite/assets/img/logo.png';
import config from '../../_config/app-config.json';
import './Banner.scss';

export default function Banner({ onLoadComplete, pool }) {
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const isPoolPage = segments.length === 2;
  const [showLoader, setShowLoader] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Pools');
  const [selectedPool, setSelectedPool] = useState();
  const pageOptions = [
    { label: 'Pools', icon: faTableCells },
    { label: 'Discord', icon: faDiscord },
    { label: 'Email', icon: faEnvelope },
    { label: 'FAQ', icon: faQuestion },
  ];
  const poolOptions = [
    { label: 'Wallet', icon: faWallet },
    { label: 'Data', icon: faChartColumn },
    { label: 'Settings', icon: faGear },
  ];

  const handlePage = () => {
    const segments = location.pathname.split('/').filter(Boolean);
    const isPoolPage = segments.length >= 2;

    if (isPoolPage) {
      const coinId = segments[0];
      const cached = sessionStorage.getItem('selectedPool');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.coin?.id === coinId) {
          setSelectedPool(parsed);
        }
      }
    } else {
      setSelectedPool(null);
    }

    if (segments.length === 0) {
      setSelectedPage('Pools');
    } else if (segments.length === 1) {
      setSelectedPage(segments[0]);
    } else if (segments.length >= 2) {
      setSelectedPage(segments[1]);
    }
  };

  const handleNavigate = (page) => {
    if (page !== 'Discord' && page !== 'Email') {
      setSelectedPage(page);
    }

    const currentSegments = location.pathname.split('/').filter(Boolean);
    const currentCoinId = currentSegments[0] || selectedPool?.coin?.id || pool?.coin?.id;

    if (page === 'Pools') {
      navigate('/');
    } else if (page === 'Discord') {
      window.open(config.discordURL, '_blank', 'noopener,noreferrer');
    } else if (page === 'Email') {
      window.open(config.emailURL, '_blank', 'noopener,noreferrer');
    } else if (page === 'FAQ') {
      navigate(`/${page}`);
    } else {
      if (currentCoinId) {
        navigate(`/${currentCoinId}/${page}`);
      } else {
        navigate('/');
      }
    }
  };

  const handleIsLoading = (isLoading) => {
    if (isLoading) {
      setShowLoader(true);
    } else {
      setTimeout(() => {
        setShowLoader(false);
      }, config.poolsRefreshWarningSeconds * 1000);
    }
  };

  function getImageSource(type) {
    try {
      const src = require(`../../oldwebsite/coinlogo/${type.toLowerCase()}.png`);
      return src;
    } catch (error) {
      const fallbackSrc = require('../../assets/img/alt-coin-logo.png');
      return fallbackSrc;
    }
  }

  useEffect(() => {
    setSelectedPage(config.poolPageDefault);
    setSelectedPool(pool);
  }, [pool]);

  useEffect(() => {
    handlePage();
  }, [location.pathname]);

  useEffect(() => {
    if (selectedPool) {
      sessionStorage.setItem('selectedPool', JSON.stringify(selectedPool));
    }
  }, [selectedPool]);

  return (
    <Fragment>
      <div className="banner banner-top-left-corner" />
      <div className="banner banner-top">
        <img className="logo" src={logo} alt="App Logo" />
        <div className="banner-header-container">
          {isPoolPage && pool && (
            <h2 className="text-bold text-italic">
              {pool?.coin.name} {pool?.id.split('_')[1].toUpperCase()}
            </h2>
          )}
          <h2 className="secondary text-italic">{selectedPage}</h2>
        </div>
      </div>
      <div className="banner banner-left">
        <div className="banner-nav-container">
          <Tooltip id="banner-left-tooltip" className="tooltip" />
          {pageOptions.map((option, index) => (
            <div
              key={index}
              className={`banner-link${(selectedPage === 'Pools' || selectedPage === 'FAQ') && selectedPage === option.label ? ' selected' : ''}`}
              data-tooltip-id="banner-left-tooltip"
              data-tooltip-content={option.label}
              onClick={() => handleNavigate(option.label)}
            >
              <div className={`link-square${selectedPage === option.label ? ' selected' : ''}`} />
              <FontAwesomeIcon icon={option.icon} className="link-icon" />
            </div>
          ))}
          {isPoolPage && pool && (
            <Fragment>
              <div className="banner-left-divider"></div>
              {poolOptions.map((option, index) => (
                <div
                  key={index}
                  className={`banner-link${selectedPage === option.label ? ' selected' : ''}`}
                  data-tooltip-id="banner-left-tooltip"
                  data-tooltip-content={option.label}
                  onClick={() => handleNavigate(option.label)}
                >
                  <div className={`link-square${selectedPage === option.label ? ' selected' : ''}`} />
                  <FontAwesomeIcon icon={option.icon} className="link-icon" />
                </div>
              ))}
            </Fragment>
          )}
        </div>
      </div>
      {selectedPage !== 'Support' && selectedPage !== 'FAQ' && (
        <div className="loader-container">
          {isPoolPage && pool && !showLoader && <img className="coin-img" src={getImageSource(pool.coin.type)} alt="Coin Logo" />}
          <Loader
            iconLoading={faArrowRotateRight}
            iconComplete={faCheck}
            loadSeconds={config.poolsRefreshSeconds}
            loadWarningSeconds={config.poolsRefreshWarningSeconds}
            onLoadComplete={onLoadComplete}
            isLoading={handleIsLoading}
          />
        </div>
      )}
    </Fragment>
  );
}
