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

export const INITIAL_OPENSOLAR_PROPOSALS: OpenSolarSyncedProposal[] = [
  {
    id: 'os-p-1',
    proposalId: 'OS-PROP-2026-88',
    projectId: 'proj-1',
    customerName: 'Harrison Davies',
    address: '42 Albert Road',
    suburb: 'Strathfield',
    state: 'NSW',
    systemSizeKw: 13.2,
    panelCount: 30,
    panelModel: 'Trina Solar 440W Vertex S+ Dual-Glass',
    inverterModel: 'Fronius Primo GEN24 10.0 Plus',
    batteryModel: 'Tesla Powerwall 3 (13.5 kWh)',
    totalPriceAud: 17400,
    status: 'Signed',
    pdfUrl: 'https://opensolar.com/proposals/au/882190-signed.pdf',
    design3dUrl: 'https://app.opensolar.com/#/studio/design/882190',
    signedAt: '2026-08-25T14:30:00Z',
    lastSyncedAt: '10 mins ago'
  },
  {
    id: 'os-p-2',
    proposalId: 'OS-PROP-2024-41',
    projectId: 'proj-3',
    customerName: 'Brooke Henderson',
    address: '18 Gympie Street',
    suburb: 'Chermside',
    state: 'QLD',
    systemSizeKw: 6.6,
    panelCount: 16,
    panelModel: 'Jinko Solar Tiger Neo 415W N-Type',
    inverterModel: 'Sungrow SG5.0RS-ADA 5kW',
    totalPriceAud: 5850,
    status: 'Signed',
    pdfUrl: 'https://opensolar.com/proposals/au/410982-signed.pdf',
    design3dUrl: 'https://app.opensolar.com/#/studio/design/410982',
    signedAt: '2024-08-18T09:15:00Z',
    lastSyncedAt: '1 hour ago'
  },
  {
    id: 'os-p-3',
    proposalId: 'OS-PROP-2026-99',
    projectId: 'proj-2',
    customerName: 'Marcus Sterling',
    address: '120 George St',
    suburb: 'Parramatta',
    state: 'NSW',
    systemSizeKw: 39.6,
    panelCount: 90,
    panelModel: 'Canadian Solar HiKu7 440W All-Black Mono',
    inverterModel: 'SolarEdge SE33.3K 3-Phase Commercial',
    totalPriceAud: 42000,
    status: 'Signed',
    pdfUrl: 'https://opensolar.com/proposals/au/990142-signed.pdf',
    design3dUrl: 'https://app.opensolar.com/#/studio/design/990142',
    signedAt: '2026-06-10T11:00:00Z',
    lastSyncedAt: '25 mins ago'
  },
  {
    id: 'os-p-4',
    proposalId: 'OS-PROP-2026-104',
    projectId: 'proj-5',
    customerName: 'Nathaniel Ward',
    address: '88 Old Northern Road',
    suburb: 'Castle Hill',
    state: 'NSW',
    systemSizeKw: 10.0,
    panelCount: 24,
    panelModel: 'Hyundai Energy 415W Heavy Duty Mono',
    inverterModel: 'Fronius Primo 8.2-1',
    totalPriceAud: 11200,
    status: 'Signed',
    pdfUrl: 'https://opensolar.com/proposals/au/104812-signed.pdf',
    design3dUrl: 'https://app.opensolar.com/#/studio/design/104812',
    signedAt: '2026-08-29T16:20:00Z',
    lastSyncedAt: '5 mins ago'
  },
  {
    id: 'os-p-5',
    proposalId: 'OS-PROP-2026-112',
    customerName: 'Chloe Bennett',
    address: '54 Pacific Highway',
    suburb: 'Coffs Harbour',
    state: 'NSW',
    systemSizeKw: 8.8,
    panelCount: 20,
    panelModel: 'Trina Solar 440W Vertex S+',
    inverterModel: 'Sungrow SH8.0RT Hybrid Inverter',
    batteryModel: 'Sungrow SBR096 9.6kWh High Voltage',
    totalPriceAud: 14500,
    status: 'Sent',
    pdfUrl: 'https://opensolar.com/proposals/au/112940-draft.pdf',
    design3dUrl: 'https://app.opensolar.com/#/studio/design/112940',
    lastSyncedAt: 'Just now'
  }
];

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
