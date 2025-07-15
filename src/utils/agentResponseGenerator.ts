import { format } from 'date-fns';
import { AgentType } from './agentContext';

// Define agentConfig with information about each agent
export const agentConfig = {
  'data-agent': {
    name: 'Data Agent',
    number: 'LIQ-01',
    description: 'I specialize in data imports, file formats, and industry settings.',
    expertise: ['data imports', 'file formats', 'industry settings'],
    icon: 'database'
  },
  'analysis-agent': {
    name: 'Analysis Agent',
    number: 'LIQ-02',
    description: 'I provide insights on your financial metrics and cash flow forecasts.',
    expertise: ['financial metrics', 'cash flow analysis', 'KPI tracking'],
    icon: 'bar-chart'
  },
  'insights-agent': {
    name: 'Insights Agent',
    number: 'LIQ-03',
    description: 'I identify patterns and provide deep financial analysis.',
    expertise: ['pattern recognition', 'trend analysis', 'anomaly detection'],
    icon: 'lightbulb'
  },
  'scenario-agent': {
    name: 'Scenario Agent',
    number: 'LIQ-04',
    description: 'I simulate different financial scenarios to help you prepare for the future.',
    expertise: ['what-if analysis', 'stress testing', 'scenario modeling'],
    icon: 'git-branch'
  },
  'reporting-agent': {
    name: 'Reporting Agent',
    number: 'LIQ-05',
    description: 'I help you create and customize financial reports.',
    expertise: ['report generation', 'data visualization', 'document formatting'],
    icon: 'file-text'
  },
  'integration-agent': {
    name: 'Integration Agent',
    number: 'LIQ-06',
    description: 'I specialize in connecting with other systems and APIs.',
    expertise: ['data exports', 'API connections', 'system integrations'],
    icon: 'plug'
  },
  'alert-agent': {
    name: 'Alert Agent',
    number: 'LIQ-07',
    description: 'I help you set up alerts and notifications for important financial events.',
    expertise: ['threshold monitoring', 'notification systems', 'custom alerts'],
    icon: 'bell'
  },
  'model-agent': {
    name: 'Model Agent',
    number: 'LIQ-08',
    description: 'I help you configure AI forecasting models and parameters.',
    expertise: ['model selection', 'parameter tuning', 'forecasting configuration'],
    icon: 'cpu'
  },
  'settings-agent': {
    name: 'Settings Agent',
    number: 'LIQ-09',
    description: 'I help you manage your application settings and preferences.',
    expertise: ['profile management', 'security settings', 'preference configuration'],
    icon: 'settings'
  },
  'assistant-agent': {
    name: 'Assistant Agent',
    number: 'LIQ-00',
    description: 'I coordinate all specialized agents to provide comprehensive assistance.',
    expertise: ['agent coordination', 'query routing', 'comprehensive answers'],
    icon: 'bot'
  }
};

