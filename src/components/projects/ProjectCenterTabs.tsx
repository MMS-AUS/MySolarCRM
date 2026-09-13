import React, { useState } from 'react';
import { Project, LeadActivity, LeadActivityType } from '../../types';
import {
  Activity,
  FileText,
  Mail,
  Phone,
  CheckSquare,
  Calendar,
  Sparkles,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  DollarSign,
  Sun,
  Eye,
  ArrowRight,
  ExternalLink,
  Wrench,
  Truck,
  ShieldCheck,
  Send,
  Zap,
  Building2,
  Layers,
  Check
} from 'lucide-react';
import { formatAudAccounts, parseAudAccounts } from '../../utils/australianPostcodes';
import { ProjectFormData } from './ProjectDetailsLeftPanel';

interface ProjectCenterTabsProps {
  project?: Project | null;
  formData: ProjectFormData;
  activities: LeadActivity[];
  onAddActivity: (activity: Omit<LeadActivity, 'id' | 'createdAt'>) => void;
  onToggleTask: (activityId: string) => void;
  onDeleteActivity: (activityId: string) => void;
}

export const ProjectCenterTabs: React.FC<ProjectCenterTabsProps> = ({
  project,
  formData,
  activities,
  onAddActivity,
  onToggleTask,
  onDeleteActivity
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities'>('overview');
  const [activityFilter, setActivityFilter] = useState<'All' | LeadActivityType>('All');

  // Activity logger state
  const [showLogger, setShowLogger] = useState(false);
  const [loggerType, setLoggerType] = useState<LeadActivityType>('Note');
  const [loggerTitle, setLoggerTitle] = useState('');
  const [loggerDescription, setLoggerDescription] = useState('');
  const [loggerCallOutcome, setLoggerCallOutcome] = useState('Connected');
  const [loggerCallDuration, setLoggerCallDuration] = useState('5m');
  const [loggerTaskDueDate, setLoggerTaskDueDate] = useState('');
  const [loggerTaskPriority, setLoggerTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [loggerMeetingDate, setLoggerMeetingDate] = useState('');
  const [loggerMeetingLocation, setLoggerMeetingLocation] = useState('Site Installation / Pre-inspection');
  const [quickNoteText, setQuickNoteText] = useState('');

  // Financial calculations
  const parsedSelling = parseAudAccounts(formData.amount || formData.sellingPrice);
  const parsedDeposit = parseAudAccounts(formData.deposit);
  const balanceDue = Math.max(0, parsedSelling - parsedDeposit);
  const estStcRebate = Math.round((Number(formData.systemSizeKw) || 6.6) * 380);

  const filteredActivities = activities.filter(a => {
    if (activityFilter === 'All') return true;
    return a.type === activityFilter;
  });

  const handleSaveActivity = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loggerDescription.trim() && !loggerTitle.trim()) return;

    let finalTitle = loggerTitle.trim();
    if (!finalTitle) {
      if (loggerType === 'Call') finalTitle = `Phone Call (${loggerCallOutcome})`;
      else if (loggerType === 'Meeting') finalTitle = `Site Meeting: ${loggerMeetingLocation}`;
      else if (loggerType === 'Task') finalTitle = `Task: ${loggerDescription.slice(0, 30)}...`;
      else if (loggerType === 'Email') finalTitle = 'Customer Email Sent';
      else finalTitle = 'Project Team Note';
    }

    onAddActivity({
      leadId: project?.id || 'proj-active',
      type: loggerType,
      title: finalTitle,
      description: loggerDescription.trim(),
      createdBy: formData.salesPersonName || 'Project Lead',
      callOutcome: loggerType === 'Call' ? loggerCallOutcome : undefined,
      callDuration: loggerType === 'Call' ? loggerCallDuration : undefined,
      dueDate: loggerType === 'Task' ? loggerTaskDueDate : undefined,
      completed: loggerType === 'Task' ? false : undefined,
      priority: loggerType === 'Task' ? loggerTaskPriority : undefined,
      meetingDate: loggerType === 'Meeting' ? loggerMeetingDate : undefined,
      meetingLocation: loggerType === 'Meeting' ? loggerMeetingLocation : undefined
    });

    // Reset logger
    setLoggerTitle('');
    setLoggerDescription('');
    setShowLogger(false);
  };

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;

    onAddActivity({
      leadId: project?.id || 'proj-active',
      type: 'Note',
      title: 'Quick Activity Note',
      description: quickNoteText.trim(),
      createdBy: formData.salesPersonName || 'Project Lead'
    });

    setQuickNoteText('');
  };

  const getActivityIcon = (type: LeadActivityType) => {
    switch (type) {
      case 'Note':
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-amber-400" />;
      case 'Call':
        return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Task':
        return <CheckSquare className="w-3.5 h-3.5 text-purple-400" />;
      case 'Meeting':
        return <Calendar className="w-3.5 h-3.5 text-rose-400" />;
      case 'Status Change':
        return <Sparkles className="w-3.5 h-3.5 text-[#bef264]" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Tabs Controller */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-3 shrink-0">
        <div className="flex items-center gap-1.5 p-1 bg-[#141414] rounded-xl border border-[#2e2e2e]">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-[#282828] text-white shadow-sm border border-[#3e3e3e]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#bef264]" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'activities'
                ? 'bg-[#282828] text-white shadow-sm border border-[#3e3e3e]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#bef264]" />
            <span>Activities</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1b1b1b] text-[#bef264] border border-[#bef26430]">
              {activities.length}
            </span>
          </button>
        </div>

        {/* Quick actions in tab header */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('activities');
              setLoggerType('Note');
              setShowLogger(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[11px] font-medium text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3 text-[#bef264]" />
            <span>Log Note</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('activities');
              setLoggerType('Call');
              setShowLogger(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[11px] font-medium text-gray-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>Log Call</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5 overflow-y-auto pr-1 custom-scrollbar">
          {/* 1. DATA HIGHLIGHTS & METRICS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#bef264]" />
                Project Highlights &amp; Metrics
              </h3>
              <span className="text-[11px] font-mono text-[#bef264] bg-[#bef26410] px-2 py-0.5 rounded border border-[#bef26425]">
                Stage: {formData.projectStage}
              </span>
            </div>

            {/* Metric Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Financial Highlights */}
              <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#222] pb-2">
                  <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Financial Highlights
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">AUD Accounts</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Contract Value</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {formData.amount || formData.sellingPrice || '$0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Deposit Paid</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {formData.deposit || '$0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Balance Due</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      ${formatAudAccounts(balanceDue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Est. STC Rebate</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">
                      ~${formatAudAccounts(estStcRebate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hardware & Site Snapshot */}
              <div className="p-4 bg-[#141414] border border-[#2a2a2a] rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#222] pb-2">
                  <span className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Hardware &amp; System Specs
                  </span>
                  <span className="text-[10px] font-mono text-[#bef264]">{formData.systemSizeKw} kW Array</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Inverter</span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {formData.inverterManufacturer || 'Sungrow'} ({formData.inverterSizeKw || '5.0'}kW)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Panels</span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {formData.noOfPanels || 15}x {formData.panelManufacturer || 'AIKO'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Storage Battery</span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {formData.batteryManufacturer
                        ? `${formData.batteryManufacturer} (${formData.usableCapacity || '10'}kWh)`
                        : 'None Installed'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Phase / Roof</span>
                    <span className="text-xs font-semibold text-white block truncate">
                      {formData.phase || 'Single Phase'} • {formData.roofType || 'Tile'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Status Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#141414] border border-[#2a2a2a] rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Installation Status</span>
                <span className="text-xs font-bold text-sky-400 mt-0.5 block truncate">
                  {formData.installationStatus || 'Unscheduled'}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  {formData.installationDate ? `Date: ${formData.installationDate}` : 'Date pending'}
                </span>
              </div>

              <div className="p-3 bg-[#141414] border border-[#2a2a2a] rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">DNSP Grid Pre-Approval</span>
                <span className="text-xs font-bold text-amber-400 mt-0.5 block truncate">
                  {formData.gridAppStatus || 'Not Started'}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  {formData.electricityDistributor || 'Ausgrid'}
                </span>
              </div>

              <div className="p-3 bg-[#141414] border border-[#2a2a2a] rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">STC Trading Portal</span>
                <span className="text-xs font-bold text-[#bef264] mt-0.5 block truncate">
                  {formData.stcStatus || 'Pending Upload'}
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  {formData.stcTradedPortal || 'BridgeSelect'}
                </span>
              </div>
            </div>
          </div>

          {/* OpenSolar & Engineering Direct Links */}
          <div className="p-3 bg-[#141414] border border-[#2a2a2a] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Sun className="w-4 h-4 shrink-0" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">OpenSolar Proposal &amp; SLD Design</div>
                <div className="text-[11px] text-gray-400 font-mono">
                  Proposal ID: {project?.openSolarProposalId || `OS-PROP-2026-${formData.projectNumber || '101'}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {project?.openSolarContractSigned ? (
                <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Contract Signed</span>
                </span>
              ) : (
                <span className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-lg font-medium">
                  Contract Pending
                </span>
              )}
              <a
                href={`https://app.opensolar.com/#/projects/${project?.openSolarProposalId || 'demo'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-[#222] hover:bg-[#2c2c2c] border border-[#333] text-gray-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Open in OpenSolar</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Quick Note Input Box */}
          <form onSubmit={handleQuickNoteSubmit} className="p-3 bg-[#141414] border border-[#282828] rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-gray-300">Quick Activity Note</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={quickNoteText}
                onChange={e => setQuickNoteText(e.target.value)}
                placeholder="Log a quick customer conversation or project update..."
                className="flex-1 px-3 py-2 bg-[#101010] border border-[#333] rounded-lg text-xs text-white placeholder-gray-500 focus:border-[#bef264] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!quickNoteText.trim()}
                className="px-3.5 py-2 bg-[#bef264] hover:bg-[#aee653] disabled:opacity-40 disabled:hover:bg-[#bef264] text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Post</span>
              </button>
            </div>
          </form>

          {/* Recent Activities Snapshot */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Recent Activity Timeline
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className="text-xs text-[#bef264] hover:underline flex items-center gap-1 font-medium"
              >
                <span>View all ({activities.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="p-6 text-center bg-[#141414] border border-dashed border-[#282828] rounded-xl">
                <Activity className="w-6 h-6 text-gray-600 mx-auto mb-1.5" />
                <p className="text-xs text-gray-400">No activities logged yet.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('activities');
                    setShowLogger(true);
                  }}
                  className="mt-2 text-xs text-[#bef264] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  <Plus className="w-3 h-3" /> Log first interaction
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {activities.slice(0, 3).map(activity => (
                  <div
                    key={activity.id}
                    className="p-3 bg-[#141414] border border-[#262626] rounded-xl flex items-start justify-between gap-3 text-xs hover:border-[#383838] transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-[#202020] border border-[#333] shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate text-xs">{activity.title}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#222] text-gray-400 border border-[#333]">
                            {activity.type}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">
                            {activity.description}
                          </p>
                        )}
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          By {activity.createdBy || 'Project Lead'} &bull; {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
          {/* Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#262626]">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['All', 'Note', 'Email', 'Call', 'Task', 'Meeting', 'Status Change'] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActivityFilter(filter as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    activityFilter === filter
                      ? 'bg-[#bef264] text-slate-950 font-bold'
                      : 'bg-[#181818] hover:bg-[#242424] text-gray-400 hover:text-white border border-[#2e2e2e]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {!showLogger && (
              <button
                type="button"
                onClick={() => setShowLogger(true)}
                className="flex items-center gap-1 text-xs bg-[#bef264] hover:bg-[#aee653] text-slate-950 px-2.5 py-1 rounded-lg font-bold transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Activity</span>
              </button>
            )}
          </div>

          {/* Interactive Activity Logger Box */}
          {showLogger && (
            <form
              onSubmit={handleSaveActivity}
              className="p-4 bg-[#141414] border border-[#bef26450] rounded-xl space-y-3.5 shadow-xl animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-[#bef264]">Log:</span>
                  {(['Note', 'Email', 'Call', 'Task', 'Meeting'] as LeadActivityType[]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLoggerType(t)}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                        loggerType === t
                          ? 'bg-[#282828] text-white border border-[#444]'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowLogger(false)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  value={loggerTitle}
                  onChange={e => setLoggerTitle(e.target.value)}
                  placeholder={`e.g. ${
                    loggerType === 'Call'
                      ? 'Discussed inverter placement with electrician'
                      : loggerType === 'Task'
                      ? 'Follow up DNSP pre-approval certificate'
                      : loggerType === 'Meeting'
                      ? 'Pre-install roof framing inspection'
                      : 'Customer confirmed roof access arrangements'
                  }`}
                  className="w-full px-3 py-2 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                />
              </div>

              {loggerType === 'Call' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Call Outcome</label>
                    <select
                      value={loggerCallOutcome}
                      onChange={e => setLoggerCallOutcome(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                    >
                      <option value="Connected">Connected</option>
                      <option value="Left Voicemail">Left Voicemail</option>
                      <option value="No Answer">No Answer</option>
                      <option value="Busy">Busy</option>
                      <option value="Wrong Number">Wrong Number</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Duration</label>
                    <input
                      type="text"
                      value={loggerCallDuration}
                      onChange={e => setLoggerCallDuration(e.target.value)}
                      placeholder="5m"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {loggerType === 'Task' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={loggerTaskDueDate}
                      onChange={e => setLoggerTaskDueDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                    <select
                      value={loggerTaskPriority}
                      onChange={e => setLoggerTaskPriority(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              )}

              {loggerType === 'Meeting' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Meeting Date / Time</label>
                    <input
                      type="datetime-local"
                      value={loggerMeetingDate}
                      onChange={e => setLoggerMeetingDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={loggerMeetingLocation}
                      onChange={e => setLoggerMeetingLocation(e.target.value)}
                      placeholder="Site Installation / Pre-inspection"
                      className="w-full px-3 py-1.5 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={loggerDescription}
                  onChange={e => setLoggerDescription(e.target.value)}
                  placeholder="Enter detailed outcome or notes..."
                  className="w-full px-3 py-1.5 bg-[#101010] border border-[#333] rounded-lg text-xs text-white focus:border-[#bef264] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLogger(false)}
                  className="px-3 py-1 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#bef264] hover:bg-[#aee653] text-slate-950 font-bold rounded-lg text-xs shadow transition-colors"
                >
                  Save Activity
                </button>
              </div>
            </form>
          )}

          {/* Filtered Activity List */}
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center bg-[#141414] border border-dashed border-[#282828] rounded-xl">
              <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-xs text-gray-400">
                No {activityFilter === 'All' ? '' : activityFilter} activities logged.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map(act => (
                <div
                  key={act.id}
                  className="p-3.5 bg-[#141414] border border-[#262626] rounded-xl space-y-2 hover:border-[#383838] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#202020] border border-[#333]">
                        {getActivityIcon(act.type)}
                      </div>

                      <div>
                        <span className="font-semibold text-xs text-white">{act.title}</span>
                        <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span>Logged by {act.createdBy || 'Staff'}</span>
                          <span>•</span>
                          <span>{new Date(act.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {act.type === 'Task' && (
                        <button
                          type="button"
                          onClick={() => onToggleTask(act.id)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                            act.completed
                              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                              : 'bg-[#222] text-gray-300 hover:bg-[#2c2c2c] border border-[#333]'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{act.completed ? 'Completed' : 'Mark Done'}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteActivity(act.id)}
                        className="p-1 text-gray-500 hover:text-rose-400 rounded transition-colors"
                        title="Delete activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {act.description && (
                    <p className="text-xs text-gray-300 pl-6 border-l-2 border-[#2a2a2a] ml-2 whitespace-pre-line">
                      {act.description}
                    </p>
                  )}

                  {/* Metadata tags */}
                  <div className="flex items-center gap-2 pl-6 ml-2 text-[11px] text-gray-400 flex-wrap">
                    {act.callOutcome && (
                      <span className="px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-[#333] text-emerald-400">
                        Outcome: {act.callOutcome} ({act.callDuration || '5m'})
                      </span>
                    )}
                    {act.dueDate && (
                      <span className="px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-[#333] text-purple-400">
                        Due: {act.dueDate} &bull; {act.priority || 'Medium'}
                      </span>
                    )}
                    {act.meetingDate && (
                      <span className="px-1.5 py-0.5 rounded bg-[#1c1c1c] border border-[#333] text-rose-400">
                        {act.meetingDate} &bull; {act.meetingLocation}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
