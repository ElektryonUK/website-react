import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { fetchPools } from './services/PoolService';
import Banner from './components/Banner/Banner';
import Dashboard from './pages/Dashboard/Dashboard';
import FAQ from './pages/FAQ/FAQ';
import PoolWallet from './pages/PoolWallet/PoolWallet';
import PoolData from './pages/PoolData/PoolData';
import PoolSettings from './pages/PoolSettings/PoolSettings';
import './App.scss';

export default function App() {
  const location = useLocation();
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(() => {
    const stored = localStorage.getItem('selectedPool');
    return stored ? JSON.parse(stored) : undefined;
  });

  const getPools = useCallback(async () => {
    const fetchedPools = await fetchPools();
    const poolsSolo = fetchedPools.filter((x) => x.id.includes('solo'));
    const poolsPplns = fetchedPools.filter((x) => x.id.includes('pplns'));
    const uniqueCoinNames = [...new Set(fetchedPools.map((pool) => pool.coin.name))];

    const uniquePools = uniqueCoinNames.map((coinName) => {
      const pplns = poolsPplns.find((x) => x.coin.name === coinName);
      const solo = poolsSolo.find((x) => x.coin.name === coinName);

      return {
        name: coinName,
        payouts: pplns && solo ? 2 : 1,
        poolPplns: pplns || null,
        poolSolo: solo || null,
        payoutDefault: pplns ? 'PPLNS' : 'SOLO',
      };
    });

    setPools(uniquePools);
  }, []);

  const handleSelectedPool = (pool) => {
    setSelectedPool(pool);
  };

  const handleOnLoadComplete = () => {
    getPools();
  };

  useEffect(() => {
    const path = location.pathname.toLowerCase();

    if (path === '/' || path.includes('/wallet') || path.includes('/data')) {
      getPools();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (selectedPool) {
      localStorage.setItem('selectedPool', JSON.stringify(selectedPool));
    } else {
      localStorage.removeItem('selectedPool');
    }
  }, [selectedPool]);

  return (
    <div className="app">
      <div className="background"></div>
      <div className="background-cover"></div>
      <div className="app-container">
        <Banner onLoadComplete={handleOnLoadComplete} pool={selectedPool} />
        <Routes>
          <Route path="/" element={<Dashboard poolData={pools} onNavigate={handleSelectedPool} />} />
          <Route path="/FAQ" element={<FAQ poolData={pools} onNavigate={handleSelectedPool} />} />
          <Route path="/:poolId/Wallet" element={<PoolWallet pool={selectedPool} />} />
          <Route path="/:poolId/Data" element={<PoolData pool={selectedPool} />} />
          <Route path="/:poolId/Settings" element={<PoolSettings pool={selectedPool} />} />
        </Routes>
      </div>
    </div>
  );
}
