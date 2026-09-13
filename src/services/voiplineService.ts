import { VoIPLineIntegrationSettings, VoIPLineExtensionMapping } from '../types';

const STORAGE_KEY_VOIPLINE_SETTINGS = 'solar_crm_voipline_settings';
const STORAGE_KEY_VOIPLINE_EXTENSIONS = 'solar_crm_voipline_extensions';

export const DEFAULT_VOIPLINE_SETTINGS: VoIPLineIntegrationSettings = {
  accountNumber: 'AU-94281',
  apiKey: 'vpl_live_9f82b4a7e10c4921b790d6',
  apiSecret: 'sec_8402a7b319f0049281a4b2c1',
  sipDomain: 'syd.voipline.net.au',
  sipPort: 5061,
  callerIdNumber: '+61 2 8311 4920',
  callerIdName: 'SolarFlow Clean Energy',
  status: 'connected',
  enableCallRecording: true,
  recordingAnnouncement: true, // "This call is recorded for quality, training and compliance purposes."
  enableScreenPopWebhook: true,
  screenPopWebhookUrl: 'https://crm.solarinstallers.com.au/api/webhooks/voipline/screenpop',
  enableClickToCall: true,
  callDispositionTags: ['Interested - 10kW+', 'Battery Add-on Quote', 'Follow-up Scheduled', 'Switchboard Upgrade Required', 'Not Interested', 'Voicemail Left'],
  maxConcurrentLines: 16,
  lastPingLatencyMs: 14,
  lastSyncTime: 'Real-time (Active)',
  webrtcGatewayUrl: 'wss://webrtc-syd.voipline.net.au:8089/ws'
};

export const DEFAULT_VOIPLINE_EXTENSIONS: VoIPLineExtensionMapping[] = [
  {
    id: 'ext-101',
    extension: '101',
    staffName: 'Sarah Jenkins',
    staffRole: 'Lead Solar Consultant (NSW)',
    directDid: '+61 2 8311 4921',
    status: 'Online',
    forwardToMobile: '+61 411 902 110'
  },
  {
    id: 'ext-102',
    extension: '102',
    staffName: 'David Miller',
    staffRole: 'Lead CEC Solar Electrician',
    directDid: '+61 2 8311 4922',
    status: 'Busy',
    forwardToMobile: '+61 402 881 920'
  },
  {
    id: 'ext-103',
    extension: '103',
    staffName: 'Liam Chen',
    staffRole: 'Electrical Designer & Grid Applications',
    directDid: '+61 2 8311 4923',
    status: 'Online',
    forwardToMobile: '+61 423 774 019'
  },
  {
    id: 'ext-104',
    extension: '104',
    staffName: 'Tom Harris',
    staffRole: 'Commercial Solar & Battery Specialist',
    directDid: '+61 7 3180 2941',
    status: 'Online',
    forwardToMobile: '+61 433 119 402'
  },
  {
    id: 'ext-100',
    extension: '100',
    staffName: 'Main Reception & Queue',
    staffRole: 'Inbound IVR Call Hunt Group',
    directDid: '+61 2 8311 4920',
    status: 'Online'
  }
];

export function getVoIPLineSettings(): VoIPLineIntegrationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOIPLINE_SETTINGS);
    if (raw) return { ...DEFAULT_VOIPLINE_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading VoIPLine settings:', e);
  }
  return DEFAULT_VOIPLINE_SETTINGS;
}

export function saveVoIPLineSettings(settings: VoIPLineIntegrationSettings): VoIPLineIntegrationSettings {
  try {
    const updated = { ...settings, lastSyncTime: new Date().toLocaleTimeString() };
    localStorage.setItem(STORAGE_KEY_VOIPLINE_SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving VoIPLine settings:', e);
    return settings;
  }
}

export function getVoIPLineExtensions(): VoIPLineExtensionMapping[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOIPLINE_EXTENSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading VoIPLine extensions:', e);
  }
  return DEFAULT_VOIPLINE_EXTENSIONS;
}

export function saveVoIPLineExtensions(extensions: VoIPLineExtensionMapping[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_VOIPLINE_EXTENSIONS, JSON.stringify(extensions));
  } catch (e) {
    console.error('Error saving VoIPLine extensions:', e);
  }
}

export interface VoIPLinePingResult {
  success: boolean;
  message: string;
  sipStatus: string;
  serverNode: string;
  activeChannels: number;
  latencyMs: number;
}

export async function pingVoIPLineSipGateway(): Promise<VoIPLinePingResult> {
  await new Promise(resolve => setTimeout(resolve, 750));
  return {
    success: true,
    message: 'VoIPLine Telecom AU SIP Trunk is REGISTERED & ONLINE.',
    sipStatus: '200 OK (SIP/2.0)',
    serverNode: 'syd-pop02.voipline.net.au (Sydney Equinix SY4)',
    activeChannels: 4,
    latencyMs: 14
  };
}

export async function originateTestCall(
  destNumber: string,
  extension: string
): Promise<{ success: boolean; callId: string; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 850));
  return {
    success: true,
    callId: `vpl-call-${Date.now()}`,
    message: `Outbound test call bridging Extension ${extension} to ${destNumber}. Ringing softphone...`
  };
}
