import {
  UserProfile,
  Contact,
  Company,
  Lead,
  Project,
  Ticket,
  MaintenanceRecord,
  SubContractor,
  SalesOrder,
  InstallOrder,
  CustomerReview,
  MessageMediaSMS,
  VoIPCallLog,
  DynamicDropdownConfig,
  LeaveRequest,
  IntegrationConfig,
  ReferralBonus,
  CompanyProfile,
  AppNotification,
  RoleAccessConfig,
  SystemFeatureConfig,
  DynamicRoleConfig,
  SystemOperationalRules,
  PortalAddressConfig,
  SystemPortalAddresses
} from '../types';

export const INITIAL_COMPANY_PROFILE: CompanyProfile = {
  companyName: 'My Solar CRM',
  legalName: 'My Solar CRM Australia Pty Ltd',
  abn: '52 619 840 231',
  acn: '619 840 231',
  logoUrl: '',
  headerLogoUrl: '',
  loginLogoUrl: '',
  logoPreset: 'sun',
  headerLogoPreset: 'sun',
  loginLogoPreset: 'sun',
  primaryColor: '#f59e0b',
  accentColor: '#38bdf8',
  tagline: "Australia's Premier Solar & Battery Energy Management CRM",
  email: 'operations@mysolarcrm.com.au',
  phone: '1300 852 400',
  website: 'https://mysolarcrm.com.au',
  address: 'Level 14, 100 Pacific Highway, North Sydney NSW 2060',
  cecRetailerNumber: 'CEC-RET-94281',
  portalWelcomeText: 'Welcome to the My Solar Customer Portal. Track your solar installation, view your signed contract, and monitor savings.',
  portalBannerUrl: ''
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'New Inbound Lead',
    message: 'Sarah Jenkins requested a quote for a 10.4kW AIKO System + Tesla Powerwall 3 in Sydney.',
    timestamp: '10m ago',
    type: 'lead',
    read: false,
    targetSection: 'leads',
    targetId: 'lead-1'
  },
  {
    id: 'notif-2',
    title: 'Project Milestone Reached',
    message: 'Project SOL-NSW-1042 (Marcus Thorne) completed installation. Ready for BridgeSelect STC claim ($3,920 AUD).',
    timestamp: '35m ago',
    type: 'project',
    read: false,
    targetSection: 'projects',
    targetId: 'proj-1'
  },
  {
    id: 'notif-3',
    title: 'Referral Bonus Approved for EFT',
    message: 'Referral bonus REF-2026-001 ($500 AUD) for Sarah Jenkins approved. Ready for banking batch release.',
    timestamp: '2h ago',
    type: 'referral',
    read: false,
    targetSection: 'referrals',
    targetId: 'ref-1'
  },
  {
    id: 'notif-4',
    title: 'Support Ticket Urgent Alert',
    message: 'Inverter Fault (Code 402) submitted by David Wilson for 6.6kW Sungrow system in Brisbane.',
    timestamp: '4h ago',
    type: 'ticket',
    read: false,
    targetSection: 'tickets',
    targetId: 'tick-1'
  },
  {
    id: 'notif-5',
    title: '2-Year Maintenance Due',
    message: 'System at 14 Carrington Rd, Cronulla NSW is now due for its 24-month CEC checkup.',
    timestamp: '1d ago',
    type: 'maintenance',
    read: true,
    targetSection: 'maintenance',
    targetId: 'maint-1'
  }
];

export const INITIAL_ACCESS_ROLES: RoleAccessConfig[] = [
  {
    role: 'admin',
    roleName: 'System Administrator',
    description: 'Full unconstrained access to all ERP modules, P&L, HRMS, and settings.',
    canViewLeads: true,
    canEditLeads: true,
    canViewProjects: true,
    canEditProjects: true,
    canViewTickets: true,
    canResolveTickets: true,
    canViewFinancials: true,
    canManageSettings: true,
    canAccessPortals: true
  },
  {
    role: 'manager',
    roleName: 'Operations & Sales Manager',
    description: 'Pipeline oversight, RFQ management, installer dispatch, and team coordination.',
    canViewLeads: true,
    canEditLeads: true,
    canViewProjects: true,
    canEditProjects: true,
    canViewTickets: true,
    canResolveTickets: true,
    canViewFinancials: true,
    canManageSettings: false,
    canAccessPortals: true
  },
  {
    role: 'employee',
    roleName: 'Sales & Field Representative',
    description: 'Leads prospecting, customer communication, survey scheduling, and site notes.',
    canViewLeads: true,
    canEditLeads: true,
    canViewProjects: true,
    canEditProjects: false,
    canViewTickets: true,
    canResolveTickets: false,
    canViewFinancials: false,
    canManageSettings: false,
    canAccessPortals: false
  },
  {
    role: 'installer',
    roleName: 'Subcontractor Installer',
    description: 'Access to assigned work orders, quote submission, and photo uploads.',
    canViewLeads: false,
    canEditLeads: false,
    canViewProjects: true,
    canEditProjects: false,
    canViewTickets: false,
    canResolveTickets: false,
    canViewFinancials: false,
    canManageSettings: false,
    canAccessPortals: true
  },
  {
    role: 'customer',
    roleName: 'Customer (Self-Service)',
    description: 'Live project tracking, signed proposal review, invoices, and review submission.',
    canViewLeads: false,
    canEditLeads: false,
    canViewProjects: true,
    canEditProjects: false,
    canViewTickets: true,
    canResolveTickets: false,
    canViewFinancials: false,
    canManageSettings: false,
    canAccessPortals: true
  }
];

