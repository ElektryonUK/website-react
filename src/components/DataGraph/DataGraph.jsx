import { Fragment } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Tile from '../Tile/Tile';
import './DataGraph.scss';

export default function DataGraph({ graph, index, showCurrentValue, graphClass }) {
  return (
    <Fragment>
      <Tile key={index} classes={graphClass}>
        <div className="graph-header-container">
          <h3 className="text-italic">{graph.label}</h3>
          {showCurrentValue && (
            <div className="data-metric">
              <h1 className="secondary">{graph.array[graph.array.length - 1].value}</h1>
              <h1 className="secondary-faded">kH/s</h1>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graph.array} margin={{ top: 28, right: 32, left: -16, bottom: -8 }}>
            <CartesianGrid stroke="#FFFFFF1A" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                padding: '6px 8px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                borderRadius: '4px',
                border: 'none',
                fontSize: '12px',
              }}
              itemStyle={{
                padding: '0px',
                margin: '0px',
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#C04040" strokeWidth={3} animationDuration={1000} />
          </LineChart>
        </ResponsiveContainer>
      </Tile>
    </Fragment>
  );
}
