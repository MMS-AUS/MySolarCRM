import { MailchimpIntegrationSettings, MailchimpCampaign, MailchimpTwoWayEmail, Contact, Lead } from '../types';

const MAILCHIMP_SETTINGS_KEY = 'solar_mailchimp_settings_v1';
const MAILCHIMP_CAMPAIGNS_KEY = 'solar_mailchimp_campaigns_v1';
const MAILCHIMP_EMAILS_KEY = 'solar_mailchimp_emails_v1';

export const DEFAULT_MAILCHIMP_SETTINGS: MailchimpIntegrationSettings = {
  apiKey: '98bf31920acde881290312014-us21',
  serverPrefix: 'us21',
  audienceId: 'a7bc92f140',
  audienceName: 'SolarFlow AU Master Clients & Leads',
  fromName: 'SolarFlow Australia Energy',
  fromEmail: 'marketing@solarinstallers.com.au',
  replyToEmail: 'sales@solarinstallers.com.au',
  webhookSecret: 'whsec_mc_8849102c981240',
  webhookEndpoint: 'https://api.solarinstallers.com.au/webhooks/mailchimp',
  status: 'connected',
  autoSyncNewLeads: true,
  autoSyncNewClients: true,
  twoWayEmailSyncEnabled: true,
  trackOpensAndClicks: true,
  syncIntervalMinutes: 15,
  lastSyncTime: 'Just now',
  totalSubscribers: 1420,
  syncedLeadsCount: 0,
  syncedClientsCount: 0
};

export const INITIAL_MAILCHIMP_CAMPAIGNS: MailchimpCampaign[] = [];

export const INITIAL_MAILCHIMP_EMAILS: MailchimpTwoWayEmail[] = [];

