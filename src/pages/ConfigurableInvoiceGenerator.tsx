import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceGenerator } from './InvoiceGenerator';
import { InvoiceConfigForm } from '@/components/InvoiceConfigForm';
import { useInvoiceConfig } from '@/hooks/useInvoiceConfig';

export const ConfigurableInvoiceGenerator: React.FC = () => {
  const { config, updateConfig, resetConfig } = useInvoiceConfig();
  const [activeTab, setActiveTab] = useState<string>('generator');

  // Function to save config to localStorage
  const saveConfigToStorage = () => {
    try {
      localStorage.setItem('invoiceConfig', JSON.stringify(config));
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration.');
    }
  };

  // Function to load config from localStorage
  const loadConfigFromStorage = () => {
    try {
      const savedConfig = localStorage.getItem('invoiceConfig');
      if (savedConfig) {
        updateConfig(JSON.parse(savedConfig));
        alert('Configuration loaded successfully!');
      } else {
        alert('No saved configuration found.');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
      alert('Failed to load configuration.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Invoice Generator</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generator">Generate Invoice</TabsTrigger>
          <TabsTrigger value="config">Configure Fields</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator" className="mt-6">
          <InvoiceGenerator config={config} />
        </TabsContent>
        
        <TabsContent value="config" className="mt-6">
          <div className="mb-4 flex justify-end space-x-4">
            <button 
              onClick={loadConfigFromStorage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Load Saved Config
            </button>
            <button 
              onClick={saveConfigToStorage}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Save Config
            </button>
          </div>
          <InvoiceConfigForm 
            config={config} 
            onUpdateConfig={updateConfig} 
            onResetConfig={resetConfig} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