export const INITIAL_DROPDOWNS: DynamicDropdownConfig = {
  panelBrands: ['AIKO Solar', 'Jinko Solar (Tiger Neo)', 'Trina Solar (Vertex S+)', 'Canadian Solar', 'LONGi Solar', 'REC Alpha Pure'],
  inverterBrands: ['Fronius (Primo/Symo Gen24)', 'Sungrow (SG/SH Series)', 'Enphase (IQ8 Microinverters)', 'SolarEdge (Home Wave)', 'Sigenergy (SigenStor)', 'GoodWe'],
  batteryBrands: ['Tesla Powerwall 3 (13.5kWh)', 'Sungrow SBR Battery (9.6kWh - 19.2kWh)', 'Sigenergy SigenStor (8kWh - 48kWh)', 'BYD Battery-Box Premium', 'Enphase IQ Battery 5P'],
  leadSources: ['Meta Ads (NSW High Efficiency)', 'Meta Ads (QLD Battery Rebate)', 'Google Search & PMax', 'OpenSolar Lead Form', 'Customer Referral', 'SolarQuotes.com.au'],
  roofTypes: ['Colorbond / Metal Sheet', 'Concrete Tile', 'Terracotta Tile', 'Klip-lok Metal', 'Slate', 'Commercial Flat Roof'],
  projectStatuses: [
    'Site Survey',
    'Engineering & DNSP Approval',
    'Sales Order Dispatched',
    'RFQ Sent to Installers',
    'Install Scheduled',
    'Installation in Progress',
    'Installation Completed',
    'BridgeSelect STC Claimed',
    'Grid Meter Connected',
    'Completed'
  ],
  ticketCategories: [
    'Inverter Fault / Error Code',
    'WiFi Monitoring Drop',
    'Panel Damage / Shading',
    'Switchboard Trip',
    'Roof Leak Inspection',
    'General Query'
  ],
  ticketPriorities: ['Low', 'Medium', 'High', 'Urgent'],
  dnspsNSW: ['Ausgrid (Sydney/Central Coast/Hunter)', 'Endeavour Energy (Western Sydney/South Coast)', 'Essential Energy (Regional NSW)'],
  dnspsQLD: ['Energex (South East QLD/Brisbane/Gold Coast)', 'Ergon Energy (Regional QLD)'],
  employeeDepartments: ['Management', 'Sales', 'Operations', 'Warehouse', 'Customer Support', 'Engineering'],
  referralPaymentStatuses: ['Pending Review', 'Approved for Payment', 'Paid via EFT', 'On Hold', 'Rejected'],
  states: ['NSW', 'QLD', 'VIC', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
  contactTypes: ['Residential', 'Commercial', 'Subcontractor', 'Vendor', 'Government / Council', 'Partner'],
  companyTypes: ['Commercial Customer', 'Subcontractor Installer', 'Equipment Vendor', 'Engineering Consultant', 'Wholesaler / Distributor'],
  platforms: [
    'Meta Lead Ads (Facebook/Instagram)',
    'Google Search & PMax Ads',
    'Website Inbound Form',
    'OpenSolar Lead Form',
    'Customer Referral',
    'Direct Phone Call (Inbound)',
    'Door to Door / Field Sales',
    'SolarQuotes.com.au Partner'
  ],
  salesPersons: [
    'Mitchell Barnes',
    'Chloe Gallagher',
    'Akash Mohite',
    'Liam Evans',
    'Jessica Wu',
    'Marcus Vance',
    'Sarah Jenkins'
  ],
  leadStatuses: [
    'New',
    'Contacted',
    'Site Survey Scheduled',
    'Proposal Sent',
    'Contract Signed',
    'Deposit Received',
    'Converted to Project',
    'Lost'
  ],
  houseStoreys: [
    'Single Storey',
    'Double Storey',
    'Triple Storey',
    'Split Level',
    'Commercial Multi-Level'
  ],
  phases: [
    'Single Phase',
    'Three Phase',
    'Split Phase'
  ],
  docsReceivedOptions: [
    'Yes',
    'No',
    'Partially Received',
    'Pending DNSP Pre-Approval',
    'Pending Council DA / Heritage'
  ],
  existingSystemTemplates: [
    'No existing solar installed (Brand new installation)',
    'Existing 1.5kW System with 8 x 190W panels + Sharp Inverter (To be decommissioned)',
    'Existing 3.0kW System with 12 x 250W panels + Sunny Boy Inverter (Retain existing string)',
    'Existing 5.0kW System with 15 x 330W panels + Fronius Primo (Add AC Coupled Battery)',
    'Existing 6.6kW System with 18 x 370W panels + Sungrow SG5.0RS (Upgrade to Hybrid & Battery)',
    'Existing Solar Hot Water system on North pitch (Roof space constraint)',
    'Existing 3-Phase Solar 10kW with SolarEdge Optimizers'
  ],
  panelHierarchy: [
    { id: 'ph-1', manufacturer: 'AIKO Solar', sizeW: 440, series: 'Neostar 2P', model: 'AIKO-A440-MAH54Mb (All-Black N-Type ABC)' },
    { id: 'ph-2', manufacturer: 'AIKO Solar', sizeW: 450, series: 'Neostar 2S', model: 'AIKO-A450-MAH54Mb (High Efficiency ABC)' },
    { id: 'ph-3', manufacturer: 'AIKO Solar', sizeW: 475, series: 'Stellar Series', model: 'AIKO-A475-MAH60Mb (Commercial & Large Roof)' },
    { id: 'ph-4', manufacturer: 'Jinko Solar (Tiger Neo)', sizeW: 440, series: 'Tiger Neo N-Type 54HL4R', model: 'JKM440N-54HL4R-B (Full Black)' },
    { id: 'ph-5', manufacturer: 'Jinko Solar (Tiger Neo)', sizeW: 475, series: 'Tiger Neo N-Type 60HL4', model: 'JKM475N-60HL4-V (Silver Frame)' },
    { id: 'ph-6', manufacturer: 'Trina Solar (Vertex S+)', sizeW: 440, series: 'Vertex S+ Dual Glass', model: 'TSM-440NEG9R.28 (Clear Black N-Type)' },
    { id: 'ph-7', manufacturer: 'Trina Solar (Vertex S+)', sizeW: 450, series: 'Vertex S+ Dual Glass', model: 'TSM-450NEG9R.28 (High Output)' },
    { id: 'ph-8', manufacturer: 'Trina Solar (Vertex S+)', sizeW: 500, series: 'Vertex S+ Ultra', model: 'TSM-500NEG18R.20 (Bifacial Commercial)' },
    { id: 'ph-9', manufacturer: 'Canadian Solar', sizeW: 415, series: 'HiKu6 Mono PERC', model: 'CS6R-415MS (Reliable All-Weather)' },
    { id: 'ph-10', manufacturer: 'Canadian Solar', sizeW: 440, series: 'TOPHiKu6 N-Type', model: 'CS6R-440T (N-Type TOPCon Dual-Glass)' },
    { id: 'ph-11', manufacturer: 'LONGi Solar', sizeW: 435, series: 'Hi-MO X6 Explorer', model: 'LR5-54HTB-435M (HPBC Black)' },
    { id: 'ph-12', manufacturer: 'LONGi Solar', sizeW: 450, series: 'Hi-MO 7 Bifacial', model: 'LR5-72HGD-450M (Commercial N-Type)' },
    { id: 'ph-13', manufacturer: 'REC Alpha Pure', sizeW: 430, series: 'Alpha Pure-R Series', model: 'REC430AA Pure-R (Heterojunction HJT Lead-Free)' },
    { id: 'ph-14', manufacturer: 'REC Alpha Pure', sizeW: 470, series: 'Alpha Pure-RX Series', model: 'REC470AA Pure-RX (Premium High Density)' }
  ],
  inverterHierarchy: [
    { id: 'ih-1', manufacturer: 'Fronius (Primo/Symo Gen24)', sizeKw: 5.0, model: 'Primo GEN24 5.0 Plus (Single Phase Hybrid Ready)' },
    { id: 'ih-2', manufacturer: 'Fronius (Primo/Symo Gen24)', sizeKw: 6.0, model: 'Primo GEN24 6.0 Plus (Single Phase)' },
    { id: 'ih-3', manufacturer: 'Fronius (Primo/Symo Gen24)', sizeKw: 8.2, model: 'Primo 8.2-1 (High Yield Single Phase)' },
    { id: 'ih-4', manufacturer: 'Fronius (Primo/Symo Gen24)', sizeKw: 10.0, model: 'Symo GEN24 10.0 Plus (Three Phase Hybrid)' },
    { id: 'ih-5', manufacturer: 'Sungrow (SG/SH Series)', sizeKw: 5.0, model: 'SG5.0RS-ADA (Single Phase Dual MPPT String)' },
    { id: 'ih-6', manufacturer: 'Sungrow (SG/SH Series)', sizeKw: 5.0, model: 'SH5.0RS Hybrid (Single Phase Battery Ready)' },
    { id: 'ih-7', manufacturer: 'Sungrow (SG/SH Series)', sizeKw: 8.0, model: 'SH8.0RT-20 (Three Phase High Voltage Hybrid)' },
    { id: 'ih-8', manufacturer: 'Sungrow (SG/SH Series)', sizeKw: 10.0, model: 'SH10RT-20 (Three Phase High Voltage Hybrid)' },
    { id: 'ih-9', manufacturer: 'Enphase (IQ8 Microinverters)', sizeKw: 5.0, model: 'IQ8AC Microinverter Array (5.0kW Peak Grid-Forming)' },
    { id: 'ih-10', manufacturer: 'Enphase (IQ8 Microinverters)', sizeKw: 10.0, model: 'IQ8HC Microinverter Commercial Array (10.0kW Peak)' },
    { id: 'ih-11', manufacturer: 'SolarEdge (Home Wave)', sizeKw: 5.0, model: 'SE5000H Home Wave (HD-Wave with Optimizers)' },
    { id: 'ih-12', manufacturer: 'SolarEdge (Home Wave)', sizeKw: 10.0, model: 'SE10000H Home Hub (Three Phase Backup Ready)' },
    { id: 'ih-13', manufacturer: 'Sigenergy (SigenStor)', sizeKw: 5.0, model: 'SigenStor 5.0 TP (All-in-One 5kW Single Phase)' },
    { id: 'ih-14', manufacturer: 'Sigenergy (SigenStor)', sizeKw: 10.0, model: 'SigenStor 10.0 TP (All-in-One 10kW Three Phase)' },
    { id: 'ih-15', manufacturer: 'GoodWe', sizeKw: 5.0, model: 'DNS Series G3 (GW5000D-NS Single Phase)' },
    { id: 'ih-16', manufacturer: 'GoodWe', sizeKw: 10.0, model: 'ET Series (GW10K-ET Three Phase Storage Hybrid)' }
  ],
  batteryHierarchy: [
    { id: 'bh-1', manufacturer: 'Tesla Powerwall 3 (13.5kWh)', usableCapacityKwh: 13.5, model: 'Tesla Powerwall 3 Integrated Inverter', size: '13.5kWh Wall Mounted Slimline' },
    { id: 'bh-2', manufacturer: 'Tesla Powerwall 3 (13.5kWh)', usableCapacityKwh: 27.0, model: 'Dual Tesla Powerwall 3 Pack (2 x 13.5kWh)', size: '27.0kWh High Capacity Dual Stacking' },
    { id: 'bh-3', manufacturer: 'Sungrow SBR Battery (9.6kWh - 19.2kWh)', usableCapacityKwh: 9.6, model: 'SBR096 High Voltage Modular', size: '3 Modules (9.6kWh Floor Mounted Tower)' },
    { id: 'bh-4', manufacturer: 'Sungrow SBR Battery (9.6kWh - 19.2kWh)', usableCapacityKwh: 12.8, model: 'SBR128 High Voltage Modular', size: '4 Modules (12.8kWh Floor Mounted Tower)' },
    { id: 'bh-5', manufacturer: 'Sungrow SBR Battery (9.6kWh - 19.2kWh)', usableCapacityKwh: 16.0, model: 'SBR160 High Voltage Modular', size: '5 Modules (16.0kWh Floor Mounted Tower)' },
    { id: 'bh-6', manufacturer: 'Sungrow SBR Battery (9.6kWh - 19.2kWh)', usableCapacityKwh: 19.2, model: 'SBR192 High Voltage Modular', size: '6 Modules (19.2kWh Maximum Residential Tower)' },
    { id: 'bh-7', manufacturer: 'Sigenergy SigenStor (8kWh - 48kWh)', usableCapacityKwh: 8.0, model: 'Sigen Battery 8.0kWh LFP', size: 'Single 8kWh Modular Stack' },
    { id: 'bh-8', manufacturer: 'Sigenergy SigenStor (8kWh - 48kWh)', usableCapacityKwh: 16.0, model: 'Sigen Battery Dual Stack 16.0kWh', size: 'Dual 16kWh Modular Stack' },
    { id: 'bh-9', manufacturer: 'Sigenergy SigenStor (8kWh - 48kWh)', usableCapacityKwh: 24.0, model: 'Sigen Battery Triple Stack 24.0kWh', size: 'Triple 24kWh Heavy Duty Residential' },
    { id: 'bh-10', manufacturer: 'BYD Battery-Box Premium', usableCapacityKwh: 10.2, model: 'Battery-Box Premium HVS 10.2', size: '4 x HVS 2.56kWh Modules Tower' },
    { id: 'bh-11', manufacturer: 'BYD Battery-Box Premium', usableCapacityKwh: 13.8, model: 'Battery-Box Premium HVM 13.8', size: '5 x HVM 2.76kWh Modules Tower' },
    { id: 'bh-12', manufacturer: 'Enphase IQ Battery 5P', usableCapacityKwh: 5.0, model: 'IQ Battery 5P Modular', size: '5.0kWh Compact Wall Mount' },
    { id: 'bh-13', manufacturer: 'Enphase IQ Battery 5P', usableCapacityKwh: 10.0, model: 'Dual IQ Battery 5P System (2 x 5P)', size: '10.0kWh Dual Wall Array' },
    { id: 'bh-14', manufacturer: 'Enphase IQ Battery 5P', usableCapacityKwh: 15.0, model: 'Triple IQ Battery 5P System (3 x 5P)', size: '15.0kWh Whole Home Backup' }
  ],

  // Project Management Dropdowns
  projectStages: [
    'Site Survey',
    'Engineering & DNSP Approval',
    'Sales Order Created (Warehouse)',
    'Subcontractor RFQ / Quoting',
    'Install Scheduled',
    'Installation in Progress',
    'Installation Completed',
    'Clean Energy Regulator (STC Claim)',
    'DNSP Grid Inspection & Metering',
    'Completed'
  ],
  ebCustomerNameMatchOptions: ['Yes', 'No', 'Pending Rectification'],
  ebAddressMatchOptions: ['Yes', 'No', 'Pending Land Title / Sub-lot'],
  ebMeterMatchOptions: ['Yes', 'No', 'Discrepancy Flagged'],
  ebMeterPhaseOptions: ['Single Phase', 'Three Phase', 'Two Phase / Split'],
  ebOpenSolarSystemMatchOptions: ['Yes', 'No', 'Variance Verified'],
  ebOpenSolarPricingMatchOptions: ['Yes', 'No', 'Discrepancy Adjusted'],
  electricityDistributors: [
    'Ausgrid',
    'Endeavour Energy',
    'Essential Energy',
    'Energex',
    'Ergon Energy',
    'Powercor',
    'CitiPower',
    'Jemena',
    'United Energy',
    'SA Power Networks',
    'Western Power'
  ],
  energyRetailers: [
    'Origin Energy',
    'AGL Energy',
    'EnergyAustralia',
    'Red Energy',
    'Alinta Energy',
    'Powershop',
    'Amber Electric',
    'Dodo Power & Gas',
    'OVO Energy',
    'GloBird Energy'
  ],
  gridApplicationStatuses: [
    'Not Started',
    'Grid Applied',
    'Grid Under Review',
    'Grid App Approved',
    'Grid Rejected',
    'Resubmitted'
  ],
  installationStatuses: [
    'Unscheduled',
    'Booked / Scheduled',
    'Installer Dispatched',
    'In Progress',
    'Installation Completed',
    'Closed',
    'Cancelled'
  ],
  installationBookedByOptions: [
    'Operations Manager',
    'Lead Electrician',
    'Customer Service',
    'Project Coordinator',
    'Akash Mohite',
    'Chloe Gallagher',
    'Mitchell Barnes'
  ],
  installationMonths: [
    'January 2026',
    'February 2026',
    'March 2026',
    'April 2026',
    'May 2026',
    'June 2026',
    'July 2026',
    'August 2026',
    'September 2026',
    'October 2026',
    'November 2026',
    'December 2026'
  ],
  installationDocsStatuses: [
    'Pending',
    'Uploaded',
    'Under Review',
    'Verified & SAA Approved',
    'Rectification Required'
  ],
  installerInvoiceStatuses: [
    'Pending Approval',
    'Approved',
    'Paid',
    'Disputed',
    'On Hold'
  ],
  warehouses: [
    'Sydney Central DC (Alexandria)',
    'Brisbane North Hub (Eagle Farm)',
    'Melbourne West Warehouse (Truganina)',
    'Adelaide Logistics Depot',
    'Perth Distribution Centre'
  ],
  warehouseInvoiceStatuses: [
    'Draft',
    'Awaiting Dispatch',
    'Invoiced',
    'Paid',
    'Reconciled'
  ],
  stockStatuses: [
    'In Stock',
    'Allocated to Job',
    'Awaiting Shipment',
    'Dispatched to Site',
    'Delivered & Installed'
  ],
  isFinanceOptions: [
    'No (Cash / Direct Payment)',
    'Yes (Green Finance)',
    'Yes (Interest Free)',
    'Conditional Finance'
  ],
  financeCompanies: [
    'Brighte',
    'Plenti',
    'Community First Credit Union',
    'Humm',
    'Handepay',
    'RateSetter',
    'Parker Lane'
  ],
  financeStatuses: [
    'Not Applicable',
    'Application Draft',
    'Submitted',
    'Conditionally Approved',
    'Unconditionally Approved',
    'Settled',
    'Declined'
  ],
  stcPortals: [
    'BridgeSelect',
    'Green Energy Trading (GET)',
    'Clean Energy Trading',
    'TradeSTCs',
    'REC Registry'
  ],
  stcStatuses: [
    'Pending Upload',
    'Pre-Validation Passed',
    'Submitted to CER',
    'Approved & Traded',
    'Audit Flagged',
    'Paid'
  ]
};

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    name: 'Admin MakeMySolar',
    email: 'admin@makemysolar.com.au',
    phone: '+61 412 889 012',
    voipLineNumber: '+61 2 8311 4920',
    messageMediaSenderId: '+61 2 8311 4920',
    role: 'admin',
    department: 'Management',
    assignedDomain: 'makemysolar.com.au',
    isPasswordSet: true,
    inviteStatus: 'active'
  },
  {
    id: 'usr-mgr-1',
    name: 'Chloe Gallagher',
    email: 'chloe.g@mysolarcrm.com.au',
    phone: '+61 423 456 789',
    voipLineNumber: '+61 2 8311 4922',
    messageMediaSenderId: '+61 2 8311 4922',
    role: 'manager',
    department: 'Operations',
    assignedDomain: 'mysolarcrm.com.au',
    isPasswordSet: true,
    inviteStatus: 'active'
  },
  {
    id: 'usr-emp-1',
    name: 'Mitchell Barnes',
    email: 'm.barnes@mysolarcrm.com.au',
    phone: '+61 434 567 890',
    voipLineNumber: '+61 7 3184 8921',
    messageMediaSenderId: '+61 7 3184 8921',
    role: 'employee',
    department: 'Sales',
    assignedDomain: 'mysolarcrm.com.au',
    isPasswordSet: true,
    inviteStatus: 'active'
  },
  {
    id: 'usr-emp-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@mysolarcrm.com.au',
    phone: '+61 418 234 567',
    voipLineNumber: '+61 2 8311 4925',
    messageMediaSenderId: '+61 2 8311 4925',
    role: 'employee',
    department: 'Customer Support',
    assignedDomain: 'mysolarcrm.com.au',
    isPasswordSet: true,
    inviteStatus: 'active'
  }
];

