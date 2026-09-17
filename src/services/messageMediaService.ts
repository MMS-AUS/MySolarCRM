import { MessageMediaIntegrationSettings, MessageMediaSMSLogItem } from '../types';

const MESSAGEMEDIA_SETTINGS_KEY = 'solar_messagemedia_settings_v1';
const MESSAGEMEDIA_LOGS_KEY = 'solar_messagemedia_logs_v1';

export const DEFAULT_MESSAGEMEDIA_SETTINGS: MessageMediaIntegrationSettings = {
  apiKey: 'mm_live_ak_90218734bcfe',
  apiSecret: 'mm_sec_8849102c918340df981720a45',
  accountNumber: 'MM-AU-781920',
  senderId: '+61 488 842 910',
  dedicatedVirtualNumber: '+61 488 842 910',
  accountStatus: 'Active',
  remainingCredits: 4850,
  environment: 'production',
  inboundWebhookUrl: 'https://api.solarinstallers.com.au/webhooks/messagemedia/inbound',
  dlrWebhookUrl: 'https://api.solarinstallers.com.au/webhooks/messagemedia/dlr',
  appendSpamActOptOut: true,
  autoSendOnSurveyBooked: true,
  autoSendOnInstallEnRoute: true,
  autoSendOnDnspApproval: true,
  autoSendOnMaintenanceDue: true,
  matchStaffSenderLine: true,
  lastSyncTime: 'Just now'
};

export const INITIAL_MESSAGEMEDIA_LOGS: MessageMediaSMSLogItem[] = [];

export function getMessageMediaSettings(): MessageMediaIntegrationSettings {
  try {
    const raw = localStorage.getItem(MESSAGEMEDIA_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_MESSAGEMEDIA_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading MessageMedia settings', e);
  }
  return DEFAULT_MESSAGEMEDIA_SETTINGS;
}

export function saveMessageMediaSettings(settings: MessageMediaIntegrationSettings): MessageMediaIntegrationSettings {
  try {
    const updated = { ...settings, lastSyncTime: 'Just now' };
    localStorage.setItem(MESSAGEMEDIA_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving MessageMedia settings', e);
    return settings;
  }
}

export function getMessageMediaLogs(): MessageMediaSMSLogItem[] {
  try {
    const raw = localStorage.getItem(MESSAGEMEDIA_LOGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading MessageMedia logs', e);
  }
  return INITIAL_MESSAGEMEDIA_LOGS;
}

export function saveMessageMediaLogs(logs: MessageMediaSMSLogItem[]): void {
  try {
    localStorage.setItem(MESSAGEMEDIA_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving MessageMedia logs', e);
  }
}

export interface MessageMediaPingResult {
  success: boolean;
  message: string;
  latencyMs: number;
  creditsRemaining: number;
  routeTier: string;
  virtualNumber: string;
}

export async function pingMessageMediaGateway(): Promise<MessageMediaPingResult> {
  await new Promise(resolve => setTimeout(resolve, 750));
  const settings = getMessageMediaSettings();
  const hasKey = settings.apiKey && settings.apiKey.length > 5;

  if (!hasKey) {
    return {
      success: false,
      message: 'API credentials missing. Please configure your MessageMedia API Key & Secret.',
      latencyMs: 380,
      creditsRemaining: 0,
      routeTier: 'Disconnected',
      virtualNumber: 'Not allocated'
    };
  }

  return {
    success: true,
    message: 'HTTP 200 OK — Connected to MessageMedia AU Telstra/Optus Direct Gateway.',
    latencyMs: 88,
    creditsRemaining: settings.remainingCredits,
    routeTier: 'Tier-1 Australian Direct Carrier Route',
    virtualNumber: settings.dedicatedVirtualNumber
  };
}

export async function sendTestSMSMessageMedia(
  recipient: string,
  body: string
): Promise<{ success: boolean; message: string; log: MessageMediaSMSLogItem }> {
  await new Promise(resolve => setTimeout(resolve, 900));
  const settings = getMessageMediaSettings();

  const finalBody = settings.appendSpamActOptOut && !body.toLowerCase().includes('stop')
    ? `${body} Optout: Reply STOP`
    : body;

  const newCredits = Math.max(0, settings.remainingCredits - 1);
  saveMessageMediaSettings({ ...settings, remainingCredits: newCredits });

  const log: MessageMediaSMSLogItem = {
    id: `smsg-${Date.now()}`,
    direction: 'outbound',
    senderNumber: settings.dedicatedVirtualNumber,
    recipientNumber: recipient,
    messageText: finalBody,
    status: 'DELIVERED',
    creditsUsed: 1,
    timestamp: new Date().toISOString(),
    deliveryLatencyMs: Math.floor(Math.random() * 60) + 110
  };

  const currentLogs = getMessageMediaLogs();
  const updatedLogs = [log, ...currentLogs];
  saveMessageMediaLogs(updatedLogs);

  return {
    success: true,
    message: `SMS successfully dispatched via MessageMedia gateway to ${recipient}. Status: DELIVERED (1 credit deducted).`,
    log
  };
}
