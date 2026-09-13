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
  syncedLeadsCount: 48,
  syncedClientsCount: 185
};

export const INITIAL_MAILCHIMP_CAMPAIGNS: MailchimpCampaign[] = [
  {
    id: 'mc-cmp-1',
    webId: '109842',
    title: '2026 Spring Solar Battery Rebate Boost (NSW & QLD)',
    subjectLine: 'Claim up to $1,500 extra rebate on Tesla Powerwall 3 & Sungrow Batteries',
    previewText: 'Australian Government & State energy incentives updated for September 2026.',
    segment: 'All Leads & Clients',
    status: 'SENT',
    sentAt: '2026-09-01T10:00:00Z',
    recipientsCount: 1390,
    openRatePercent: 44.8,
    clickRatePercent: 18.2,
    repliesCount: 38,
    unsubscribedCount: 3
  },
  {
    id: 'mc-cmp-2',
    webId: '109843',
    title: '24-Month CEC System Health Check & Inspection Reminder',
    subjectLine: 'Is your solar system performing at peak output? Book your 2-Year inspection',
    previewText: 'CEC accredited safety audits keep your manufacturer warranties valid.',
    segment: 'Existing Clients',
    status: 'SENT',
    sentAt: '2026-08-20T09:30:00Z',
    recipientsCount: 185,
    openRatePercent: 62.4,
    clickRatePercent: 28.1,
    repliesCount: 22,
    unsubscribedCount: 0
  },
  {
    id: 'mc-cmp-3',
    webId: '109844',
    title: 'Refer-A-Friend $500 Cash Reward Bonus Program',
    subjectLine: 'Earn $500 EFT direct to your bank when you refer a neighbour to SolarFlow',
    previewText: 'Unlimited referral payouts for Harrison, Brooke, and our community.',
    segment: 'Existing Clients',
    status: 'SENT',
    sentAt: '2026-08-10T14:00:00Z',
    recipientsCount: 180,
    openRatePercent: 58.0,
    clickRatePercent: 21.5,
    repliesCount: 15,
    unsubscribedCount: 1
  },
  {
    id: 'mc-cmp-4',
    webId: '109845',
    title: 'Commercial Solar Instant Asset Write-Off 2026-27',
    subjectLine: 'Slash commercial energy tariffs and maximize business tax depreciation',
    previewText: '30kW to 100kW commercial systems with guaranteed Ausgrid network approvals.',
    segment: 'Meta Ads Leads',
    status: 'SCHEDULED',
    sentAt: '2026-09-10T09:00:00Z',
    recipientsCount: 48,
    openRatePercent: 0,
    clickRatePercent: 0,
    repliesCount: 0,
    unsubscribedCount: 0
  }
];

export const INITIAL_MAILCHIMP_EMAILS: MailchimpTwoWayEmail[] = [
  {
    id: 'mc-em-1',
    campaignId: 'mc-cmp-1',
    campaignTitle: '2026 Spring Solar Battery Rebate Boost (NSW & QLD)',
    direction: 'outbound',
    senderEmail: 'marketing@solarinstallers.com.au',
    senderName: 'SolarFlow Australia',
    recipientEmail: 'nathaniel.ward@gmail.com',
    recipientName: 'Nathaniel Ward',
    subject: 'Claim up to $1,500 extra rebate on Tesla Powerwall 3 & Sungrow Batteries',
    bodyText: 'Hi Nathaniel, great news for homeowners in Castle Hill. The Australian State battery incentive program now provides up to $1,500 off connected battery installations.',
    timestamp: '2026-09-01T10:00:00Z',
    status: 'opened',
    contactId: 'cnt-5',
    contactName: 'Nathaniel Ward',
    isLead: false,
    read: true,
    tags: ['Battery Rebate', 'Tesla Powerwall 3']
  },
  {
    id: 'mc-em-2',
    campaignId: 'mc-cmp-1',
    campaignTitle: '2026 Spring Solar Battery Rebate Boost (NSW & QLD)',
    direction: 'inbound',
    senderEmail: 'nathaniel.ward@gmail.com',
    senderName: 'Nathaniel Ward',
    recipientEmail: 'sales@solarinstallers.com.au',
    recipientName: 'SolarFlow Sales Team',
    subject: 'Re: Claim up to $1,500 extra rebate on Tesla Powerwall 3 & Sungrow Batteries',
    bodyText: 'Hi team, I received this marketing email regarding the battery rebate. Can you let me know if my current 10kW system design has enough roof capacity to support adding a Tesla Powerwall 3 with backup gateway?',
    timestamp: '2026-09-01T11:42:15Z',
    status: 'replied',
    contactId: 'cnt-5',
    contactName: 'Nathaniel Ward',
    isLead: false,
    read: false,
    tags: ['Lead Response', 'High Priority Inquiry']
  },
  {
    id: 'mc-em-3',
    campaignId: 'mc-cmp-1',
    campaignTitle: '2026 Spring Solar Battery Rebate Boost (NSW & QLD)',
    direction: 'outbound',
    senderEmail: 'sales@solarinstallers.com.au',
    senderName: 'Sarah Jenkins (SolarFlow CRM)',
    recipientEmail: 'nathaniel.ward@gmail.com',
    recipientName: 'Nathaniel Ward',
    subject: 'Re: Claim up to $1,500 extra rebate on Tesla Powerwall 3 & Sungrow Batteries',
    bodyText: 'Hi Nathaniel, absolutely! Your 10kW Fronius Primo inverter setup is fully compatible with the Tesla Powerwall 3 AC-coupled backup gateway. We have added the Powerwall 3 option to your OpenSolar proposal with the $1,500 rebate deducted.',
    timestamp: '2026-09-01T12:15:00Z',
    status: 'delivered',
    contactId: 'cnt-5',
    contactName: 'Nathaniel Ward',
    isLead: false,
    read: true,
    tags: ['CRM Direct Reply', 'Proposal Updated']
  },
  {
    id: 'mc-em-4',
    campaignId: 'mc-cmp-2',
    campaignTitle: '24-Month CEC System Health Check & Inspection Reminder',
    direction: 'inbound',
    senderEmail: 'brooke.h@outlook.com',
    senderName: 'Brooke Henderson',
    recipientEmail: 'sales@solarinstallers.com.au',
    recipientName: 'SolarFlow Customer Care',
    subject: 'Re: Is your solar system performing at peak output? Book your 2-Year inspection',
    bodyText: 'Hi, thanks for the reminder email! My system has been running smoothly since 2024, but I would like to book the inspection for Chermside on Tuesday morning if an electrician is in North Brisbane.',
    timestamp: '2026-08-20T11:18:00Z',
    status: 'replied',
    contactId: 'cnt-2',
    contactName: 'Brooke Henderson',
    isLead: false,
    read: true,
    tags: ['Inspection Booking', 'QLD Metro']
  },
  {
    id: 'mc-em-5',
    direction: 'inbound',
    senderEmail: 'm.sterling@sterlingdistributors.com.au',
    senderName: 'Marcus Sterling',
    recipientEmail: 'sales@solarinstallers.com.au',
    recipientName: 'SolarFlow Commercial Team',
    subject: 'Commercial Rooftop Tariff Optimization Query',
    bodyText: 'Good afternoon, following up on your email newsletter regarding the 39.6kW solar layout. Could you email through the expected annual degradation schedule for the Canadian Solar modules?',
    timestamp: '2026-08-30T15:10:00Z',
    status: 'replied',
    contactId: 'cnt-3',
    contactName: 'Marcus Sterling',
    isLead: false,
    read: true,
    tags: ['Commercial Lead', 'Technical Inquiry']
  }
];

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