export const INITIAL_CONNECTED_DOMAINS = ['makemysolar.com.au', 'mysolarcrm.com.au', 'solarenergy.com.au'];

export const INITIAL_PORTAL_ADDRESSES: SystemPortalAddresses = {
  customerPortal: {
    portalType: 'customer',
    label: 'Customer Self-Service Portal',
    subdomain: 'customer',
    baseDomain: 'mysolarcrm.com.au',
    path: '/customer',
    routingMode: 'subdomain',
    customDomain: 'customer.mysolarcrm.com.au',
    isSslActive: true,
    dnsCnameStatus: 'verified',
    dnsExpectedCname: 'customer.mysolarcrm.com.au CNAME ingress.mysolarcrm.com.au',
    customTitle: 'Customer Self-Service & Solar System Monitoring',
    customSubtitle: 'Track your solar installation, view contracts & monitor energy generation',
    supportPhone: '1300 852 400',
    supportEmail: 'support@mysolarcrm.com.au',
    allowSmsOtp: true,
    allowEmailMagicLink: true,
    allowPasswordLogin: true,
    lastUpdated: '2026-03-01T00:00:00.000Z'
  },
  installerPortal: {
    portalType: 'installer',
    label: 'Subcontractor Installer Portal',
    subdomain: 'installers',
    baseDomain: 'mysolarcrm.com.au',
    path: '/installer',
    routingMode: 'subdomain',
    customDomain: 'installers.mysolarcrm.com.au',
    isSslActive: true,
    dnsCnameStatus: 'verified',
    dnsExpectedCname: 'installers.mysolarcrm.com.au CNAME ingress.mysolarcrm.com.au',
    customTitle: 'Clean Energy Council Accredited Installer Portal',
    customSubtitle: 'Field job packs, photo verification checklists, SWMS & quote submissions',
    supportPhone: '1300 852 400',
    supportEmail: 'contractors@mysolarcrm.com.au',
    allowSmsOtp: true,
    allowEmailMagicLink: false,
    allowPasswordLogin: true,
    requireCecVerification: true,
    lastUpdated: '2026-03-01T00:00:00.000Z'
  },
  enforceSeparateLogins: true,
  enableAutoRouting: true
};

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Apex Solar Installations NSW',
    abn: '54 621 890 123',
    type: 'Subcontractor Installer',
    state: 'NSW',
    city: 'Sydney (Wetherill Park)',
    phone: '+61 2 9604 1122',
    email: 'dispatch@apexsolarnsw.com.au',
    contactPerson: 'David Miller (CEC Accredited)',
    cecAccredited: true,
    activeProjectsCount: 3
  },
  {
    id: 'comp-2',
    name: 'Gold Coast SunPower Tech QLD',
    abn: '32 984 105 776',
    type: 'Subcontractor Installer',
    state: 'QLD',
    city: 'Gold Coast (Nerang)',
    phone: '+61 7 5596 3344',
    email: 'admin@sunpowertech.com.au',
    contactPerson: 'Liam O’Connor (SAA Designer & Installer)',
    cecAccredited: true,
    activeProjectsCount: 2
  },
  {
    id: 'comp-3',
    name: 'Krannich Solar Wholesale AU',
    abn: '89 123 456 789',
    type: 'Equipment Vendor',
    state: 'NSW',
    city: 'Sydney (Eastern Creek)',
    phone: '+61 2 8888 7700',
    email: 'orders.nsw@krannich-solar.com',
    contactPerson: 'Sarah Jenkins',
    activeProjectsCount: 0
  },
  {
    id: 'comp-4',
    name: 'Harbour Logistics Commercial Centre',
    abn: '41 902 334 112',
    type: 'Commercial Customer',
    state: 'NSW',
    city: 'Port Botany',
    phone: '+61 2 9316 4400',
    email: 'facilities@harbourlogistics.com.au',
    contactPerson: 'Geoff Howard',
    creditLimit: 150000,
    activeProjectsCount: 1
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt-1',
    name: 'Harrison Davies',
    email: 'harrison.davies@gmail.com',
    phone: '+61 411 234 567',
    state: 'NSW',
    city: 'Strathfield, Sydney',
    address: '42 Albert Road, Strathfield NSW 2135',
    addresses: [
      {
        id: 'addr-cnt-1-1',
        street: '42 Albert Road',
        suburb: 'Strathfield',
        state: 'NSW',
        postcode: '2135',
        propertyType: 'Primary Residence',
        systemSizeKw: 10.4,
        notes: 'Single storey colorbond, high air-con power bill. 10.4kW + Sungrow battery.',
        isPrimary: true
      },
      {
        id: 'addr-cnt-1-2',
        street: '18 Ocean Parade',
        suburb: 'Manly',
        state: 'NSW',
        postcode: '2095',
        propertyType: 'Investment Property',
        systemSizeKw: 6.6,
        notes: 'Beachside holiday rental duplex. Two-storey tile roof.',
        isPrimary: false
      }
    ],
    type: 'Residential',
    source: 'Meta Ads',
    openSolarContactId: 'OS-CNT-901',
    assignedVoipLineNumber: '+61 2 8311 4920',
    notes: 'Single storey colorbond, high air-con quarterly bill ($1,250), looking for 10.4kW + Sungrow battery.',
    createdAt: '2026-07-12',
    lastContactedAt: '2026-09-02'
  },
  {
    id: 'cnt-2',
    name: 'Brooke Henderson',
    email: 'brooke.h@outlook.com',
    phone: '+61 422 789 331',
    state: 'QLD',
    city: 'Chermside, Brisbane',
    address: '18 Gympie Street, Chermside QLD 4032',
    addresses: [
      {
        id: 'addr-cnt-2-1',
        street: '18 Gympie Street',
        suburb: 'Chermside',
        state: 'QLD',
        postcode: '4032',
        propertyType: 'Primary Residence',
        systemSizeKw: 6.6,
        notes: 'Two-storey terracotta tile roof. Completed install in 2024.',
        isPrimary: true
      },
      {
        id: 'addr-cnt-2-2',
        street: '74 Sunshine Boulevard',
        suburb: 'Broadbeach Waters',
        state: 'QLD',
        postcode: '4218',
        propertyType: 'Holiday Home',
        systemSizeKw: 8.8,
        notes: 'Canal waterfront property. Metal sheet roof.',
        isPrimary: false
      }
    ],
    type: 'Residential',
    source: 'OpenSolar',
    openSolarContactId: 'OS-CNT-904',
    assignedVoipLineNumber: '+61 7 3184 8921',
    notes: 'Two-storey terracotta tile roof. Needs CEC certified installer with tile safety kit. Completed install in 2024.',
    createdAt: '2024-08-15',
    lastContactedAt: '2026-08-28'
  },
  {
    id: 'cnt-3',
    name: 'Marcus Sterling',
    email: 'm.sterling@sterlingdistributors.com.au',
    phone: '+61 433 912 445',
    state: 'NSW',
    city: 'Parramatta, Sydney',
    address: '120 George St, Parramatta NSW 2150',
    addresses: [
      {
        id: 'addr-cnt-3-1',
        street: '120 George St',
        suburb: 'Parramatta',
        state: 'NSW',
        postcode: '2150',
        propertyType: 'Commercial Facility',
        systemSizeKw: 39.6,
        notes: 'Commercial rooftop solar system with 3-Phase Ausgrid connection.',
        isPrimary: true
      },
      {
        id: 'addr-cnt-3-2',
        street: 'Unit 4, 88 Industrial Drive',
        suburb: 'Wetherill Park',
        state: 'NSW',
        postcode: '2164',
        propertyType: 'Commercial Warehouse',
        systemSizeKw: 50.0,
        notes: 'Heavy machinery logistics distribution warehouse.',
        isPrimary: false
      }
    ],
    type: 'Commercial',
    companyId: 'comp-4',
    companyName: 'Harbour Logistics Commercial Centre',
    source: 'Gmail Sync',
    assignedVoipLineNumber: '+61 2 8311 4920',
    notes: '39.6kW commercial rooftop solar system. 3-Phase with Ausgrid high voltage connection.',
    createdAt: '2026-06-05',
    lastContactedAt: '2026-09-01'
  },
  {
    id: 'cnt-4',
    name: 'David Miller',
    email: 'dispatch@apexsolarnsw.com.au',
    phone: '+61 450 123 456',
    state: 'NSW',
    city: 'Sydney',
    address: '14 Newton Rd, Wetherill Park NSW 2164',
    addresses: [
      {
        id: 'addr-cnt-4-1',
        street: '14 Newton Rd',
        suburb: 'Wetherill Park',
        state: 'NSW',
        postcode: '2164',
        propertyType: 'Commercial Facility',
        isPrimary: true
      }
    ],
    type: 'Subcontractor',
    companyId: 'comp-1',
    companyName: 'Apex Solar Installations NSW',
    source: 'Manual',
    assignedVoipLineNumber: '+61 2 8311 4922',
    notes: 'Subcontractor lead installer. CEC Accreditation #A8921034.',
    createdAt: '2025-01-10'
  },
  {
    id: 'cnt-5',
    name: 'Nathaniel Ward',
    email: 'nathaniel.ward@gmail.com',
    phone: '+61 401 555 123',
    state: 'NSW',
    city: 'Castle Hill, Sydney',
    address: '88 Old Northern Road, Castle Hill NSW 2154',
    addresses: [
      {
        id: 'addr-cnt-5-1',
        street: '88 Old Northern Road',
        suburb: 'Castle Hill',
        state: 'NSW',
        postcode: '2154',
        propertyType: 'Primary Residence',
        systemSizeKw: 13.2,
        notes: 'Two-storey concrete tile roof. 13.2kW Solar + Tesla Powerwall 3.',
        isPrimary: true
      },
      {
        id: 'addr-cnt-5-2',
        street: '14 Figtree Pocket Road',
        suburb: 'Indooroopilly',
        state: 'QLD',
        postcode: '4068',
        propertyType: 'Investment Property',
        systemSizeKw: 9.6,
        notes: 'Brisbane riverfront rental property. Single-storey metal roof.',
        isPrimary: false
      }
    ],
    type: 'Residential',
    source: 'Meta Ads',
    openSolarContactId: 'OS-CNT-905',
    assignedVoipLineNumber: '+61 2 8311 4920',
    notes: 'Referred by Harrison Davies. Premium residential package with battery.',
    createdAt: '2026-08-28',
    lastContactedAt: '2026-09-02'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    leadDate: '2026-08-30',
    platform: 'Meta Lead Ads (Facebook/Instagram)',
    salesPersonName: 'Mitchell Barnes',
    state: 'NSW',
    postcode: '2154',
    area: 'Metro',
    nearestBigCity: 'Sydney',
    status: 'Proposal Sent',
    saleDate: '',
    firstName: 'Nathaniel',
    lastName: 'Ward',
    managerRenteeFirstName: '',
    managerRenteeLastName: '',
    address: '12 Castle Street',
    suburb: 'Castle Hill',
    addressVerified: true,
    primaryMobile: '0401 555 123',
    secondaryMobile: '0402 111 888',
    email: 'nathaniel.ward@gmail.com, nathan.work@solargroup.com.au',
    salesTeamNotes: 'Interested in 13.2kW AIKO system with Tesla Powerwall 3. Customer wants proposal revised before Friday.',
    systemPrice: 15400,
    sellingPrice: 11900,
    deposit: 1000,
    depositReceivedDate: '',
    customerName: 'Nathaniel Ward',
    phone: '0401 555 123',
    systemSizeKw: 13.2,
    batteryRequired: true,
    propertyType: 'Residential Two-Storey',
    roofType: 'Concrete Tile',
    phaseType: 'Three Phase',
    quarterlyBillAud: 1450,
    source: 'Meta Lead Ads (Facebook/Instagram)',
    sheetSyncRowId: 'GSHEET_ROW_42',
    createdAt: '2026-08-30',
    assignedTo: 'Mitchell Barnes',
    attachments: [
      {
        id: 'att-101-1',
        name: 'Electricity_Bill_Q2_2026.pdf',
        sizeBytes: 1420000,
        uploadedAt: '2026-08-31T09:15:00.000Z',
        uploadedBy: 'staff',
        category: 'Electricity Bill',
        notes: 'Ausgrid quarterly bill showing 32 kWh/day average consumption.'
      },
      {
        id: 'att-101-2',
        name: 'Switchboard_Main_Breakers.jpg',
        sizeBytes: 2840000,
        uploadedAt: '2026-08-31T09:20:00.000Z',
        uploadedBy: 'staff',
        category: 'Switchboard Photo',
        notes: 'Clear image of meter and main isolation switch.'
      }
    ]
  },
  {
    id: 'lead-102',
    leadDate: '2026-09-01',
    platform: 'Meta Lead Ads (Facebook/Instagram)',
    salesPersonName: 'Chloe Gallagher',
    state: 'QLD',
    postcode: '4109',
    area: 'Metro',
    nearestBigCity: 'Brisbane',
    status: 'Site Survey Scheduled',
    saleDate: '',
    firstName: 'Sophie',
    lastName: 'Zhang',
    managerRenteeFirstName: 'Daniel',
    managerRenteeLastName: 'Zhang',
    address: '35 Mains Road',
    suburb: 'Sunnybank',
    addressVerified: true,
    primaryMobile: '0412 667 889',
    secondaryMobile: '',
    email: 'sophie.zhang@hotmail.com',
    salesTeamNotes: 'Eligible for QLD battery rebate. Confirmed site survey scheduled for tomorrow 10am.',
    systemPrice: 12800,
    sellingPrice: 9400,
    deposit: 500,
    depositReceivedDate: '',
    customerName: 'Sophie Zhang',
    phone: '0412 667 889',
    systemSizeKw: 10.4,
    batteryRequired: true,
    propertyType: 'Residential Single-Storey',
    roofType: 'Colorbond / Metal Sheet',
    phaseType: 'Single Phase',
    quarterlyBillAud: 980,
    source: 'Meta Lead Ads (Facebook/Instagram)',
    sheetSyncRowId: 'GSHEET_ROW_43',
    createdAt: '2026-09-01',
    assignedTo: 'Chloe Gallagher'
  },
  {
    id: 'lead-103',
    leadDate: '2026-09-03',
    platform: 'Google Search & PMax Ads',
    salesPersonName: 'Mitchell Barnes',
    state: 'NSW',
    postcode: '2300',
    area: 'Regional',
    nearestBigCity: 'Newcastle',
    status: 'New',
    saleDate: '',
    firstName: 'Brad',
    lastName: 'O’Halloran',
    managerRenteeFirstName: '',
    managerRenteeLastName: '',
    address: '105 Hunter Street',
    suburb: 'Newcastle East',
    addressVerified: true,
    primaryMobile: '0423 778 990',
    secondaryMobile: '0423 112 334',
    email: 'brad.ohalloran@yahoo.com.au',
    salesTeamNotes: 'Inbound organic Google search enquiry. Requested callback after 5:30 PM.',
    systemPrice: 8900,
    sellingPrice: 6200,
    deposit: 0,
    depositReceivedDate: '',
    customerName: 'Brad O’Halloran',
    phone: '0423 778 990',
    systemSizeKw: 6.6,
    batteryRequired: false,
    propertyType: 'Residential Single-Storey',
    roofType: 'Terracotta Tile',
    phaseType: 'Single Phase',
    quarterlyBillAud: 650,
    source: 'Google Search & PMax Ads',
    sheetSyncRowId: 'GSHEET_ROW_44',
    createdAt: '2026-09-03',
    assignedTo: 'Mitchell Barnes'
  },
  {
    id: 'lead-104',
    leadDate: '2026-09-02',
    platform: 'Meta Lead Ads (Facebook/Instagram)',
    salesPersonName: 'Mitchell Barnes',
    state: 'NSW',
    postcode: '2153',
    area: 'Metro',
    nearestBigCity: 'Sydney',
    status: 'Contract Signed',
    saleDate: '2026-09-02',
    firstName: 'Matthew',
    lastName: 'Barnes',
    managerRenteeFirstName: '',
    managerRenteeLastName: '',
    address: '42 Windmill Avenue',
    suburb: 'Baulkham Hills',
    addressVerified: true,
    primaryMobile: '0421 987 654',
    secondaryMobile: '0421 333 222',
    email: 'matthew.b@outlook.com',
    salesTeamNotes: 'Contract signed for 10.4kW AIKO Neostar with 10kWh Battery storage. Customer requested immediate portal access to upload documents.',
    systemPrice: 13500,
    sellingPrice: 10400,
    deposit: 1000,
    depositReceivedDate: '09/02/2026',
    customerName: 'Matthew Barnes',
    phone: '0421 987 654',
    systemSizeKw: 10.4,
    batteryRequired: true,
    propertyType: 'Residential Two-Storey',
    roofType: 'Concrete Tile',
    phaseType: 'Single Phase',
    quarterlyBillAud: 1120,
    source: 'Meta Lead Ads (Facebook/Instagram)',
    sheetSyncRowId: 'GSHEET_ROW_45',
    createdAt: '2026-09-02',
    assignedTo: 'Mitchell Barnes',
    attachments: [
      {
        id: 'att-104-1',
        name: 'Signed_Solar_Installation_Contract_Barnes.pdf',
        sizeBytes: 1850000,
        uploadedAt: '2026-09-02T11:00:00.000Z',
        uploadedBy: 'staff',
        category: 'Contract',
        notes: 'Executed solar supply & installation contract with customer digital signature.'
      },
      {
        id: 'att-104-2',
        name: 'Customer_Electricity_Bill_Latest.pdf',
        sizeBytes: 1120000,
        uploadedAt: '2026-09-02T14:20:00.000Z',
        uploadedBy: 'customer',
        category: 'Electricity Bill',
        notes: 'Uploaded by Matthew Barnes via Customer Portal self-service.'
      }
    ],
    portalCredentials: {
      username: 'matthew.b@outlook.com',
      tempPassword: 'Solar-2026!Barnes#842',
      generatedAt: '2026-09-02T11:05:00.000Z',
      inviteSentAt: '2026-09-02T11:05:30.000Z',
      inviteLink: 'https://customer.mysolarcrm.com.au?auth_user=matthew.b%40outlook.com',
      status: 'Credentials Sent'
    },
    xeroInvoiceId: 'xinv-1',
    xeroInvoiceNumber: 'INV-2026-0041',
    xeroInvoiceTotal: 10400,
    xeroInvoiceStatus: 'AUTHORISED',
    xeroReceiptNumber: 'REC-2026-1042',
    xeroReceiptDate: '2026-09-02',
    xeroReceiptAmount: 1000,
    xeroReceiptMethod: 'Direct Debit / EFT'
  }
];

