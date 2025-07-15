import React, { useState, useEffect } from 'react';
import { BarChart4, Save, RefreshCw, Settings, Clock, Brain, ArrowRight, ToggleLeft, Check, Info } from 'lucide-react';
import { generateForecastData } from '../utils/dataGenerator';
import TabChatInterface from './TabChatInterface';

interface ModelConfigurationProps {
  historicalData: any;
  forecastData: any;
  onModelUpdate: (newForecastData: any) => void;
}

// Default configuration for the forecast model
const DEFAULT_CONFIG = {
  models: {
    prophet: true,
    arima: true,
    lstm: false,
    ensemble: true
  },
  parameters: {
    forecastHorizon: 90,
    confidenceInterval: 80,
    seasonalityStrength: 50,
    outlierSensitivity: 50,
    volatilityFactor: 50
  },
  features: {
    useWeekdayPattern: true,
    useMonthlyPattern: true, 
    useHistoricalTrends: true,
    detectAnomalies: true,
    includeExternalFactors: false
  }
};

const ModelConfiguration: React.FC<ModelConfigurationProps> = ({ 
  historicalData, 
  forecastData, 
  onModelUpdate 
}) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('models');
  const [advancedMode, setAdvancedMode] = useState(false);

  const suggestedQuestions = [
    "Which model is best for my data?",
    "What does the ensemble method do?",
    "How do I improve forecast accuracy?",
    "What parameters should I adjust?"
  ];

  useEffect(() => {
    setUnsavedChanges(false);
  }, []);

  const handleModelToggle = (model: keyof typeof config.models) => {
    // Don't allow all models to be turned off
    const currentlyEnabled = Object.values(config.models).filter(Boolean).length;
    if (currentlyEnabled <= 1 && config.models[model]) return;
    
    setConfig(prev => ({
      ...prev,
      models: {
        ...prev.models,
        [model]: !prev.models[model]
      }
    }));
    setUnsavedChanges(true);
  };

  const handleParameterChange = (parameter: keyof typeof config.parameters, value: number) => {
    setConfig(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [parameter]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const handleFeatureToggle = (feature: keyof typeof config.features) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
    setUnsavedChanges(true);
  };

  const handleApplyChanges = () => {
    setIsProcessing(true);
    setUpdateSuccess(false);
    
    // Simulate processing time
    setTimeout(() => {
      // Create a modified clone of historical data with adjustments based on config
      const adjustedHistoricalData = { ...historicalData };
      
      // Apply model configuration adjustments
      // In a real system, these configurations would affect the model behavior
      // For this demo, we'll use them to slightly modify the generated data
      
      // Use more models = smoother predictions with less variance
      const modelCount = Object.values(config.models).filter(Boolean).length;
      const ensembleEnabled = config.models.ensemble;
      
      // Adjust historical data based on parameters
      adjustedHistoricalData.dailyData = adjustedHistoricalData.dailyData.map((day: any) => {
        // Apply seasonality strength 
        const seasonalityFactor = (config.parameters.seasonalityStrength / 50); // 0.5-1.5
        
        // Apply volatility factor
        const volatilityBase = config.parameters.volatilityFactor / 50; // 0.5-1.5
        const volatilityAdjustment = config.features.detectAnomalies 
          ? volatilityBase * 0.8  // Less volatility if anomaly detection is on
          : volatilityBase * 1.2; // More volatility if anomaly detection is off
        
        // Generate random adjustments based on config
        const inflowAdjustment = 1 + ((Math.random() * 0.1) - 0.05) * volatilityAdjustment;
        const outflowAdjustment = 1 + ((Math.random() * 0.1) - 0.05) * volatilityAdjustment;
        
        // Apply weekday pattern if enabled
        const date = new Date(day.date);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const weekdayFactor = config.features.useWeekdayPattern && isWeekend 
          ? 0.6  // Weekend reduction
          : 1.0; // Normal weekday
        
        // Apply monthly pattern if enabled
        const monthFactor = config.features.useMonthlyPattern
          ? 1 + ((date.getMonth() % 3 === 0) ? 0.15 : 0)  // Quarterly adjustment
          : 1.0;
        
        // Calculate final adjustments
        const finalInflowFactor = inflowAdjustment * seasonalityFactor * weekdayFactor * monthFactor;
        const finalOutflowFactor = outflowAdjustment * seasonalityFactor * weekdayFactor;
        
        return {
          ...day,
          inflows: Math.round(day.inflows * finalInflowFactor),
          outflows: Math.round(day.outflows * finalOutflowFactor)
        };
      });
      
      // If ensemble is enabled, smooth the data
      if (ensembleEnabled) {
        // Simple moving average for demonstration
        const smoothedData = [...adjustedHistoricalData.dailyData];
        const windowSize = 3;
        
        for (let i = windowSize; i < smoothedData.length - windowSize; i++) {
          const surroundingInflows = smoothedData.slice(i - windowSize, i + windowSize + 1)
            .reduce((sum: number, day: any) => sum + day.inflows, 0) / (windowSize * 2 + 1);
          
          const surroundingOutflows = smoothedData.slice(i - windowSize, i + windowSize + 1)
            .reduce((sum: number, day: any) => sum + day.outflows, 0) / (windowSize * 2 + 1);
          
          smoothedData[i] = {
            ...smoothedData[i],
            inflows: Math.round(smoothedData[i].inflows * 0.7 + surroundingInflows * 0.3),
            outflows: Math.round(smoothedData[i].outflows * 0.7 + surroundingOutflows * 0.3)
          };
        }
        
        adjustedHistoricalData.dailyData = smoothedData;
      }
      
      // Generate new forecast based on adjusted historical data
      const newForecast = generateForecastData(adjustedHistoricalData, config.parameters.forecastHorizon);
      
      // Adjust forecast confidence based on configuration
      newForecast.dailyForecasts = newForecast.dailyForecasts.map((day: any, index: number) => {
        // Confidence decreases over time, but is affected by the confidence interval setting
        const timeDecay = 1 - (index / config.parameters.forecastHorizon) * 0.5;
        const modelBoost = (modelCount / 4) * 5; // 5-20% boost based on model count
        const baseConfidence = config.parameters.confidenceInterval;
        
        // Calculate final confidence
        let confidence = Math.round((baseConfidence * timeDecay + modelBoost) * 
          (config.features.useHistoricalTrends ? 1.1 : 0.9));
        
        // Cap confidence at 98%
        confidence = Math.min(confidence, 98);
        
        return {
          ...day,
          confidence
        };
      });
      
      // Update the forecast
      onModelUpdate(newForecast);
      setIsProcessing(false);
      setUnsavedChanges(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }, 2000);
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setUnsavedChanges(true);
  };

  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Forecast Model Configuration</h2>
          <div className="flex space-x-2">
            <button 
              onClick={resetToDefaults}
              className="flex items-center bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={16} className="mr-1" />
              Reset
            </button>
            <button 
              onClick={handleApplyChanges}
              disabled={isProcessing || !unsavedChanges}
              className={`flex items-center px-4 py-2 rounded ${
                isProcessing || !unsavedChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-colors`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Apply Changes
                </>
              )}
            </button>
          </div>
        </div>
        
        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center">
            <Check size={18} className="mr-2" />
            Forecast model updated successfully!
          </div>
        )}
        
        <p className="text-gray-600">
          Customize the AI forecasting models and parameters to optimize for your specific business needs and cash flow patterns.
        </p>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('models')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'models' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Brain size={16} className="inline-block mr-1" />
              Models
            </button>
            <button 
              onClick={() => setActiveTab('parameters')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'parameters' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Settings size={16} className="inline-block mr-1" />
              Parameters
            </button>
            <button 
              onClick={() => setActiveTab('features')}
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === 'features' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart4 size={16} className="inline-block mr-1" />
              Features
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex justify-end mb-4">
              <button 
                onClick={toggleAdvancedMode}
                className="flex items-center text-sm text-gray-600 hover:text-indigo-600"
              >
                <ToggleLeft size={18} className={`mr-1 ${advancedMode ? 'text-indigo-600' : ''}`} />
                {advancedMode ? 'Advanced Mode' : 'Basic Mode'}
              </button>
            </div>
            
            {activeTab === 'models' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Forecasting Models</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select which AI forecasting models to use for your cash flow predictions. Using multiple models generally improves accuracy.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      className={`border rounded-lg p-5 cursor-pointer ${
                        config.models.prophet 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleModelToggle('prophet')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <BarChart4 size={18} className="mr-2 text-indigo-600" />
                          Prophet Model
                        </h4>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          config.models.prophet 
                            ? 'border-indigo-600 bg-indigo-600' 
                            : 'border-gray-300'
                        }`}>
                          {config.models.prophet && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Effective at identifying seasonal patterns and trends in financial data.
                      </p>
                      {advancedMode && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                            <div>Seasonality: <span className="font-medium">Advanced</span></div>
                            <div>Speed: <span className="font-medium">Medium</span></div>
                            <div>Best for: <span className="font-medium">Cyclical business</span></div>
                            <div>Author: <span className="font-medium">Facebook Research</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-5 cursor-pointer ${
                        config.models.arima 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleModelToggle('arima')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <Clock size={18} className="mr-2 text-indigo-600" />
                          ARIMA Model
                        </h4>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          config.models.arima 
                            ? 'border-indigo-600 bg-indigo-600' 
                            : 'border-gray-300'
                        }`}>
                          {config.models.arima && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Statistical model that excels at short-term forecasting with historical patterns.
                      </p>
                      {advancedMode && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                            <div>Time series: <span className="font-medium">Specialized</span></div>
                            <div>Speed: <span className="font-medium">Fast</span></div>
                            <div>Best for: <span className="font-medium">Short-term</span></div>
                            <div>Config: <span className="font-medium">(2,1,2)</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-5 cursor-pointer ${
                        config.models.lstm 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleModelToggle('lstm')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <Brain size={18} className="mr-2 text-indigo-600" />
                          LSTM Neural Network
                        </h4>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          config.models.lstm 
                            ? 'border-indigo-600 bg-indigo-600' 
                            : 'border-gray-300'
                        }`}>
                          {config.models.lstm && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Deep learning model capable of identifying complex non-linear patterns.
                      </p>
                      {advancedMode && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                            <div>Complexity: <span className="font-medium">High</span></div>
                            <div>Speed: <span className="font-medium">Slow</span></div>
                            <div>Best for: <span className="font-medium">Complex patterns</span></div>
                            <div>Data needs: <span className="font-medium">Extensive</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className={`border rounded-lg p-5 cursor-pointer ${
                        config.models.ensemble 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleModelToggle('ensemble')}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          <Settings size={18} className="mr-2 text-indigo-600" />
                          Ensemble Method
                        </h4>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          config.models.ensemble 
                            ? 'border-indigo-600 bg-indigo-600' 
                            : 'border-gray-300'
                        }`}>
                          {config.models.ensemble && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Combines results from multiple models to improve accuracy and reduce variance.
                      </p>
                      {advancedMode && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                            <div>Method: <span className="font-medium">Weighted average</span></div>
                            <div>Benefits: <span className="font-medium">Stability</span></div>
                            <div>Requires: <span className="font-medium">Multiple models</span></div>
                            <div>Overhead: <span className="font-medium">Minimal</span></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'parameters' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Forecast Parameters</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Adjust these parameters to fine-tune your forecast model's behavior and optimize for your business needs.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Forecast Horizon (Days)
                        </label>
                        <span className="text-sm text-gray-500">
                          {config.parameters.forecastHorizon} days
                        </span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="180"
                        step="15"
                        value={config.parameters.forecastHorizon}
                        onChange={(e) => handleParameterChange('forecastHorizon', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>30 days</span>
                        <span>90 days</span>
                        <span>180 days</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Controls how far into the future your forecast extends. Longer horizons typically have lower confidence.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Confidence Interval
                        </label>
                        <span className="text-sm text-gray-500">
                          {config.parameters.confidenceInterval}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={config.parameters.confidenceInterval}
                        onChange={(e) => handleParameterChange('confidenceInterval', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>50%</span>
                        <span>75%</span>
                        <span>95%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Determines the width of prediction intervals. Higher values mean wider intervals but more certainty.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Seasonality Strength
                        </label>
                        <span className="text-sm text-gray-500">
                          {config.parameters.seasonalityStrength < 33 ? 'Low' : 
                           config.parameters.seasonalityStrength < 66 ? 'Medium' : 'High'} 
                          ({config.parameters.seasonalityStrength}%)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={config.parameters.seasonalityStrength}
                        onChange={(e) => handleParameterChange('seasonalityStrength', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Adjusts how much the model emphasizes seasonal patterns in your cash flow data.
                      </p>
                    </div>
                    
                    {advancedMode && (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Outlier Sensitivity
                            </label>
                            <span className="text-sm text-gray-500">
                              {config.parameters.outlierSensitivity < 33 ? 'Low' : 
                               config.parameters.outlierSensitivity < 66 ? 'Medium' : 'High'} 
                              ({config.parameters.outlierSensitivity}%)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={config.parameters.outlierSensitivity}
                            onChange={(e) => handleParameterChange('outlierSensitivity', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Controls how sensitive the model is to unusual transactions and outlier events.
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Volatility Factor
                            </label>
                            <span className="text-sm text-gray-500">
                              {config.parameters.volatilityFactor < 33 ? 'Low' : 
                               config.parameters.volatilityFactor < 66 ? 'Medium' : 'High'} 
                              ({config.parameters.volatilityFactor}%)
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={config.parameters.volatilityFactor}
                            onChange={(e) => handleParameterChange('volatilityFactor', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Adjusts how much day-to-day variability the model expects in cash flows.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Model Features</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enable or disable specific forecasting capabilities to tailor the model to your business requirements.
                  </p>
                  
                  <div className="space-y-4">
                    <div 
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleFeatureToggle('useWeekdayPattern')}
                    >
                      <div>
                        <h4 className="font-medium">Weekday Pattern Recognition</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Identifies and applies day-of-week patterns (e.g., higher weekend retail sales).
                        </p>
                      </div>
                      <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                        config.features.useWeekdayPattern ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          config.features.useWeekdayPattern ? 'translate-x-6' : ''
                        }`}></div>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleFeatureToggle('useMonthlyPattern')}
                    >
                      <div>
                        <h4 className="font-medium">Monthly/Seasonal Patterns</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Accounts for monthly patterns and seasonal trends in your cash flow data.
                        </p>
                      </div>
                      <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                        config.features.useMonthlyPattern ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          config.features.useMonthlyPattern ? 'translate-x-6' : ''
                        }`}></div>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleFeatureToggle('useHistoricalTrends')}
                    >
                      <div>
                        <h4 className="font-medium">Historical Trend Analysis</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Analyzes past trends to project future cash flow directional movements.
                        </p>
                      </div>
                      <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                        config.features.useHistoricalTrends ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          config.features.useHistoricalTrends ? 'translate-x-6' : ''
                        }`}></div>
                      </div>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => handleFeatureToggle('detectAnomalies')}
                    >
                      <div>
                        <h4 className="font-medium">Anomaly Detection</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Identifies and filters out unusual transactions that might skew predictions.
                        </p>
                      </div>
                      <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                        config.features.detectAnomalies ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          config.features.detectAnomalies ? 'translate-x-6' : ''
                        }`}></div>
                      </div>
                    </div>
                    
                    {advancedMode && (
                      <div 
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => handleFeatureToggle('includeExternalFactors')}
                      >
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">External Factors</h4>
                            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded-full">Beta</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Incorporates external economic indicators and market data into the forecast.
                          </p>
                        </div>
                        <div className={`w-12 h-6 flex items-center rounded-full p-1 ${
                          config.features.includeExternalFactors ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            config.features.includeExternalFactors ? 'translate-x-6' : ''
                          }`}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">About AI Forecasting Models</h3>
              <div className="mt-2 text-sm text-indigo-700">
                <p>
                  Our AI-powered forecasting system uses multiple models and techniques to deliver accurate cash flow predictions. 
                  Use the configuration options to optimize the forecasting behavior for your specific business needs.
                  {advancedMode && (
                    <span className="block mt-2">
                      For best results, enable the ensemble method and at least two forecasting models. This creates a more balanced 
                      prediction that's less affected by unusual data points or model-specific limitations.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="h-[780px]">
          <TabChatInterface
            agentName="Model Agent"
            agentNumber="Agent-08"
            agentDescription="I help you configure and optimize the AI forecasting models for your business needs."
            placeholderText="Ask about model configuration..."
            suggestedQuestions={suggestedQuestions}
            view="model"
          />
        </div>
      </div>
    </div>
  );
};

export default ModelConfiguration;