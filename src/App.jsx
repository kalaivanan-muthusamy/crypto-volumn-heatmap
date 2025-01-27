import { ConfigProvider, Flex } from 'antd';
import HeatMapChart from './volume-heatmap';

function App() {
  return (
    <Flex gap="middle" style={{ width: '100%' }}>
      <HeatMapChart defaultSymbol="BTCUSDT" />
      <HeatMapChart defaultSymbol="ETHUSDT" />
    </Flex>
  );
}

export default App;
