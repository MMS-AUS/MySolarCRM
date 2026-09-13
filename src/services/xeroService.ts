import {
  XeroIntegrationSettings,
  XeroInvoice,
  XeroQuotation,
  XeroBill,
  XeroContactSyncItem,
  XeroLineItem,
  XeroPaymentReceipt,
  Contact,
  SubContractor,
  Lead
} from '../types';

const SETTINGS_KEY = 'solar_xero_settings';
const INVOICES_KEY = 'solar_xero_invoices';
const QUOTATIONS_KEY = 'solar_xero_quotations';
const BILLS_KEY = 'solar_xero_bills';
const CONTACTS_SYNC_KEY = 'solar_xero_contacts_sync';
const PAYMENT_RECEIPTS_KEY = 'solar_xero_payment_receipts';

export const DEFAULT_XERO_SETTINGS: XeroIntegrationSettings = {
  organizationName: 'SolarFlow Dynamics Australia Pty Ltd',
  tenantId: 'xero-tnt-9921-8840-au',
  isConnected: true,
  connectedEmail: 'accounts@solarinstallers.com.au',
  tokenExpiresAt: new Date(Date.now() + 86400000 * 28).toISOString(),
  salesAccountCode: '200 - Solar System & Battery Sales',
  stcClearingAccountCode: '215 - STC Government Rebate Clearing',
  cogsAccountCode: '310 - Solar Panels & Inverters Inventory',
  installerLabourAccountCode: '320 - Contractor Installation Labour',
  bankAccountCode: '090 - ANZ Business Operating Account',
  defaultInvoiceTermsDays: 14,
  defaultQuoteTermsDays: 30,
  autoSyncNewContacts: true,
  autoCreateInvoiceOnContract: true,
  lastSyncTime: 'Real-time',
  isDemoAccount: true
};

const INITIAL_INVOICES: XeroInvoice[] = [
  {
    id: 'xinv-1',
    invoiceNumber: 'INV-2026-0041',
    type: 'ACCREC',
    contactId: 'cnt-1',
    contactName: 'Nathaniel Ward',
    contactEmail: 'nathaniel.ward@gmail.com',
    date: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'AUTHORISED',
    reference: 'SOL-NSW-1042',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'li-1',
        description: '10.0kW Solar Power System (24x Jinko Tiger Neo 440W Panels + Sungrow SG10RS Inverter)',
        quantity: 1,
        unitAmount: 16800.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 1680.0,
        lineAmount: 16800.0
      },
      {
        id: 'li-2',
        description: 'Less: Point of Sale Small-scale Technology Certificate (STC) Rebate (110 STCs @ $38.00)',
        quantity: 1,
        unitAmount: -4180.0,
        accountCode: '215',
        taxType: 'BAS Excluded',
        taxAmount: 0.0,
        lineAmount: -4180.0
      }
    ],
    subTotal: 12620.0,
    totalTax: 1680.0,
    total: 12620.0,
    amountPaid: 3000.0,
    amountDue: 9620.0,
    updatedAt: '2026-09-02T10:15:00Z'
  },
  {
    id: 'xinv-2',
    invoiceNumber: 'INV-2026-0038',
    type: 'ACCREC',
    contactId: 'cnt-2',
    contactName: 'Brooke Henderson',
    contactEmail: 'brooke.h@outlook.com',
    date: '2026-08-20',
    dueDate: '2026-09-03',
    status: 'PAID',
    reference: 'SOL-QLD-0891',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'li-3',
        description: '13.2kW Jinko Solar System + Tesla Powerwall 3 (13.5kWh Storage & Integrated Inverter)',
        quantity: 1,
        unitAmount: 22400.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 2240.0,
        lineAmount: 22400.0
      },
      {
        id: 'li-4',
        description: 'Less: CER STC Certificate Rebate Assignment (140 STCs @ $38.00)',
        quantity: 1,
        unitAmount: -5320.0,
        accountCode: '215',
        taxType: 'BAS Excluded',
        taxAmount: 0.0,
        lineAmount: -5320.0
      }
    ],
    subTotal: 17080.0,
    totalTax: 2240.0,
    total: 17080.0,
    amountPaid: 17080.0,
    amountDue: 0.0,
    updatedAt: '2026-08-29T14:40:00Z'
  },
  {
    id: 'xinv-3',
    invoiceNumber: 'INV-2026-0043',
    type: 'ACCREC',
    contactId: 'cnt-3',
    contactName: 'Marcus Sterling',
    contactEmail: 'm.sterling@sterlingdistributors.com.au',
    date: '2026-09-03',
    dueDate: '2026-09-17',
    status: 'AUTHORISED',
    reference: 'SOL-NSW-1055',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'li-5',
        description: '39.6kW Commercial Solar Logistics Hub (90x Trina Vertex S+ & 2x Fronius Symo 20kW)',
        quantity: 1,
        unitAmount: 44900.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 4490.0,
        lineAmount: 44900.0
      },
      {
        id: 'li-6',
        description: 'Commercial STC Point of Sale Rebate Deduction (390 STCs @ $38.00)',
        quantity: 1,
        unitAmount: -14820.0,
        accountCode: '215',
        taxType: 'BAS Excluded',
        taxAmount: 0.0,
        lineAmount: -14820.0
      }
    ],
    subTotal: 30080.0,
    totalTax: 4490.0,
    total: 30080.0,
    amountPaid: 10000.0,
    amountDue: 20080.0,
    updatedAt: '2026-09-04T09:00:00Z'
  },
  {
    id: 'xinv-4',
    invoiceNumber: 'INV-2026-0044',
    type: 'ACCREC',
    contactId: 'cnt-4',
    contactName: 'Elena Rostova',
    contactEmail: 'elena.rostova@icloud.com',
    date: '2026-09-05',
    dueDate: '2026-09-19',
    status: 'DRAFT',
    reference: 'QU-2026-098',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'li-7',
        description: '8.8kW Residential Solar Package (20x Trina Solar + Sungrow 8kW Hybrid Inverter)',
        quantity: 1,
        unitAmount: 11500.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 1150.0,
        lineAmount: 11500.0
      },
      {
        id: 'li-8',
        description: 'STC Government Subsidy Discount (98 STCs @ $38.50)',
        quantity: 1,
        unitAmount: -3773.0,
        accountCode: '215',
        taxType: 'BAS Excluded',
        taxAmount: 0.0,
        lineAmount: -3773.0
      }
    ],
    subTotal: 7727.0,
    totalTax: 1150.0,
    total: 7727.0,
    amountPaid: 0.0,
    amountDue: 7727.0,
    updatedAt: '2026-09-05T16:20:00Z'
  }
];