// Sample response templates for different agent types and queries
const templates: Record<AgentType, Record<string, string>> = {
  'data-agent': {
    default: "I can help you upload and process your financial data. You can ask about accepted file formats, how to use the sample data, or how industry selection affects your forecasts.",
    file_formats: "I accept CSV and Excel (XLSX) files with your financial transaction data. The file should include columns for date, transaction amount, transaction type (inflow/outflow), and optionally a category. You can download a template from the sample files section below.",
    industry_selection: "Selecting your industry helps me apply appropriate seasonal patterns and benchmarks to your data. For example, retail businesses typically have stronger Q4 sales, while manufacturing might have more consistent revenue with quarterly material purchases. Choose the industry that best matches your business pattern.",
    data_preparation: "Before uploading, ensure your data includes transaction dates, amounts, and types (income/expense). Remove any non-financial data and ensure dates are in a consistent format. If you have multiple accounts, you can either combine the data or upload them separately for individual analysis."
  },
  'analysis-agent': {
    default: "I analyze your financial metrics and provide insights on your cash flow forecast. I can tell you about your cash position, projected balance, burn rate, or help you interpret your financial KPIs.",
    cash_position: "Your current cash position is {{currentBalance}} and is projected to be {{projectedBalance}} in 30 days, which represents a {{cashGrowthPercent}} {{cashGrowthDirection}}. This {{growthAssessment}} based on your historical cash flow patterns.",
    burn_rate: "Your current monthly burn rate is {{burnRate}}, giving you a runway of approximately {{runway}} days at your current spending level. This is {{runwayAssessment}} compared to industry benchmarks.",
    dso_analysis: "Your Days Sales Outstanding (DSO) is currently {{dso}} days, which is {{dsoComparison}} the industry average of {{industryDSO}} days. {{dsoRecommendation}}",
    cash_flow_details: "Your projected cash flow for the next quarter shows {{trend}}. Major inflows are expected around {{majorInflows}}, while significant outflows are scheduled for {{majorOutflows}}. The most critical period for liquidity management appears to be {{criticalPeriod}}."
  },
  'insights-agent': {
    default: "I provide deep financial analysis and pattern recognition to help you optimize your working capital. I can analyze cash conversion cycles, identify seasonal patterns, or provide recommendations for working capital optimization.",
    cash_conversion: "Your Cash Conversion Cycle is {{ccc}} days, comprised of {{dso}} days DSO, {{dio}} days DIO, and {{dpo}} days DPO. This means it takes {{ccc}} days to convert your investments in inventory and resources into cash flows from sales. {{cccAssessment}}",
    seasonal_patterns: "I've analyzed your cash flow data and identified several seasonal patterns. Your business shows {{seasonalPattern}} with peaks in {{peakMonths}} and troughs in {{troughMonths}}. This pattern is {{seasonalityComparison}} for your industry.",
    working_capital: "Based on your financial data, I've identified opportunities to optimize your working capital by {{optimizationStrategy}}. This could improve your cash position by approximately {{improvementEstimate}} within {{timeframe}}.",
    anomaly_detection: "I've detected several anomalies in your financial data: {{anomalies}}. These unusual patterns may indicate {{anomalyImplications}} and should be investigated."
  },
  'scenario-agent': {
    default: "I simulate different financial scenarios to help you understand potential outcomes. I can model revenue changes, payment delays, market downturns, or other financial scenarios.",
    revenue_increase: "I've modeled a {{percentage}}% revenue increase scenario. This would improve your 90-day cash position by approximately {{improvementPercent}}%, but would require managing increased expenses which typically lag behind revenue growth by 30-45 days.",
    payment_delay: "I've simulated a scenario with a {{days}}-day payment delay from your top customers. This would reduce your 30-day cash position by approximately {{reductionPercent}}%, creating a {{riskLevel}} liquidity risk. I recommend establishing a credit line that covers at least {{creditLinePercent}}% of your monthly revenue as a contingency.",
    market_downturn: "I've created a market downturn scenario with a {{revenueDecrease}}% revenue decrease and {{paymentDelays}}-day payment delays. Under these conditions, your cash reserves would be depleted in approximately {{depletionDays}} days. To withstand such a scenario, I recommend {{recommendations}}.",
    expense_reduction: "I've modeled an expense reduction scenario targeting {{targetAreas}}. By reducing expenses in these areas by {{reductionPercent}}%, you could improve your cash position by {{improvementAmount}} over {{timeframe}} months without significantly impacting operations."
  },
  'reporting-agent': {
    default: "I can help you generate comprehensive financial reports based on your forecast data. You can ask about customization options, how to export or print reports, or what information is included in each report section.",
    report_customization: "You can customize your reports by selecting specific date ranges, metrics to include, and visualization preferences. Currently, the report includes an executive summary, 90-day cash flow projection, monthly forecast breakdown, and any active alerts.",
    export_options: "You can download the report as a PDF by clicking the 'Download PDF' button. The report will include all current visualizations and data. For printing, use the 'Print' button, which will open your browser's print dialog with the report formatted for printing.",
    report_sections: "The financial report is structured into several key sections: {{sections}}. Each section provides specific insights into your financial position and forecast, with a focus on {{focusAreas}}.",
    schedule_reports: "I can help you schedule regular reports to be generated {{frequency}}. These can be automatically shared with {{recipients}} to keep your team informed about your financial position and outlook."
  },
  'integration-agent': {
    default: "I can help you with data export, system integrations, and API access. What specific integration or data management function are you interested in?",
    export_data: "You can export your data in CSV, Excel, or JSON formats. Select the type of data you want to export (forecast, historical, or combined) and your preferred format, then click 'Export Data'. The file will be downloaded to your device.",
    system_connections: "You can connect to external systems like SAP, Oracle NetSuite, QuickBooks, and banking APIs. These integrations allow you to import live financial data automatically. Select the system you want to connect to, and I'll guide you through the authentication process.",
    api_access: "We provide a RESTful API for custom integrations. You can retrieve forecast data, historical data, run simulations, and access alerts programmatically. API keys are available in the 'API Access' tab, and comprehensive documentation is available to help you implement your integration."
  },
  'alert-agent': {
    default: "I can help you configure your alert and notification settings. You can ask about alert thresholds, custom alerts, notification methods, or notification schedules.",
    threshold_configuration: "Alert thresholds determine when notifications are triggered. Key thresholds include: minimum cash balance, DSO threshold, burn rate percentage, consecutive negative cash flow days, and working capital ratio. Set these values based on your business requirements and risk tolerance.",
    custom_alerts: "You can create custom alerts based on specific conditions like: single large inflow or outflow, balance increases or decreases by percentage, specific customer payment events. Use the 'Add Custom Alert' section to configure these specialized triggers.",
    notification_methods: "Configure notification methods (email, dashboard alerts) and frequency (real-time, daily digest, weekly). You can set notification time windows to avoid alerts during off-hours and add multiple email recipients for team notifications."
  },
  'model-agent': {
    default: "I can help you configure the AI forecasting models and parameters. You can ask about model selection, parameter configuration, or specific forecasting features.",
    model_selection: "We use multiple forecasting models including Prophet (for seasonal patterns), ARIMA (for short-term forecasting), and optional LSTM neural networks (for complex patterns). You can enable or disable models based on your data characteristics and forecasting needs.",
    parameter_tuning: "Model parameters allow you to fine-tune forecast behavior. Key parameters include: forecast horizon (how far to forecast), confidence interval width, seasonality strength, outlier sensitivity, and volatility factor. Adjust these based on your business patterns and risk tolerance.",
    features_configuration: "Our forecasting engine has several features you can enable/disable: weekday pattern recognition, monthly/seasonal pattern analysis, historical trend analysis, anomaly detection, and external factors (beta). Enabling more features generally improves forecast accuracy but may require more data."
  },
  'settings-agent': {
    default: "I can help you manage your application settings. You can ask about profile management, security settings, notification preferences, or data management options.",
    profile_settings: "In the Profile tab, you can update your personal information including name, email, job title, and company details. This information is used for report generation and notifications.",
    security_settings: "Security settings allow you to manage your password, enable two-factor authentication, and set session timeout preferences. I recommend enabling two-factor authentication for enhanced security and setting an appropriate session timeout based on your usage patterns.",
    notification_preferences: "You can customize your notification preferences to receive alerts via email or in-app notifications. Set your notification schedule to control when you receive alerts and configure quiet hours and days to avoid disruptions during off-hours."
  },
  'assistant-agent': {
    default: "I'm the Assistant Agent that coordinates all specialized financial AI agents. I can help answer your questions about cash flow, forecasting, or direct you to the right specialized agent for deeper analysis.",
    agent_referral: "I'll connect you with our {{agentName}} who specializes in {{expertise}} to help with your question about {{topic}}.",
    comprehensive_answer: "Let me provide a comprehensive answer by consulting multiple agents: {{agentResponses}}",
    clarification: "To better assist you, could you clarify whether you're asking about {{option1}} or {{option2}}? This will help me direct your question to the most appropriate agent."
  }
};

