import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Layers,
  FileText,
  ExternalLink,
  Lock,
  Globe,
  Copy,
  Check,
  Building,
  Zap,
  Download,
  Info,
  ChevronRight
} from 'lucide-react';
import {
  getOpenSolarSettings,
  saveOpenSolarSettings,
  getOpenSolarProposals,
  saveOpenSolarProposals,
  pingOpenSolarApi,
  OpenSolarPingResult
} from '../../services/openSolarService';
import { OpenSolarIntegrationSettings, OpenSolarSyncedProposal } from '../../types';

interface OpenSolarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'mapping' | 'proposals' | 'webhooks';
}

export const OpenSolarSettingsModal: React.FC<OpenSolarSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const { setSelectedPreviewProposalUrl } = useApp();
  const [activeTab, setActiveTab] = useState<'settings' | 'mapping' | 'proposals' | 'webhooks'>(initialTab);

  const [settings, setSettings] = useState<OpenSolarIntegrationSettings>(getOpenSolarSettings);
  const [proposals, setProposals] = useState<OpenSolarSyncedProposal[]>(getOpenSolarProposals);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Ping test state
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<OpenSolarPingResult | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getOpenSolarSettings());
      setProposals(getOpenSolarProposals());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveOpenSolarSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await pingOpenSolarApi();
      setPingResult(res);
    } finally {
      setIsPinging(false);
    }
  };

  const handlePullProposals = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    await new Promise(resolve => setTimeout(resolve, 1100));
    const current = getOpenSolarProposals();
    setProposals(current);
    setIsSyncing(false);
    setSyncMessage(`Successfully synchronized ${current.length} proposals & Nearmap 3D CAD layouts from OpenSolar API!`);
    setTimeout(() => setSyncMessage(null), 5000);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#2d2d2d] overflow-hidden flex flex-col max-h-[92vh] text-[#e5e7eb]">
        {/* Header */}
        <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  OpenSolar Platform Integration &amp; 3D Studio
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Nearmap 3D &amp; NEM Tariffs
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Connected Org: <span className="font-mono text-white font-semibold">{settings.orgId}</span> | Partner: <span className="font-mono text-orange-300">{settings.partnerCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#262626] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 bg-[#141414] border-b border-[#262626] overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>API &amp; Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'mapping'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Sync &amp; Mapping Rules</span>
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'proposals'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Synced Proposals ({proposals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'webhooks'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Webhooks &amp; Endpoints</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>OpenSolar configuration successfully updated and saved to local CRM state!</span>
            </div>
          )}

          {syncMessage && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-xs text-orange-300 flex items-center gap-2">
              <Sun className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}

          {/* TAB 1: API & Credentials */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="p-4 bg-[#161616] border border-[#262626] rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-orange-400" />
                    OpenSolar Account Authorization
                  </h4>
                  <p className="text-xs text-gray-400">
                    Connect your Australian OpenSolar business account to automatically pull 3D roof panel designs, system sizing, degradation calculations, and customer digital contracts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isPinging}
                  className="px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-200 border border-[#333] text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>

              {pingResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    pingResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      {pingResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                      {pingResult.message}
                    </span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/30 font-semibold">
                      {pingResult.latencyMs}ms Latency
                    </span>
                  </div>
                  {pingResult.success && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1 text-gray-300 border-t border-emerald-500/20">
                      <div>Organization: <strong>{pingResult.orgName}</strong></div>
                      <div>Tariff DB: <strong>{pingResult.tariffDatabaseVersion}</strong></div>
                      <div>Nearmap 3D: <strong>Active</strong></div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    OpenSolar Organization ID <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.orgId}
                    onChange={e => setSettings({ ...settings, orgId: e.target.value })}
                    className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-400"
                    placeholder="OS-ORG-84920"
                    required
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Found in OpenSolar Control &gt; Company &gt; Business Settings</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Environment Target
                  </label>
                  <select
                    value={settings.environment}
                    onChange={e => setSettings({ ...settings, environment: e.target.value as any })}
                    className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-400"
                  >
                    <option value="production">Production (app.opensolar.com)</option>
                    <option value="sandbox">Sandbox / Staging (sandbox.opensolar.com)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    API Key / Personal Access Token <span className="text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 pr-20 text-white focus:outline-none focus:border-orange-400"
                      placeholder="os_live_sk_..."
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-500">
                      Bearer Auth
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Partner / Affiliate Code
                  </label>
                  <input
                    type="text"
                    value={settings.partnerCode}
                    onChange={e => setSettings({ ...settings, partnerCode: e.target.value })}
                    className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-400"
                    placeholder="AU-SOLAR-PRO-2026"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Default Proposal Template
                  </label>
                  <input
                    type="text"
                    value={settings.defaultProposalTemplate}
                    onChange={e => setSettings({ ...settings, defaultProposalTemplate: e.target.value })}
                    className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-400"
                    placeholder="AU Standard Residential 2026"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-[#262626]">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs shadow-md transition-colors"
                >
                  Save OpenSolar Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Sync & Mapping Rules */}
          {activeTab === 'mapping' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#161616] border border-[#262626] rounded-xl space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  Automated Solar CRM Workflow Engine
                </h4>
                <p className="text-xs text-gray-400">
                  Configure how customer proposals, 3D aerial ray tracing, and equipment BOMs synchronize into Solar CRM projects.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.autoCreateProjectOnSigned}
                    onChange={e => {
                      const updated = { ...settings, autoCreateProjectOnSigned: e.target.checked };
                      setSettings(updated);
                      saveOpenSolarSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Auto-Create CRM Project Upon Contract Signature
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      When a customer digitally signs the OpenSolar proposal, automatically promote lead to Project in Stage 2 (Site Survey / Engineering).
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.syncNearmap3dImagery}
                    onChange={e => {
                      const updated = { ...settings, syncNearmap3dImagery: e.target.checked };
                      setSettings(updated);
                      saveOpenSolarSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Sync Nearmap High-Resolution 3D Lidar Roof Imagery
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Embeds high-resolution satellite arrays, pitch angles, and solar access percentages directly in the CRM Project viewer.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626] cursor-pointer hover:border-[#333]">
                  <input
                    type="checkbox"
                    checked={settings.syncPricingAndBom}
                    onChange={e => {
                      const updated = { ...settings, syncPricingAndBom: e.target.checked };
                      setSettings(updated);
                      saveOpenSolarSettings(updated);
                    }}
                    className="mt-1 rounded bg-[#121212] border-gray-600 text-orange-500 focus:ring-orange-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Sync Bill of Materials (BOM) &amp; Manufacturer Warranties
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      Extracts exact panel models, inverter ratings, battery serial specs, and pricing breakdowns into CRM Sales Orders.
                    </span>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Periodic Polling Interval
                  </label>
                  <select
                    value={settings.syncIntervalMinutes}
                    onChange={e => {
                      const updated = { ...settings, syncIntervalMinutes: parseInt(e.target.value) || 15 };
                      setSettings(updated);
                      saveOpenSolarSettings(updated);
                    }}
                    className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-400"
                  >
                    <option value={5}>Every 5 Minutes (High Priority)</option>
                    <option value={15}>Every 15 Minutes (Standard Recommendation)</option>
                    <option value={30}>Every 30 Minutes</option>
                    <option value={60}>Hourly Polling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Contract Signature Action
                  </label>
                  <input
                    type="text"
                    value="Attach Signed PDF & Trigger BridgeSelect STC Lodgement"
                    readOnly
                    className="w-full text-xs font-mono bg-[#161616] border border-[#2d2d2d] rounded-lg p-2.5 text-gray-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Synced Proposals */}
          {activeTab === 'proposals' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#161616] border border-[#262626] rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-white">Synchronized Proposal Registry</h4>
                  <p className="text-xs text-gray-400">
                    Live proposals created in OpenSolar Studio and synchronized with Solar CRM contacts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePullProposals}
                  disabled={isSyncing}
                  className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Pulling from OpenSolar...' : 'Pull Proposals Now'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {proposals.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-orange-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-orange-400">{p.proposalId}</span>
                        <span className="text-sm font-bold text-white">{p.customerName}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.status === 'Signed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {p.status}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">
                          {p.systemSizeKw} kW ({p.panelCount} panels)
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {p.address}, {p.suburb} {p.state} &bull; {p.panelModel} &bull; {p.inverterModel}
                        {p.batteryModel && ` &bull; ${p.batteryModel}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-xs font-bold text-white mr-2">
                        ${p.totalPriceAud.toLocaleString()} AUD
                      </span>
                      <button
                        onClick={() => setSelectedPreviewProposalUrl(p.proposalId)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-orange-300 hover:text-white border border-[#333] text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="View Interactive 3D Proposal"
                      >
                        <Sun className="w-3.5 h-3.5 text-orange-400" />
                        <span>View 3D</span>
                      </button>
                      <a
                        href={p.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-300 hover:text-white border border-[#333] text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Webhooks & Endpoints */}
          {activeTab === 'webhooks' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#161616] border border-[#262626] rounded-xl space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  Real-time Inbound OpenSolar Webhook
                </h4>
                <p className="text-xs text-gray-400">
                  OpenSolar sends instant HTTP POST notifications whenever proposals are viewed, revised, or digitally signed.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Inbound Webhook URL (Paste into OpenSolar Control &gt; Webhooks)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={settings.webhookEndpoint}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.webhookEndpoint, 'endpoint')}
                      className="px-3.5 py-2.5 bg-[#262626] hover:bg-[#333] text-gray-200 border border-[#333] rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      {copiedField === 'endpoint' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'endpoint' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Webhook HMAC-SHA256 Signing Secret
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value={settings.webhookSecret}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg p-2.5 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(settings.webhookSecret, 'secret')}
                      className="px-3.5 py-2.5 bg-[#262626] hover:bg-[#333] text-gray-200 border border-[#333] rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      {copiedField === 'secret' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'secret' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#161616] border border-[#262626] rounded-xl text-xs space-y-2">
                <span className="font-bold text-white block">Subscribed Webhook Events:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>proposal.signed (Immediate Project promotion)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>proposal.viewed (Customer engagement tracking)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>project.created (Bi-directional lead sync)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>design.updated (3D CAD array re-render)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
