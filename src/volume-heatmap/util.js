import axios from 'axios';

export const fetchVolumeData = async (symbol, interval = '1h') => {
  const url = `https://api.binance.com/api/v3/klines`;
  const params = {
    symbol,
    interval,
    limit: 24 * 30,
  }

  try {
    const response = await axios.get(url, { params });
    const data = response.data;

    // Transform data into hourly heatmap structure
    const volumeData = data.map((item) => ({
      dateTime: new Date(item[0]),
      volume: parseFloat(item[7]), // Volume
    }));

    // Aggregate into a structure suitable for Nivo HeatMap
    const heatmapData = {};
    volumeData.forEach(({ dateTime, volume }) => {
      const date = dateTime.toISOString().split('T')[0]; // Extract date
      const hour = dateTime.getUTCHours(); // Extract hour
      heatmapData[date] = heatmapData[date] || {};
      heatmapData[date][hour] = (heatmapData[date][hour] || 0) + volume;
    });

    // Convert to Nivo HeatMap format
    return Object.entries(heatmapData).map(([date, hours]) => ({
      id: date,
      data: [...Array.from({ length: 24 }, (_, i) => ({ x: i, y: hours[i] ?? null }))],
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export function formatNumber(num, decimals = 1) {
  if (num === 0) return '0';

  const units = ['', 'K', 'M', 'B', 'T', 'P', 'E']; // Extend as needed
  const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3); // Determine unit index
  const scaledNumber = num / Math.pow(10, magnitude * 3); // Scale the number

  const formattedNumber = scaledNumber.toFixed(decimals); // Round to specified decimals
  return `${formattedNumber}${units[magnitude] || ''}`;
}

export function isWeekend(dateString) {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
}