// Simulation of agent knowledge for contextual responses
const agentKnowledge = {
  financialMetrics: {
    cashBalanceThresholds: {
      critical: 30000,
      warning: 60000,
      healthy: 100000
    },
    dsoIndustryAverages: {
      retail: 15,
      manufacturing: 45,
      saas: 20
    },
    dpoIndustryAverages: {
      retail: 35,
      manufacturing: 30,
      saas: 15
    },
    burnRateAssessment: {
      high: 0.15, // 15% of cash balance per month
      medium: 0.1, // 10% of cash balance per month
      low: 0.05 // 5% of cash balance per month
    },
    runwayThresholds: {
      critical: 60, // days
      warning: 120, // days
      healthy: 180 // days
    }
  },
  businessContexts: {
    seasonality: {
      retail: {
        highSeasons: ['Q4', 'Back-to-school'],
        lowSeasons: ['Q1']
      },
      manufacturing: {
        highSeasons: ['Q2', 'Q4'],
        lowSeasons: ['Q3']
      },
      saas: {
        highSeasons: ['Q1', 'Q4'],
        lowSeasons: ['Q3']
      }
    },
    typicalCashConversionCycle: {
      retail: 25,
      manufacturing: 60,
      saas: 40
    }
  }
};

// Function to identify the intent of a user message
function identifyIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Look for specific intents based on keywords
  if (lowerMessage.includes('file') && (lowerMessage.includes('format') || lowerMessage.includes('type'))) {
    return 'file_formats';
  }
  
  if (lowerMessage.includes('industry') || lowerMessage.includes('business type')) {
    return 'industry_selection';
  }
  
  if (lowerMessage.includes('cash position') || lowerMessage.includes('balance')) {
    return 'cash_position';
  }
  
  if (lowerMessage.includes('burn rate') || lowerMessage.includes('spending rate')) {
    return 'burn_rate';
  }
  
  if (lowerMessage.includes('dso') || lowerMessage.includes('days sales') || lowerMessage.includes('receivable')) {
    return 'dso_analysis';
  }
  
  if (lowerMessage.includes('conversion cycle') || lowerMessage.includes('ccc')) {
    return 'cash_conversion';
  }
  
  if (lowerMessage.includes('seasonal') || lowerMessage.includes('pattern')) {
    return 'seasonal_patterns';
  }
  
  if (lowerMessage.includes('optimize') && lowerMessage.includes('working capital')) {
    return 'working_capital';
  }
  
  if (lowerMessage.includes('revenue increase') || lowerMessage.includes('sales increase')) {
    return 'revenue_increase';
  }
  
  if (lowerMessage.includes('delay') && lowerMessage.includes('payment')) {
    return 'payment_delay';
  }
  
  if (lowerMessage.includes('downturn') || lowerMessage.includes('recession')) {
    return 'market_downturn';
  }
  
  if (lowerMessage.includes('customize') && lowerMessage.includes('report')) {
    return 'report_customization';
  }
  
  if ((lowerMessage.includes('export') || lowerMessage.includes('download')) && lowerMessage.includes('report')) {
    return 'export_options';
  }
  
  if (lowerMessage.includes('export') && lowerMessage.includes('data')) {
    return 'export_data';
  }
  
  if (lowerMessage.includes('connect') || lowerMessage.includes('integration')) {
    return 'system_connections';
  }
  
  if (lowerMessage.includes('api')) {
    return 'api_access';
  }
  
  if (lowerMessage.includes('threshold') || lowerMessage.includes('trigger')) {
    return 'threshold_configuration';
  }
  
  if (lowerMessage.includes('custom') && lowerMessage.includes('alert')) {
    return 'custom_alerts';
  }
  
  if (lowerMessage.includes('notification') || lowerMessage.includes('alert') && lowerMessage.includes('email')) {
    return 'notification_methods';
  }
  
  if (lowerMessage.includes('model') || lowerMessage.includes('algorithm')) {
    return 'model_selection';
  }
  
  if (lowerMessage.includes('parameter') || lowerMessage.includes('configuration')) {
    return 'parameter_tuning';
  }
  
  if (lowerMessage.includes('feature') || lowerMessage.includes('capability')) {
    return 'features_configuration';
  }
  
  if (lowerMessage.includes('profile') || lowerMessage.includes('account')) {
    return 'profile_settings';
  }
  
  if (lowerMessage.includes('security') || lowerMessage.includes('password')) {
    return 'security_settings';
  }
  
  // For the assistant agent, check if we need to consult other agents
  if (lowerMessage.includes('all agents') || lowerMessage.includes('comprehensive')) {
    return 'comprehensive_answer';
  }
  
  // Default to a generic response if no specific intent is detected
  return 'default';
}

