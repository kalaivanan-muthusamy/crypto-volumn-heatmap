import React, { useEffect, useState } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { Card, Flex, Select } from 'antd';
import { fetchVolumeData, formatNumber } from './util';
import Title from 'antd/es/typography/Title';

const assets = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'TRXUSDT'];

const HeatMapChart = ({ defaultSymbol }) => {
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState(defaultSymbol || 'BTCUSDT');

  useEffect(() => {
    if (symbol) {
      const loadData = async () => {
        const volumeData = await fetchVolumeData(symbol);
        // const formattedData = volumeData.map((data) => ({
        //   id: data.day,
        //   data: Object.entries(data),
        // }));
        console.log(volumeData);
        setData(volumeData);
      };

      loadData();
    }
  }, [symbol]);

  return (
    <div style={{ width: '100%' }}>
      <Flex
        align="center"
        gap={12}
        justify="space-between"
        style={{ padding: '10px 0' }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Binace {symbol} Volume Heatmap
        </Title>
        <Select value={symbol} onChange={(val) => setSymbol(val)}>
          {assets.map((asset) => (
            <Select.Option key={asset} value={asset}>
              {asset}
            </Select.Option>
          ))}
        </Select>
      </Flex>
      <Card>
        <div style={{ height: '700px', width: '100%' }}>
          <ResponsiveHeatMap
            data={data}
            valueFormat={(val) => null && formatNumber(val)}
            keys={Array.from({ length: 24 }, (_, i) => i.toString())} // Hours 0-23
            margin={{ top: 45, right: 0, bottom: 0, left: 90 }}
            colors={{
              type: 'quantize',
              scheme: 'oranges',
            }}
            axisLeft={{
              orient: 'left',
              legend: 'Hour of Day',
              legendPosition: 'middle',
              legendOffset: -86,
            }}
            axisTop={{
              orient: 'top',
              legend: 'Day',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            borderRadius={4}
            borderColor={{
              theme: 'background',
            }}
            emptyColor="#fff"
            // labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
            tooltip={({ cell }) => (
              <strong>
                {formatNumber(cell.value, 2)} Volume
              </strong>
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default HeatMapChart;