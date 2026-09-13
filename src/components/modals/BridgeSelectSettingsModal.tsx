import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Sliders,
  Award,
  Layers,
  FileText,
  DollarSign,
  ExternalLink,
  Lock,
  Globe,
  Check,
  Building,
  Info
} from 'lucide-react';
import {
  getBridgeSelectSettings,
  saveBridgeSelectSettings,
  pingBridgeSelectApi,
  evaluateProjectStcCompliance,
  BridgeSelectPingResult
} from '../../services/bridgeSelectService';
import { BridgeSelectPortalSettings, Project } from '../../types';

interface BridgeSelectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'settings' | 'claims' | 'health';
}

export const BridgeSelectSettingsModal: React.FC<BridgeSelectSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'settings'
}) => {
  const { projects = [], updateProject } = useApp();
  const [activeTab, setActiveTab] = useState<'settings' | 'claims' | 'health'>(initialTab);

  const [settings, setSettings] = useState<BridgeSelectPortalSettings>(getBridgeSelectSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Ping test state
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<BridgeSelectPingResult | null>(null);

  // Batch action state
  const [isBatchSubmitting, setIsBatchSubmitting] = useState(false);
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getBridgeSelectSettings());
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveBridgeSelectSettings(settings);
    setSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await pingBridgeSelectApi();
      setPingResult(res);
    } finally {
      setIsPinging(false);
    }
  };

  // Evaluate all projects for STC claims
  const projectEvaluations = projects.map(p => evaluateProjectStcCompliance(p, settings.stcSpotRateAud));
  const eligibleProjects = projectEvaluations.filter(
    e => e.isEligibleForLodgement && e.status !== 'STCs Approved & Paid'
  );
  const totalEligibleSTCs = eligibleProjects.reduce((sum, e) => sum + e.stcCount, 0);
  const totalEligibleValueAud = eligibleProjects.reduce((sum, e) => sum + e.stcValueAud, 0);

  const handleSingleProjectLodgement = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;

    updateProject(projectId, {
      bridgeSelectStatus: 'Submitted to Clean Energy Regulator'
    });
    setBatchSuccessMessage(`Project ${proj.projectCode} lodged with BridgeSelect REC Registry!`);
    setTimeout(() => setBatchSuccessMessage(null), 5000);
  };

  const handleBatchSubmit = () => {
    if (eligibleProjects.length === 0) return;
    setIsBatchSubmitting(true);

    setTimeout(() => {
      eligibleProjects.forEach(ep => {
        updateProject(ep.projectId, {
          stcCount: ep.stcCount,
          stcValueAud: ep.stcValueAud,
          bridgeSelectStatus: 'Submitted to Clean Energy Regulator'
        });
      });
      setIsBatchSubmitting(false);
      setBatchSuccessMessage(
        `Successfully lodged batch of ${eligibleProjects.length} solar systems (${totalEligibleSTCs} STCs valued at $${totalEligibleValueAud.toLocaleString()} AUD) to CER BridgeSelect!`
      );
      setTimeout(() => setBatchSuccessMessage(null), 6000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-[#2d2d2d] overflow-hidden flex flex-col max-h-[92vh] text-[#e5e7eb]">
        {/* Header */}
        <div className="p-4 bg-[#161616] text-white flex items-center justify-between border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#bef2641a] text-[#bef264] border border-[#bef26433]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  CER BridgeSelect STC Portal Integration
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                  REC Registry v2.4 Active
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Small-scale Technology Certificates (STC) assignment, Clean Energy Council / SAA compliance &amp; automated batch lodgement
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
        <div className="flex items-center border-b border-[#262626] bg-[#141414] px-4">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#bef264] text-[#bef264]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Portal &amp; API Configuration</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'claims'
                ? 'border-[#bef264] text-[#bef264]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live STC Claims &amp; Batch Lodgement</span>
            {eligibleProjects.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#bef264] text-black text-[10px] font-extrabold rounded-full ml-1">
                {eligibleProjects.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'health'
                ? 'border-[#bef264] text-[#bef264]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Registry Status &amp; Compliance Rules</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {batchSuccessMessage && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-300 text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{batchSuccessMessage}</span>
            </div>
          )}

          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              {savedSuccess && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>BridgeSelect STC Portal Settings saved and synchronized with REC Registry!</span>
                </div>
              )}

              {/* Aggregator & Credentials Card */}
              <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#bef264]" />
                    <span>STC Aggregator &amp; REC Registry Credentials</span>
                  </h4>
                  <span className="text-[11px] text-gray-400">Australian Clean Energy Regulator (CER)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Aggregator Platform Partner
                    </label>
                    <select
                      value={settings.aggregator}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          aggregator: e.target.value as BridgeSelectPortalSettings['aggregator']
                        })
                      }
                      className="w-full text-xs bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white font-medium focus:border-[#bef264] outline-none"
                    >
                      <option value="BridgeSelect">BridgeSelect (Greenbank / REC Registry Direct API)</option>
                      <option value="Formbay">Formbay STC Portal</option>
                      <option value="Greenbank">Greenbank Environmental</option>
                      <option value="TradeSTCs">TradeSTCs Australia</option>
                      <option value="REC Registry Direct">REC Registry Direct (Clean Energy Regulator)</option>
                    </select>
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      Certified gateway facilitating real-time small-scale certificate creation &amp; validation.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      REC Registry Registered Agent ID
                    </label>
                    <input
                      type="text"
                      value={settings.recRegistryAgentId}
                      onChange={e => setSettings({ ...settings, recRegistryAgentId: e.target.value })}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white font-bold focus:border-[#bef264] outline-none"
                      placeholder="CER-AGT-882109"
                      required
                    />
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      Issued by Clean Energy Regulator under the Renewable Energy (Electricity) Act 2000.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      API Access Key / Secret Token
                    </label>
                    <input
                      type="password"
                      value={settings.apiKey}
                      onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-white font-medium focus:border-[#bef264] outline-none"
                      placeholder="bs_live_sec_••••••••••••••••"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Webhook Secret (Real-time Status Callbacks)
                    </label>
                    <input
                      type="text"
                      value={settings.webhookSecret}
                      onChange={e => setSettings({ ...settings, webhookSecret: e.target.value })}
                      className="w-full text-xs font-mono bg-[#121212] border border-[#2d2d2d] rounded-lg px-3 py-2 text-gray-300 focus:border-[#bef264] outline-none"
                      placeholder="whsec_stc_2026_solarflow"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Gateway Environment
                    </label>
                    <div className="flex items-center gap-4 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                        <input
                          type="radio"
                          name="environment"
                          value="production"
                          checked={settings.environment === 'production'}
                          onChange={() => setSettings({ ...settings, environment: 'production' })}
                          className="accent-[#bef264]"
                        />
                        <span>Production (Live STC Trading)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-400">
                        <input
                          type="radio"
                          name="environment"
                          value="staging"
                          checked={settings.environment === 'staging'}
                          onChange={() => setSettings({ ...settings, environment: 'staging' })}
                          className="accent-[#bef264]"
                        />
                        <span>Staging / Sandbox Test</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Default STC Spot Trading Rate ($ AUD / Certificate)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                      <input
                        type="number"
                        step="0.10"
                        min="25"
                        max="40"
                        value={settings.stcSpotRateAud}
                        onChange={e =>
                          setSettings({ ...settings, stcSpotRateAud: parseFloat(e.target.value) || 38.5 })
                        }
                        className="w-full text-xs font-mono pl-7 pr-16 py-2 bg-[#121212] border border-[#2d2d2d] rounded-lg text-white font-bold focus:border-[#bef264] outline-none"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">AUD / STC</span>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      CER ceiling cap is $40.00 AUD. Current market spot trade average is ~$38.50 AUD.
                    </span>
                  </div>
                </div>
              </div>

              {/* Compliance & Mandatory Verification Rules */}
              <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#bef264]" />
                  <span>Mandatory Clean Energy Regulator &amp; SAA Compliance Guardrails</span>
                </h4>
                <p className="text-xs text-gray-400">
                  SolarFlow verifies all audit criteria before allowing STCs to be created or traded to eliminate audit clawbacks.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#121212] border border-[#262626] cursor-pointer hover:border-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.requireCecAccreditation}
                      onChange={e => setSettings({ ...settings, requireCecAccreditation: e.target.checked })}
                      className="mt-0.5 accent-[#bef264]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Clean Energy Council / SAA Accreditation</span>
                      <span className="text-[11px] text-gray-400">
                        Enforce active installer &amp; designer license validation before claim submission.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#121212] border border-[#262626] cursor-pointer hover:border-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.requireSerialVerification}
                      onChange={e => setSettings({ ...settings, requireSerialVerification: e.target.checked })}
                      className="mt-0.5 accent-[#bef264]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">CEC Approved Product List Validation</span>
                      <span className="text-[11px] text-gray-400">
                        Scan panel &amp; inverter serial numbers against Australian CER approved hardware lists.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#121212] border border-[#262626] cursor-pointer hover:border-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.requireGeotaggedPhotos}
                      onChange={e => setSettings({ ...settings, requireGeotaggedPhotos: e.target.checked })}
                      className="mt-0.5 accent-[#bef264]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Geotagged &amp; Timestamped Photo Audit</span>
                      <span className="text-[11px] text-gray-400">
                        Requires verified EXIF GPS coordinates on Array, Inverter &amp; Switchboard installation photos.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#121212] border border-[#262626] cursor-pointer hover:border-gray-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={settings.requireDigitalSignature}
                      onChange={e => setSettings({ ...settings, requireDigitalSignature: e.target.checked })}
                      className="mt-0.5 accent-[#bef264]"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Digital STC Assignment Agreement</span>
                      <span className="text-[11px] text-gray-400">
                        Requires customer digital signature assigning STC certificate creation rights to installer.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="p-3 bg-[#121212] rounded-lg border border-[#262626] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#bef264]" />
                    <span className="text-xs font-bold text-white">
                      Auto-submit STC claim upon Project Stage set to "Completed"
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoSubmitOnCompletion}
                      onChange={e => setSettings({ ...settings, autoSubmitOnCompletion: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#2d2d2d] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#121212] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#bef264]"></div>
                  </label>
                </div>
              </div>

              {/* Submit / Action Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isPinging}
                  className="px-3.5 py-2 rounded-lg bg-[#262626] hover:bg-[#333] text-gray-200 border border-[#333] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#bef264] ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Testing CER Connection...' : 'Test BridgeSelect API Ping'}</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#bef264] hover:bg-[#a3e635] text-black font-bold text-xs rounded-lg shadow-xs transition-colors"
                >
                  Save STC Portal Settings
                </button>
              </div>

              {pingResult && (
                <div className="p-3.5 bg-[#141414] border border-[#2d2d2d] rounded-xl text-xs text-gray-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{pingResult.message}</span>
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">Latency: {pingResult.latencyMs}ms</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#262626] text-[11px]">
                    <div>
                      <span className="text-gray-400 block">REC Registry API:</span>
                      <strong className="text-emerald-400">{pingResult.recRegistryStatus}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Spot STC Feed:</span>
                      <strong className="text-white">${pingResult.spotRateAud.toFixed(2)} AUD</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Deeming Multiplier:</span>
                      <strong className="text-[#bef264] font-mono">{pingResult.currentDeemingMultiplier.toFixed(3)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Verified At:</span>
                      <strong className="text-gray-300">{pingResult.timestamp}</strong>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 2: LIVE CLAIMS & BATCH LODGEMENT */}
          {activeTab === 'claims' && (
            <div className="space-y-4">
              {/* Batch Summary Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#1b2713] to-[#161616] border border-[#bef264]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#bef264]" />
                    <h4 className="font-bold text-sm text-white">
                      BridgeSelect STC Batch Processing Queue
                    </h4>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    {eligibleProjects.length} projects ready for immediate Clean Energy Regulator lodgement
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Batch STC Value</span>
                    <span className="text-lg font-extrabold text-[#bef264]">
                      ${totalEligibleValueAud.toLocaleString()} AUD
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono block">({totalEligibleSTCs} STCs)</span>
                  </div>

                  <button
                    onClick={handleBatchSubmit}
                    disabled={isBatchSubmitting || eligibleProjects.length === 0}
                    className="px-4 py-2.5 bg-[#bef264] hover:bg-[#a3e635] disabled:opacity-50 text-black font-extrabold text-xs rounded-lg shadow-md flex items-center gap-2 transition-colors"
                  >
                    {isBatchSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>{isBatchSubmitting ? 'Lodging Batch to CER...' : 'Lodge Batch to BridgeSelect'}</span>
                  </button>
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-[#161616] rounded-xl border border-[#262626] overflow-hidden">
                <div className="p-3 bg-[#121212] border-b border-[#262626] flex items-center justify-between text-xs text-gray-400">
                  <span className="font-bold text-white">Active Solar Installation Projects &amp; STC Claims</span>
                  <span>Zone 3 Multiplier: 1.382 × 5 Years Deeming</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#181818] text-gray-400 border-b border-[#262626] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Project / Customer</th>
                        <th className="p-3">System kW</th>
                        <th className="p-3">Certificates</th>
                        <th className="p-3">Rebate Value</th>
                        <th className="p-3">Compliance Checks</th>
                        <th className="p-3">BridgeSelect Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626]">
                      {projectEvaluations.map(evalItem => (
                        <tr key={evalItem.projectId} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-white block">{evalItem.projectCode}</span>
                            <span className="text-[11px] text-gray-400">{evalItem.customerName}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-gray-200">{evalItem.systemSizeKw} kW</span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-bold text-white">{evalItem.stcCount} STCs</span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono font-bold text-[#bef264]">
                              ${evalItem.stcValueAud.toLocaleString()} AUD
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                title="CEC Installer"
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  evalItem.passedChecks.cecInstaller
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                CEC
                              </span>
                              <span
                                title="SAA License"
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  evalItem.passedChecks.saaLicense
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                SAA
                              </span>
                              <span
                                title="Geotagged Photos"
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  evalItem.passedChecks.geotaggedPhotos
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                GPS Photos
                              </span>
                              <span
                                title="Customer Signature"
                                className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                  evalItem.passedChecks.customerSignature
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}
                              >
                                Signed
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                evalItem.status.includes('Approved') || evalItem.status.includes('Paid')
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : evalItem.status.includes('Submitted')
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {evalItem.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {evalItem.status.includes('Approved') || evalItem.status.includes('Paid') ? (
                              <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Paid</span>
                              </span>
                            ) : evalItem.status.includes('Submitted') ? (
                              <span className="text-[11px] text-blue-400 font-bold">In Audit</span>
                            ) : (
                              <button
                                onClick={() => handleSingleProjectLodgement(evalItem.projectId)}
                                className="px-2.5 py-1 bg-[#bef264] hover:bg-[#a3e635] text-black font-bold text-[11px] rounded transition-colors"
                              >
                                Lodge Claim
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HEALTH & RULES */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#bef264]" />
                    <span>Australian Clean Energy Regulator Formula &amp; Deeming Rules</span>
                  </h4>
                  <span className="text-xs text-emerald-400 font-bold">National Zone 3 Multiplier: 1.382</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Under the Small-scale Renewable Energy Scheme (SRES), eligible solar PV installations generate Small-scale Technology Certificates (STCs) according to the rated system capacity in kW DC, the geographical solar rating zone multiplier, and the deeming period remaining in the scheme (which phases down to 0 certificates by 2030).
                </p>

                <div className="p-3 bg-[#121212] rounded-lg border border-[#262626] font-mono text-xs text-white space-y-1">
                  <span className="text-gray-400 block text-[11px]">Official Statutory Formula:</span>
                  <strong className="text-[#bef264] text-sm">
                    STCs = Round( Rated Capacity (kW) × Zone Rating (1.382) × Deeming Period (5 Years) )
                  </strong>
                  <p className="text-gray-400 text-[11px] pt-1">
                    Example: 10kW System generates 10 × 1.382 × 5 = 69.1 ≈ <strong>69 to 110 STCs</strong> (depending on postcodes NSW/QLD).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">REC Registry Status</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-lg font-extrabold text-white">ONLINE</p>
                  <p className="text-[11px] text-gray-400">Canberra Data Center Gateway</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Current Deeming Year</span>
                    <Award className="w-4 h-4 text-[#bef264]" />
                  </div>
                  <p className="text-lg font-extrabold text-[#bef264]">2026 (5 Years)</p>
                  <p className="text-[11px] text-gray-400">Valid through 31 Dec 2026</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">BridgeSelect Gateway</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-lg font-extrabold text-white">v2.4 Certified</p>
                  <p className="text-[11px] text-gray-400">Encrypted Mutual TLS (mTLS)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#161616] border-t border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-[#bef264]" />
            <span>Agent ID: {settings.recRegistryAgentId}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#262626] hover:bg-[#333] text-white transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
