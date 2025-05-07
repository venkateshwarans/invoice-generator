import { useState, useEffect } from 'react';
import { mergeConfig } from '@/config/invoiceConfig';
import type { InvoiceFieldConfig, InvoiceItem } from '@/types/invoice';

export interface UseInvoiceConfigProps {
  initialConfig?: Partial<InvoiceFieldConfig>;
}

export interface UseInvoiceConfigReturn {
  config: InvoiceFieldConfig;
  updateConfig: (newConfig: Partial<InvoiceFieldConfig>) => void;
  resetConfig: () => void;
  getInitialItem: () => InvoiceItem;
  getFieldValue: (section: string, field: string) => any;
}

export function useInvoiceConfig({ initialConfig = {} }: UseInvoiceConfigProps = {}): UseInvoiceConfigReturn {
  const [config, setConfig] = useState<InvoiceFieldConfig>(mergeConfig(initialConfig));

  // Only set config once on initial mount
  // Removed the dependency on initialConfig to prevent infinite loops
  useEffect(() => {
    setConfig(mergeConfig(initialConfig));
  }, []);

  // Function to update the configuration
  const updateConfig = (newConfig: Partial<InvoiceFieldConfig>) => {
    setConfig(prevConfig => mergeConfig({ ...prevConfig, ...newConfig }));
  };

  // Function to reset to default configuration
  const resetConfig = () => {
    setConfig(mergeConfig(initialConfig));
  };

  // Function to get an initial item based on the config
  const getInitialItem = (): InvoiceItem => {
    const item: InvoiceItem = {
      id: Date.now(),
      description: '',
      hsnSac: '',
      quantity: 1,
      rate: 0,
      igstPercent: config.taxes.igst.defaultValue,
      igstAmount: 0,
      amount: 0,
    };

    // Add any additional fields from config
    config.itemFields.forEach(field => {
      if (!Object.prototype.hasOwnProperty.call(item, field.key)) {
        item[field.key] = field.type === 'number' ? 0 : '';
      }
    });

    return item;
  };

  // Helper function to get a field value from any section
  const getFieldValue = (section: string, field: string): any => {
    if (config[section] && config[section][field]) {
      return config[section][field].defaultValue;
    }
    return undefined;
  };

  return {
    config,
    updateConfig,
    resetConfig,
    getInitialItem,
    getFieldValue,
  };
}
