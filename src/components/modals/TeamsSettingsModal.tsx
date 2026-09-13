import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Sliders,
  ShieldCheck,
  Bell,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Info,
  DollarSign,
  Wrench,
  AlertCircle,
  Hash
} from 'lucide-react';
import {
  getTeamsSettings,
  saveTeamsSettings,
  getTeamsDispatchedCards,
  saveTeamsDispatchedCards,
  testTeamsWebhook
} from '../../services/teamsService';
import { TeamsIntegrationSettings, TeamsDispatchedCard } from '../../types';

interface TeamsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'channels' | 'cards' | 'test';
}

export const TeamsSettingsModal: React.FC<TeamsSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'channels' | 'cards' | 'test'>(initialTab);

  const [settings, setSettings] = useState<TeamsIntegrationSettings>(getTeamsSettings);
  const [cards, setCards] = useState<TeamsDispatchedCard[]>(getTeamsDispatchedCards);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Test state
  const [testChannel, setTestChannel] = useState<'sales-wins' | 'installation-dispatch' | 'dnsp-approvals' | 'customer-escalations'>('sales-wins');
  const [testTitle, setTestTitle] = useState('🎉 Commercial Solar Contract Won - 26.4kW System ($34,800 AUD)');
  const [testSummary, setTestSummary] = useState('Sarah Jenkins successfully closed Marcus Vance Bondi Beach commercial project with Tesla Powerwall 3 battery integration.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getTeamsSettings());
      setCards(getTeamsDispatchedCards());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveTeamsSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleSendTestCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestResult(null);

    let targetUrl = settings.defaultChannelWebhookUrl;
    if (testChannel === 'sales-wins') targetUrl = settings.salesWinsWebhookUrl;
    if (testChannel === 'installation-dispatch') targetUrl = settings.installDispatchWebhookUrl;
    if (testChannel === 'dnsp-approvals') targetUrl = settings.dnspApprovalsWebhookUrl;
    if (testChannel === 'customer-escalations') targetUrl = settings.customerEscalationsWebhookUrl;

    try {
      const res = await testTeamsWebhook(targetUrl, testTitle, testSummary);
      setTestResult(res);
      setCards(getTeamsDispatchedCards());
    } finally {
      setIsSendingTest(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-2xl shadow-2xl border border-[#2d2d2d] overflow-hidden text-gray-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#141414] border-b border-[#262626] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base md:text-lg text-white">Microsoft Teams Webhook Settings</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Adaptive Cards 1.5
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                  Office 365 Connector
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Channel webhook notifications for sales wins, CEC field commissioning, DNSP grid approvals &amp; customer escalations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 md:px-6 bg-[#161616] border-b border-[#262626] shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Webhook Endpoints</span>
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'channels'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alert Rules &amp; Triggers</span>
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'cards'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Dispatched Cards ({cards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'test'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Card Dispatch Tester</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="space-y-5">
              {savedSuccess && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Microsoft Teams Webhook URLs and card styling saved successfully.</span>
                </div>
              )}

              {/* Status Banner */}
              <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{settings.teamName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400">
                        {settings.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Total Dispatched Cards: <strong className="text-white">{settings.totalCardsDispatched}</strong> • Accent Color:{' '}
                      <span className="inline-block w-3 h-3 rounded-full align-middle ml-1" style={{ backgroundColor: settings.cardThemeColor }} />{' '}
                      <strong className="text-white">{settings.cardThemeColor}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Organization and Tenant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Microsoft Teams Workspace / Organization Name
                  </label>
                  <input
                    type="text"
                    value={settings.teamName}
                    onChange={e => setSettings({ ...settings, teamName: e.target.value })}
                    className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Card Accent Theme Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.cardThemeColor}
                      onChange={e => setSettings({ ...settings, cardThemeColor: e.target.value })}
                      className="w-10 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.cardThemeColor}
                      onChange={e => setSettings({ ...settings, cardThemeColor: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Channel Incoming Webhooks */}
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Dedicated Microsoft Teams Channel Webhook URLs
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1 flex items-center justify-between">
                    <span>Default / General Channel Incoming Webhook URL</span>
                  </label>
                  <input
                    type="text"
                    value={settings.defaultChannelWebhookUrl}
                    onChange={e => setSettings({ ...settings, defaultChannelWebhookUrl: e.target.value })}
                    className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Sales Wins &amp; Contract Signings Channel Webhook
                  </label>
                  <input
                    type="text"
                    value={settings.salesWinsWebhookUrl}
                    onChange={e => setSettings({ ...settings, salesWinsWebhookUrl: e.target.value })}
                    className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Installation &amp; Field Crew Dispatch Channel Webhook
                  </label>
                  <input
                    type="text"
                    value={settings.installDispatchWebhookUrl}
                    onChange={e => setSettings({ ...settings, installDispatchWebhookUrl: e.target.value })}
                    className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    DNSP Network Grid Connection Approvals Channel Webhook
                  </label>
                  <input
                    type="text"
                    value={settings.dnspApprovalsWebhookUrl}
                    onChange={e => setSettings({ ...settings, dnspApprovalsWebhookUrl: e.target.value })}
                    className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Priority 1 Customer Escalation Channel Webhook
                  </label>
                  <input
                    type="text"
                    value={settings.customerEscalationsWebhookUrl}
                    onChange={e => setSettings({ ...settings, customerEscalationsWebhookUrl: e.target.value })}
                    className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Teams Webhooks</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'channels' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Automated Teams Adaptive Card Rules</h3>
                <p className="text-xs text-gray-400">
                  Select which business events automatically generate and push high-fidelity cards into Teams.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-xs font-bold text-white block">Deal Signed &amp; Contract Executed</span>
                        <span className="text-[11px] text-gray-400">
                          Fires when a client signs their OpenSolar proposal or pays a deposit.
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableSalesWinsCards}
                      onChange={e => setSettings({ ...settings, enableSalesWinsCards: e.target.checked })}
                      className="rounded text-purple-500 focus:ring-0"
                    />
                  </div>

                  {settings.enableSalesWinsCards && (
                    <div className="pt-2 border-t border-[#262626] flex items-center gap-3 text-xs">
                      <span className="text-gray-400">Minimum Contract Value Threshold:</span>
                      <div className="flex items-center gap-1 font-mono">
                        <span className="text-gray-400">$</span>
                        <input
                          type="number"
                          value={settings.salesMinContractValueAud}
                          onChange={e => setSettings({ ...settings, salesMinContractValueAud: parseInt(e.target.value) || 0 })}
                          className="w-24 px-2 py-1 bg-[#1a1a1a] border border-[#333] rounded text-white text-xs outline-none"
                        />
                        <span className="text-gray-400">AUD</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Installation Field Crew Dispatch &amp; Sign-off</span>
                      <span className="text-[11px] text-gray-400">
                        Dispatches card with CEC accredited installer photo verification and panel serial numbers.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableInstallDispatchCards}
                    onChange={e => setSettings({ ...settings, enableInstallDispatchCards: e.target.checked })}
                    className="rounded text-purple-500 focus:ring-0"
                  />
                </div>

                <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">DNSP Grid Pre-Approval Confirmation</span>
                      <span className="text-[11px] text-gray-400">
                        Pushes approved export limit notifications (Ausgrid, Endeavour, Energex, Essential).
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableDnspApprovalsCards}
                    onChange={e => setSettings({ ...settings, enableDnspApprovalsCards: e.target.checked })}
                    className="rounded text-purple-500 focus:ring-0"
                  />
                </div>

                <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Priority 1 Inverter / Battery Escalation</span>
                      <span className="text-[11px] text-gray-400">
                        Sends immediate alert when warranty ticket or emergency inverter error code is logged.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableCustomerEscalationCards}
                    onChange={e => setSettings({ ...settings, enableCustomerEscalationCards: e.target.checked })}
                    className="rounded text-purple-500 focus:ring-0"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Dispatched Adaptive Cards Stream</h3>
                  <p className="text-xs text-gray-400">
                    Audit log of JSON Adaptive Cards sent to Microsoft Teams channels.
                  </p>
                </div>
                <span className="text-xs text-gray-400">Showing {cards.length} cards</span>
              </div>

              <div className="space-y-3">
                {cards.map(card => (
                  <div
                    key={card.id}
                    className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{card.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#262626] text-purple-400">
                          #{card.channel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          HTTP {card.httpResponseCode} OK
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(card.dispatchedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 bg-[#1a1a1a] p-3 rounded-lg border border-[#262626]/60">
                      {card.summary}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                      {card.clientName && <span>Client: <strong className="text-white">{card.clientName}</strong></span>}
                      {card.systemSizeKw && <span>System: <strong className="text-white">{card.systemSizeKw} kW</strong></span>}
                      {card.contractValueAud && <span>Value: <strong className="text-emerald-400">${card.contractValueAud.toLocaleString()} AUD</strong></span>}
                      {card.assignedStaff && <span>Assigned: <strong className="text-gray-300">{card.assignedStaff}</strong></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="max-w-xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
                  <Send className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Live Teams Adaptive Card Tester</h3>
                <p className="text-xs text-gray-400">
                  Post a test card into your Microsoft Teams channel to verify JSON payload rendering and webhook authorization.
                </p>
              </div>

              {testResult && (
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{testResult.message}</span>
                </div>
              )}

              <form onSubmit={handleSendTestCard} className="space-y-4 bg-[#141414] p-5 rounded-xl border border-[#262626]">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Target Channel Webhook
                  </label>
                  <select
                    value={testChannel}
                    onChange={e => setTestChannel(e.target.value as any)}
                    className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-xl px-3 py-2.5 text-white outline-none focus:border-purple-500"
                  >
                    <option value="sales-wins">Sales Wins &amp; Contracts</option>
                    <option value="installation-dispatch">Installation &amp; Field Operations</option>
                    <option value="dnsp-approvals">DNSP Network Grid Approvals</option>
                    <option value="customer-escalations">Priority Customer Escalations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={e => setTestTitle(e.target.value)}
                    className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-xl px-3 py-2.5 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Card Summary Text
                  </label>
                  <textarea
                    rows={3}
                    value={testSummary}
                    onChange={e => setTestSummary(e.target.value)}
                    className="w-full text-xs bg-[#1a1a1a] border border-[#262626] rounded-xl p-3 text-white outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSendingTest ? 'Posting to Teams Connector...' : 'Post Adaptive Card to Teams'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
