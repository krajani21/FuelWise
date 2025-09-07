import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

const AreaStatistics = ({ statistics }) => {
  if (!statistics) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#003366] to-blue-700 text-white rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex items-center mb-4">
        <BarChart3 className="h-6 w-6 mr-2" />
        <h2 className="text-xl font-bold">Area Price Statistics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <BarChart3 className="h-4 w-4 mr-1 opacity-80" />
            <span className="text-sm opacity-80">Average</span>
          </div>
          <div className="text-2xl font-bold">${statistics.average}/L</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingDown className="h-4 w-4 mr-1 opacity-80" />
            <span className="text-sm opacity-80">Lowest</span>
          </div>
          <div className="text-2xl font-bold text-green-300">${statistics.lowest}/L</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="h-4 w-4 mr-1 opacity-80" />
            <span className="text-sm opacity-80">Highest</span>
          </div>
          <div className="text-2xl font-bold text-red-300">${statistics.highest}/L</div>
        </div>
      </div>
      
      <div className="text-center mt-4 text-sm opacity-80">
        Based on {statistics.stationCount} stations in your area
      </div>
    </div>
  );
};

export default AreaStatistics;
