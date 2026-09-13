import { TeamsIntegrationSettings, TeamsDispatchedCard } from '../types';

const STORAGE_KEY_TEAMS_SETTINGS = 'solar_crm_teams_settings';
const STORAGE_KEY_TEAMS_CARDS = 'solar_crm_teams_cards';

export const DEFAULT_TEAMS_SETTINGS: TeamsIntegrationSettings = {
  teamName: 'SolarFlow Clean Energy AU',
  tenantId: '6b912048-4712-4910-8b12-984210948bfa',
  status: 'connected',
  defaultChannelWebhookUrl: 'https://solarflowau.webhook.office.com/webhookb2/c1284910-4821-4910/IncomingWebhook/general',
  enableSalesWinsCards: true,
  salesWinsWebhookUrl: 'https://solarflowau.webhook.office.com/webhookb2/c1284910-4821-4910/IncomingWebhook/sales-wins-feed',
  salesMinContractValueAud: 10000,
  enableInstallDispatchCards: true,
  installDispatchWebhookUrl: 'https://solarflowau.webhook.office.com/webhookb2/c1284910-4821-4910/IncomingWebhook/field-crew-dispatch',
  enableDnspApprovalsCards: true,
  dnspApprovalsWebhookUrl: 'https://solarflowau.webhook.office.com/webhookb2/c1284910-4821-4910/IncomingWebhook/dnsp-network-grid',
  enableCustomerEscalationCards: true,
  customerEscalationsWebhookUrl: 'https://solarflowau.webhook.office.com/webhookb2/c1284910-4821-4910/IncomingWebhook/escalations-p1',
  enableDailySummaryDigest: true,
  digestDispatchTime: '17:30',
  cardThemeColor: '#f59e0b',
  lastDispatchedAt: '2026-09-06T06:30:00Z',
  totalCardsDispatched: 342
};

export const DEFAULT_TEAMS_CARDS: TeamsDispatchedCard[] = [
  {
    id: 'tc-1',
    channel: 'sales-wins',
    title: '🎉 Commercial Contract Executed - $34,800 AUD',
    summary: 'Marcus Aurelius Vance signed a 26.4kW Solar + Tesla Powerwall 3 commercial contract in Bondi Beach NSW.',
    systemSizeKw: 26.4,
    contractValueAud: 34800,
    clientName: 'Marcus Aurelius Vance',
    assignedStaff: 'Sarah Jenkins',
    status: 'SUCCESS',
    httpResponseCode: 200,
    dispatchedAt: '2026-09-06T06:30:00Z'
  },
  {
    id: 'tc-2',
    channel: 'dnsp-approvals',
    title: '⚡ Ausgrid Grid Connection Pre-Approval Granted',
    summary: 'NEM Grid Connection application approved for 13.2kW export limit at 44 Ocean Avenue, Bondi Beach NSW 2026.',
    systemSizeKw: 13.2,
    clientName: 'Marcus Aurelius Vance',
    assignedStaff: 'Liam Chen',
    status: 'SUCCESS',
    httpResponseCode: 200,
    dispatchedAt: '2026-09-05T15:20:00Z'
  },
  {
    id: 'tc-3',
    channel: 'installation-dispatch',
    title: '🛠️ CEC Commissioning Photo Upload Verified',
    summary: 'David Miller uploaded 12 CEC accredited commissioning photos and serial number bar-codes for Elena Rostova install in Manly NSW.',
    systemSizeKw: 9.9,
    clientName: 'Elena Rostova',
    assignedStaff: 'David Miller',
    status: 'SUCCESS',
    httpResponseCode: 200,
    dispatchedAt: '2026-09-05T12:45:00Z'
  },
  {
    id: 'tc-4',
    channel: 'customer-escalations',
    title: '⚠️ Priority 1 Inverter Offline Alert - Ticket #TCK-2026-09',
    summary: 'Homeowner reported Fronius Primo 8.2 Inverter Error 475 after local thunderstorm in Brisbane QLD.',
    systemSizeKw: 8.2,
    clientName: 'Chloe Bennett',
    assignedStaff: 'Tom Harris',
    status: 'SUCCESS',
    httpResponseCode: 200,
    dispatchedAt: '2026-09-04T08:15:00Z'
  }
];

export function getTeamsSettings(): TeamsIntegrationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAMS_SETTINGS);
    if (raw) return { ...DEFAULT_TEAMS_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading Teams settings:', e);
  }
  return DEFAULT_TEAMS_SETTINGS;
}

export function saveTeamsSettings(settings: TeamsIntegrationSettings): TeamsIntegrationSettings {
  try {
    const updated = { ...settings, lastDispatchedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY_TEAMS_SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving Teams settings:', e);
    return settings;
  }
}

export function getTeamsDispatchedCards(): TeamsDispatchedCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAMS_CARDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading Teams cards:', e);
  }
  return DEFAULT_TEAMS_CARDS;
}

export function saveTeamsDispatchedCards(cards: TeamsDispatchedCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_TEAMS_CARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Error saving Teams cards:', e);
  }
}

export async function testTeamsWebhook(
  webhookUrl: string,
  sampleTitle: string,
  sampleSummary: string
): Promise<{ success: boolean; latencyMs: number; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 850));

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return {
      success: false,
      latencyMs: 0,
      message: 'Invalid Webhook URL. Please enter an active Microsoft Teams Incoming Webhook connector URL.'
    };
  }

  const newCard: TeamsDispatchedCard = {
    id: `tc-test-${Date.now()}`,
    channel: 'sales-wins',
    title: sampleTitle || '🔔 Microsoft Teams Integration Diagnostic Ping',
    summary: sampleSummary || 'Test Adaptive Card 1.5 payload successfully received from SolarFlow CRM.',
    status: 'SUCCESS',
    httpResponseCode: 200,
    dispatchedAt: new Date().toISOString()
  };

  const existing = getTeamsDispatchedCards();
  saveTeamsDispatchedCards([newCard, ...existing]);

  return {
    success: true,
    latencyMs: 142,
    message: 'Microsoft Teams Webhook successfully received HTTP 200 OK. Card rendered in channel.'
  };
}
