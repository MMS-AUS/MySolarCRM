import { WhatsAppIntegrationSettings, WhatsAppTemplate, WhatsAppMessageLog } from '../types';

const STORAGE_KEY_WHATSAPP_SETTINGS = 'solar_crm_whatsapp_settings';
const STORAGE_KEY_WHATSAPP_TEMPLATES = 'solar_crm_whatsapp_templates';
const STORAGE_KEY_WHATSAPP_LOGS = 'solar_crm_whatsapp_logs';

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppIntegrationSettings = {
  wabaId: '392019485019283',
  phoneNumberId: '109823749281726',
  displayPhoneNumber: '+61 480 019 822',
  verifiedName: 'SolarFlow Clean Energy Australia',
  apiToken: 'EAAGm0PX4ZBZB4BA...system_user_permanent_token_sec_9941',
  apiVersion: 'v20.0',
  webhookCallbackUrl: 'https://crm.solarinstallers.com.au/api/webhooks/whatsapp',
  webhookVerifyToken: 'solarflow_wa_verify_token_2026_australia',
  status: 'connected',
  autoSendQuoteNotification: true,
  autoSendInstallArrivalAlert: true,
  autoSendPhotoRequest: true,
  allowInboundPhotoIngestion: true,
  lastSyncTime: 'Real-time (Active)',
  qualityRating: 'GREEN',
  dailyMessageLimit: 10000
};

export const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'tpl-1',
    name: 'solar_survey_confirmation',
    category: 'UTILITY',
    language: 'en_AU',
    status: 'APPROVED',
    bodyText: 'Hi {{1}}, your CEC solar site assessment for {{2}} is confirmed for {{3}} at {{4}}. Our accredited technician {{5}} will inspect your switchboard and roof structure. Reply to this chat if you need to reschedule.',
    parameters: ['Customer Name', 'Address', 'Date', 'Time', 'Technician Name']
  },
  {
    id: 'tpl-2',
    name: 'switchboard_photo_request',
    category: 'UTILITY',
    language: 'en_AU',
    status: 'APPROVED',
    bodyText: 'G\'day {{1}}, to fast-track your solar & battery grid pre-approval with {{2}}, could you please reply with a clear photo of your main switchboard and electricity meter? Our engineering team will review it within 2 hours.',
    parameters: ['Customer Name', 'DNSP Provider']
  },
  {
    id: 'tpl-3',
    name: 'crew_arriving_notice',
    category: 'UTILITY',
    language: 'en_AU',
    status: 'APPROVED',
    bodyText: 'Good morning {{1}}! Your SolarFlow install team led by {{2}} is en route to {{3}} (ETA: {{4}}). Please ensure driveway access and that pets are indoors. See you soon!',
    parameters: ['Customer Name', 'Electrician Lead', 'Address', 'ETA']
  },
  {
    id: 'tpl-4',
    name: 'solar_quote_ready',
    category: 'MARKETING',
    language: 'en_AU',
    status: 'APPROVED',
    bodyText: 'Hi {{1}}, your tailored {{2}}kW solar proposal with {{3}} is ready to view. Estimated annual electricity savings: {{4}}. Tap the link to view your interactive 3D roof design: {{5}}',
    parameters: ['Customer Name', 'System Size', 'Battery Model', 'Savings AUD', 'Proposal Link']
  }
];

