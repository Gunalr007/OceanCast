// Simulated ML Engine for Ocean Cast
// Generates realistic predictive time-series data using mathematical models.

function generateNoise(volatility) {
  return (Math.random() - 0.5) * volatility;
}

function generateForecast(baseRate, days, baseVolatility, baseTrend, seasonalityFunc, params) {
  const data = [];
  let currentRate = baseRate;
  const today = new Date();
  
  // Apply interactive parameters
  const volatility = baseVolatility * (params.volatilityMultiplier || 1.0);
  const trend = baseTrend + (params.trendOffset || 0);

  for (let i = -30; i <= days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    // Simulate complex model: base + trend + seasonality + random noise
    currentRate = currentRate + trend + generateNoise(volatility);
    
    // Prevent negative freight rates
    if (currentRate < 5) currentRate = 5;

    // Apply seasonality
    const seasonalFactor = seasonalityFunc(d.getMonth());
    const finalRate = currentRate * seasonalFactor;
    
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (i < 0) {
      data.push({ date: dateStr, historical: parseFloat(finalRate.toFixed(2)) });
    } else if (i === 0) {
      data.push({ 
        date: dateStr, 
        historical: parseFloat(finalRate.toFixed(2)),
        forecast: parseFloat(finalRate.toFixed(2)),
        lowerBound: parseFloat(finalRate.toFixed(2)),
        upperBound: parseFloat(finalRate.toFixed(2))
      });
    } else {
      // Confidence interval widens over time, affected by volatility
      const confidenceMargin = (i * volatility * 0.4); 
      data.push({ 
        date: dateStr, 
        forecast: parseFloat(finalRate.toFixed(2)),
        lowerBound: parseFloat(Math.max(5, finalRate - confidenceMargin).toFixed(2)),
        upperBound: parseFloat((finalRate + confidenceMargin).toFixed(2))
      });
    }
  }
  
  return data;
}

// Seasonality functions
const monsoonSeasonality = (month) => {
  // Higher rates during monsoon (June-Sept) due to port disruptions
  if (month >= 5 && month <= 8) return 1.08; 
  return 1.0;
};

const winterDemandSeasonality = (month) => {
  // Higher coal demand in winter (Nov-Feb)
  if (month >= 10 || month <= 1) return 1.12;
  return 1.0;
};

const flatSeasonality = () => 1.0;

module.exports = {
  getFreightForecast: (cargoType = 'coal', params = {}) => {
    let baseRate, volatility, trend, seasonality;

    switch(cargoType.toLowerCase()) {
      case 'iron_ore':
        baseRate = 25.0;
        volatility = 0.8;
        trend = 0.02;
        seasonality = flatSeasonality; // Iron ore is steadier
        break;
      case 'grain':
        baseRate = 40.0;
        volatility = 1.5;
        trend = 0.05;
        seasonality = monsoonSeasonality; // Affected by harvest/monsoon
        break;
      case 'coal':
      default:
        baseRate = 30.0;
        volatility = 1.2;
        trend = 0.03;
        seasonality = winterDemandSeasonality;
        break;
    }

    return generateForecast(baseRate, 60, volatility, trend, seasonality, params);
  },
  
  getDemandForecast: () => {
    // Simulate monthly demand in MT
    const demand = [];
    const today = new Date();
    let baseDemand = 75000;
    
    for (let i = -3; i <= 6; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthStr = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      const seasonal = winterDemandSeasonality(d.getMonth());
      baseDemand = baseDemand + (Math.random() - 0.2) * 5000; // Slight upward bias
      
      const finalDemand = Math.floor(baseDemand * seasonal);
      
      if (i < 0) {
        demand.push({ month: monthStr, historical: finalDemand });
      } else {
        demand.push({ month: monthStr, forecast: finalDemand });
      }
    }
    return demand;
  }
};