export const INITIAL_SUBCONTRACTORS: SubContractor[] = [
  {
    id: 'sub-1',
    name: 'David Miller',
    companyName: 'Apex Solar Installations NSW',
    abn: '54 621 890 123',
    phone: '+61 450 123 456',
    email: 'dispatch@apexsolarnsw.com.au',
    state: 'NSW',
    metroAreas: ['Sydney Metro', 'Wollongong', 'Central Coast', 'Newcastle'],
    cecAccreditationNumber: 'CEC-A8921034',
    saaLicenseNumber: 'SAA-NSW-44120',
    insuranceExpiryDate: '2027-04-30',
    rating: 4.9,
    completedInstalls: 142,
    activeJobsCount: 3,
    complianceVerified: true
  },
  {
    id: 'sub-2',
    name: 'Liam O’Connor',
    companyName: 'Gold Coast SunPower Tech QLD',
    abn: '32 984 105 776',
    phone: '+61 460 789 012',
    email: 'admin@sunpowertech.com.au',
    state: 'QLD',
    metroAreas: ['Brisbane Metro', 'Gold Coast', 'Sunshine Coast', 'Ipswich'],
    cecAccreditationNumber: 'CEC-B7129841',
    saaLicenseNumber: 'SAA-QLD-88210',
    insuranceExpiryDate: '2027-02-15',
    rating: 4.8,
    completedInstalls: 98,
    activeJobsCount: 2,
    complianceVerified: true
  },
  {
    id: 'sub-3',
    name: 'Craig Thornton',
    companyName: 'Metro Pro Solar Crew Sydney',
    abn: '77 411 902 334',
    phone: '+61 470 334 556',
    email: 'craig@metroprosolar.com.au',
    state: 'NSW',
    metroAreas: ['Sydney Metro', 'Western Sydney'],
    cecAccreditationNumber: 'CEC-A6049182',
    saaLicenseNumber: 'SAA-NSW-31998',
    insuranceExpiryDate: '2026-11-30',
    rating: 4.7,
    completedInstalls: 64,
    activeJobsCount: 1,
    complianceVerified: true
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    projectCode: 'SOL-NSW-1042',
    title: '10.4kW AIKO + Sungrow Hybrid System',
    customerId: 'cnt-1',
    customerName: 'Harrison Davies',
    customerEmail: 'harrison.davies@gmail.com',
    customerPhone: '+61 411 234 567',
    address: '42 Albert Road',
    suburb: 'Strathfield, Sydney',
    state: 'NSW',
    dnsp: 'Ausgrid',
    status: 'Installation Completed',
    systemSizeKw: 10.4,
    panelBrand: 'AIKO Solar',
    panelModel: 'Neostar 2P 440W All-Black N-Type ABC',
    panelCount: 24,
    inverterBrand: 'Sungrow (SG/SH Series)',
    inverterModel: 'SH8.0RS Hybrid Inverter 8.0kW',
    batteryBrand: 'Sungrow SBR Battery (9.6kWh - 19.2kWh)',
    batteryCapacityKwh: 9.6,
    contractValueAud: 14850,
    stcCount: 102,
    customerStcRateAud: 36.00,
    customerStcValueAud: 3672,
    internalStcRateAud: 39.50,
    internalStcValueAud: 4029,
    stcValueAud: 4029,
    bridgeSelectStatus: 'Submitted to Clean Energy Regulator',
    openSolarProposalId: 'OS-PROP-2026-88',
    openSolarSignedUrl: 'https://opensolar.com/proposals/au/882190-signed.pdf',
    openSolarContractSigned: true,
    salesOrderId: 'so-101',
    installOrderId: 'io-101',
    subcontractorId: 'sub-1',
    subcontractorName: 'Apex Solar Installations NSW',
    installerQuotedAud: 2850,
    installationDate: '2026-08-25',
    specsDocumentUrl: 'https://files.aussolar.com.au/specs/SOL-NSW-1042-specs.pdf',
    sitePlanUrl: 'https://files.aussolar.com.au/plans/SOL-NSW-1042-roofplan.pdf',
    installedPhotos: [
      {
        id: 'p-1',
        category: 'Array / Panels',
        url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-25T14:30:00Z',
        verified: true
      },
      {
        id: 'p-2',
        category: 'Inverter & Isolators',
        url: 'https://images.unsplash.com/photo-1548611716-ad38e7e1f400?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-25T15:10:00Z',
        verified: true
      },
      {
        id: 'p-3',
        category: 'Switchboard',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-25T15:45:00Z',
        verified: true
      }
    ]
  },
  {
    id: 'proj-2',
    projectCode: 'SOL-QLD-0891',
    title: '13.2kW Jinko + Tesla Powerwall 3',
    customerId: 'cnt-2',
    customerName: 'Brooke Henderson',
    customerEmail: 'brooke.h@outlook.com',
    customerPhone: '+61 422 789 331',
    address: '18 Gympie Street',
    suburb: 'Chermside, Brisbane',
    state: 'QLD',
    dnsp: 'Energex',
    status: 'Completed',
    systemSizeKw: 13.2,
    panelBrand: 'Jinko Solar (Tiger Neo)',
    panelModel: 'Tiger Neo N-type 440W',
    panelCount: 30,
    inverterBrand: 'Tesla Powerwall 3 (13.5kWh)',
    inverterModel: 'Tesla Powerwall 3 Integrated 11.5kW Inverter',
    batteryBrand: 'Tesla Powerwall 3 (13.5kWh)',
    batteryCapacityKwh: 13.5,
    contractValueAud: 22400,
    stcCount: 140,
    customerStcRateAud: 36.00,
    customerStcValueAud: 5040,
    internalStcRateAud: 39.50,
    internalStcValueAud: 5530,
    stcValueAud: 5530,
    bridgeSelectStatus: 'STCs Approved & Paid',
    openSolarProposalId: 'OS-PROP-2024-41',
    openSolarSignedUrl: 'https://opensolar.com/proposals/au/410982-signed.pdf',
    openSolarContractSigned: true,
    salesOrderId: 'so-102',
    installOrderId: 'io-102',
    subcontractorId: 'sub-2',
    subcontractorName: 'Gold Coast SunPower Tech QLD',
    installerQuotedAud: 3400,
    installationDate: '2024-08-20',
    completedDate: '2024-09-01',
    specsDocumentUrl: 'https://files.aussolar.com.au/specs/SOL-QLD-0891-specs.pdf',
    sitePlanUrl: 'https://files.aussolar.com.au/plans/SOL-QLD-0891-roofplan.pdf',
    installedPhotos: [
      {
        id: 'p-4',
        category: 'Array / Panels',
        url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2024-08-20T16:00:00Z',
        verified: true
      }
    ]
  },
  {
    id: 'proj-3',
    projectCode: 'SOL-NSW-1055',
    title: '39.6kW Commercial Solar Logistics Hub',
    customerId: 'cnt-3',
    customerName: 'Marcus Sterling',
    customerEmail: 'm.sterling@sterlingdistributors.com.au',
    customerPhone: '+61 433 912 445',
    address: '120 George St',
    suburb: 'Parramatta, Sydney',
    state: 'NSW',
    dnsp: 'Ausgrid',
    status: 'Install Scheduled',
    systemSizeKw: 39.6,
    panelBrand: 'Trina Solar (Vertex S+)',
    panelModel: 'Vertex S+ 440W Glass-Glass Dual Glass',
    panelCount: 90,
    inverterBrand: 'Fronius (Primo/Symo Gen24)',
    inverterModel: 'Fronius Symo 20.0-3-M Commercial (x2)',
    contractValueAud: 44900,
    stcCount: 390,
    customerStcRateAud: 36.00,
    customerStcValueAud: 14040,
    internalStcRateAud: 39.50,
    internalStcValueAud: 15405,
    stcValueAud: 15405,
    bridgeSelectStatus: 'CEC Accredited Checked',
    openSolarProposalId: 'OS-PROP-2026-99',
    openSolarSignedUrl: 'https://opensolar.com/proposals/au/990142-signed.pdf',
    openSolarContractSigned: true,
    salesOrderId: 'so-103',
    installOrderId: 'io-103',
    subcontractorId: 'sub-1',
    subcontractorName: 'Apex Solar Installations NSW',
    installerQuotedAud: 7800,
    installationDate: '2026-09-15',
    specsDocumentUrl: 'https://files.aussolar.com.au/specs/SOL-NSW-1055-specs.pdf',
    sitePlanUrl: 'https://files.aussolar.com.au/plans/SOL-NSW-1055-roofplan.pdf'
  },
  {
    id: 'proj-4',
    projectCode: 'SOL-NSW-1060',
    title: '6.6kW Budget Residential Solar',
    customerId: 'cnt-1',
    customerName: 'Nathaniel Ward',
    customerEmail: 'nathaniel.ward@gmail.com',
    customerPhone: '+61 401 555 123',
    address: '15 Old Northern Rd',
    suburb: 'Castle Hill, Sydney',
    state: 'NSW',
    dnsp: 'Endeavour Energy',
    status: 'RFQ Sent to Installers',
    systemSizeKw: 6.6,
    panelBrand: 'Canadian Solar',
    panelModel: 'HiKu6 Mono 415W',
    panelCount: 16,
    inverterBrand: 'Sungrow (SG/SH Series)',
    inverterModel: 'SG5.0RS Single Phase 5.0kW',
    contractValueAud: 6990,
    stcCount: 65,
    customerStcRateAud: 36.00,
    customerStcValueAud: 2340,
    internalStcRateAud: 39.50,
    internalStcValueAud: 2567,
    stcValueAud: 2567,
    bridgeSelectStatus: 'Pending Verification',
    openSolarProposalId: 'OS-PROP-2026-104',
    openSolarContractSigned: true,
    salesOrderId: 'so-104',
    installOrderId: 'io-104',
    specsDocumentUrl: 'https://files.aussolar.com.au/specs/SOL-NSW-1060-specs.pdf'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-1',
    ticketNumber: 'TKT-2026-042',
    projectId: 'proj-2',
    projectCode: 'SOL-QLD-0891',
    customerId: 'cnt-2',
    customerName: 'Brooke Henderson',
    customerPhone: '+61 422 789 331',
    title: 'Tesla App showing Gateway WiFi Disconnect',
    description: 'After NBN router reboot last evening, the Tesla Powerwall 3 gateway LED is flashing amber and real-time generation is not updating in our app.',
    category: 'WiFi Monitoring Drop',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2026-09-02T08:15:00Z',
    assignedTechnician: 'Liam O’Connor',
    resolutionNotes: 'Customer contacted via WhatsApp. Provided Gateway WPS sync steps. Field check booked if not resolved today.',
    updatedAt: '2026-09-03T09:30:00Z'
  },
  {
    id: 'tkt-2',
    ticketNumber: 'TKT-2026-039',
    projectId: 'proj-2',
    projectCode: 'SOL-QLD-0891',
    customerId: 'cnt-2',
    customerName: 'Brooke Henderson',
    customerPhone: '+61 422 789 331',
    title: 'Quarterly Generation Audit Confirmation',
    description: 'Customer requested verification of solar credits on Origin Energy bill matching our OpenSolar forecast.',
    category: 'General Query',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2026-08-10T11:00:00Z',
    assignedTechnician: 'Chloe Gallagher',
    resolutionNotes: 'Exported OpenSolar generation history report and reconciled with smart meter intervals. Generation 98.4% of forecast.',
    updatedAt: '2026-08-12T14:20:00Z'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'maint-1',
    projectId: 'proj-2',
    projectCode: 'SOL-QLD-0891',
    customerId: 'cnt-2',
    customerName: 'Brooke Henderson',
    customerPhone: '+61 422 789 331',
    customerEmail: 'brooke.h@outlook.com',
    address: '18 Gympie Street, Chermside QLD 4032',
    state: 'QLD',
    installationDate: '2024-08-20',
    nextPeriodicServiceDueDate: '2026-08-20', // OVERDUE by 2 weeks (2 years from 2024)
    status: 'Overdue',
    lastNotificationSentAt: '2026-08-25T10:00:00Z',
    assignedTechnician: 'Liam O’Connor',
    notes: 'System is past 2-year CEC health check threshold. Isolator seal inspection & thermal imaging recommended.'
  },
  {
    id: 'maint-2',
    projectId: 'proj-1',
    projectCode: 'SOL-NSW-1042',
    customerId: 'cnt-1',
    customerName: 'Harrison Davies',
    customerPhone: '+61 411 234 567',
    customerEmail: 'harrison.davies@gmail.com',
    address: '42 Albert Road, Strathfield NSW 2135',
    state: 'NSW',
    installationDate: '2026-08-25',
    nextPeriodicServiceDueDate: '2028-08-25',
    status: 'Pending',
    notes: 'Brand new install. 2-year checkup logged for 2028.'
  }
];

