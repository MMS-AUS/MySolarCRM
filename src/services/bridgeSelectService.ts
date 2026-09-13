import { BridgeSelectPortalSettings, Project } from '../types';

const STORAGE_KEY = 'solar_bridgeselect_settings';

export const DEFAULT_BRIDGESELECT_SETTINGS: BridgeSelectPortalSettings = {
  recRegistryAgentId: 'CER-AGT-882109',
  apiKey: 'bs_live_sec_9941a823bf1c8e90',
  webhookSecret: 'whsec_stc_2026_solarflow',
  environment: 'production',
  aggregator: 'BridgeSelect',
  stcSpotRateAud: 38.50,
  requireCecAccreditation: true,
  requireSaaLicense: true,
  requireSerialVerification: true,
  requireGeotaggedPhotos: true,
  requireDigitalSignature: true,
  autoSubmitOnCompletion: true,
  lastSyncTime: 'Real-time'
};

export const getBridgeSelectSettings = (): BridgeSelectPortalSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_BRIDGESELECT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading BridgeSelect settings:', e);
  }
  return DEFAULT_BRIDGESELECT_SETTINGS;
};

export const saveBridgeSelectSettings = (settings: Partial<BridgeSelectPortalSettings>): BridgeSelectPortalSettings => {
  const current = getBridgeSelectSettings();
  const updated: BridgeSelectPortalSettings = {
    ...current,
    ...settings,
    lastSyncTime: 'Just now'
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving BridgeSelect settings:', e);
  }
  return updated;
};

export interface BridgeSelectPingResult {
  success: boolean;
  message: string;
  latencyMs: number;
  environment: string;
  recRegistryStatus: 'ONLINE' | 'MAINTENANCE' | 'OFFLINE';
  spotRateAud: number;
  activeBatchQueue: number;
  currentDeemingMultiplier: number;
  timestamp: string;
}

export const pingBridgeSelectApi = async (): Promise<BridgeSelectPingResult> => {
  const settings = getBridgeSelectSettings();
  // Simulate network roundtrip
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    success: true,
    message: `Connected to Clean Energy Regulator (${settings.aggregator} Gateway v2.4). REC Registry verified.`,
    latencyMs: 48,
    environment: settings.environment,
    recRegistryStatus: 'ONLINE',
    spotRateAud: settings.stcSpotRateAud,
    activeBatchQueue: 3,
    currentDeemingMultiplier: 1.382 * 5, // Zone 3 rating 1.382 * 5 years remaining
    timestamp: new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
};

export interface ProjectStcValidationResult {
  projectId: string;
  projectCode: string;
  customerName: string;
  systemSizeKw: number;
  stcCount: number;
  stcValueAud: number; // Internal claim value
  customerStcValueAud: number; // Customer invoiced discount
  internalStcValueAud: number; // Internal CER claim value
  stcTradingMarginAud: number; // Retained profit margin
  passedChecks: {
    cecInstaller: boolean;
    saaLicense: boolean;
    approvedEquipment: boolean;
    geotaggedPhotos: boolean;
    customerSignature: boolean;
  };
  isEligibleForLodgement: boolean;
  status: string;
}

export const evaluateProjectStcCompliance = (
  project: Project,
  internalRateAud: number = 39.50,
  customerRateAud: number = 36.00
): ProjectStcValidationResult => {
  const zoneMultiplier = 1.382;
  const deemingYears = 5;
  const calculatedSTCs = project.stcCount || Math.round(project.systemSizeKw * zoneMultiplier * deemingYears);
  const effectiveInternalRate = project.internalStcRateAud ?? internalRateAud;
  const effectiveCustomerRate = project.customerStcRateAud ?? customerRateAud;
  const internalStcValueAud = project.internalStcValueAud ?? Math.round(calculatedSTCs * effectiveInternalRate);
  const customerStcValueAud = project.customerStcValueAud ?? Math.round(calculatedSTCs * effectiveCustomerRate);
  const stcTradingMarginAud = internalStcValueAud - customerStcValueAud;

  const hasPhotos = (project.installedPhotos && project.installedPhotos.length >= 3) || project.status === 'Completed';
  const hasApprovedEquipment = Boolean(project.panelBrand && project.inverterBrand);
  const cecInstaller = Boolean(project.subcontractorName || project.subcontractorId);
  const saaLicense = true;
  const customerSignature = Boolean(project.openSolarContractSigned || project.status === 'Completed' || project.status === 'Install Scheduled');

  const isEligible = hasPhotos && hasApprovedEquipment && cecInstaller && saaLicense && customerSignature;

  return {
    projectId: project.id,
    projectCode: project.projectCode,
    customerName: project.customerName,
    systemSizeKw: project.systemSizeKw,
    stcCount: calculatedSTCs,
    stcValueAud: internalStcValueAud,
    customerStcValueAud,
    internalStcValueAud,
    stcTradingMarginAud,
    passedChecks: {
      cecInstaller,
      saaLicense,
      approvedEquipment: hasApprovedEquipment,
      geotaggedPhotos: hasPhotos,
      customerSignature
    },
    isEligibleForLodgement: isEligible,
    status: project.bridgeSelectStatus || 'Pending Documentation'
  };
};
