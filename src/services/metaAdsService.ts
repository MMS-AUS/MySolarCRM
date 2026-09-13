import { MetaAdsIntegrationSettings, MetaLeadFormConfig, MetaIngestedLead } from '../types';

const STORAGE_KEY_META_SETTINGS = 'solar_crm_meta_ads_settings';
const STORAGE_KEY_META_FORMS = 'solar_crm_meta_forms';
const STORAGE_KEY_META_LEADS = 'solar_crm_meta_leads';

export const DEFAULT_META_SETTINGS: MetaAdsIntegrationSettings = {
  appId: '839201948572019',
  appSecret: 'sec_meta_fb94827103ba8491c0e',
  businessManagerId: 'bm_291048571920',
  pageId: '109823749281726',
  pageName: 'SolarFlow Clean Energy Australia',
  pageAccessToken: 'EAAGm0PX4ZBZB4BA...meta_graph_page_long_lived_token_883',
  webhookCallbackUrl: 'https://crm.solarinstallers.com.au/api/webhooks/meta-leads',
  webhookVerifyToken: 'solarflow_meta_webhook_verify_2026',
  status: 'connected',
  autoAssignLeads: true,
  assignmentMethod: 'state_based',
  defaultAssignedRep: 'Sarah Jenkins',
  enableMessengerChatSync: true,
  enableInstantWelcomeSms: true,
  instantWelcomeMessage: 'Hi {{name}}, thanks for requesting your NSW/QLD Solar & Battery rebate assessment! Our specialist {{rep}} will call you shortly to confirm your roof layout.',
  syncIntervalMinutes: 5,
  lastSyncTime: 'Real-time (Active)',
  totalLeadsIngested: 142
};

export const DEFAULT_META_FORMS: MetaLeadFormConfig[] = [
  {
    id: 'form-1',
    formId: 'fb_form_849201948',
    formName: 'NSW $14,000 Battery Rebate 2026 - Instant Quote',
    campaignName: 'Meta Ads - NSW Metro Solar & Storage',
    status: 'ACTIVE',
    leadsCount: 84,
    createdDate: '2026-08-10',
    fieldMappings: [
      { formField: 'full_name', crmField: 'fullName' },
      { formField: 'phone_number', crmField: 'phone' },
      { formField: 'email', crmField: 'email' },
      { formField: 'post_code', crmField: 'postcode' },
      { formField: 'quarterly_power_bill', crmField: 'quarterlyBillAud' },
      { formField: 'home_ownership', crmField: 'homeOwnership' },
      { formField: 'roof_type', crmField: 'roofType' }
    ]
  },
  {
    id: 'form-2',
    formId: 'fb_form_392018471',
    formName: 'QLD SunSaver Battery Boost Package - Free Feasibility',
    campaignName: 'Meta Ads - QLD Brisbane & Gold Coast',
    status: 'ACTIVE',
    leadsCount: 46,
    createdDate: '2026-08-15',
    fieldMappings: [
      { formField: 'full_name', crmField: 'fullName' },
      { formField: 'phone_number', crmField: 'phone' },
      { formField: 'email', crmField: 'email' },
      { formField: 'suburb', crmField: 'suburb' },
      { formField: 'average_electricity_bill', crmField: 'quarterlyBillAud' },
      { formField: 'interested_in_battery', crmField: 'batteryInterest' }
    ]
  },
  {
    id: 'form-3',
    formId: 'fb_form_109283741',
    formName: 'Commercial Solar 30kW - 100kW Tax Depreciation Form',
    campaignName: 'Meta Ads - NSW Commercial B2B',
    status: 'PAUSED',
    leadsCount: 12,
    createdDate: '2026-07-22',
    fieldMappings: [
      { formField: 'business_name', crmField: 'companyName' },
      { formField: 'contact_person', crmField: 'fullName' },
      { formField: 'work_phone', crmField: 'phone' },
      { formField: 'work_email', crmField: 'email' },
      { formField: 'monthly_power_spend', crmField: 'monthlySpendAud' }
    ]
  }
];

export const DEFAULT_META_LEADS: MetaIngestedLead[] = [
  {
    id: 'meta-lead-1',
    leadgenId: 'lead_94810294819',
    formName: 'NSW $14,000 Battery Rebate 2026 - Instant Quote',
    campaignName: 'Meta Ads - NSW Metro Solar & Storage',
    customerName: 'Marcus Aurelius Vance',
    phone: '+61 412 884 910',
    email: 'marcus.vance@bondi-residence.com.au',
    suburb: 'Bondi Beach',
    state: 'NSW',
    quarterlyBillAud: 780,
    roofType: 'Tile (Single Storey)',
    homeOwnership: 'Own',
    batteryInterest: true,
    receivedAt: '2026-09-06T06:45:00Z',
    status: 'Contacted',
    assignedTo: 'Sarah Jenkins'
  },
  {
    id: 'meta-lead-2',
    leadgenId: 'lead_84920194820',
    formName: 'QLD SunSaver Battery Boost Package - Free Feasibility',
    campaignName: 'Meta Ads - QLD Brisbane & Gold Coast',
    customerName: 'Claire Abernathy',
    phone: '+61 421 902 441',
    email: 'c.abernathy@brisbanegardens.com.au',
    suburb: 'Paddington',
    state: 'QLD',
    quarterlyBillAud: 920,
    roofType: 'Colorbond Metal (Two Storey)',
    homeOwnership: 'Own',
    batteryInterest: true,
    receivedAt: '2026-09-05T19:30:00Z',
    status: 'Assigned',
    assignedTo: 'Tom Harris'
  },
  {
    id: 'meta-lead-3',
    leadgenId: 'lead_73910482019',
    formName: 'NSW $14,000 Battery Rebate 2026 - Instant Quote',
    campaignName: 'Meta Ads - NSW Metro Solar & Storage',
    customerName: 'Liam O\'Connor',
    phone: '+61 403 881 294',
    email: 'liam.oconnor@cronullabeach.com.au',
    suburb: 'Cronulla',
    state: 'NSW',
    quarterlyBillAud: 650,
    roofType: 'Concrete Tile',
    homeOwnership: 'Mortgage',
    batteryInterest: false,
    receivedAt: '2026-09-05T14:15:00Z',
    status: 'Imported',
    assignedTo: 'Sarah Jenkins'
  }
];