export const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'so-101',
    orderNumber: 'SO-NSW-2026-091',
    projectId: 'proj-1',
    projectCode: 'SOL-NSW-1042',
    customerName: 'Harrison Davies',
    supplierName: 'Krannich Solar Wholesale AU',
    status: 'Delivered to Site',
    orderDate: '2026-08-15',
    dispatchDate: '2026-08-20',
    warehouseLocation: 'Sydney Wetherill Park Logistics Hub',
    totalCostAud: 8420,
    items: [
      { id: 'soi-1', sku: 'AIKO-NEO-440', partNumber: 'AIKO-NEO-440', description: 'AIKO Neostar 440W All-Black Panels', quantity: 24, unitCostAud: 145, totalAud: 3480, totalCostAud: 3480 },
      { id: 'soi-2', sku: 'SUNG-SH8.0RS', partNumber: 'SUNG-SH8.0RS', description: 'Sungrow SH8.0RS Hybrid Inverter', quantity: 1, unitCostAud: 1650, totalAud: 1650, totalCostAud: 1650 },
      { id: 'soi-3', sku: 'SUNG-SBR096', partNumber: 'SUNG-SBR096', description: 'Sungrow 9.6kWh High Voltage Battery', quantity: 1, unitCostAud: 2800, totalAud: 2800, totalCostAud: 2800 },
      { id: 'soi-4', sku: 'CLENERGY-ROOF', partNumber: 'CLENERGY-ROOF', description: 'Clenergy SolarRoof Mounting Kit 24P', quantity: 1, unitCostAud: 490, totalAud: 490, totalCostAud: 490 }
    ]
  },
  {
    id: 'so-102',
    orderNumber: 'SO-QLD-2024-044',
    projectId: 'proj-2',
    projectCode: 'SOL-QLD-0891',
    customerName: 'Brooke Henderson',
    supplierName: 'Krannich Solar Wholesale AU',
    status: 'Delivered to Site',
    orderDate: '2024-08-05',
    dispatchDate: '2024-08-10',
    warehouseLocation: 'Brisbane Acacia Ridge Distribution Hub',
    totalCostAud: 13900,
    items: [
      { id: 'soi-5', sku: 'JK-TIGER-440', partNumber: 'JK-TIGER-440', description: 'Jinko Tiger Neo 440W Panels', quantity: 30, unitCostAud: 135, totalAud: 4050, totalCostAud: 4050 },
      { id: 'soi-6', sku: 'TSLA-PW3', partNumber: 'TSLA-PW3', description: 'Tesla Powerwall 3 13.5kWh + Backup Gateway 2', quantity: 1, unitCostAud: 9200, totalAud: 9200, totalCostAud: 9200 },
      { id: 'soi-7', sku: 'GRACE-RACK-30', partNumber: 'GRACE-RACK-30', description: 'Grace Solar Tile Racking Kit 30P', quantity: 1, unitCostAud: 650, totalAud: 650, totalCostAud: 650 }
    ]
  },
  {
    id: 'so-103',
    orderNumber: 'SO-NSW-2026-112',
    projectId: 'proj-3',
    projectCode: 'SOL-NSW-1055',
    customerName: 'Marcus Sterling',
    supplierName: 'Krannich Solar Wholesale AU',
    status: 'Dispatched from Warehouse',
    orderDate: '2026-08-28',
    dispatchDate: '2026-08-29',
    warehouseLocation: 'Sydney Wetherill Park Logistics Hub',
    totalCostAud: 22100,
    items: [
      { id: 'soi-8', sku: 'TRINA-VERT-440', partNumber: 'TRINA-VERT-440', description: 'Trina Vertex S+ 440W Dual Glass Panels', quantity: 90, unitCostAud: 130, totalAud: 11700, totalCostAud: 11700 },
      { id: 'soi-9', sku: 'FRONIUS-SYMO-20', partNumber: 'FRONIUS-SYMO-20', description: 'Fronius Symo 20.0-3-M Commercial Inverters', quantity: 2, unitCostAud: 4400, totalAud: 8800, totalCostAud: 8800 },
      { id: 'soi-10', sku: 'SCHLETTER-COMM', partNumber: 'SCHLETTER-COMM', description: 'Schletter Commercial Metal Roof Clamps & Rails', quantity: 1, unitCostAud: 1600, totalAud: 1600, totalCostAud: 1600 }
    ]
  },
  {
    id: 'so-104',
    orderNumber: 'SO-NSW-2026-118',
    projectId: 'proj-4',
    projectCode: 'SOL-NSW-1060',
    customerName: 'Nathaniel Ward',
    supplierName: 'Krannich Solar Wholesale AU',
    status: 'Ordered',
    orderDate: '2026-09-02',
    dispatchDate: 'Pending dispatch',
    warehouseLocation: 'Sydney Wetherill Park Logistics Hub',
    totalCostAud: 3450,
    items: [
      { id: 'soi-11', sku: 'CSI-HIKU6-415', partNumber: 'CSI-HIKU6-415', description: 'Canadian Solar HiKu6 415W Panels', quantity: 16, unitCostAud: 115, totalAud: 1840, totalCostAud: 1840 },
      { id: 'soi-12', sku: 'SUNG-SG5.0RS', partNumber: 'SUNG-SG5.0RS', description: 'Sungrow SG5.0RS Inverter', quantity: 1, unitCostAud: 1250, totalAud: 1250, totalCostAud: 1250 },
      { id: 'soi-13', sku: 'CLENERGY-16P', partNumber: 'CLENERGY-16P', description: 'Clenergy Tile Racking Kit 16P', quantity: 1, unitCostAud: 360, totalAud: 360, totalCostAud: 360 }
    ]
  }
];

