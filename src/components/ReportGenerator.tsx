import React, { useRef } from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import TabChatInterface from './TabChatInterface';

interface ReportGeneratorProps {
  historicalData: any;
  forecastData: any;
  alerts: any[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ 
  forecastData, 
  historicalData, 
  alerts 
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "How can I customize this report?",
    "Can I export this in other formats?",
    "What other reports are available?",
    "How often should I generate reports?"
  ];

  const generatePdf = async () => {
    if (!reportRef.current) return;
    
    // Create PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const currentDate = new Date();
    
    // Add header
    doc.setFontSize(22);
    doc.setTextColor(51, 51, 153);
    doc.text('Cash Flow Forecast Report', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${format(currentDate, 'MMMM dd, yyyy')}`, 105, 22, { align: 'center' });
    doc.text(`Industry: ${forecastData.industry || 'Not specified'}`, 105, 28, { align: 'center' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 32, 190, 32);
    
    // KPIs Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Key Performance Indicators', 20, 40);
    
    const kpiData = [
      ['Current Cash Position', `$${forecastData.dailyForecasts[0].balance.toLocaleString()}`],
      ['Projected 30-Day Balance', `$${forecastData.dailyForecasts[29].balance.toLocaleString()}`],
      ['Days Sales Outstanding (DSO)', `${Math.round(forecastData.kpis.dso)} days`],
      ['Days Payable Outstanding (DPO)', `${Math.round(forecastData.kpis.dpo)} days`],
      ['Monthly Burn Rate', `$${Math.round(forecastData.monthlyForecasts[0].outflows / 30).toLocaleString()} per day`]
    ];
    
    // @ts-ignore (jspdf-autotable augments jsPDF prototype)
    doc.autoTable({
      startY: 45,
      head: [['Metric', 'Value']],
      body: kpiData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 80 } }
    });
    
    // Forecast Table Section
    doc.setFontSize(16);
    doc.text('Monthly Forecast Summary', 20, doc.lastAutoTable.finalY + 15);
    
    const monthlyData = forecastData.monthlyForecasts.map((month: any) => [
      month.month,
      `$${month.inflows.toLocaleString()}`,
      `$${month.outflows.toLocaleString()}`,
      `$${month.balance.toLocaleString()}`,
      `${month.confidence}%`
    ]);
    
    // @ts-ignore
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Month', 'Inflows', 'Outflows', 'Ending Balance', 'Confidence']],
      body: monthlyData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255 },
      styles: { fontSize: 10 }
    });
    
    // Alerts Section
    if (alerts.length > 0) {
      doc.setFontSize(16);
      doc.text('Cash Flow Alerts', 20, doc.lastAutoTable.finalY + 15);
      
      const alertsData = alerts.map(alert => [
        format(new Date(alert.date), 'MMM dd, yyyy'),
        alert.type === 'warning' ? 'Warning' : 'Information',
        alert.message
      ]);
      
      // @ts-ignore
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Date', 'Type', 'Message']],
        body: alertsData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 10 },
        columnStyles: { 2: { cellWidth: 100 } }
      });
    }
    
    // Capture the cash flow chart as an image
    try {
      const chartElement = document.querySelector('#cash-flow-chart-container canvas');
      if (chartElement) {
        const canvas = await html2canvas(chartElement as HTMLElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        // Add chart to new page if not enough space
        if (doc.lastAutoTable.finalY > 180) {
          doc.addPage();
          doc.setFontSize(16);
          doc.text('Cash Flow Forecast Chart', 20, 20);
          doc.addImage(imgData, 'PNG', 20, 25, 170, 85);
        } else {
          doc.setFontSize(16);
          doc.text('Cash Flow Forecast Chart', 20, doc.lastAutoTable.finalY + 15);
          doc.addImage(imgData, 'PNG', 20, doc.lastAutoTable.finalY + 20, 170, 85);
        }
      }
    } catch (error) {
      console.error('Error capturing chart:', error);
    }
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        'Cash Flow Prediction Agent - Confidential Financial Information',
        105,
        285,
        { align: 'center' }
      );
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
    }
    
    // Save the PDF
    doc.save(`Cash_Flow_Forecast_${format(currentDate, 'yyyy-MM-dd')}.pdf`);
  };

  // Use this reference to store preview data for print view
  const reportData = {
    date: format(new Date(), 'MMMM dd, yyyy'),
    industry: forecastData.industry || 'Manufacturing',
    currentBalance: forecastData.dailyForecasts[0].balance,
    projectedBalance: forecastData.dailyForecasts[29].balance,
    monthlyForecasts: forecastData.monthlyForecasts,
    dso: Math.round(forecastData.kpis.dso),
    dpo: Math.round(forecastData.kpis.dpo),
    burnRate: Math.round(forecastData.monthlyForecasts[0].outflows / 30)
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Report Generator</h2>
          <div className="flex space-x-2">
            <button
              onClick={generatePdf}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              <Printer size={16} className="mr-2" />
              Print
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Generate a detailed report of your cash flow forecast data. The report includes your KPIs, forecast tables, and visualizations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium flex items-center mb-2">
                <FileText size={18} className="mr-2 text-indigo-600" />
                Report Features
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Executive summary with key metrics</li>
                <li>• 90-day cash flow projection</li>
                <li>• Monthly forecast breakdown</li>
                <li>• Liquidity risk analysis</li>
                <li>• Financial KPIs and ratios</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Report Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Date: {reportData.date}</p>
                <p>Industry: {reportData.industry}</p>
                <p>Forecast Period: 90 days</p>
                <p>Cash Position: ${reportData.currentBalance.toLocaleString()}</p>
                <p>Alerts: {alerts.length} active</p>
              </div>
            </div>
          </div>
          
          {/* Report Preview (will be visible in print mode and referenced for PDF) */}
          <div className="border rounded-lg p-6 bg-white mt-4" ref={reportRef}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">Cash Flow Forecast Report</h2>
              <p className="text-gray-500">Generated on {reportData.date}</p>
              <p className="text-gray-500">Industry: {reportData.industry}</p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Key Performance Indicators</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Current Cash Position</p>
                  <p className="text-xl font-bold">${reportData.currentBalance.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Projected in 30 Days</p>
                  <p className="text-xl font-bold">${reportData.projectedBalance.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Daily Burn Rate</p>
                  <p className="text-xl font-bold">${reportData.burnRate.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Days Sales Outstanding</p>
                  <p className="text-xl font-bold">{reportData.dso} days</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-gray-600">Days Payable Outstanding</p>
                  <p className="text-xl font-bold">{reportData.dpo} days</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">Monthly Forecast</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Inflows</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Outflows</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ending Balance</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.monthlyForecasts.map((month: any, index: number) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{month.month}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-green-600">${month.inflows.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-red-600">${month.outflows.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">${month.balance.toLocaleString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">{month.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {alerts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Cash Flow Alerts</h3>
                <div className="space-y-2">
                  {alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg ${alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex items-start">
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}`}>
                            {alert.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(alert.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-400 text-center mt-10 pt-4 border-t">
              Cash Flow Prediction Agent - Confidential Financial Information
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="h-[780px]">
          <TabChatInterface
            agentName="Reporting Agent"
            agentNumber="Agent-05"
            agentDescription="I help you create and customize comprehensive financial reports."
            placeholderText="Ask about report options..."
            suggestedQuestions={suggestedQuestions}
            view="reports"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;