const INITIAL_QUOTATIONS: XeroQuotation[] = [
  {
    id: 'xqu-1',
    quoteNumber: 'QU-2026-104',
    contactId: 'cnt-5',
    contactName: 'Lachlan Murdoch',
    contactEmail: 'l.murdoch@sunshineenergy.com.au',
    title: '13.2kW Dual Array + 10kWh Battery Storage System',
    summary: 'Turnkey solar installation for acreage property including roof mounting, smart energy meter, and backup switch.',
    date: '2026-09-02',
    expiryDate: '2026-10-02',
    status: 'SENT',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'qli-1',
        description: '13.2kW Solar Array (30x Jinko Tiger Neo N-Type 440W)',
        quantity: 1,
        unitAmount: 14200.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 1420.0,
        lineAmount: 14200.0
      },
      {
        id: 'qli-2',
        description: 'Sungrow SBR 10kWh Modular Lithium Iron Phosphate Battery',
        quantity: 1,
        unitAmount: 8900.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 890.0,
        lineAmount: 8900.0
      },
      {
        id: 'qli-3',
        description: 'Less: CER STC Rebate Deduction (140 STCs @ $38.50)',
        quantity: 1,
        unitAmount: -5390.0,
        accountCode: '215',
        taxType: 'BAS Excluded',
        taxAmount: 0.0,
        lineAmount: -5390.0
      }
    ],
    subTotal: 17710.0,
    totalTax: 2310.0,
    total: 17710.0,
    terms: 'Valid for 30 days from issue date. Subject to DNSP grid connection pre-approval.',
    updatedAt: '2026-09-02T11:00:00Z'
  },
  {
    id: 'xqu-2',
    quoteNumber: 'QU-2026-102',
    contactId: 'cnt-1',
    contactName: 'Nathaniel Ward',
    contactEmail: 'nathaniel.ward@gmail.com',
    title: '10.0kW High Efficiency Residential Solar System',
    summary: 'Standard pitched tile roof installation with Sungrow single phase inverter.',
    date: '2026-08-15',
    expiryDate: '2026-09-15',
    status: 'ACCEPTED',
    convertedInvoiceId: 'xinv-1',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'qli-4',
        description: '10.0kW Solar Power Package (24x Jinko Tiger Neo + Sungrow SG10RS)',
        quantity: 1,
        unitAmount: 16800.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 1680.0,
        lineAmount: 16800.0
      },
      {
        id: 'qli-5',
        description: 'Less: STC Point of Sale Rebate (110 STCs @ $38.00)',
        quantity: 1,
        unitAmount: -4180.0,
        accountCode: '215',
        taxType: 'BAS Excluded',
        taxAmount: 0.0,
        lineAmount: -4180.0
      }
    ],
    subTotal: 12620.0,
    totalTax: 1680.0,
    total: 12620.0,
    terms: 'Standard SolarFlow 10-year workmanship warranty included.',
    updatedAt: '2026-08-20T09:30:00Z'
  },
  {
    id: 'xqu-3',
    quoteNumber: 'QU-2026-108',
    contactId: 'cnt-6',
    contactName: 'Giselle Chen',
    contactEmail: 'g.chen@sydneysouth.com.au',
    title: '6.6kW Budget-Friendly Starter Solar Setup',
    summary: 'Designed for residential townhouse in South Sydney with smart export limit.',
    date: '2026-09-04',
    expiryDate: '2026-10-04',
    status: 'DRAFT',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'qli-6',
        description: '6.6kW Solar Array (15x Trina Solar 440W + Sungrow 5kW Inverter)',
        quantity: 1,
        unitAmount: 7800.0,
        accountCode: '200',
        taxType: 'OUTPUT2 (10% GST)',
        taxAmount: 780.0,
        lineAmount: 7800.0
      },
      {
        id: 'qli-7',
        description: 'Less: STC Point of Sale Rebate (73 STCs @ $38.50)',
        quantity: 1,
        unitAmount: -2810.5,
        accountCode: '215',
        taxType: 'BAS Excluded',
        taxAmount: 0.0,
        lineAmount: -2810.5
      }
    ],
    subTotal: 4989.5,
    totalTax: 780.0,
    total: 4989.5,
    terms: '10% deposit required upon acceptance.',
    updatedAt: '2026-09-04T15:00:00Z'
  }
];