// Function to fill template with data
function fillTemplate(template: string, data: Record<string, any>): string {
  let filledTemplate = template;
  
  // Replace all placeholders with actual values
  Object.keys(data).forEach(key => {
    const placeholder = `{{${key}}}`;
    if (filledTemplate.includes(placeholder)) {
      filledTemplate = filledTemplate.replace(new RegExp(placeholder, 'g'), data[key].toString());
    }
  });
  
  // Remove any remaining placeholders
  filledTemplate = filledTemplate.replace(/{{[^}]+}}/g, 'N/A');
  
  return filledTemplate;
}

// Function to get response from another agent (for coordination)
function getResponseFromAgent(agentId: AgentType, message: string, forecastData: any, historicalData: any): string {
  const intent = identifyIntent(message);
  const template = templates[agentId][intent] || templates[agentId].default;
  
  // Prepare data for template based on agent and intent
  const templateData = prepareTemplateData(agentId, intent, forecastData, historicalData);
  
  return fillTemplate(template, templateData);
}

// Function to prepare dynamic data for templates
function prepareTemplateData(agentId: AgentType, intent: string, forecastData: any, historicalData: any): Record<string, any> {
  const data: Record<string, any> = {};
  
  // Add common financial data if available
  if (forecastData) {
    data.currentBalance = `$${forecastData.dailyForecasts[0].balance.toLocaleString()}`;
    data.projectedBalance = `$${forecastData.dailyForecasts[29].balance.toLocaleString()}`;
    
    const cashGrowth = ((forecastData.dailyForecasts[29].balance - forecastData.dailyForecasts[0].balance) / forecastData.dailyForecasts[0].balance) * 100;
    data.cashGrowthPercent = `${Math.abs(cashGrowth).toFixed(1)}%`;
    data.cashGrowthDirection = cashGrowth >= 0 ? 'increase' : 'decrease';
    data.growthAssessment = cashGrowth >= 10 ? 'strong growth' : cashGrowth >= 0 ? 'moderate growth' : cashGrowth >= -10 ? 'slight decline' : 'significant decline';
    
    // Burn rate and runway
    const monthlyBurnRate = Math.round(forecastData.monthlyForecasts[0].outflows / 30);
    data.burnRate = `$${monthlyBurnRate.toLocaleString()} per day`;
    data.runway = Math.round(forecastData.dailyForecasts[0].balance / monthlyBurnRate);
    
    const runwayThresholds = agentKnowledge.financialMetrics.runwayThresholds;
    data.runwayAssessment = data.runway > runwayThresholds.healthy ? 'very healthy' : 
                           data.runway > runwayThresholds.warning ? 'adequate' : 
                           data.runway > runwayThresholds.critical ? 'concerning' : 'critical';
    
    // DSO and DPO
    if (forecastData.kpis) {
      data.dso = Math.round(forecastData.kpis.dso);
      data.dpo = Math.round(forecastData.kpis.dpo);
      
      // Industry comparison
      const industry = forecastData.industry?.toLowerCase() || 'manufacturing';
      data.industryDSO = agentKnowledge.financialMetrics.dsoIndustryAverages[industry] || 45;
      data.dsoComparison = data.dso <= data.industryDSO ? 'better than' : 'worse than';
      data.dsoRecommendation = data.dso > data.industryDSO ? 
        'Consider implementing early payment incentives or reviewing your accounts receivable process.' : 
        'Your current collection practices are working well. Maintain your current approach.';
      
      // Cash Conversion Cycle
      data.dio = Math.round(30 + Math.random() * 10); // Days Inventory Outstanding (simulated)
      data.ccc = data.dso + data.dio - data.dpo;
      const industryCCC = agentKnowledge.businessContexts.typicalCashConversionCycle[industry] || 45;
      data.cccAssessment = data.ccc < industryCCC ? 
        `This is better than the industry average of ${industryCCC} days, indicating efficient working capital management.` : 
        `This is longer than the industry average of ${industryCCC} days, suggesting opportunities to improve working capital efficiency.`;
    }
    
    // Seasonal patterns
    const industry = forecastData.industry?.toLowerCase() || 'manufacturing';
    data.seasonalPattern = 'typical seasonal fluctuations';
    data.peakMonths = agentKnowledge.businessContexts.seasonality[industry]?.highSeasons.join(' and ') || 'Q4';
    data.troughMonths = agentKnowledge.businessContexts.seasonality[industry]?.lowSeasons.join(' and ') || 'Q1';
    data.seasonalityComparison = 'typical';
    
    // For scenario agent
    data.percentage = 15;
    data.improvementPercent = 22;
    data.days = 30;
    data.reductionPercent = 18;
    data.riskLevel = 'moderate';
    data.creditLinePercent = 25;
    data.revenueDecrease = 20;
    data.paymentDelays = 30;
    data.depletionDays = 72;
    data.recommendations = 'maintaining at least 90 days of operating expenses in cash reserves and implementing expense reduction plans that can be activated quickly';
    
    // For reporting agent
    data.sections = 'Executive Summary, Cash Flow Forecast, KPI Analysis, and Risk Assessment';
    data.focusAreas = 'liquidity management and cash flow optimization';
    data.frequency = 'weekly or monthly';
    data.recipients = 'key stakeholders and financial team members';
    
    // For optimization strategies
    data.optimizationStrategy = 'improving your receivables process and optimizing inventory levels';
    data.improvementEstimate = '$75,000-$100,000';
    data.timeframe = '3-6';
    
    // For anomaly detection
    data.anomalies = 'unusual payment patterns in accounts receivable, unexpected expense spikes in Q2, and irregular inventory turnover';
    data.anomalyImplications = 'potential process inefficiencies or changing customer behavior';
    
    // For assistant agent
    data.agentName = 'Insights Agent';
    data.expertise = 'pattern recognition and financial trends analysis';
    data.topic = 'seasonal patterns';
    data.option1 = 'historical data analysis';
    data.option2 = 'future projections';
    
    // Mock agent responses for comprehensive answers
    data.agentResponses = `
1. Analysis Agent: Your cash position is projected to grow by 8.3% in the next 30 days.
2. Insights Agent: Your business shows typical seasonal patterns with Q4 being your strongest period.
3. Scenario Agent: Running a stress test shows you have sufficient reserves to handle a 15% revenue drop.
    `;
  }
  
  return data;
}