export function getMetaAdsSettings(): MetaAdsIntegrationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_META_SETTINGS);
    if (raw) return { ...DEFAULT_META_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading Meta Ads settings:', e);
  }
  return DEFAULT_META_SETTINGS;
}

export function saveMetaAdsSettings(settings: MetaAdsIntegrationSettings): MetaAdsIntegrationSettings {
  try {
    const updated = { ...settings, lastSyncTime: new Date().toLocaleTimeString() };
    localStorage.setItem(STORAGE_KEY_META_SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving Meta Ads settings:', e);
    return settings;
  }
}

export function getMetaLeadForms(): MetaLeadFormConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_META_FORMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading Meta lead forms:', e);
  }
  return DEFAULT_META_FORMS;
}

export function saveMetaLeadForms(forms: MetaLeadFormConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_META_FORMS, JSON.stringify(forms));
  } catch (e) {
    console.error('Error saving Meta lead forms:', e);
  }
}

export function getMetaIngestedLeads(): MetaIngestedLead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_META_LEADS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading Meta leads:', e);
  }
  return DEFAULT_META_LEADS;
}

export function saveMetaIngestedLeads(leads: MetaIngestedLead[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_META_LEADS, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving Meta leads:', e);
  }
}

export interface MetaPingResult {
  success: boolean;
  message: string;
  pageStatus: string;
  subscribedApps: string[];
  activeCampaignsCount: number;
  latencyMs: number;
}

export async function pingMetaGraphApi(): Promise<MetaPingResult> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    message: 'Meta Graph API v20.0 Webhook verified. Leadgen subscription: ACTIVE.',
    pageStatus: 'SolarFlow Clean Energy Australia (Page ID: 109823749281726)',
    subscribedApps: ['leadgen', 'messages', 'messaging_postbacks'],
    activeCampaignsCount: 3,
    latencyMs: 92
  };
}

export async function simulateMetaLeadSubmission(
  sample?: Partial<MetaIngestedLead>
): Promise<{ success: boolean; lead: MetaIngestedLead; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 750));

  const names = ['Jessica Hawthorne', 'Timothy Fletcher', 'Samantha Sterling', 'Damian Zhao'];
  const suburbs = ['Manly', 'Chatswood', 'Southport', 'Surry Hills'];
  const states: ('NSW' | 'QLD')[] = ['NSW', 'QLD'];
  const bills = [680, 840, 950, 1120];

  const randomName = sample?.customerName || names[Math.floor(Math.random() * names.length)];
  const randomState = sample?.state || states[Math.floor(Math.random() * states.length)];
  const randomSuburb = sample?.suburb || suburbs[Math.floor(Math.random() * suburbs.length)];
  const randomBill = sample?.quarterlyBillAud || bills[Math.floor(Math.random() * bills.length)];

  const assignedRep = randomState === 'NSW' ? 'Sarah Jenkins' : 'Tom Harris';

  const newLead: MetaIngestedLead = {
    id: `meta-sim-${Date.now()}`,
    leadgenId: `lead_sim_${Math.random().toString(36).substring(2, 9)}`,
    formName: randomState === 'NSW' ? 'NSW $14,000 Battery Rebate 2026 - Instant Quote' : 'QLD SunSaver Battery Boost Package',
    campaignName: randomState === 'NSW' ? 'Meta Ads - NSW Metro Solar & Storage' : 'Meta Ads - QLD Brisbane & Gold Coast',
    customerName: randomName,
    phone: sample?.phone || `+61 4${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: sample?.email || `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
    suburb: randomSuburb,
    state: randomState,
    quarterlyBillAud: randomBill,
    roofType: 'Tile (Single Storey)',
    homeOwnership: 'Own',
    batteryInterest: true,
    receivedAt: new Date().toISOString(),
    status: 'Imported',
    assignedTo: assignedRep
  };

  const existing = getMetaIngestedLeads();
  const updated = [newLead, ...existing];
  saveMetaIngestedLeads(updated);

  const settings = getMetaAdsSettings();
  saveMetaAdsSettings({ ...settings, totalLeadsIngested: settings.totalLeadsIngested + 1 });

  return {
    success: true,
    lead: newLead,
    message: `Meta Webhook received instant leadgen for "${randomName}" (${randomState}). Assigned to ${assignedRep}.`
  };
}

// Aliases and helper functions for modal compatibility
export const getMetaSettings = getMetaAdsSettings;
export const saveMetaSettings = saveMetaAdsSettings;
export const getMetaForms = getMetaLeadForms;
export const saveMetaForms = saveMetaLeadForms;
export const getMetaLeads = getMetaIngestedLeads;
export const saveMetaLeads = saveMetaIngestedLeads;

export async function pingMetaWebhook(): Promise<{ success: boolean; message: string; latencyMs: number }> {
  const res = await pingMetaGraphApi();
  return {
    success: res.success,
    message: res.message,
    latencyMs: res.latencyMs
  };
}

export async function triggerManualMetaLeadSync(): Promise<{ success: boolean; newLeadsIngested: number; message: string }> {
  const sim = await simulateMetaLeadSubmission();
  return {
    success: sim.success,
    newLeadsIngested: 1,
    message: sim.message
  };
}