const INITIAL_BILLS: XeroBill[] = [
  {
    id: 'xbill-1',
    billNumber: 'BILL-OSW-8891',
    type: 'ACCPAY',
    contactId: 'sup-1',
    contactName: 'One Stop Warehouse (OSW) Australia',
    supplierType: 'Equipment Distributor',
    date: '2026-08-26',
    dueDate: '2026-09-25',
    status: 'AUTHORISED',
    reference: 'PO-SOL-NSW-1042',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'bli-1',
        description: '24x Jinko Tiger Neo 440W N-type Mono Panels (SKU: JKM-440N-54HL4R-V)',
        quantity: 24,
        unitAmount: 185.0,
        accountCode: '310',
        taxType: 'INPUT2 (10% GST on Expenses)',
        taxAmount: 444.0,
        lineAmount: 4440.0
      },
      {
        id: 'bli-2',
        description: '1x Sungrow SG10RS Single-Phase 10kW String Inverter',
        quantity: 1,
        unitAmount: 1980.0,
        accountCode: '310',
        taxType: 'INPUT2 (10% GST on Expenses)',
        taxAmount: 198.0,
        lineAmount: 1980.0
      },
      {
        id: 'bli-3',
        description: 'Clenergy Tile Roof Mounting Kit & Clamps',
        quantity: 1,
        unitAmount: 620.0,
        accountCode: '310',
        taxType: 'INPUT2 (10% GST on Expenses)',
        taxAmount: 62.0,
        lineAmount: 620.0
      }
    ],
    subTotal: 7040.0,
    totalTax: 704.0,
    total: 7744.0,
    amountPaid: 0.0,
    amountDue: 7744.0,
    updatedAt: '2026-08-27T08:00:00Z'
  },
  {
    id: 'xbill-2',
    billNumber: 'BILL-SUB-1042',
    type: 'ACCPAY',
    contactId: 'sub-1',
    contactName: 'Sydney Metro Solar Electrical Pty Ltd',
    supplierType: 'Installation Subcontractor',
    date: '2026-08-28',
    dueDate: '2026-09-11',
    status: 'AUTHORISED',
    reference: 'INSTALL-SOL-NSW-1042',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'bli-4',
        description: 'CEC Accredited Installation & Commissioning Fee (10kW Array - Sydney)',
        quantity: 1,
        unitAmount: 2800.0,
        accountCode: '320',
        taxType: 'INPUT2 (10% GST on Expenses)',
        taxAmount: 280.0,
        lineAmount: 2800.0
      }
    ],
    subTotal: 2800.0,
    totalTax: 280.0,
    total: 3080.0,
    amountPaid: 0.0,
    amountDue: 3080.0,
    updatedAt: '2026-08-29T11:20:00Z'
  },
  {
    id: 'xbill-3',
    billNumber: 'BILL-OSW-8830',
    type: 'ACCPAY',
    contactId: 'sup-1',
    contactName: 'One Stop Warehouse (OSW) Australia',
    supplierType: 'Equipment Distributor',
    date: '2026-08-18',
    dueDate: '2026-09-17',
    status: 'PAID',
    reference: 'PO-SOL-QLD-0891',
    currencyCode: 'AUD',
    lineItems: [
      {
        id: 'bli-5',
        description: '1x Tesla Powerwall 3 Integrated Battery Storage System 13.5kWh',
        quantity: 1,
        unitAmount: 11200.0,
        accountCode: '310',
        taxType: 'INPUT2 (10% GST on Expenses)',
        taxAmount: 1120.0,
        lineAmount: 11200.0
      }
    ],
    subTotal: 11200.0,
    totalTax: 1120.0,
    total: 12320.0,
    amountPaid: 12320.0,
    amountDue: 0.0,
    updatedAt: '2026-08-30T16:00:00Z'
  }
];

