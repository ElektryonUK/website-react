import { Fragment } from 'react';
import Tile from '../../components/Tile/Tile';
import Pool from '../../components/Pool/Pool';
import './Dashboard.scss';

export default function Dashboard({ poolData, onNavigate }) {
  return (
    <Fragment>
      <div className="pools-container">
        {poolData.map((pool, index) => (
          <Tile key={index} classes={'pool square'}>
            <Pool id={index} pool={pool} onNavigate={onNavigate} />
          </Tile>
        ))}
      </div>
    </Fragment>
  );
}
