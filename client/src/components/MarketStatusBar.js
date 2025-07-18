import React, { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const MarketStatusBar = () => {
  const [marketData, setMarketData] = useState({
    sp500: { value: 0, change: 0, percentChange: 0 },
    nasdaq: { value: 0, change: 0, percentChange: 0 },
    dow: { value: 0, change: 0, percentChange: 0 },
    russell2000: { value: 0, change: 0, percentChange: 0 }
  });

  const [time, setTime] = useState(new Date());
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [flashIndex, setFlashIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get('/api/stocks/market-overview');
        if (response.data.success) {
          const data = response.data.indices;
          setMarketData({
            sp500: {
              value: data.sp500?.price || 0,
              change: data.sp500?.change || 0,
              percentChange: data.sp500?.changePercent || 0
            },
            nasdaq: {
              value: data.nasdaq?.price || 0,
              change: data.nasdaq?.change || 0,
              percentChange: data.nasdaq?.changePercent || 0
            },
            dow: {
              value: data.dowJones?.price || 0,
              change: data.dowJones?.change || 0,
              percentChange: data.dowJones?.changePercent || 0
            },
            russell2000: {
              value: data.russell2000?.price || 0,
              change: data.russell2000?.change || 0,
              percentChange: data.russell2000?.changePercent || 0
            }
          });
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMarketData();

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Update market data every 30 seconds
    const marketTimer = setInterval(fetchMarketData, 30000);

    // Flash animation for market status
    const flashTimer = setInterval(() => {
      setFlashIndex(prev => (prev + 1) % 4);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(marketTimer);
      clearInterval(flashTimer);
    };
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const getFlashColor = (index) => {
    const colors = ['text-green-400', 'text-yellow-400', 'text-green-400', 'text-yellow-400'];
    return colors[index];
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-4 py-3 font-mono overflow-hidden">
      <div className="flex items-center justify-between text-sm">
        {/* Time with Wall Street style */}
        <div className="text-yellow-400 font-bold text-lg tracking-wider">
          {time.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>

        {/* Market Indices with Wall Street animations */}
        <div className="flex items-center space-x-8">
          {/* S&P 500 */}
          <div className="flex items-center space-x-3 group hover:bg-gray-800 px-3 py-1 rounded transition-all duration-200">
            <span className="text-gray-400 text-xs uppercase tracking-wider">S&P 500</span>
            <span className="text-quant-gold font-bold text-lg transition-all duration-300 group-hover:text-yellow-400">
              {formatNumber(marketData.sp500.value)}
            </span>
            <div className={`flex items-center ${getChangeColor(marketData.sp500.change)} transition-all duration-300`}>
              {React.createElement(getChangeIcon(marketData.sp500.change), { className: "h-4 w-4 mr-1 animate-pulse" })}
              <span className="font-bold text-sm">
                {marketData.sp500.change >= 0 ? '+' : ''}{formatNumber(marketData.sp500.change)} 
              </span>
              <span className="ml-1 text-xs">
                ({marketData.sp500.percentChange >= 0 ? '+' : ''}{formatNumber(marketData.sp500.percentChange)}%)
              </span>
            </div>
          </div>

          {/* NASDAQ */}
          <div className="flex items-center space-x-3 group hover:bg-gray-800 px-3 py-1 rounded transition-all duration-200">
            <span className="text-gray-400 text-xs uppercase tracking-wider">NASDAQ</span>
            <span className="text-quant-gold font-bold text-lg transition-all duration-300 group-hover:text-yellow-400">
              {formatNumber(marketData.nasdaq.value)}
            </span>
            <div className={`flex items-center ${getChangeColor(marketData.nasdaq.change)} transition-all duration-300`}>
              {React.createElement(getChangeIcon(marketData.nasdaq.change), { className: "h-4 w-4 mr-1 animate-pulse" })}
              <span className="font-bold text-sm">
                {marketData.nasdaq.change >= 0 ? '+' : ''}{formatNumber(marketData.nasdaq.change)} 
              </span>
              <span className="ml-1 text-xs">
                ({marketData.nasdaq.percentChange >= 0 ? '+' : ''}{formatNumber(marketData.nasdaq.percentChange)}%)
              </span>
            </div>
          </div>

          {/* DOW */}
          <div className="flex items-center space-x-3 group hover:bg-gray-800 px-3 py-1 rounded transition-all duration-200">
            <span className="text-gray-400 text-xs uppercase tracking-wider">DOW</span>
            <span className="text-quant-gold font-bold text-lg transition-all duration-300 group-hover:text-yellow-400">
              {formatNumber(marketData.dow.value)}
            </span>
            <div className={`flex items-center ${getChangeColor(marketData.dow.change)} transition-all duration-300`}>
              {React.createElement(getChangeIcon(marketData.dow.change), { className: "h-4 w-4 mr-1 animate-pulse" })}
              <span className="font-bold text-sm">
                {marketData.dow.change >= 0 ? '+' : ''}{formatNumber(marketData.dow.change)} 
              </span>
              <span className="ml-1 text-xs">
                ({marketData.dow.percentChange >= 0 ? '+' : ''}{formatNumber(marketData.dow.percentChange)}%)
              </span>
            </div>
          </div>

          {/* Russell 2000 */}
          <div className="flex items-center space-x-3 group hover:bg-gray-800 px-3 py-1 rounded transition-all duration-200">
            <span className="text-gray-400 text-xs uppercase tracking-wider">RUT</span>
            <span className="text-quant-gold font-bold text-lg transition-all duration-300 group-hover:text-yellow-400">
              {formatNumber(marketData.russell2000.value)}
            </span>
            <div className={`flex items-center ${getChangeColor(marketData.russell2000.change)} transition-all duration-300`}>
              {React.createElement(getChangeIcon(marketData.russell2000.change), { className: "h-4 w-4 mr-1 animate-pulse" })}
              <span className="font-bold text-sm">
                {marketData.russell2000.change >= 0 ? '+' : ''}{formatNumber(marketData.russell2000.change)} 
              </span>
              <span className="ml-1 text-xs">
                ({marketData.russell2000.percentChange >= 0 ? '+' : ''}{formatNumber(marketData.russell2000.percentChange)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Market Status with Wall Street flashing */}
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${getFlashColor(flashIndex)}`}></div>
          <span className={`font-bold text-lg tracking-wider ${getFlashColor(flashIndex)} transition-all duration-300`}>
            {isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
          </span>
        </div>
      </div>

      {/* Ticker-style news scroll */}
      <div className="mt-2 text-xs text-gray-400 overflow-hidden whitespace-nowrap">
        <div className="animate-scroll-left inline-block">
          <span className="text-yellow-400 font-bold">BREAKING:</span> AAPL up 2.3% on strong earnings • 
          <span className="text-green-400 font-bold">TSLA</span> gains 1.8% • 
          <span className="text-red-400 font-bold">NVDA</span> down 0.7% • 
          Fed signals potential rate cuts • 
          <span className="text-yellow-400 font-bold">BREAKING:</span> AAPL up 2.3% on strong earnings • 
          <span className="text-green-400 font-bold">TSLA</span> gains 1.8% • 
          <span className="text-red-400 font-bold">NVDA</span> down 0.7% • 
          Fed signals potential rate cuts
        </div>
      </div>
    </div>
  );
};

export default MarketStatusBar; 