// Main function to generate agent response
export function generateAgentResponse(
  agentId: AgentType,
  message: string,
  forecastData: any = null,
  historicalData: any = null,
  conversationHistory: any[] = []
): { text: string; refersToAgents?: AgentType[]; markdown?: boolean } {
  const intent = identifyIntent(message);
  const template = templates[agentId][intent] || templates[agentId].default;
  
  // Check if we need to get answers from other agents (for assistant agent)
  if (agentId === 'assistant-agent' && intent === 'comprehensive_answer') {
    const relevantAgents: AgentType[] = determineRelevantAgents(message);
    const agentResponses = relevantAgents.map(agent => {
      const response = getResponseFromAgent(agent, message, forecastData, historicalData);
      return `**${agentConfig[agent].name}**: ${response}`;
    }).join('\n\n');
    
    const responseText = `I've consulted multiple specialized agents to give you a comprehensive answer:\n\n${agentResponses}`;
    return { 
      text: responseText, 
      refersToAgents: relevantAgents,
      markdown: true 
    };
  }
  
  // For agent referral from assistant
  if (agentId === 'assistant-agent' && intent !== 'default' && intent !== 'clarification') {
    const targetAgent = determineTargetAgent(intent);
    if (targetAgent && targetAgent !== 'assistant-agent') {
      const templateData = {
        agentName: agentConfig[targetAgent].name,
        expertise: agentConfig[targetAgent].expertise.join(', '),
        topic: intent.replace('_', ' ')
      };
      const referralText = fillTemplate(templates['assistant-agent'].agent_referral, templateData);
      const agentResponse = getResponseFromAgent(targetAgent, message, forecastData, historicalData);
      
      return { 
        text: `${referralText}\n\n${agentResponse}`, 
        refersToAgents: [targetAgent] 
      };
    }
  }
  
  // Standard response for all other cases
  const templateData = prepareTemplateData(agentId, intent, forecastData, historicalData);
  return { text: fillTemplate(template, templateData) };
}

