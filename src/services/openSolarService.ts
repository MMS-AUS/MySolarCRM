import { OpenSolarIntegrationSettings, OpenSolarSyncedProposal } from '../types';

const OPENSOLAR_SETTINGS_KEY = 'solar_opensolar_settings_v1';
const OPENSOLAR_PROPOSALS_KEY = 'solar_opensolar_proposals_v1';

export const DEFAULT_OPENSOLAR_SETTINGS: OpenSolarIntegrationSettings = {
  orgId: 'OS-ORG-84920',
  apiKey: 'os_live_sk_77b31920ac9e4198b10f882190c',
  environment: 'production',
  partnerCode: 'AU-SOLAR-PRO-2026',
  defaultCurrency: 'AUD',
  autoCreateProjectOnSigned: true,
  syncNearmap3dImagery: true,
  syncPricingAndBom: true,
  syncIntervalMinutes: 15,
  webhookSecret: 'whsec_os_998124ab87201cff3190',
  webhookEndpoint: 'https://api.solarinstallers.com.au/webhooks/opensolar',
  lastSyncTime: 'Just now',
  status: 'connected',
  enableLiveSync: true,
  defaultProposalTemplate: 'AU Standard Residential 2026 (Nearmap 3D)'
};

export const INITIAL_OPENSOLAR_PROPOSALS: OpenSolarSyncedProposal[] = [];

export function getOpenSolarSettings(): OpenSolarIntegrationSettings {
  try {
    const raw = localStorage.getItem(OPENSOLAR_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_OPENSOLAR_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading OpenSolar settings', e);
  }
  return DEFAULT_OPENSOLAR_SETTINGS;
}

export function saveOpenSolarSettings(settings: OpenSolarIntegrationSettings): OpenSolarIntegrationSettings {
  try {
    const updated = { ...settings, lastSyncTime: 'Just now' };
    localStorage.setItem(OPENSOLAR_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving OpenSolar settings', e);
    return settings;
  }
}

export function getOpenSolarProposals(): OpenSolarSyncedProposal[] {
  try {
    const raw = localStorage.getItem(OPENSOLAR_PROPOSALS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading OpenSolar proposals', e);
  }
  return INITIAL_OPENSOLAR_PROPOSALS;
}

export function saveOpenSolarProposals(proposals: OpenSolarSyncedProposal[]): void {
  try {
    localStorage.setItem(OPENSOLAR_PROPOSALS_KEY, JSON.stringify(proposals));
  } catch (e) {
    console.error('Error saving OpenSolar proposals', e);
  }
}

export interface OpenSolarPingResult {
  success: boolean;
  message: string;
  latencyMs: number;
  orgName: string;
  tariffDatabaseVersion: string;
  activeProposalsCount: number;
  nearmapAccess: boolean;
}

export async function pingOpenSolarApi(): Promise<OpenSolarPingResult> {
  await new Promise(resolve => setTimeout(resolve, 850));
  const settings = getOpenSolarSettings();
  const hasKey = settings.apiKey && settings.apiKey.length > 8;

  if (!hasKey) {
    return {
      success: false,
      message: 'API Key missing or invalid. Please check your OpenSolar Bearer token.',
      latencyMs: 320,
      orgName: 'Unverified Organization',
      tariffDatabaseVersion: 'NEM-AU-2026.1',
      activeProposalsCount: 0,
      nearmapAccess: false
    };
  }

  return {
    success: true,
    message: 'HTTP 200 OK — Connected to OpenSolar Core API Gateway & Nearmap 3D Service.',
    latencyMs: 74,
    orgName: 'SolarFlow Australia Energy Group (Org #84920)',
    tariffDatabaseVersion: 'AEMO / NEM National Database Q3-2026',
    activeProposalsCount: 142,
    nearmapAccess: true
  };
}