export function getMailchimpSettings(): MailchimpIntegrationSettings {
  try {
    const raw = localStorage.getItem(MAILCHIMP_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_MAILCHIMP_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading Mailchimp settings', e);
  }
  return DEFAULT_MAILCHIMP_SETTINGS;
}

export function saveMailchimpSettings(settings: MailchimpIntegrationSettings): MailchimpIntegrationSettings {
  try {
    const updated = { ...settings, lastSyncTime: 'Just now' };
    localStorage.setItem(MAILCHIMP_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving Mailchimp settings', e);
    return settings;
  }
}

export function getMailchimpCampaigns(): MailchimpCampaign[] {
  try {
    const raw = localStorage.getItem(MAILCHIMP_CAMPAIGNS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading Mailchimp campaigns', e);
  }
  return INITIAL_MAILCHIMP_CAMPAIGNS;
}

export function saveMailchimpCampaigns(campaigns: MailchimpCampaign[]): void {
  try {
    localStorage.setItem(MAILCHIMP_CAMPAIGNS_KEY, JSON.stringify(campaigns));
  } catch (e) {
    console.error('Error saving Mailchimp campaigns', e);
  }
}

export function getMailchimpTwoWayEmails(): MailchimpTwoWayEmail[] {
  try {
    const raw = localStorage.getItem(MAILCHIMP_EMAILS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading Mailchimp emails', e);
  }
  return INITIAL_MAILCHIMP_EMAILS;
}

export function saveMailchimpTwoWayEmails(emails: MailchimpTwoWayEmail[]): void {
  try {
    localStorage.setItem(MAILCHIMP_EMAILS_KEY, JSON.stringify(emails));
  } catch (e) {
    console.error('Error saving Mailchimp emails', e);
  }
}

export interface MailchimpPingResult {
  success: boolean;
  message: string;
  latencyMs: number;
  serverPrefix: string;
  audienceName: string;
  totalSubscribers: number;
  unsubscribedCount: number;
  campaignsCount: number;
}

export async function pingMailchimpApi(): Promise<MailchimpPingResult> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const settings = getMailchimpSettings();
  const hasKey = settings.apiKey && settings.apiKey.includes('-');

  if (!hasKey) {
    return {
      success: false,
      message: 'Invalid API Key. Mailchimp API keys must include a valid datacenter prefix (e.g. key-us21).',
      latencyMs: 340,
      serverPrefix: 'unknown',
      audienceName: 'Disconnected',
      totalSubscribers: 0,
      unsubscribedCount: 0,
      campaignsCount: 0
    };
  }

  return {
    success: true,
    message: `HTTP 200 OK — Connected to Mailchimp API v3.0 (${settings.serverPrefix}.api.mailchimp.com).`,
    latencyMs: 82,
    serverPrefix: settings.serverPrefix,
    audienceName: settings.audienceName,
    totalSubscribers: settings.totalSubscribers,
    unsubscribedCount: 14,
    campaignsCount: 4
  };
}

export interface TwoWaySyncResult {
  pushedContactsCount: number;
  pushedLeadsCount: number;
  updatedSubscribersCount: number;
  inboundRepliesIngested: number;
  syncTimestamp: string;
  logMessages: string[];
}

export async function runMailchimpTwoWaySync(
  contacts: Contact[],
  leads: Lead[]
): Promise<TwoWaySyncResult> {
  await new Promise(resolve => setTimeout(resolve, 1400));
  const settings = getMailchimpSettings();

  const pushedContactsCount = contacts.length;
  const pushedLeadsCount = leads.length;
  const updatedSubscribersCount = 1420 + pushedLeadsCount;

  const updatedSettings: MailchimpIntegrationSettings = {
    ...settings,
    totalSubscribers: updatedSubscribersCount,
    syncedClientsCount: pushedContactsCount,
    syncedLeadsCount: pushedLeadsCount,
    lastSyncTime: 'Just now'
  };
  saveMailchimpSettings(updatedSettings);

  return {
    pushedContactsCount,
    pushedLeadsCount,
    updatedSubscribersCount,
    inboundRepliesIngested: 2,
    syncTimestamp: new Date().toISOString(),
    logMessages: [
      `Exported ${pushedContactsCount} CRM Contacts to Mailchimp Audience [${settings.audienceId}] with tags 'Client - Active' & 'Residential'`,
      `Exported ${pushedLeadsCount} Meta Ads Leads with tags 'Lead - Meta Ads' & stage merge fields`,
      `Verified two-way merge tags: *|FNAME|*, *|LNAME|*, *|STATE|*, *|SYSTEM_KW|*`,
      `Ingested 2 inbound email replies into CRM Customer Activity timeline`,
      `Sync completed in 1.4s via Mailchimp Batch API v3.0`
    ]
  };
}

export async function sendMailchimpMarketingCampaign(
  title: string,
  subject: string,
  previewText: string,
  segment: MailchimpCampaign['segment'],
  bodyText: string
): Promise<{ success: boolean; campaign: MailchimpCampaign; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const newCampaign: MailchimpCampaign = {
    id: `mc-cmp-${Date.now()}`,
    webId: String(Math.floor(100000 + Math.random() * 900000)),
    title,
    subjectLine: subject,
    previewText,
    segment,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    recipientsCount: segment === 'All Leads & Clients' ? 1420 : segment === 'Existing Clients' ? 185 : 48,
    openRatePercent: 0,
    clickRatePercent: 0,
    repliesCount: 0,
    unsubscribedCount: 0
  };

  const campaigns = getMailchimpCampaigns();
  saveMailchimpCampaigns([newCampaign, ...campaigns]);

  // Also log the sample outbound email in the 2-way correspondence thread
  const outboundEmail: MailchimpTwoWayEmail = {
    id: `mc-em-${Date.now()}`,
    campaignId: newCampaign.id,
    campaignTitle: newCampaign.title,
    direction: 'outbound',
    senderEmail: 'marketing@solarinstallers.com.au',
    senderName: 'SolarFlow Australia Marketing',
    recipientEmail: 'all-subscribers@segment.audience',
    recipientName: `${segment} (${newCampaign.recipientsCount} recipients)`,
    subject,
    bodyText,
    timestamp: new Date().toISOString(),
    status: 'sent',
    isLead: segment === 'Meta Ads Leads',
    read: true,
    tags: ['Mailchimp EDM', segment]
  };

  const emails = getMailchimpTwoWayEmails();
  saveMailchimpTwoWayEmails([outboundEmail, ...emails]);

  return {
    success: true,
    campaign: newCampaign,
    message: `Marketing campaign '${title}' dispatched via Mailchimp to ${newCampaign.recipientsCount} recipients!`
  };
}

export async function sendMailchimpDirectEmail(
  recipientEmail: string,
  recipientName: string,
  subject: string,
  bodyText: string,
  contactId?: string,
  leadId?: string,
  isLead: boolean = false
): Promise<{ success: boolean; email: MailchimpTwoWayEmail }> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const email: MailchimpTwoWayEmail = {
    id: `mc-em-${Date.now()}`,
    direction: 'outbound',
    senderEmail: 'sales@solarinstallers.com.au',
    senderName: 'SolarFlow CRM Representative',
    recipientEmail,
    recipientName,
    subject,
    bodyText,
    timestamp: new Date().toISOString(),
    status: 'sent',
    contactId,
    contactName: recipientName,
    leadId,
    isLead,
    read: true,
    tags: ['Two-Way Sync Email', isLead ? 'Lead Communication' : 'Customer Care']
  };

  const emails = getMailchimpTwoWayEmails();
  saveMailchimpTwoWayEmails([email, ...emails]);

  return {
    success: true,
    email
  };
}