export const INITIAL_INSTALL_ORDERS: InstallOrder[] = [
  {
    id: 'io-101',
    orderNumber: 'INST-NSW-2026-081',
    projectId: 'proj-1',
    projectCode: 'SOL-NSW-1042',
    customerName: 'Harrison Davies',
    address: '42 Albert Road, Strathfield NSW 2135',
    state: 'NSW',
    systemSizeKw: 10.4,
    roofType: 'Colorbond / Metal Sheet',
    storeys: 'Single Storey',
    specialRequirements: 'Single-storey colorbond. Easy side access. Sungrow battery mounted in shaded carport.',
    status: 'Completed',
    submittedRequirements: {
      panelCount: 24,
      inverterType: 'Sungrow SH8.0RS Hybrid',
      batteryIncluded: true,
      switchboardUpgradeRequired: false,
      siteAccessInstructions: 'Driveway parking available. Gate code 4920.'
    },
    quotes: [
      {
        id: 'q-1',
        subcontractorId: 'sub-1',
        subcontractorName: 'Apex Solar Installations NSW',
        amountAud: 2850,
        estimatedDays: 1,
        crewSize: 3,
        notes: 'Full CEC team. Includes Sungrow battery commissioning and switchboard safety certificate.',
        submittedAt: '2026-08-18',
        status: 'Accepted'
      },
      {
        id: 'q-2',
        subcontractorId: 'sub-3',
        subcontractorName: 'Metro Pro Solar Crew Sydney',
        amountAud: 3100,
        estimatedDays: 1.5,
        crewSize: 2,
        notes: 'Standard install quote including travel.',
        submittedAt: '2026-08-19',
        status: 'Rejected'
      }
    ],
    awardedSubcontractorId: 'sub-1',
    awardedAmountAud: 2850
  },
  {
    id: 'io-102',
    orderNumber: 'INST-QLD-2024-032',
    projectId: 'proj-2',
    projectCode: 'SOL-QLD-0891',
    customerName: 'Brooke Henderson',
    address: '18 Gympie Street, Chermside QLD 4032',
    state: 'QLD',
    systemSizeKw: 13.2,
    roofType: 'Concrete Tile',
    storeys: 'Two Storey',
    specialRequirements: 'Two-storey tile roof. Tile ladder safety bracket and edge protection required.',
    status: 'Completed',
    submittedRequirements: {
      panelCount: 30,
      inverterType: 'Tesla Powerwall 3 Integrated',
      batteryIncluded: true,
      switchboardUpgradeRequired: true,
      siteAccessInstructions: 'Rear yard access via side gate. Dog kept inside.'
    },
    quotes: [
      {
        id: 'q-3',
        subcontractorId: 'sub-2',
        subcontractorName: 'Gold Coast SunPower Tech QLD',
        amountAud: 3400,
        estimatedDays: 1,
        crewSize: 4,
        notes: 'Tesla certified installers with certified edge protection and SAA compliance.',
        submittedAt: '2024-08-10',
        status: 'Accepted'
      }
    ],
    awardedSubcontractorId: 'sub-2',
    awardedAmountAud: 3400
  },
  {
    id: 'io-103',
    orderNumber: 'INST-NSW-2026-095',
    projectId: 'proj-3',
    projectCode: 'SOL-NSW-1055',
    customerName: 'Marcus Sterling',
    address: '120 George St, Parramatta NSW 2150',
    state: 'NSW',
    systemSizeKw: 39.6,
    roofType: 'Commercial Flat Roof',
    storeys: 'Commercial Flat',
    specialRequirements: 'High-voltage Ausgrid protection relay commissioning. Elevated boom lift required.',
    status: 'Awarded',
    submittedRequirements: {
      panelCount: 90,
      inverterType: 'Fronius Symo 20.0-3-M (x2)',
      batteryIncluded: false,
      switchboardUpgradeRequired: true,
      siteAccessInstructions: 'Loading bay B after 7:00 AM. Site induction required with security.'
    },
    quotes: [
      {
        id: 'q-4',
        subcontractorId: 'sub-1',
        subcontractorName: 'Apex Solar Installations NSW',
        amountAud: 7800,
        estimatedDays: 2,
        crewSize: 5,
        notes: 'Commercial team with cherry picker & Ausgrid qualified supervisor.',
        submittedAt: '2026-08-25',
        status: 'Accepted'
      }
    ],
    awardedSubcontractorId: 'sub-1',
    awardedAmountAud: 7800
  },
  {
    id: 'io-104',
    orderNumber: 'INST-NSW-2026-102',
    projectId: 'proj-4',
    projectCode: 'SOL-NSW-1060',
    customerName: 'Nathaniel Ward',
    address: '15 Old Northern Rd, Castle Hill NSW 2154',
    state: 'NSW',
    systemSizeKw: 6.6,
    roofType: 'Concrete Tile',
    storeys: 'Single Storey',
    specialRequirements: 'Standard 6.6kW residential single phase install.',
    status: 'Quotes Received',
    submittedRequirements: {
      panelCount: 16,
      inverterType: 'Sungrow SG5.0RS',
      batteryIncluded: false,
      switchboardUpgradeRequired: false,
      siteAccessInstructions: 'Front driveway access.'
    },
    quotes: [
      {
        id: 'q-5',
        subcontractorId: 'sub-1',
        subcontractorName: 'Apex Solar Installations NSW',
        amountAud: 1850,
        estimatedDays: 1,
        crewSize: 2,
        notes: 'Standard single phase quote.',
        submittedAt: '2026-09-02',
        status: 'Pending'
      },
      {
        id: 'q-6',
        subcontractorId: 'sub-3',
        subcontractorName: 'Metro Pro Solar Crew Sydney',
        amountAud: 1750,
        estimatedDays: 1,
        crewSize: 2,
        notes: 'Can complete within 48 hours of dispatch.',
        submittedAt: '2026-09-03',
        status: 'Pending'
      }
    ]
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerId: 'cnt-2',
    customerName: 'Brooke Henderson',
    suburb: 'Chermside, Brisbane',
    state: 'QLD',
    rating: 5,
    comment: 'Exceptional solar service! The team handled our Energex approvals seamlessly and the 13.2kW Tesla Powerwall install in Chermside was completed in one single day. Our quarterly electricity bill went from $980 to a $14 credit!',
    systemDetails: '13.2kW Jinko Solar + Tesla Powerwall 3',
    createdAt: '2024-09-10',
    googleMyBusinessSynced: true,
    published: true,
    adminReply: 'Thank you Brooke! Delighted that your Powerwall system has eliminated your power bills. Great work by our QLD install crew.'
  },
  {
    id: 'rev-2',
    customerId: 'cnt-1',
    customerName: 'Harrison Davies',
    suburb: 'Strathfield, Sydney',
    state: 'NSW',
    rating: 5,
    comment: 'From the OpenSolar design 3D simulation to the physical installation in Strathfield, everything was top tier. The BridgeSelect STC rebate discount was applied directly on the invoice so we saved over $3,800 immediately.',
    systemDetails: '10.4kW AIKO Solar + Sungrow 9.6kWh Battery',
    createdAt: '2026-08-28',
    googleMyBusinessSynced: true,
    published: true
  }
];

export const INITIAL_SMS_MESSAGES: MessageMediaSMS[] = [
  {
    id: 'sms-1',
    direction: 'outbound',
    senderNumber: '+61 2 8311 4920',
    recipientNumber: '+61 411 234 567',
    contactId: 'cnt-1',
    contactName: 'Harrison Davies',
    projectId: 'proj-1',
    messageText: 'Hi Harrison, your 10.4kW AIKO solar installation has been successfully commissioned today! Your STC rebate assignment is with BridgeSelect. Check your customer portal for your live monitoring link.',
    timestamp: '2026-08-25T16:15:00Z',
    status: 'delivered'
  },
  {
    id: 'sms-2',
    direction: 'inbound',
    senderNumber: '+61 411 234 567',
    recipientNumber: '+61 2 8311 4920',
    contactId: 'cnt-1',
    contactName: 'Harrison Davies',
    projectId: 'proj-1',
    messageText: 'Awesome, thanks Lachlan! The Sungrow app is already showing 7.8kW generation in Strathfield right now. Super impressed with David and the Apex crew.',
    timestamp: '2026-08-25T16:22:00Z',
    status: 'received'
  },
  {
    id: 'sms-3',
    direction: 'outbound',
    senderNumber: '+61 7 3184 8921',
    recipientNumber: '+61 422 789 331',
    contactId: 'cnt-2',
    contactName: 'Brooke Henderson',
    projectId: 'proj-2',
    messageText: 'Hi Brooke, notice from AusSolar: Your 13.2kW Tesla system in Chermside is due for its 2-year CEC health & isolator check. We have automated a booking slot for next Tuesday. Please reply YES to confirm.',
    timestamp: '2026-08-25T10:00:00Z',
    status: 'delivered'
  }
];

export const INITIAL_VOIP_CALLS: VoIPCallLog[] = [
  {
    id: 'call-1',
    direction: 'outbound',
    callerNumber: '+61 2 8311 4920',
    recipientNumber: '+61 411 234 567',
    contactName: 'Harrison Davies',
    durationSeconds: 245,
    timestamp: '2026-08-24T11:15:00Z',
    status: 'answered'
  },
  {
    id: 'call-2',
    direction: 'inbound',
    callerNumber: '+61 450 123 456',
    recipientNumber: '+61 2 8311 4922',
    contactName: 'David Miller (Apex Solar)',
    durationSeconds: 180,
    timestamp: '2026-08-25T08:30:00Z',
    status: 'answered'
  },
  {
    id: 'call-3',
    direction: 'inbound',
    callerNumber: '+61 401 555 123',
    recipientNumber: '+61 2 8311 4920',
    contactName: 'Nathaniel Ward',
    durationSeconds: 0,
    timestamp: '2026-09-02T15:40:00Z',
    status: 'missed'
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'u-1',
    employeeName: 'Sarah Jenkins',
    leaveType: 'Annual Leave',
    startDate: '2026-09-14',
    endDate: '2026-09-18',
    days: 5,
    reason: 'Family holiday on Sunshine Coast',
    status: 'Pending',
    createdAt: '2026-09-01'
  },
  {
    id: 'leave-2',
    employeeId: 'u-2',
    employeeName: 'David Miller',
    leaveType: 'Rostered Day Off (RDO)',
    startDate: '2026-09-08',
    endDate: '2026-09-08',
    days: 1,
    reason: 'Monthly scheduled CEC installer RDO',
    status: 'Approved',
    createdAt: '2026-08-25'
  },
  {
    id: 'leave-3',
    employeeId: 'u-3',
    employeeName: 'Liam Chen',
    leaveType: 'Sick & Carer Leave',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    days: 2,
    reason: 'Flu symptoms and medical consultation',
    status: 'Approved',
    createdAt: '2026-08-19'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'gmail',
    name: 'Google Workspace Gmail',
    category: 'Customer Communication',
    enabled: true,
    description: 'Two-way customer email synchronization and lead correspondence logging.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar Sync',
    category: 'Field Operations',
    enabled: true,
    description: 'Automated site survey, installation date, and maintenance appointment bookings.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'gmb',
    name: 'Google My Business Reviews',
    category: 'Reputation & Marketing',
    enabled: true,
    description: 'Directly sync and publish 5-star customer reviews to Google Maps listing.',
    lastSyncTime: '15 mins ago'
  },
  {
    id: 'xero',
    name: 'Xero Cloud Accounting',
    category: 'Finance & Invoicing',
    enabled: true,
    description: 'Bi-directional invoice creation, milestone reconciliation, and contractor bill syncing.',
    lastSyncTime: '1 hour ago'
  },
  {
    id: 'bridgeselect',
    name: 'CER BridgeSelect STC Portal',
    category: 'Regulatory & Rebates',
    enabled: true,
    description: 'Clean Energy Regulator STC small-scale technology certificate generation & verification.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'opensolar',
    name: 'OpenSolar Design Platform',
    category: 'Solar Engineering',
    enabled: true,
    description: 'Automated 3D proposal design, system CAD layout, and contract PDF integration.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'messagemedia',
    name: 'MessageMedia SMS Gateway',
    category: 'Customer Communication',
    enabled: true,
    description: 'Automated 2-way Australian mobile SMS for site arrival notices and customer reminders.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp Newsletter & EDM',
    category: 'Marketing Automation',
    enabled: true,
    description: 'Two-way email sync, automated solar seasonal maintenance tips and battery upgrade EDM campaigns.',
    lastSyncTime: 'Two-way Active'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    category: 'Customer Communication',
    enabled: true,
    description: 'Meta Cloud API direct chat channel with homeowners for roof photo uploads and real-time support.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'voipline',
    name: 'VoIPLine Telecom AU',
    category: 'Telephony & PBX',
    enabled: true,
    description: 'Virtual cloud PBX click-to-call, customer caller ID lookup, and audio call recordings.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'messenger',
    name: 'Meta Ads & Messenger Lead Sync',
    category: 'Lead Generation',
    enabled: true,
    description: 'Instant ingestion of Facebook & Instagram solar battery rebate lead forms and Messenger chat.',
    lastSyncTime: 'Real-time'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams Webhook',
    category: 'Internal Comms',
    enabled: true,
    description: 'Adaptive Card channel notifications for new closed sales deals, dispatch alerts, and escalations.',
    lastSyncTime: 'Real-time'
  }
];

