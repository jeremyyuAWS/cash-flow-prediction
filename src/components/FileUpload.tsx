import React, { useState } from 'react';
import { Upload, FileText, Check, AlertTriangle, Building } from 'lucide-react';
import TabChatInterface from './TabChatInterface';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  fileUploaded: boolean;
  industryType: string;
  setIndustryType: (industry: string) => void;
}

const INDUSTRY_OPTIONS = [
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
  { id: 'retail', name: 'Retail', icon: '🛒' },
  { id: 'saas', name: 'Software/SaaS', icon: '💻' }
];

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUpload, 
  isLoading, 
  fileUploaded,
  industryType,
  setIndustryType
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const suggestedQuestions = [
    "What file formats do you accept?",
    "How do I select my industry?",
    "What data should my file contain?",
    "Can I use sample data?"
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    // Only process certain file types
    if (file.type === 'text/csv' || file.name.endsWith('.csv') || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
      onFileUpload(file);
    } else {
      alert('Please upload a CSV or Excel file');
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Financial Data</h2>
          <p className="text-gray-600 mb-6">
            Upload your financial transaction data to generate cash flow predictions. We accept CSV and Excel formats with transaction details.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Industry Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {INDUSTRY_OPTIONS.map((industry) => (
                <div 
                  key={industry.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    industryType === industry.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setIndustryType(industry.id)}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{industry.icon}</span>
                    <span className="font-medium">{industry.name}</span>
                  </div>
                  {industryType === industry.id && (
                    <div className="mt-2 text-xs text-indigo-600">
                      Industry pattern selected
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Different industries have unique cash flow patterns. Select the one that best matches your business.
            </p>
          </div>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mb-4"></div>
                <p className="text-gray-600">Processing your data...</p>
              </div>
            ) : fileUploaded ? (
              <div className="flex flex-col items-center justify-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Check size={24} className="text-green-600" />
                </div>
                <p className="mt-4 font-medium text-green-600">File uploaded successfully!</p>
                <p className="mt-2 text-gray-600">Your cash flow forecast has been updated.</p>
                <button 
                  className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Upload Another File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Upload size={24} className="text-indigo-600" />
                </div>
                <p className="mt-4 font-medium">Drag and drop your file here</p>
                <p className="mt-2 text-gray-500">or</p>
                <label className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-indigo-700 transition-colors">
                  <span>Browse Files</span>
                  <input 
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                    accept=".csv,.xlsx"
                  />
                </label>
                <p className="mt-4 text-sm text-gray-500">Supports CSV and Excel files</p>
              </div>
            )}
          </div>
          
          {selectedFile && !fileUploaded && !isLoading && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText size={20} className="text-indigo-600" />
                  <span className="ml-2 font-medium">{selectedFile.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>
                <button 
                  className="bg-indigo-600 text-white py-1 px-4 rounded text-sm hover:bg-indigo-700 transition-colors"
                  onClick={handleSubmit}
                >
                  Process
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-8 border-t pt-6">
            <h3 className="font-medium mb-2">Sample Data Files</h3>
            <p className="text-sm text-gray-600 mb-4">
              Don't have your own data? Use our sample files to test the app.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <FileText size={20} className="text-indigo-600" />
                  <span className="ml-2 font-medium">transactions_sample.csv</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Basic transaction data including dates, amounts, and categories
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  Industry: Manufacturing
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <FileText size={20} className="text-indigo-600" />
                  <span className="ml-2 font-medium">retail_transactions.xlsx</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Retail transaction data with seasonal patterns and daily sales
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  Industry: Retail
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <FileText size={20} className="text-indigo-600" />
                  <span className="ml-2 font-medium">saas_subscriptions.csv</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  SaaS subscription revenue and expenses with MRR metrics
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  Industry: Software/SaaS
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-center">
                  <FileText size={20} className="text-indigo-600" />
                  <span className="ml-2 font-medium">custom_template.xlsx</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Empty template file with correct format for your own data
                </p>
                <div className="mt-2 text-xs text-green-600">
                  Compatible with all industry types
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="h-[780px]">
          <TabChatInterface
            agentName="Data Agent"
            agentNumber="Agent-01"
            agentDescription="I help you prepare and upload your financial data for analysis."
            placeholderText="Ask about data upload..."
            suggestedQuestions={suggestedQuestions}
            view="upload"
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;