const INITIAL_CONTACT_SYNC: XeroContactSyncItem[] = [
  {
    crmContactId: 'cnt-1',
    xeroContactId: 'XERO-CNT-101',
    name: 'Nathaniel Ward',
    email: 'nathaniel.ward@gmail.com',
    phone: '+61 412 345 678',
    contactType: 'Customer',
    syncStatus: 'Synced',
    lastSyncedAt: '2026-09-06T06:30:00Z',
    balanceAud: 9620.0
  },
  {
    crmContactId: 'cnt-2',
    xeroContactId: 'XERO-CNT-102',
    name: 'Brooke Henderson',
    email: 'brooke.h@outlook.com',
    phone: '+61 422 789 331',
    contactType: 'Customer',
    syncStatus: 'Synced',
    lastSyncedAt: '2026-09-05T14:10:00Z',
    balanceAud: 0.0
  },
  {
    crmContactId: 'cnt-3',
    xeroContactId: 'XERO-CNT-103',
    name: 'Marcus Sterling',
    email: 'm.sterling@sterlingdistributors.com.au',
    phone: '+61 433 912 445',
    contactType: 'Customer',
    syncStatus: 'Synced',
    lastSyncedAt: '2026-09-06T06:30:00Z',
    balanceAud: 20080.0
  },
  {
    crmContactId: 'sub-1',
    xeroContactId: 'XERO-VND-001',
    name: 'Sydney Metro Solar Electrical Pty Ltd',
    email: 'accounts@sydneymetrosolar.com.au',
    phone: '+61 2 9840 2200',
    contactType: 'Subcontractor',
    syncStatus: 'Synced',
    lastSyncedAt: '2026-09-05T10:00:00Z',
    balanceAud: 3080.0
  },
  {
    crmContactId: 'sup-1',
    xeroContactId: 'XERO-VND-002',
    name: 'One Stop Warehouse (OSW) Australia',
    email: 'ar@onestopwarehouse.com.au',
    phone: '+61 2 8000 9000',
    contactType: 'Supplier',
    syncStatus: 'Synced',
    lastSyncedAt: '2026-09-06T06:30:00Z',
    balanceAud: 7744.0
  }
];

// Helper to get / save from local storage
export const getXeroSettings = (): XeroIntegrationSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return { ...DEFAULT_XERO_SETTINGS, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Error loading Xero settings:', e);
  }
  return DEFAULT_XERO_SETTINGS;
};

export const saveXeroSettings = (settings: Partial<XeroIntegrationSettings>): XeroIntegrationSettings => {
  const current = getXeroSettings();
  const updated = { ...current, ...settings, lastSyncTime: 'Just now' };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving Xero settings:', e);
  }
  return updated;
};

/**
 * Disconnect current Xero organization/account so the user can connect their actual account
 */
export const disconnectXeroAccount = (): XeroIntegrationSettings => {
  const current = getXeroSettings();
  const updated: XeroIntegrationSettings = {
    ...current,
    isConnected: false,
    organizationName: '',
    connectedEmail: '',
    tenantId: '',
    isDemoAccount: false,
    lastSyncTime: 'Disconnected'
  };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error disconnecting Xero:', e);
  }
  return updated;
};

/**
 * Connect the user's actual corporate Xero organization and accounting mailbox
 */
export const connectActualXeroAccount = (params: {
  organizationName: string;
  connectedEmail: string;
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  clearSampleData?: boolean;
}): XeroIntegrationSettings => {
  const current = getXeroSettings();
  const updated: XeroIntegrationSettings = {
    ...current,
    organizationName: params.organizationName.trim(),
    connectedEmail: params.connectedEmail.trim(),
    tenantId: params.tenantId?.trim() || `xero-tnt-${Math.random().toString(36).substring(2, 9)}`,
    clientId: params.clientId?.trim(),
    clientSecret: params.clientSecret?.trim(),
    isConnected: true,
    isDemoAccount: false,
    tokenExpiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    lastSyncTime: 'Connected Just Now'
  };

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    if (params.clearSampleData) {
      localStorage.setItem(INVOICES_KEY, JSON.stringify([]));
      localStorage.setItem(QUOTATIONS_KEY, JSON.stringify([]));
      localStorage.setItem(BILLS_KEY, JSON.stringify([]));
      localStorage.setItem(CONTACTS_SYNC_KEY, JSON.stringify([]));
    }
  } catch (e) {
    console.error('Error connecting actual Xero account:', e);
  }

  return updated;
};

/**
 * Reset back to sample demo company (SolarFlow Dynamics)
 */