// Function to determine which agents are relevant to a query
function determineRelevantAgents(message: string): AgentType[] {
  const lowerMessage = message.toLowerCase();
  const relevantAgents: AgentType[] = [];
  
  // Financial metrics and KPIs
  if (lowerMessage.includes('balance') || lowerMessage.includes('cash position') || 
      lowerMessage.includes('burn rate') || lowerMessage.includes('kpi')) {
    relevantAgents.push('analysis-agent');
  }
  
  // Patterns and trends
  if (lowerMessage.includes('pattern') || lowerMessage.includes('trend') || 
      lowerMessage.includes('seasonal') || lowerMessage.includes('anomaly')) {
    relevantAgents.push('insights-agent');
  }
  
  // Scenarios and projections
  if (lowerMessage.includes('scenario') || lowerMessage.includes('what if') || 
      lowerMessage.includes('projection') || lowerMessage.includes('simulate')) {
    relevantAgents.push('scenario-agent');
  }
  
  // If asking about a specific feature or general financial health
  if (lowerMessage.includes('report') || lowerMessage.includes('export')) {
    relevantAgents.push('reporting-agent');
  }
  
  // Model and forecasting questions
  if (lowerMessage.includes('model') || lowerMessage.includes('forecast accuracy') || 
      lowerMessage.includes('algorithm') || lowerMessage.includes('prediction')) {
    relevantAgents.push('model-agent');
  }
  
  // If no specific agents were identified, add analysis agent as default
  if (relevantAgents.length === 0) {
    relevantAgents.push('analysis-agent');
  }
  
  return relevantAgents;
}

