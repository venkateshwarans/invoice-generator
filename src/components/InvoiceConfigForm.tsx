// Replace the entire content of /Users/venkat/CascadeProjects/invoice-generator/src/components/InvoiceConfigForm.tsx with this:

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DynamicField } from '@/components/DynamicField';
import type { InvoiceFieldConfig, TaxConfig } from '@/types/invoice';

interface InvoiceConfigFormProps {
  config: InvoiceFieldConfig;
  onUpdateConfig: (config: Partial<InvoiceFieldConfig>) => void;
  onResetConfig: () => void;
}

export const InvoiceConfigForm: React.FC<InvoiceConfigFormProps> = ({
  config,
  onUpdateConfig,
  onResetConfig,
}) => {
  const handleFieldChange = (section: string, field: string, value: any) => {
    onUpdateConfig({
      [section]: {
        ...config[section],
        [field]: {
          ...config[section][field],
          defaultValue: value,
        },
      },
    });
  };

  const handleTaxChange = (taxKey: string, enabled: boolean) => {
    onUpdateConfig({
      taxes: {
        ...config.taxes,
        [taxKey]: {
          ...config.taxes[taxKey],
          enabled,
        } as TaxConfig,
      },
    });
  };

  const handleCurrencyChange = (currency: string, symbol: string) => {
    onUpdateConfig({
      ui: {
        ...config.ui,
        currency,
        currencySymbol: symbol,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Configuration</CardTitle>
          <CardDescription>Customize your invoice fields and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company Information</h3>
              {Object.entries(config.company).map(([key, field]) => (
                field && (
                  <DynamicField
                    key={`company-${key}`}
                    id={`company-${key}`}
                    field={field}
                    value={field.defaultValue}
                    onChange={(value) => handleFieldChange('company', key, value)}
                  />
                )
              ))}
            </div>

            {/* Invoice Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
              {Object.entries(config.invoice).map(([key, field]) => (
                field && (
                  <DynamicField
                    key={`invoice-${key}`}
                    id={`invoice-${key}`}
                    field={field}
                    value={field.defaultValue}
                    onChange={(value) => handleFieldChange('invoice', key, value)}
                  />
                )
              ))}
            </div>

            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              {Object.entries(config.client).map(([key, field]) => (
                field && (
                  <DynamicField
                    key={`client-${key}`}
                    id={`client-${key}`}
                    field={field}
                    value={field.defaultValue}
                    onChange={(value) => handleFieldChange('client', key, value)}
                  />
                )
              ))}
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              {Object.entries(config.payment).map(([key, field]) => (
                field && (
                  <DynamicField
                    key={`payment-${key}`}
                    id={`payment-${key}`}
                    field={field}
                    value={field.defaultValue}
                    onChange={(value) => handleFieldChange('payment', key, value)}
                  />
                )
              ))}
            </div>

            {/* Tax Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Tax Settings</h3>
              {Object.entries(config.taxes).map(([key, tax]) => (
                tax && (
                  <div key={`tax-${key}`} className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id={`tax-${key}-enabled`}
                      checked={tax.enabled}
                      onChange={(e) => handleTaxChange(key, e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor={`tax-${key}-enabled`} className="mr-4">
                      {tax.label}
                    </label>
                    {tax.enabled && (
                      <div className="flex-1">
                        <label htmlFor={`tax-${key}-value`} className="sr-only">
                          Default {tax.label} Value
                        </label>
                        <input
                          type="number"
                          id={`tax-${key}-value`}
                          value={tax.defaultValue}
                          onChange={(e) => 
                            onUpdateConfig({
                              taxes: {
                                ...config.taxes,
                                [key]: {
                                  enabled: tax.enabled,
                                  label: tax.label,
                                  defaultValue: parseFloat(e.target.value),
                                } as TaxConfig,
                              },
                            })
                          }
                          className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>

            {/* Currency Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Currency Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="block mb-2">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={config.ui.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value, config.ui.currencySymbol)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="INR">Indian Rupee (INR)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="currencySymbol" className="block mb-2">
                    Symbol
                  </label>
                  <input
                    type="text"
                    id="currencySymbol"
                    value={config.ui.currencySymbol}
                    onChange={(e) => handleCurrencyChange(config.ui.currency, e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline" onClick={onResetConfig}>
              Reset to Default
            </Button>
            <Button type="button">
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};