export const INITIAL_REFERRAL_BONUSES: ReferralBonus[] = [
  {
    id: 'ref-1',
    referralCode: 'REF-2026-001',
    referredById: 'cnt-1',
    referredByName: 'Harrison Davies',
    referralContactId: 'cnt-5',
    referralName: 'Nathaniel Ward',
    address: '88 Old Northern Road, Castle Hill NSW 2154',
    phone: '+61 401 555 123',
    email: 'nathaniel.ward@gmail.com',
    referralAmountAud: 500,
    referralStatus: 'Install Scheduled',
    linkedProjectId: 'proj-1',
    linkedProjectCode: 'SOL-NSW-1042',
    paymentStatus: 'Approved for Payment',
    paymentReference: 'EFT-REF-89104',
    notes: 'Neighbour referral for premium 13.2kW system with Tesla Powerwall 3. Approved per referral program terms.',
    attachments: [
      {
        id: 'att-1',
        name: 'Harrison_Davies_Referral_Claim.pdf',
        sizeBytes: 124500,
        uploadedAt: '2026-08-29',
        fileType: 'pdf'
      }
    ],
    createdAt: '2026-08-28'
  },
  {
    id: 'ref-2',
    referralCode: 'REF-2026-002',
    referredById: 'cnt-2',
    referredByName: 'Brooke Henderson',
    referralContactId: 'cnt-1',
    referralName: 'Harrison Davies',
    address: '42 Albert Road, Strathfield NSW 2135',
    phone: '+61 411 234 567',
    email: 'harrison.davies@gmail.com',
    referralAmountAud: 350,
    referralStatus: 'Installation in Progress',
    linkedProjectId: 'proj-1',
    linkedProjectCode: 'SOL-NSW-1042',
    paymentStatus: 'Paid via EFT',
    paymentReference: 'CBA-EFT-992314',
    notes: 'Family referral bonus paid directly to Brooke Henderson account via CommBank EFT.',
    attachments: [
      {
        id: 'att-2',
        name: 'CBA_EFT_Transfer_Receipt_Brooke_350.pdf',
        sizeBytes: 88200,
        uploadedAt: '2026-08-22',
        fileType: 'pdf'
      },
      {
        id: 'att-3',
        name: 'Signed_Referral_Voucher.png',
        sizeBytes: 342000,
        uploadedAt: '2026-08-21',
        fileType: 'image'
      }
    ],
    createdAt: '2026-08-20',
    paidAt: '2026-08-22'
  },
  {
    id: 'ref-3',
    referralCode: 'REF-2026-003',
    referredById: 'cnt-5',
    referredByName: 'Nathaniel Ward',
    referralContactId: 'cnt-3',
    referralName: 'Marcus Sterling',
    address: '120 George St, Parramatta NSW 2150',
    phone: '+61 433 912 445',
    email: 'm.sterling@sterlingdistributors.com.au',
    referralAmountAud: 1000,
    referralStatus: 'Engineering & DNSP Approval',
    linkedProjectId: 'proj-2',
    linkedProjectCode: 'SOL-NSW-1043',
    paymentStatus: 'Pending Review',
    notes: 'Commercial 39.6kW referral. Bonus pending final DNSP grid approval from Ausgrid.',
    attachments: [],
    createdAt: '2026-09-01'
  }
];

export const INITIAL_SYSTEM_FEATURES: SystemFeatureConfig[] = [
  {
    id: 'dashboard',
    name: 'Executive Dashboard',
    description: 'Real-time solar pipeline metrics, revenue, conversion rates, and stage breakdowns.',
    category: 'Core CRM',
    enabled: true,
    showInSidebar: true,
    order: 1
  },
  {
    id: 'contacts',
    name: 'Contacts & Multi-Property',
    description: 'Residential & commercial customer management with multi-site address tracking.',
    category: 'Core CRM',
    enabled: true,
    showInSidebar: true,
    order: 2
  },
  {
    id: 'companies',
    name: 'Companies & Suppliers',
    description: 'Commercial solar accounts, equipment distributors, and electrical subcontractors.',
    category: 'Core CRM',
    enabled: true,
    showInSidebar: true,
    order: 3
  },
  {
    id: 'leads',
    name: 'Leads (Meta Ads)',
    description: 'Meta Facebook/Instagram lead capture, phase validation, and 1-click project conversion.',
    category: 'Core CRM',
    enabled: true,
    showInSidebar: true,
    order: 4
  },
  {
    id: 'projects',
    name: 'Solar Projects',
    description: 'Full 10-stage Australian project delivery: Site Survey, DNSP Approval, STC lodgement, and commissioning.',
    category: 'Operations & Field',
    enabled: true,
    showInSidebar: true,
    order: 5
  },
  {
    id: 'tickets',
    name: 'Support & Warranty Tickets',
    description: 'Post-install service requests, inverter fault codes, switchboard trips, and technician scheduling.',
    category: 'Operations & Field',
    enabled: true,
    showInSidebar: true,
    order: 6
  },
  {
    id: 'referrals',
    name: 'Referral Bonus Program',
    description: 'Customer referral reward vouchers, banking EFT payments, and proof attachment compliance.',
    category: 'Core CRM',
    enabled: true,
    showInSidebar: true,
    order: 7
  },
  {
    id: 'maintenance',
    name: '2-Year Periodic Maintenance',
    description: 'Automated 24-month CEC safety inspection cycles, notification triggers, and safety reports.',
    category: 'Operations & Field',
    enabled: true,
    showInSidebar: true,
    order: 8
  },
  {
    id: 'subcontractors',
    name: 'Subcontractor Installers',
    description: 'Accredited CEC electrician roster, insurance expiry audits, and metro service coverage.',
    category: 'Operations & Field',
    enabled: true,
    showInSidebar: true,
    order: 9
  },
  {
    id: 'sales-orders',
    name: 'Sales Orders & Warehouse',
    description: 'Equipment bill of materials (BOM), warehouse inventory picking, and dispatch notes.',
    category: 'Supply Chain',
    enabled: true,
    showInSidebar: true,
    order: 10
  },
  {
    id: 'install-orders',
    name: 'Install Orders (RFQs)',
    description: 'Tendering installation labor to CEC accredited subcontractors, quote reviews, and award workflow.',
    category: 'Supply Chain',
    enabled: true,
    showInSidebar: true,
    order: 11
  },
  {
    id: 'pl-statement',
    name: 'P&L Statement & Financials',
    description: 'Project-level profit & loss, gross margin calculation, equipment vs labor costs, and STC cashflow.',
    category: 'Finance & HR',
    enabled: true,
    showInSidebar: true,
    order: 12
  },
  {
    id: 'hrms',
    name: 'HRMS & Staff Roster',
    description: 'Internal employees, department allocation, leave requests approval, and VoIP extension binding.',
    category: 'Finance & HR',
    enabled: true,
    showInSidebar: true,
    order: 13
  },
  {
    id: 'integrations',
    name: 'Integrations Hub',
    description: '12 active external connectors: VoIPLine, MessageMedia, Meta Ads, BridgeSelect STC, OpenSolar, Xero, SolarEdge, Sungrow, Fronius, Ausgrid.',
    category: 'Communications & Tools',
    enabled: true,
    showInSidebar: true,
    order: 14
  },
  {
    id: 'company-profile',
    name: 'Company Profile & Branding',
    description: 'Corporate ABN, legal details, CEC retailer credential, dynamic logos, and portal theme customization.',
    category: 'Communications & Tools',
    enabled: true,
    showInSidebar: true,
    order: 15
  },
  {
    id: 'settings',
    name: 'Settings & Administration',
    description: 'Dynamic feature flags, dynamic roles & access control, user accounts, hardware dropdowns, and security.',
    category: 'Communications & Tools',
    enabled: true,
    showInSidebar: true,
    order: 16
  },
  {
    id: 'customer-portal',
    name: 'Customer Self-Service Portal',
    description: 'Branded portal for homeowners to track solar install, download proposals, and review tickets.',
    category: 'Portals & Customer',
    enabled: true,
    showInSidebar: false,
    order: 17
  },
  {
    id: 'installer-portal',
    name: 'Subcontractor Installer Portal',
    description: 'Mobile-friendly portal for CEC installers to view work orders, submit RFQ bids, and upload photos.',
    category: 'Portals & Customer',
    enabled: true,
    showInSidebar: false,
    order: 18
  },
  {
    id: 'voip-telephony',
    name: 'VoIPLine Softphone Dialer',
    description: 'In-app virtual phone dialer with Australian geographic caller ID (+61 2 / +61 7) and call logging.',
    category: 'Communications & Tools',
    enabled: true,
    showInSidebar: false,
    order: 19
  },
  {
    id: 'sinch-sms',
    name: 'Sinch / MessageMedia 2-Way SMS',
    description: 'Two-way SMS text messaging with Australian mobile numbers and appointment notifications.',
    category: 'Communications & Tools',
    enabled: true,
    showInSidebar: false,
    order: 20
  },
  {
    id: 'meta-sync',
    name: 'Meta Ads Google Sheet Ingestion',
    description: 'Live sync tool for ingesting leads from Google Sheets and Meta Webhooks.',
    category: 'Communications & Tools',
    enabled: true,
    showInSidebar: false,
    order: 21
  },
  {
    id: 'stc-calculator',
    name: 'BridgeSelect STC Engine',
    description: 'Automated Australian Clean Energy Regulator STC rebate calculation and compliance engine.',
    category: 'Operations & Field',
    enabled: true,
    showInSidebar: false,
    order: 22
  }
];

