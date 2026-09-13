import React, { useState, useEffect } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Facebook,
  MessageSquare,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Users,
  Zap,
  Tag,
  Filter,
  ArrowRight,
  Database,
  DollarSign
} from 'lucide-react';
import {
  getMetaSettings,
  saveMetaSettings,
  getMetaForms,
  saveMetaForms,
  getMetaLeads,
  saveMetaLeads,
  pingMetaWebhook,
  triggerManualMetaLeadSync
} from '../../services/metaAdsService';
import { MetaAdsIntegrationSettings, MetaLeadFormConfig, MetaIngestedLead } from '../../types';

interface MetaAdsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'forms' | 'leads' | 'sync';
}

export const MetaAdsSettingsModal: React.FC<MetaAdsSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'forms' | 'leads' | 'sync'>(initialTab);

  const [settings, setSettings] = useState<MetaAdsIntegrationSettings>(getMetaSettings);
  const [forms, setForms] = useState<MetaLeadFormConfig[]>(getMetaForms);
  const [leads, setLeads] = useState<MetaIngestedLead[]>(getMetaLeads);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ count: number; message: string } | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getMetaSettings());
      setForms(getMetaForms());
      setLeads(getMetaLeads());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveMetaSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await triggerManualMetaLeadSync();
      setSyncResult({ count: res.newLeadsIngested, message: res.message });
      setLeads(getMetaLeads());
      setSettings(getMetaSettings());
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePingWebhook = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await pingMetaWebhook();
      setPingResult(res);
      if (res.success) {
        setSettings(prev => ({ ...prev, status: 'connected' }));
      }
    } finally {
      setIsPinging(false);
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base md:text-lg text-white">Meta Ads &amp; Messenger Lead Sync</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Graph API v20.0
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300">
                  Real-Time Webhook
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Instant ingestion of Facebook &amp; Instagram solar battery leads, automated state-based assignment &amp; instant welcome SMS.
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
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Meta API &amp; App</span>
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'forms'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Instant Forms ({forms.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Ingested Leads ({leads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'sync'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync &amp; Diagnostics</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="space-y-5">
              {savedSuccess && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Meta Ads integration settings saved successfully.</span>
                </div>
              )}

              {/* Status Banner */}
              <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{settings.pageName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                        {settings.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Page ID: <strong className="text-gray-200">{settings.pageId}</strong> • Total Leads Ingested:{' '}
                      <span className="text-blue-400 font-bold">{settings.totalLeadsIngested}</span> • Sync Interval:{' '}
                      <strong className="text-gray-200">{settings.syncIntervalMinutes} mins</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePingWebhook}
                  disabled={isPinging}
                  className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Pinging Webhook...' : 'Verify Meta Webhook'}</span>
                </button>
              </div>

              {pingResult && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{pingResult.message} ({pingResult.latencyMs}ms)</span>
                </div>
              )}

              {/* App Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Meta Developer App &amp; Page Config
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Meta App ID
                    </label>
                    <input
                      type="text"
                      value={settings.appId}
                      onChange={e => setSettings({ ...settings, appId: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Meta App Secret
                    </label>
                    <input
                      type="password"
                      value={settings.appSecret}
                      onChange={e => setSettings({ ...settings, appSecret: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Facebook Page ID
                    </label>
                    <input
                      type="text"
                      value={settings.pageId}
                      onChange={e => setSettings({ ...settings, pageId: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Facebook Page Name
                    </label>
                    <input
                      type="text"
                      value={settings.pageName}
                      onChange={e => setSettings({ ...settings, pageName: e.target.value })}
                      className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Page Long-Lived Access Token
                  </label>
                  <input
                    type="password"
                    value={settings.pageAccessToken}
                    onChange={e => setSettings({ ...settings, pageAccessToken: e.target.value })}
                    className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Requires <code className="text-gray-300">pages_read_engagement</code> and <code className="text-gray-300">leads_retrieval</code> permissions.
                  </p>
                </div>
              </div>

              {/* Webhook Configuration */}
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Real-time Lead Ads Webhook
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Callback URL (Add to Meta App &gt; Webhooks &gt; Page &gt; leadgen)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.webhookCallbackUrl}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-gray-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.webhookCallbackUrl, 'metaWh')}
                      className="px-3 py-2 rounded-xl bg-[#262626] hover:bg-[#333] text-gray-300 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedField === 'metaWh' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'metaWh' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Verify Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={settings.webhookVerifyToken}
                      onChange={e => setSettings({ ...settings, webhookVerifyToken: e.target.value })}
                      className="w-full text-xs font-mono bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.webhookVerifyToken, 'metaToken')}
                      className="px-3 py-2 rounded-xl bg-[#262626] hover:bg-[#333] text-gray-300 text-xs font-medium flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedField === 'metaToken' ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'metaToken' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lead Routing & Instant Auto-Response */}
              <div className="space-y-4 pt-4 border-t border-[#262626]">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Lead Routing &amp; Instant Auto-Response
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Lead Assignment Strategy
                    </label>
                    <select
                      value={settings.assignmentMethod}
                      onChange={e => setSettings({ ...settings, assignmentMethod: e.target.value as any })}
                      className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    >
                      <option value="state_based">State-Based (NSW &gt; Sarah Jenkins, QLD &gt; Tom Harris)</option>
                      <option value="round_robin">Round Robin (Evenly distribute to all active consultants)</option>
                      <option value="lead_type">Lead Type (Battery/Solar split)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Default Assigned Consultant
                    </label>
                    <input
                      type="text"
                      value={settings.defaultAssignedRep}
                      onChange={e => setSettings({ ...settings, defaultAssignedRep: e.target.value })}
                      className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 p-3 bg-[#141414] border border-[#262626] rounded-xl cursor-pointer hover:border-blue-500/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.enableInstantWelcomeSms}
                    onChange={e => setSettings({ ...settings, enableInstantWelcomeSms: e.target.checked })}
                    className="mt-0.5 rounded text-blue-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">Send Instant Welcome SMS via MessageMedia</span>
                    <span className="text-[11px] text-gray-400">
                      Dispatches immediate SMS within 30 seconds of Meta form submission to achieve 90%+ homeowner contact rate.
                    </span>
                  </div>
                </label>

                {settings.enableInstantWelcomeSms && (
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Instant SMS Message Body (Supports <code className="text-blue-400 font-mono">&#123;&#123;name&#125;&#125;</code> and <code className="text-blue-400 font-mono">&#123;&#123;rep&#125;&#125;</code>)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.instantWelcomeMessage}
                      onChange={e => setSettings({ ...settings, instantWelcomeMessage: e.target.value })}
                      className="w-full text-xs bg-[#141414] border border-[#262626] rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Meta Ads Settings</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'forms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Active Facebook &amp; Instagram Lead Forms</h3>
                  <p className="text-xs text-gray-400">
                    Mapped instant forms automatically ingested into SolarFlow CRM leads pipeline.
                  </p>
                </div>
                <span className="text-xs text-gray-400">Showing {forms.length} forms</span>
              </div>

              <div className="space-y-3">
                {forms.map(form => (
                  <div
                    key={form.id}
                    className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{form.formName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              form.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}
                          >
                            {form.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Campaign: <strong className="text-gray-300">{form.campaignName}</strong> • Form ID: <code className="text-gray-400">{form.formId}</code>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-400">{form.leadsCount}</span>
                        <span className="text-[10px] text-gray-500 block">Total Leads</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#1a1a1a] rounded-lg border border-[#262626]/60">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Field Mappings:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {form.fieldMappings.map((fm, idx) => (
                          <div
                            key={idx}
                            className="px-2 py-1 rounded bg-[#262626] text-[11px] font-mono text-gray-300 flex items-center gap-1.5"
                          >
                            <span className="text-blue-400">{fm.formField}</span>
                            <span className="text-gray-500">→</span>
                            <span className="text-emerald-400">{fm.crmField}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Live Ingested Meta Leads Feed</h3>
                  <p className="text-xs text-gray-400">
                    Real-time leads captured from Facebook &amp; Instagram advertising campaigns with full questionnaire answers.
                  </p>
                </div>
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {leads.map(lead => (
                  <div
                    key={lead.id}
                    className="p-4 bg-[#141414] border border-[#262626] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{lead.customerName}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#262626] text-blue-400">
                          {lead.state}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                          {lead.status}
                        </span>
                        {lead.batteryInterest && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400">
                            ⚡ Battery Interest
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Phone: <strong className="text-gray-200">{lead.phone}</strong></span>
                        <span>Email: <strong className="text-gray-200">{lead.email}</strong></span>
                        <span>Location: <strong className="text-gray-200">{lead.suburb}, {lead.state}</strong></span>
                        <span>Quarterly Bill: <strong className="text-emerald-400">${lead.quarterlyBillAud} AUD</strong></span>
                        <span>Roof: <strong className="text-gray-300">{lead.roofType}</strong></span>
                      </div>

                      <div className="text-[11px] text-gray-500">
                        Form: <strong>{lead.formName}</strong> • Assigned To: <strong className="text-gray-300">{lead.assignedTo}</strong> • Received:{' '}
                        {new Date(lead.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${lead.phone}`}
                        className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="max-w-xl mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Manual Lead Ingestion &amp; Diagnostics</h3>
                <p className="text-xs text-gray-400">
                  Force a live polling cycle against Meta Graph API v20.0 to fetch any unprocessed lead forms.
                </p>
              </div>

              {syncResult && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{syncResult.message}</span>
                </div>
              )}

              <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#262626]">
                  <span className="text-gray-400">Meta API Status:</span>
                  <span className="text-emerald-400 font-bold">CONNECTED (Graph v20.0)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#262626]">
                  <span className="text-gray-400">Last Sync Time:</span>
                  <span className="text-white">{settings.lastSyncTime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#262626]">
                  <span className="text-gray-400">Total Leads Ingested:</span>
                  <span className="text-blue-400 font-bold">{settings.totalLeadsIngested}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Instant Welcome SMS:</span>
                  <span className="text-white">{settings.enableInstantWelcomeSms ? 'Enabled (Active)' : 'Disabled'}</span>
                </div>
              </div>

              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Pulling Leads from Meta Graph...' : 'Trigger Immediate Lead Sync'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