// Function to determine the target agent for a specific intent
function determineTargetAgent(intent: string): AgentType | null {
  switch (intent) {
    case 'file_formats':
    case 'industry_selection':
    case 'data_preparation':
      return 'data-agent';
      
    case 'cash_position':
    case 'burn_rate':
    case 'dso_analysis':
    case 'cash_flow_details':
      return 'analysis-agent';
      
    case 'cash_conversion':
    case 'seasonal_patterns':
    case 'working_capital':
    case 'anomaly_detection':
      return 'insights-agent';
      
    case 'revenue_increase':
    case 'payment_delay':
    case 'market_downturn':
    case 'expense_reduction':
      return 'scenario-agent';
      
    case 'report_customization':
    case 'export_options':
    case 'report_sections':
    case 'schedule_reports':
      return 'reporting-agent';
      
    case 'export_data':
    case 'system_connections':
    case 'api_access':
      return 'integration-agent';
      
    case 'threshold_configuration':
    case 'custom_alerts':
    case 'notification_methods':
      return 'alert-agent';
      
    case 'model_selection':
    case 'parameter_tuning':
    case 'features_configuration':
      return 'model-agent';
      
    case 'profile_settings':
    case 'security_settings':
    case 'notification_preferences':
      return 'settings-agent';
      
    default:
      return null;
  }
}