export const INITIAL_DYNAMIC_ROLES: DynamicRoleConfig[] = [
  {
    id: 'admin',
    role: 'admin',
    roleName: 'System Administrator',
    description: 'Full unconstrained authority across all ERP capabilities, financials, user accounts, and system configuration.',
    badgeColor: 'purple',
    isSystem: true,
    portalTarget: 'erp',
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true, export: true },
      contacts: { view: true, create: true, edit: true, delete: true, export: true },
      companies: { view: true, create: true, edit: true, delete: true, export: true },
      leads: { view: true, create: true, edit: true, delete: true, export: true },
      projects: { view: true, create: true, edit: true, delete: true, export: true },
      tickets: { view: true, create: true, edit: true, delete: true, export: true },
      referrals: { view: true, create: true, edit: true, delete: true, export: true },
      maintenance: { view: true, create: true, edit: true, delete: true, export: true },
      subcontractors: { view: true, create: true, edit: true, delete: true, export: true },
      'sales-orders': { view: true, create: true, edit: true, delete: true, export: true },
      'install-orders': { view: true, create: true, edit: true, delete: true, export: true },
      'pl-statement': { view: true, create: true, edit: true, delete: true, export: true },
      hrms: { view: true, create: true, edit: true, delete: true, export: true },
      integrations: { view: true, create: true, edit: true, delete: true, export: true },
      'company-profile': { view: true, create: true, edit: true, delete: true, export: true },
      settings: { view: true, create: true, edit: true, delete: true, export: true },
      'customer-portal': { view: true, create: true, edit: true, delete: true, export: true },
      'installer-portal': { view: true, create: true, edit: true, delete: true, export: true },
      'voip-telephony': { view: true, create: true, edit: true, delete: true, export: true },
      'sinch-sms': { view: true, create: true, edit: true, delete: true, export: true },
      'meta-sync': { view: true, create: true, edit: true, delete: true, export: true },
      'stc-calculator': { view: true, create: true, edit: true, delete: true, export: true }
    },
    specialActions: {
      canManageSettings: true,
      canManageUsers: true,
      canManageRoles: true,
      canUseVoip: true,
      canSendSms: true,
      canSyncMetaSheet: true,
      canApproveSTC: true,
      canAccessCustomerPortal: true,
      canAccessInstallerPortal: true
    }
  },
  {
    id: 'manager',
    role: 'manager',
    roleName: 'Operations & Sales Manager',
    description: 'High-level operational oversight: pipeline management, RFQ awards, installer dispatch, and team supervision.',
    badgeColor: 'blue',
    isSystem: true,
    portalTarget: 'erp',
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: false, export: true },
      contacts: { view: true, create: true, edit: true, delete: false, export: true },
      companies: { view: true, create: true, edit: true, delete: false, export: true },
      leads: { view: true, create: true, edit: true, delete: false, export: true },
      projects: { view: true, create: true, edit: true, delete: false, export: true },
      tickets: { view: true, create: true, edit: true, delete: false, export: true },
      referrals: { view: true, create: true, edit: true, delete: false, export: true },
      maintenance: { view: true, create: true, edit: true, delete: false, export: true },
      subcontractors: { view: true, create: true, edit: true, delete: false, export: true },
      'sales-orders': { view: true, create: true, edit: true, delete: false, export: true },
      'install-orders': { view: true, create: true, edit: true, delete: false, export: true },
      'pl-statement': { view: true, create: false, edit: false, delete: false, export: true },
      hrms: { view: true, create: true, edit: true, delete: false, export: true },
      integrations: { view: true, create: false, edit: false, delete: false, export: false },
      'company-profile': { view: true, create: false, edit: true, delete: false, export: false },
      settings: { view: true, create: false, edit: false, delete: false, export: false },
      'customer-portal': { view: true, create: true, edit: true, delete: false, export: true },
      'installer-portal': { view: true, create: true, edit: true, delete: false, export: true },
      'voip-telephony': { view: true, create: true, edit: true, delete: false, export: true },
      'sinch-sms': { view: true, create: true, edit: true, delete: false, export: true },
      'meta-sync': { view: true, create: true, edit: true, delete: false, export: true },
      'stc-calculator': { view: true, create: true, edit: true, delete: false, export: true }
    },
    specialActions: {
      canManageSettings: false,
      canManageUsers: true,
      canManageRoles: false,
      canUseVoip: true,
      canSendSms: true,
      canSyncMetaSheet: true,
      canApproveSTC: true,
      canAccessCustomerPortal: true,
      canAccessInstallerPortal: true
    }
  },
  {
    id: 'employee',
    role: 'employee',
    roleName: 'Sales & Field Representative',
    description: 'Frontline sales representative: prospecting leads, logging calls, scheduling site surveys, and updating notes.',
    badgeColor: 'lime',
    isSystem: true,
    portalTarget: 'erp',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      contacts: { view: true, create: true, edit: true, delete: false, export: false },
      companies: { view: true, create: false, edit: false, delete: false, export: false },
      leads: { view: true, create: true, edit: true, delete: false, export: false },
      projects: { view: true, create: false, edit: true, delete: false, export: false },
      tickets: { view: true, create: true, edit: true, delete: false, export: false },
      referrals: { view: true, create: true, edit: false, delete: false, export: false },
      maintenance: { view: true, create: false, edit: false, delete: false, export: false },
      subcontractors: { view: false, create: false, edit: false, delete: false, export: false },
      'sales-orders': { view: false, create: false, edit: false, delete: false, export: false },
      'install-orders': { view: false, create: false, edit: false, delete: false, export: false },
      'pl-statement': { view: false, create: false, edit: false, delete: false, export: false },
      hrms: { view: true, create: true, edit: false, delete: false, export: false },
      integrations: { view: false, create: false, edit: false, delete: false, export: false },
      'company-profile': { view: false, create: false, edit: false, delete: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      'customer-portal': { view: false, create: false, edit: false, delete: false, export: false },
      'installer-portal': { view: false, create: false, edit: false, delete: false, export: false },
      'voip-telephony': { view: true, create: true, edit: true, delete: false, export: false },
      'sinch-sms': { view: true, create: true, edit: true, delete: false, export: false },
      'meta-sync': { view: false, create: false, edit: false, delete: false, export: false },
      'stc-calculator': { view: true, create: false, edit: false, delete: false, export: false }
    },
    specialActions: {
      canManageSettings: false,
      canManageUsers: false,
      canManageRoles: false,
      canUseVoip: true,
      canSendSms: true,
      canSyncMetaSheet: false,
      canApproveSTC: false,
      canAccessCustomerPortal: false,
      canAccessInstallerPortal: false
    }
  },
  {
    id: 'solar-designer',
    role: 'solar-designer',
    roleName: 'Solar & Electrical Designer',
    description: 'Engineering specialist responsible for SLDs, OpenSolar 3D roof layouts, DNSP network applications, and system sizing.',
    badgeColor: 'cyan',
    isSystem: false,
    portalTarget: 'erp',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      contacts: { view: true, create: false, edit: false, delete: false, export: false },
      companies: { view: true, create: false, edit: false, delete: false, export: false },
      leads: { view: true, create: false, edit: true, delete: false, export: false },
      projects: { view: true, create: true, edit: true, delete: false, export: true },
      tickets: { view: true, create: false, edit: true, delete: false, export: false },
      referrals: { view: false, create: false, edit: false, delete: false, export: false },
      maintenance: { view: true, create: false, edit: true, delete: false, export: false },
      subcontractors: { view: true, create: false, edit: false, delete: false, export: false },
      'sales-orders': { view: true, create: true, edit: true, delete: false, export: false },
      'install-orders': { view: true, create: true, edit: true, delete: false, export: false },
      'pl-statement': { view: false, create: false, edit: false, delete: false, export: false },
      hrms: { view: true, create: false, edit: false, delete: false, export: false },
      integrations: { view: true, create: false, edit: false, delete: false, export: false },
      'company-profile': { view: false, create: false, edit: false, delete: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      'customer-portal': { view: true, create: false, edit: false, delete: false, export: false },
      'installer-portal': { view: true, create: false, edit: false, delete: false, export: false },
      'voip-telephony': { view: true, create: true, edit: true, delete: false, export: false },
      'sinch-sms': { view: true, create: true, edit: true, delete: false, export: false },
      'meta-sync': { view: false, create: false, edit: false, delete: false, export: false },
      'stc-calculator': { view: true, create: true, edit: true, delete: false, export: true }
    },
    specialActions: {
      canManageSettings: false,
      canManageUsers: false,
      canManageRoles: false,
      canUseVoip: true,
      canSendSms: true,
      canSyncMetaSheet: false,
      canApproveSTC: true,
      canAccessCustomerPortal: true,
      canAccessInstallerPortal: true
    }
  },
  {
    id: 'customer',
    role: 'customer',
    roleName: 'Customer (Self-Service Portal)',
    description: 'Residential or commercial client tracking live installation status, accessing invoices, and submitting warranty tickets.',
    badgeColor: 'amber',
    isSystem: true,
    portalTarget: 'customer',
    permissions: {
      dashboard: { view: false, create: false, edit: false, delete: false, export: false },
      contacts: { view: false, create: false, edit: false, delete: false, export: false },
      companies: { view: false, create: false, edit: false, delete: false, export: false },
      leads: { view: false, create: false, edit: false, delete: false, export: false },
      projects: { view: true, create: false, edit: false, delete: false, export: false },
      tickets: { view: true, create: true, edit: false, delete: false, export: false },
      referrals: { view: true, create: true, edit: false, delete: false, export: false },
      maintenance: { view: false, create: false, edit: false, delete: false, export: false },
      subcontractors: { view: false, create: false, edit: false, delete: false, export: false },
      'sales-orders': { view: false, create: false, edit: false, delete: false, export: false },
      'install-orders': { view: false, create: false, edit: false, delete: false, export: false },
      'pl-statement': { view: false, create: false, edit: false, delete: false, export: false },
      hrms: { view: false, create: false, edit: false, delete: false, export: false },
      integrations: { view: false, create: false, edit: false, delete: false, export: false },
      'company-profile': { view: false, create: false, edit: false, delete: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      'customer-portal': { view: true, create: true, edit: true, delete: false, export: true },
      'installer-portal': { view: false, create: false, edit: false, delete: false, export: false },
      'voip-telephony': { view: false, create: false, edit: false, delete: false, export: false },
      'sinch-sms': { view: false, create: false, edit: false, delete: false, export: false },
      'meta-sync': { view: false, create: false, edit: false, delete: false, export: false },
      'stc-calculator': { view: false, create: false, edit: false, delete: false, export: false }
    },
    specialActions: {
      canManageSettings: false,
      canManageUsers: false,
      canManageRoles: false,
      canUseVoip: false,
      canSendSms: false,
      canSyncMetaSheet: false,
      canApproveSTC: false,
      canAccessCustomerPortal: true,
      canAccessInstallerPortal: false
    }
  },
  {
    id: 'installer',
    role: 'installer',
    roleName: 'Subcontractor Installer Portal',
    description: 'CEC accredited electrician crew access: review assigned RFQs, submit quotes, and upload commissioning photo evidence.',
    badgeColor: 'emerald',
    isSystem: true,
    portalTarget: 'installer',
    permissions: {
      dashboard: { view: false, create: false, edit: false, delete: false, export: false },
      contacts: { view: false, create: false, edit: false, delete: false, export: false },
      companies: { view: false, create: false, edit: false, delete: false, export: false },
      leads: { view: false, create: false, edit: false, delete: false, export: false },
      projects: { view: true, create: false, edit: true, delete: false, export: false },
      tickets: { view: false, create: false, edit: false, delete: false, export: false },
      referrals: { view: false, create: false, edit: false, delete: false, export: false },
      maintenance: { view: false, create: false, edit: false, delete: false, export: false },
      subcontractors: { view: false, create: false, edit: false, delete: false, export: false },
      'sales-orders': { view: false, create: false, edit: false, delete: false, export: false },
      'install-orders': { view: true, create: false, edit: true, delete: false, export: false },
      'pl-statement': { view: false, create: false, edit: false, delete: false, export: false },
      hrms: { view: false, create: false, edit: false, delete: false, export: false },
      integrations: { view: false, create: false, edit: false, delete: false, export: false },
      'company-profile': { view: false, create: false, edit: false, delete: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      'customer-portal': { view: false, create: false, edit: false, delete: false, export: false },
      'installer-portal': { view: true, create: true, edit: true, delete: false, export: true },
      'voip-telephony': { view: false, create: false, edit: false, delete: false, export: false },
      'sinch-sms': { view: false, create: false, edit: false, delete: false, export: false },
      'meta-sync': { view: false, create: false, edit: false, delete: false, export: false },
      'stc-calculator': { view: false, create: false, edit: false, delete: false, export: false }
    },
    specialActions: {
      canManageSettings: false,
      canManageUsers: false,
      canManageRoles: false,
      canUseVoip: false,
      canSendSms: false,
      canSyncMetaSheet: false,
      canApproveSTC: false,
      canAccessCustomerPortal: false,
      canAccessInstallerPortal: true
    }
  }
];

export const INITIAL_SYSTEM_RULES: SystemOperationalRules = {
  stcTradingRateAud: 39.50,
  customerStcRateAud: 36.00, // Customer STC rate shown to customer on quotes/invoices
  internalStcRateAud: 39.50, // Internal STC rate used for CER/BridgeSelect profit calculation
  defaultWarrantyYearsPanels: 25,
  defaultWarrantyYearsInverter: 10,
  defaultWarrantyYearsBattery: 10,
  referralBonusDefaultAud: 500,
  maintenanceIntervalMonths: 24,
  requireReferralReceiptProof: true,
  enableAutoDnspValidation: true,
  enableAutoStcCalculation: true,
  defaultState: 'NSW',
  emergencyContactPhone: '1300 852 400',
  openSolarSyncIntervalMinutes: 15
};



