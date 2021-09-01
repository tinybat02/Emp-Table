import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { Frame } from './types';
import { processData } from './utils/helpFunc';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: Array<{ [key: string]: string | number }> | null;
  keys: string[];
  persistColor: { [key: string]: string };
}

export class MainPanel extends PureComponent<Props> {
  state: State = {
    data: null,
    keys: [],
    persistColor: {},
  };

  componentDidMount() {
    const series = this.props.data.series as Frame[];

    if (series.length == 0) return;

    const { data, keys, persistColor } = processData(series[0].fields[0].values.buffer, {});
    this.setState({ data, keys, persistColor });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      const series = this.props.data.series as Frame[];
      if (series.length == 0) {
        this.setState(prev => ({ ...prev, data: null, keys: [] }));
        return;
      }

      const { data, keys, persistColor } = processData(series[0].fields[0].values.buffer, this.state.persistColor);
      this.setState({ data, keys, persistColor });
    }
  }

  render() {
    const { width, height } = this.props;
    const { data, keys, persistColor } = this.state;

    if (!data) {
      return <div>No Data</div>;
    }

    const colors = data.map(item => keys.map(key => item[`${key}Color`])).flat();

    function scale() {}

    scale.domain = () => {
      const _colors = colors.slice(0);

      return () => {
        return _colors.shift();
      };
    };

    return (
      <div
        style={{
          width,
          height,
          position: 'relative',
          padding: 15,
        }}
      >
        <ResponsiveHeatMap
          data={data}
          keys={keys}
          indexBy="id"
          margin={{ top: 0, right: 0, bottom: 30, left: 10 }}
          padding={1}
          forceSquare={true}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: '',
            legendOffset: 36,
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          enableLabels={false}
          cellOpacity={0.7}
          cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
          // @ts-ignore
          fill={[{ id: 'lines' }]}
          animate={true}
          motionStiffness={80}
          motionDamping={9}
          cellHoverOthersOpacity={0.25}
          //@ts-ignore
          colors={scale}
        />
        <section style={{ position: 'absolute', top: 0, right: 15 }}>
          {Object.keys(persistColor).map(polygon => {
            return (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  fill={persistColor[polygon]}
                  style={{ width: 10, height: 10, marginRight: 5 }}
                >
                  <rect width="20" height="20" />
                </svg>
                <span>{polygon}</span>{' '}
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}