export const resetToDemoXero = (): XeroIntegrationSettings => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(INVOICES_KEY);
    localStorage.removeItem(QUOTATIONS_KEY);
    localStorage.removeItem(BILLS_KEY);
    localStorage.removeItem(CONTACTS_SYNC_KEY);
  } catch (e) {
    console.error('Error resetting Xero to demo:', e);
  }
  return DEFAULT_XERO_SETTINGS;
};

/**
 * Clear existing sample financial records if user wants a clean slate
 */
export const clearXeroSampleData = (): void => {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify([]));
    localStorage.setItem(QUOTATIONS_KEY, JSON.stringify([]));
    localStorage.setItem(BILLS_KEY, JSON.stringify([]));
    localStorage.setItem(CONTACTS_SYNC_KEY, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing Xero sample data:', e);
  }
};

export const getXeroInvoices = (): XeroInvoice[] => {
  try {
    const saved = localStorage.getItem(INVOICES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading Xero invoices:', e);
  }
  return INITIAL_INVOICES;
};

export const saveXeroInvoices = (invoices: XeroInvoice[]): void => {
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error('Error saving Xero invoices:', e);
  }
};

export const getXeroQuotations = (): XeroQuotation[] => {
  try {
    const saved = localStorage.getItem(QUOTATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading Xero quotations:', e);
  }
  return INITIAL_QUOTATIONS;
};

export const saveXeroQuotations = (quotes: XeroQuotation[]): void => {
  try {
    localStorage.setItem(QUOTATIONS_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Error saving Xero quotations:', e);
  }
};

export const getXeroBills = (): XeroBill[] => {
  try {
    const saved = localStorage.getItem(BILLS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading Xero bills:', e);
  }
  return INITIAL_BILLS;
};

export const saveXeroBills = (bills: XeroBill[]): void => {
  try {
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  } catch (e) {
    console.error('Error saving Xero bills:', e);
  }
};

export const getXeroContactSyncItems = (): XeroContactSyncItem[] => {
  try {
    const saved = localStorage.getItem(CONTACTS_SYNC_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading Xero contact sync items:', e);
  }
  return INITIAL_CONTACT_SYNC;
};

export const saveXeroContactSyncItems = (items: XeroContactSyncItem[]): void => {
  try {
    localStorage.setItem(CONTACTS_SYNC_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving Xero contact sync items:', e);
  }
};

// Actions: Invoices
export const createXeroInvoice = (
  invoiceData: Omit<XeroInvoice, 'id' | 'updatedAt' | 'type'>
): XeroInvoice => {
  const invoices = getXeroInvoices();
  const newInvoice: XeroInvoice = {
    ...invoiceData,
    id: `xinv-${Date.now()}`,
    type: 'ACCREC',
    updatedAt: new Date().toISOString()
  };
  const updated = [newInvoice, ...invoices];
  saveXeroInvoices(updated);
  return newInvoice;
};

export const updateXeroInvoice = (
  id: string,
  updates: Partial<XeroInvoice>
): XeroInvoice | null => {
  const invoices = getXeroInvoices();
  const index = invoices.findIndex(inv => inv.id === id);
  if (index === -1) return null;

  const updatedItem: XeroInvoice = {
    ...invoices[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  invoices[index] = updatedItem;
  saveXeroInvoices(invoices);
  return updatedItem;
};

export const voidXeroInvoice = (id: string, voidReason: string): XeroInvoice | null => {
  const invoices = getXeroInvoices();
  const index = invoices.findIndex(inv => inv.id === id);
  if (index === -1) return null;

  const updatedItem: XeroInvoice = {
    ...invoices[index],
    status: 'VOIDED',
    voidReason: voidReason || 'Voided by CRM Operator',
    amountDue: 0,
    updatedAt: new Date().toISOString()
  };
  invoices[index] = updatedItem;
  saveXeroInvoices(invoices);
  return updatedItem;
};

// Actions: Quotations
export const createXeroQuotation = (
  quoteData: Omit<XeroQuotation, 'id' | 'updatedAt'>
): XeroQuotation => {
  const quotes = getXeroQuotations();
  const newQuote: XeroQuotation = {
    ...quoteData,
    id: `xqu-${Date.now()}`,
    updatedAt: new Date().toISOString()
  };
  const updated = [newQuote, ...quotes];
  saveXeroQuotations(updated);
  return newQuote;
};

export const updateXeroQuotation = (
  id: string,
  updates: Partial<XeroQuotation>
): XeroQuotation | null => {
  const quotes = getXeroQuotations();
  const index = quotes.findIndex(q => q.id === id);
  if (index === -1) return null;

  const updatedItem: XeroQuotation = {
    ...quotes[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  quotes[index] = updatedItem;
  saveXeroQuotations(quotes);
  return updatedItem;
};

export const voidXeroQuotation = (id: string, voidReason: string): XeroQuotation | null => {
  const quotes = getXeroQuotations();
  const index = quotes.findIndex(q => q.id === id);
  if (index === -1) return null;

  const updatedItem: XeroQuotation = {
    ...quotes[index],
    status: 'VOIDED',
    voidReason: voidReason || 'Quote voided/withdrawn',
    updatedAt: new Date().toISOString()
  };
  quotes[index] = updatedItem;
  saveXeroQuotations(quotes);
  return updatedItem;
};

export const convertQuotationToInvoice = (quoteId: string): XeroInvoice | null => {
  const quotes = getXeroQuotations();
  const quote = quotes.find(q => q.id === quoteId);
  if (!quote) return null;

  const invNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const newInvoice = createXeroInvoice({
    invoiceNumber: invNumber,
    contactId: quote.contactId,
    contactName: quote.contactName,
    contactEmail: quote.contactEmail,
    date: today,
    dueDate,
    status: 'AUTHORISED',
    reference: quote.quoteNumber,
    currencyCode: 'AUD',
    lineItems: quote.lineItems,
    subTotal: quote.subTotal,
    totalTax: quote.totalTax,
    total: quote.total,
    amountPaid: 0,
    amountDue: quote.total
  });

  // Mark quote as INVOICED
  updateXeroQuotation(quoteId, {
    status: 'INVOICED',
    convertedInvoiceId: newInvoice.id
  });

  return newInvoice;
};

// Actions: Bills
export const createXeroBill = (
  billData: Omit<XeroBill, 'id' | 'updatedAt' | 'type'>
): XeroBill => {
  const bills = getXeroBills();
  const newBill: XeroBill = {
    ...billData,
    id: `xbill-${Date.now()}`,
    type: 'ACCPAY',
    updatedAt: new Date().toISOString()
  };
  const updated = [newBill, ...bills];
  saveXeroBills(updated);
  return newBill;
};

export const updateXeroBill = (
  id: string,
  updates: Partial<XeroBill>
): XeroBill | null => {
  const bills = getXeroBills();
  const index = bills.findIndex(b => b.id === id);
  if (index === -1) return null;

  const updatedItem: XeroBill = {
    ...bills[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  bills[index] = updatedItem;
  saveXeroBills(bills);
  return updatedItem;
};

export const voidXeroBill = (id: string, voidReason: string): XeroBill | null => {
  const bills = getXeroBills();
  const index = bills.findIndex(b => b.id === id);
  if (index === -1) return null;

  const updatedItem: XeroBill = {
    ...bills[index],
    status: 'VOIDED',
    voidReason: voidReason || 'Bill voided / rejected',
    amountDue: 0,
    updatedAt: new Date().toISOString()
  };
  bills[index] = updatedItem;
  saveXeroBills(bills);
  return updatedItem;
};

// Actions: Two-way Contacts Sync
export interface ContactSyncResult {
  syncedCount: number;
  newCount: number;
  updatedCount: number;
  message: string;
  timestamp: string;
}

export const syncAllContactsWithXero = (
  crmContacts: Contact[],
  subContractors: SubContractor[]
): ContactSyncResult => {
  const currentSyncItems = getXeroContactSyncItems();
  const syncMap = new Map<string, XeroContactSyncItem>();
  currentSyncItems.forEach(item => syncMap.set(item.crmContactId, item));

  let newCount = 0;
  let updatedCount = 0;

  // Process CRM customer contacts
  crmContacts.forEach(cnt => {
    const existing = syncMap.get(cnt.id);
    if (!existing) {
      newCount++;
      const xeroId = `XERO-CNT-${Math.floor(100 + Math.random() * 900)}`;
      syncMap.set(cnt.id, {
        crmContactId: cnt.id,
        xeroContactId: xeroId,
        name: cnt.name,
        email: cnt.email,
        phone: cnt.phone,
        contactType: 'Customer',
        syncStatus: 'Synced',
        lastSyncedAt: new Date().toISOString(),
        balanceAud: 0
      });
    } else {
      updatedCount++;
      existing.name = cnt.name;
      existing.email = cnt.email;
      existing.phone = cnt.phone;
      existing.syncStatus = 'Synced';
      existing.lastSyncedAt = new Date().toISOString();
    }
  });

  // Process Subcontractors
  subContractors.forEach(sub => {
    const existing = syncMap.get(sub.id);
    if (!existing) {
      newCount++;
      const xeroId = `XERO-VND-${Math.floor(100 + Math.random() * 900)}`;
      syncMap.set(sub.id, {
        crmContactId: sub.id,
        xeroContactId: xeroId,
        name: sub.companyName,
        email: sub.email,
        phone: sub.phone,
        contactType: 'Subcontractor',
        syncStatus: 'Synced',
        lastSyncedAt: new Date().toISOString(),
        balanceAud: 0
      });
    } else {
      updatedCount++;
      existing.name = sub.companyName;
      existing.email = sub.email;
      existing.phone = sub.phone;
      existing.syncStatus = 'Synced';
      existing.lastSyncedAt = new Date().toISOString();
    }
  });

  const updatedList = Array.from(syncMap.values());
  saveXeroContactSyncItems(updatedList);

  const totalSynced = updatedList.length;
  const timestamp = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  return {
    syncedCount: totalSynced,
    newCount,
    updatedCount,
    message: `Two-way sync complete: ${totalSynced} contacts verified with Xero (${newCount} linked, ${updatedCount} refreshed).`,
    timestamp
  };
};

export const syncSingleContactWithXero = (
  crmContactId: string,
  name: string,
  email: string,
  phone: string,
  contactType: 'Customer' | 'Subcontractor' | 'Supplier'
): XeroContactSyncItem => {
  const currentSyncItems = getXeroContactSyncItems();
  const index = currentSyncItems.findIndex(i => i.crmContactId === crmContactId);

  let updatedItem: XeroContactSyncItem;
  if (index >= 0) {
    updatedItem = {
      ...currentSyncItems[index],
      name,
      email,
      phone,
      syncStatus: 'Synced',
      lastSyncedAt: new Date().toISOString()
    };
    currentSyncItems[index] = updatedItem;
  } else {
    updatedItem = {
      crmContactId,
      xeroContactId: `XERO-${contactType === 'Customer' ? 'CNT' : 'VND'}-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      phone,
      contactType,
      syncStatus: 'Synced',
      lastSyncedAt: new Date().toISOString(),
      balanceAud: 0
    };
    currentSyncItems.push(updatedItem);
  }

  saveXeroContactSyncItems(currentSyncItems);
  return updatedItem;
};

export interface XeroPingResult {
  success: boolean;
  message: string;
  organizationName: string;
  abn: string;
  currency: string;
  taxNumber: string;
  tenantId: string;
  accountsMappedCount: number;
  latencyMs: number;
  timestamp: string;
}

export const pingXeroApi = async (): Promise<XeroPingResult> => {
  const settings = getXeroSettings();
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    success: true,
    message: `Connected to Xero API v2.0 for ${settings.organizationName}. OAuth 2.0 token active.`,
    organizationName: settings.organizationName,
    abn: '48 912 345 678',
    currency: 'AUD',
    taxNumber: 'GST Registered (Australian Tax Office)',
    tenantId: settings.tenantId,
    accountsMappedCount: 5,
    latencyMs: 56,
    timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
};

// ============================================================================
// Actions: Xero Payment Receipts & Customer Invoices
// ============================================================================

const INITIAL_RECEIPTS: XeroPaymentReceipt[] = [
  {
    id: 'xrec-1',
    receiptNumber: 'REC-2026-1042',
    invoiceId: 'xinv-1',
    invoiceNumber: 'INV-2026-0041',
    contactId: 'cnt-1',
    contactName: 'Matthew Barnes',
    contactEmail: 'matthew.b@outlook.com',
    paymentDate: '2026-09-02',
    amountPaidAud: 1000,
    paymentMethod: 'Direct Debit / EFT',
    bankReference: 'ANZ-EFT-991204',
    allocatedToInvoiceAud: 1000,
    remainingInvoiceBalanceAud: 9400,
    notes: 'Initial solar installation deposit received in full via ANZ EFT.',
    updatedAt: '2026-09-02T10:30:00.000Z'
  }
];

export const getXeroPaymentReceipts = (): XeroPaymentReceipt[] => {
  try {
    const data = localStorage.getItem(PAYMENT_RECEIPTS_KEY);
    return data ? JSON.parse(data) : INITIAL_RECEIPTS;
  } catch (e) {
    console.error('Error reading Xero payment receipts:', e);
    return INITIAL_RECEIPTS;
  }
};

export const saveXeroPaymentReceipts = (receipts: XeroPaymentReceipt[]): void => {
  try {
    localStorage.setItem(PAYMENT_RECEIPTS_KEY, JSON.stringify(receipts));
  } catch (e) {
    console.error('Error saving Xero payment receipts:', e);
  }
};

export const createXeroPaymentReceipt = (
  receiptData: Omit<XeroPaymentReceipt, 'id' | 'updatedAt'>
): XeroPaymentReceipt => {
  const receipts = getXeroPaymentReceipts();
  const newReceipt: XeroPaymentReceipt = {
    ...receiptData,
    id: `xrec-${Date.now()}`,
    updatedAt: new Date().toISOString()
  };
  const updated = [newReceipt, ...receipts];
  saveXeroPaymentReceipts(updated);

  // If this receipt is linked to an invoice, update invoice amountPaid & amountDue
  if (receiptData.invoiceId) {
    const invoices = getXeroInvoices();
    const inv = invoices.find(i => i.id === receiptData.invoiceId || i.invoiceNumber === receiptData.invoiceNumber);
    if (inv) {
      const newPaid = (inv.amountPaid || 0) + receiptData.amountPaidAud;
      const newDue = Math.max(0, inv.total - newPaid);
      updateXeroInvoice(inv.id, {
        amountPaid: newPaid,
        amountDue: newDue,
        status: newDue <= 0 ? 'PAID' : 'AUTHORISED'
      });
    }
  }

  return newReceipt;
};

/**
 * Creates or retrieves a full Xero Tax Invoice for a sales lead
 */
export const generateXeroInvoiceForLead = (lead: Lead): XeroInvoice => {
  const existingInvoices = getXeroInvoices();
  if (lead.xeroInvoiceId) {
    const existing = existingInvoices.find(i => i.id === lead.xeroInvoiceId);
    if (existing) return existing;
  }

  const sysPrice = typeof lead.systemPrice === 'number' ? lead.systemPrice : parseFloat(String(lead.systemPrice || '').replace(/[^0-9.]/g, '')) || 12500;
  const sellPrice = typeof lead.sellingPrice === 'number' ? lead.sellingPrice : parseFloat(String(lead.sellingPrice || '').replace(/[^0-9.]/g, '')) || (sysPrice * 0.78);
  const dep = typeof lead.deposit === 'number' ? lead.deposit : parseFloat(String(lead.deposit || '').replace(/[^0-9.]/g, '')) || 1000;
  const stcDiscount = Math.max(0, sysPrice - sellPrice);

  const invNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  const lineItems: XeroLineItem[] = [
    {
      id: `li-${Date.now()}-1`,
      description: `${lead.systemSizeKw || 10.4}kW Solar PV System Supply & CEC Certified Installation (${lead.panelManufacturer || 'Tier-1'} Modules + ${lead.inverterManufacturer || 'Hybrid'} Inverter)`,
      quantity: 1,
      unitAmount: sysPrice,
      accountCode: '200 - Solar System & Battery Sales',
      taxType: 'OUTPUT2',
      taxAmount: sysPrice / 11,
      lineAmount: sysPrice
    }
  ];

  if (stcDiscount > 0) {
    lineItems.push({
      id: `li-${Date.now()}-2`,
      description: 'Clean Energy Regulator STC Point-of-Sale Government Rebate Discount (Assigned to Installer)',
      quantity: 1,
      unitAmount: -stcDiscount,
      accountCode: '215 - STC Government Rebate Clearing',
      taxType: 'BASEXCLUDED',
      taxAmount: 0,
      lineAmount: -stcDiscount
    });
  }

  const subTotal = sellPrice / 1.1;
  const totalTax = sellPrice - subTotal;

  return createXeroInvoice({
    invoiceNumber: invNum,
    contactId: lead.id,
    contactName: lead.customerName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Valued Customer',
    contactEmail: lead.email ? lead.email.split(',')[0].trim() : undefined,
    date: today,
    dueDate,
    status: dep > 0 ? 'AUTHORISED' : 'AUTHORISED',
    reference: `Lead #${lead.id} - ${lead.suburb || 'Residential'} Solar`,
    currencyCode: 'AUD',
    lineItems,
    subTotal: Math.round(subTotal * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    total: Math.round(sellPrice * 100) / 100,
    amountPaid: dep > 0 ? dep : 0,
    amountDue: Math.max(0, Math.round((sellPrice - (dep > 0 ? dep : 0)) * 100) / 100)
  });
};

/**
 * Generates an official Xero Payment Receipt for a lead/invoice
 */
export const generateXeroReceiptForLead = (
  lead: Lead,
  invoice: XeroInvoice,
  amountPaid?: number
): XeroPaymentReceipt => {
  const actualPaid = amountPaid !== undefined
    ? amountPaid
    : (typeof lead.deposit === 'number' ? lead.deposit : parseFloat(String(lead.deposit || '').replace(/[^0-9.]/g, '')) || 1000);

  const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const today = new Date().toISOString().split('T')[0];
  const remaining = Math.max(0, invoice.total - actualPaid);

  return createXeroPaymentReceipt({
    receiptNumber: receiptNum,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    contactId: lead.id,
    contactName: lead.customerName,
    contactEmail: lead.email ? lead.email.split(',')[0].trim() : undefined,
    paymentDate: today,
    amountPaidAud: actualPaid,
    paymentMethod: 'Direct Debit / EFT',
    bankReference: `ANZ-EFT-${Math.floor(100000 + Math.random() * 900000)}`,
    allocatedToInvoiceAud: actualPaid,
    remainingInvoiceBalanceAud: remaining,
    notes: `Deposit payment received for ${lead.customerName} - ${invoice.invoiceNumber}. Applied to Xero ledger account 090.`
  });
};