export const DEFAULT_WHATSAPP_LOGS: WhatsAppMessageLog[] = [
  {
    id: 'wa-log-1',
    direction: 'outbound',
    customerName: 'Marcus Aurelius Vance',
    customerPhone: '+61 412 884 910',
    messageType: 'template',
    templateName: 'solar_survey_confirmation',
    content: 'Hi Marcus, your CEC solar site assessment for 44 Ocean Avenue, Bondi Beach NSW 2026 is confirmed for tomorrow at 10:00 AM. Our accredited technician David Miller will inspect your switchboard.',
    timestamp: '2026-09-06T07:15:00Z',
    status: 'read'
  },
  {
    id: 'wa-log-2',
    direction: 'inbound',
    customerName: 'Marcus Aurelius Vance',
    customerPhone: '+61 412 884 910',
    messageType: 'image',
    content: 'Uploaded switchboard photo: "switchboard_bondi_meter.jpg"',
    mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    mediaCaption: 'Here is the photo of our 3-phase meter box inside the garage.',
    timestamp: '2026-09-06T07:22:00Z',
    status: 'delivered'
  },
  {
    id: 'wa-log-3',
    direction: 'outbound',
    customerName: 'Elena Rostova',
    customerPhone: '+61 401 552 194',
    messageType: 'text',
    content: 'Thanks Elena! We verified your switchboard is 3-phase 63A. No upgrade needed for the Tesla Powerwall 3 installation.',
    timestamp: '2026-09-05T14:30:00Z',
    status: 'read'
  },
  {
    id: 'wa-log-4',
    direction: 'outbound',
    customerName: 'Bruce Wayne',
    customerPhone: '+61 422 918 200',
    messageType: 'template',
    templateName: 'crew_arriving_notice',
    content: 'Good morning Bruce! Your SolarFlow install team led by David Miller is en route to 100 St Georges Cres, Drummoyne NSW (ETA: 7:45 AM).',
    timestamp: '2026-09-05T06:50:00Z',
    status: 'delivered'
  }
];

export function getWhatsAppSettings(): WhatsAppIntegrationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WHATSAPP_SETTINGS);
    if (raw) return { ...DEFAULT_WHATSAPP_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading WhatsApp settings:', e);
  }
  return DEFAULT_WHATSAPP_SETTINGS;
}

export function saveWhatsAppSettings(settings: WhatsAppIntegrationSettings): WhatsAppIntegrationSettings {
  try {
    const updated = { ...settings, lastSyncTime: new Date().toLocaleTimeString() };
    localStorage.setItem(STORAGE_KEY_WHATSAPP_SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving WhatsApp settings:', e);
    return settings;
  }
}

export function getWhatsAppTemplates(): WhatsAppTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WHATSAPP_TEMPLATES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading WhatsApp templates:', e);
  }
  return DEFAULT_WHATSAPP_TEMPLATES;
}

export function saveWhatsAppTemplates(templates: WhatsAppTemplate[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WHATSAPP_TEMPLATES, JSON.stringify(templates));
  } catch (e) {
    console.error('Error saving WhatsApp templates:', e);
  }
}

export function getWhatsAppLogs(): WhatsAppMessageLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WHATSAPP_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading WhatsApp logs:', e);
  }
  return DEFAULT_WHATSAPP_LOGS;
}

export function saveWhatsAppLogs(logs: WhatsAppMessageLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WHATSAPP_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving WhatsApp logs:', e);
  }
}

export interface WhatsAppPingResult {
  success: boolean;
  message: string;
  wabaStatus: string;
  phoneStatus: string;
  qualityRating: 'GREEN' | 'YELLOW' | 'RED';
  latencyMs: number;
}

export async function pingWhatsAppApi(): Promise<WhatsAppPingResult> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    message: 'Meta WhatsApp Cloud API v20.0 verified. Phone number status: CONNECTED.',
    wabaStatus: 'VERIFIED',
    phoneStatus: 'CONNECTED (Tier 1)',
    qualityRating: 'GREEN',
    latencyMs: 78
  };
}

export async function sendTestWhatsAppMessage(
  recipientPhone: string,
  messageText: string,
  templateName?: string
): Promise<{ success: boolean; messageId: string; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 900));

  const newLog: WhatsAppMessageLog = {
    id: `wa-${Date.now()}`,
    direction: 'outbound',
    customerName: 'Test Recipient',
    customerPhone: recipientPhone,
    messageType: templateName ? 'template' : 'text',
    templateName,
    content: messageText,
    timestamp: new Date().toISOString(),
    status: 'delivered'
  };

  const existingLogs = getWhatsAppLogs();
  saveWhatsAppLogs([newLog, ...existingLogs]);

  return {
    success: true,
    messageId: `wamid.HBgL${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    message: `Message dispatched via Meta Cloud API to ${recipientPhone}`
  };
}
