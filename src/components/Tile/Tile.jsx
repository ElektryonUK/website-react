import { Fragment } from 'react/jsx-runtime';
import './Tile.scss';

export default function Tile({ children, classes, tooltip, tooltipId }) {
  return (
    <Fragment>
      <div className={`tile ${classes}`} data-tooltip-id={tooltipId} data-tooltip-html={tooltip}>
        {children}
      </div>
    </Fragment>
  );
}
