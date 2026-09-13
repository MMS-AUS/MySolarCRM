export type UserRole = string;

export type AustralianState = 'NSW' | 'QLD';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  voipLineNumber: string; // e.g. "+61 2 8311 4920" or "+61 7 3184 8920"
  messageMediaSenderId: string;
  role: UserRole;
  department?: 'Management' | 'Sales' | 'Operations' | 'Warehouse' | 'Customer Support' | 'Engineering';
  avatar?: string;
  assignedDomain: string; // e.g. "aussolar.com.au"
  permissions?: RolePermissions;
  password?: string;
  isPasswordSet?: boolean;
  inviteToken?: string;
  inviteSentAt?: string;
  inviteStatus?: 'pending_password' | 'active';
}

export interface FeaturePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export interface DynamicRoleSpecialActions {
  canManageSettings: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canUseVoip: boolean;
  canSendSms: boolean;
  canSyncMetaSheet: boolean;
  canApproveSTC: boolean;
  canAccessCustomerPortal: boolean;
  canAccessInstallerPortal: boolean;
}

export interface DynamicRoleConfig {
  id: string; // e.g. 'admin', 'manager', 'employee', 'installer', 'customer', or custom ID
  role: string; // alias for compatibility
  roleName: string;
  description: string;
  badgeColor: string; // e.g. 'purple', 'blue', 'lime', 'amber', 'emerald', 'rose', 'cyan'
  isSystem?: boolean;
  portalTarget?: 'erp' | 'customer' | 'installer';
  permissions: Record<string, FeaturePermission>;
  specialActions: DynamicRoleSpecialActions;
}

export interface SystemFeatureConfig {
  id: string;
  name: string;
  description: string;
  category: 'Core CRM' | 'Operations & Field' | 'Supply Chain' | 'Finance & HR' | 'Portals & Customer' | 'Communications & Tools';
  enabled: boolean;
  showInSidebar: boolean;
  badgeText?: string;
  iconName?: string;
  order?: number;
}

export interface SystemOperationalRules {
  stcTradingRateAud: number; // Retained for backward compatibility
  customerStcRateAud: number; // STC rate shown to customers and used for point-of-sale invoice discounts (e.g. $36.00 AUD)
  internalStcRateAud: number; // STC wholesale trading rate claimed from CER/BridgeSelect for company profit calculation (e.g. $39.50 AUD)
  defaultWarrantyYearsPanels: number;
  defaultWarrantyYearsInverter: number;
  defaultWarrantyYearsBattery: number;
  referralBonusDefaultAud: number;
  maintenanceIntervalMonths: number;
  requireReferralReceiptProof: boolean;
  enableAutoDnspValidation: boolean;
  enableAutoStcCalculation: boolean;
  defaultState: 'NSW' | 'QLD';
  emergencyContactPhone: string;
  openSolarSyncIntervalMinutes: number;
}

export interface RolePermissions {
  dashboard: boolean;
  contacts: { view: boolean; edit: boolean; delete: boolean };
  companies: { view: boolean; edit: boolean };
  leads: { view: boolean; edit: boolean; syncSheets: boolean; convertToProject: boolean };
  projects: { view: boolean; edit: boolean; delete: boolean; assignInstaller: boolean };
  tickets: { view: boolean; resolve: boolean };
  maintenance: { view: boolean; schedule: boolean; sendAlerts: boolean };
  subcontractors: { view: boolean; manage: boolean; approveQuotes: boolean };
  salesOrders: { view: boolean; edit: boolean; manageInventory: boolean };
  installOrders: { view: boolean; createRfq: boolean; awardQuote: boolean };
  plStatement: { view: boolean; export: boolean };
  hrms: { view: boolean; manageEmployees: boolean; approveLeave: boolean };
  settings: { dropdownManagement: boolean; accessControl: boolean; domainSettings: boolean };
}

export interface ContactAddress {
  id: string;
  street: string;
  suburb: string;
  state: AustralianState;
  address?: string;
  city?: string;
  postcode?: string;
  propertyType?: 'Primary Residence' | 'Investment Property' | 'Commercial Facility' | 'Holiday Home' | string;
  systemSizeKw?: number;
  notes?: string;
  isPrimary?: boolean;
}

export interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  name: string;
  streetAddress?: string;
  suburb?: string;
  state: AustralianState | string;
  postcode?: string;
  area?: 'Metro' | 'Regional' | string;
  email: string;
  phone: string;
  contactOwner?: string;
  contactOwnerName?: string;
  contactType?: string;
  primaryCompany?: string;
  city: string; // Sydney, Newcastle, Brisbane, Gold Coast, etc.
  address: string;
  addresses?: ContactAddress[];
  type: 'Residential' | 'Commercial' | 'Subcontractor' | 'Vendor' | string;
  companyId?: string;
  companyName?: string;
  source: 'Gmail Sync' | 'Outlook Sync' | 'OpenSolar' | 'Meta Ads' | 'Manual' | string;
  openSolarContactId?: string;
  assignedVoipLineNumber?: string;
  notes?: string;
  createdAt: string;
  lastContactedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  companyOwner?: string;
  companyOwnerName?: string;
  createdAt?: string;
  phone: string;
  country?: string;
  abn: string;
  type: 'Commercial Customer' | 'Subcontractor Installer' | 'Equipment Vendor' | string;
  state: AustralianState | string;
  city: string;
  email: string;
  contactPerson: string;
  cecAccredited?: boolean;
  creditLimit?: number;
  activeProjectsCount: number;
  abnVerified?: boolean;
}

export interface LeadAttachment {
  id: string;
  name: string;
  sizeBytes?: number;
  size?: string;
  uploadedAt: string;
  uploadedBy: 'staff' | 'customer';
  category: 'Contract' | 'Electricity Bill' | 'Switchboard Photo' | 'Roof Photo' | 'DNSP Approval' | 'ID Proof' | 'Site Plan' | 'Other';
  fileUrl?: string;
  fileData?: string;
  notes?: string;
  url?: string;
}

export interface CustomerPortalCredentials {
  username: string;
  tempPassword?: string;
  generatedAt: string;
  inviteSentAt?: string;
  inviteLink: string;
  status: 'Credentials Sent' | 'Invite Sent' | 'Active';
}

export interface XeroPaymentReceipt {
  id: string;
  receiptNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  contactId: string;
  contactName: string;
  contactEmail?: string;
  paymentDate: string;
  amountPaidAud: number;
  paymentMethod: 'Direct Debit / EFT' | 'Credit Card (Stripe)' | 'BPAY' | 'Bank Deposit' | string;
  bankReference: string;
  allocatedToInvoiceAud: number;
  remainingInvoiceBalanceAud: number;
  notes?: string;
  updatedAt: string;
}

export type LeadActivityType = 'Note' | 'Email' | 'Call' | 'Task' | 'Meeting' | 'Status Change' | 'System';

export interface LeadActivity {
  id: string;
  leadId: string;
  type: LeadActivityType;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  completed?: boolean;
  dueDate?: string;
  callOutcome?: string;
  meetingTime?: string;
}

export interface Lead {
  id: string;
  projectNumber?: string; // Project # - Editable, entered manually by the user
  leadDate?: string;
  platform?: string; // Platform - Dropdown list managed from Settings
  salesPersonName?: string; // Sale Person Name - Dropdown list managed from Settings
  state: AustralianState | string; // State - Dropdown list managed from Settings
  postcode?: string; // Post Code - Text Field with Google Auto-complete verification or manual unverified
  area?: 'Metro' | 'Regional' | string; // Area - Text Field auto populate based on post code
  nearestBigCity?: string; // Suburb (Nearest Big city) - Text Field auto populate based on suburb entered
  status: string; // Lead Status - Dropdown list managed from Settings
  saleDate?: string; // Sale Date - Date Picker auto populate when status is 'Contract Signed'
  firstName?: string; // First Name - Text Field
  lastName?: string; // Last Name - Text Field
  managerRenteeFirstName?: string; // Manager/ Rentee First Name - Text Field
  managerRenteeLastName?: string; // Manager/ Rentee Last Name - Text Field
  address?: string; // Address - Text Field with Google Auto-complete verification or manual unverified
  suburb: string; // Suburb - Text Field with Google Auto-complete verification or manual unverified
  addressVerified?: boolean; // True if verified via Google autocomplete, false if unverified manual
  primaryMobile?: string; // Primary Mobile No - Text Field formatted, auto adds 0 if starts with 4
  secondaryMobile?: string; // Secondary Mobile No - Text Field formatted, auto adds 0 if starts with 4
  email: string; // Email ID - Text Field formatted, validated, accepts multiple email IDs
  salesTeamNotes?: string; // Sales Team Notes - Combo box
  systemPrice?: number | string; // System Price - AUD Accounts format ($XX,XXX.XX)
  sellingPrice?: number | string; // Selling Price (After Rebates) - AUD Accounts format ($XX,XXX.XX)
  deposit?: number | string; // Deposit - AUD Accounts format ($XX,XXX.XX)
  depositReceivedDate?: string; // Deposit Received Date (mm/dd/yyyy) - Date picker auto populate when status is 'Deposit Received'

  // Contact & Company Associations (HubSpot model)
  contactId?: string;
  hasCompany?: boolean;
  companyId?: string;
  companyName?: string;
  companyOwner?: string;
  companyCreateDate?: string;
  companyPhone?: string;
  companyCity?: string;
  companyCountry?: string;
  companyType?: string;
  companyAbn?: string;

  // Activities & Interaction Timeline (HubSpot center feed)
  activities?: LeadActivity[];

  // Solar & Electrical Equipment Hardware & Site Specifications (Before Section 5)
  noOfPanels?: number | string; // No. of Panels - Text field
  panelManufacturer?: string; // Panel Manuf. - Dropdown list managed from settings
  panelSizeW?: number | string; // Panel Size - Dependent Dropdown list managed from settings (based on Panel Manuf.)
  panelSeries?: string; // Panel Series - Dependent Dropdown list managed from settings (based on Panel Size)
  panelModel?: string; // Panel Model - Dependent Dropdown list managed from settings (based on Panel Series)

  noOfInverters?: number | string; // No. of Inverter - Text field
  inverterManufacturer?: string; // Inverter Manuf. - Dropdown list managed from settings
  inverterSizeKw?: number | string; // Inverter Size - Dependent Dropdown list managed from settings (based on Inverter Manuf.)
  inverterModel?: string; // Inverter Model - Dependent Dropdown list managed from settings (based on Inverter Size)

  noOfBatteries?: number | string; // No. of Batteries - Text field
  batteryManufacturer?: string; // Battery Manuf. - Dropdown list managed from settings
  batteryUsableCapacityKwh?: number | string; // Usable Capacity - Dependent Dropdown list managed from settings (based on Battery Manuf.)
  batteryModel?: string; // Battery Model - Dependent Dropdown list managed from settings (based on Usable Capacity)
  batterySize?: string; // Battery Size - Dependent Dropdown list managed from settings (based on Battery Model)

  houseStorey?: string; // House Storey - Dropdown list managed from settings
  // roofType already exists below, also used here as Dropdown list managed from settings
  phase?: string; // Phase - Dropdown list managed from settings (e.g. Single Phase, Three Phase, Split Phase)
  existingSystemDetails?: string; // Existing System Details - Combo Box
  docsReceived?: string; // Docs Received? - Dropdown list managed from settings (e.g. Yes, No, Partially, Pending Council/DNSP)
  docsReceivedDate?: string; // Docs Received Date - Date Picker

  // Multiple Attachments & Customer Uploads
  attachments?: LeadAttachment[];

  // Customer Portal Self-Service Credentials & Invites
  portalCredentials?: CustomerPortalCredentials;

  // Xero Cloud Accounting Tax Invoice & Receipts
  xeroInvoiceId?: string;
  xeroInvoiceNumber?: string;
  xeroInvoiceTotal?: number;
  xeroInvoiceStatus?: XeroInvoiceStatus | string;
  xeroInvoiceUrl?: string;
  xeroReceiptNumber?: string;
  xeroReceiptDate?: string;
  xeroReceiptAmount?: number;
  xeroReceiptMethod?: string;

  // Backward compatibility & Solar technical attributes
  customerName: string;
  phone: string;
  systemSizeKw: number;
  batteryRequired: boolean;
  propertyType?: 'Residential Single-Storey' | 'Residential Two-Storey' | 'Commercial Factory' | 'Commercial Retail' | string;
  roofType?: string;
  phaseType?: 'Single Phase' | 'Three Phase' | string;
  quarterlyBillAud?: number;
  source: string; // "Meta Ads", "Google Ads", etc.
  sheetSyncRowId?: string;
  createdAt: string;
  assignedTo: string;
}

export type ProjectStatus = 
  | 'Site Survey'
  | 'Engineering & DNSP Approval'
  | 'Sales Order Dispatched'
  | 'RFQ Sent to Installers'
  | 'Install Scheduled'
  | 'Installation in Progress'
  | 'Installation Completed'
  | 'BridgeSelect STC Claimed'
  | 'Grid Meter Connected'
  | 'Completed';

export interface Project {
  id: string;
  projectCode: string; // e.g. "SOL-NSW-1042"
  title: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  suburb: string;
  state: AustralianState;
  dnsp: 'Ausgrid' | 'Endeavour Energy' | 'Essential Energy' | 'Energex' | 'Ergon Energy' | string;
  status: ProjectStatus;
  systemSizeKw: number;
  panelBrand: string;
  panelModel: string;
  panelCount: number;
  inverterBrand: string;
  inverterModel: string;
  batteryBrand?: string;
  batteryCapacityKwh?: number;
  contractValueAud: number;
  stcCount: number;
  stcValueAud: number; // Internal STC claim amount (backwards compatible)
  customerStcRateAud?: number; // Customer STC rate used for quotes and customer invoice discount
  customerStcValueAud?: number; // Total customer STC amount deducted on customer invoice
  internalStcRateAud?: number; // Internal STC trading rate claimed from CER/BridgeSelect
  internalStcValueAud?: number; // Total internal STC claim value used to calculate company profits
  bridgeSelectStatus: 'Pending Verification' | 'CEC Accredited Checked' | 'Submitted to Clean Energy Regulator' | 'STCs Approved & Paid' | string;
  openSolarProposalId: string;
  openSolarSignedUrl?: string;
  openSolarContractSigned: boolean;
  salesOrderId?: string;
  installOrderId?: string;
  subcontractorId?: string;
  subcontractorName?: string;
  installerQuotedAud?: number;
  installationDate?: string;
  completedDate?: string;
  leadId?: string;
  specsDocumentUrl?: string;
  sitePlanUrl?: string;
  attachments?: LeadAttachment[];
  xeroInvoiceId?: string;
  xeroInvoiceNumber?: string;
  xeroReceiptNumber?: string;
  xeroReceiptDate?: string;
  xeroReceiptAmount?: number;
  installedPhotos?: {
    id: string;
    category: 'Array / Panels' | 'Inverter & Isolators' | 'Switchboard' | 'Earthing & Testing' | 'Commissioning Sheet';
    url: string;
    uploadedAt: string;
    verified: boolean;
  }[];

  // Top Section Fields
  projectNumber?: string; // Project Number - Auto populate from lead if info available (editable)
  amount?: number | string; // Amount - Auto populate from Selling Price (AUD) and lock for editing
  projectCreatedDate?: string; // Project Created Date - Auto populate when lead is converted
  projectClosedDate?: string; // Project Closed Date - Auto populate when Installation Status is changed to Closed
  projectStage?: string; // Project Stage - Dropdown list managed from Settings

  // Section 1: Customer & Sales
  salesPersonName?: string;
  postcode?: string;
  area?: string;
  nearestBigCity?: string;
  saleDate?: string;
  firstName?: string;
  lastName?: string;
  managerRenteeFirstName?: string;
  managerRenteeLastName?: string;
  primaryMobile?: string;
  secondaryMobile?: string;
  email?: string;
  salesTeamNotes?: string;
  systemPrice?: number | string;
  sellingPrice?: number | string;
  deposit?: number | string;
  depositReceivedDate?: string;

  // Section 2: Technical Specifications & Hardware
  noOfPanels?: number | string;
  panelManufacturer?: string;
  panelSizeW?: number | string;
  panelSeries?: string;
  noOfInverters?: number | string;
  inverterManufacturer?: string;
  inverterSizeKw?: number | string;
  noOfBatteries?: number | string;
  batteryManufacturer?: string;
  batteryModel?: string;
  usableCapacity?: string;
  batteryUsableCapacityKwh?: number | string;
  batterySize?: string;
  houseStorey?: string;
  roofType?: string;
  phase?: string;
  existingSystemDetails?: string;
  docsReceived?: string;
  docsReceivedDate?: string;

  // Section 3: Electricity Bill (EB) & Meter Checklist
  q1CustomerNameMatch?: string;
  q2AddressMatch?: string;
  q3MeterMatch?: string;
  q4MeterPhase?: string;
  q5OpenSolarSystemMatch?: string;
  q6OpenSolarPricingMatch?: string;

  // Section 4: Grid & DNSP Application
  nmi?: string;
  electricityDistributor?: string;
  gridAppRef?: string;
  energyRetailer?: string;
  retailerRef?: string;
  gridAppStatus?: string;
  gridAppliedDate?: string;
  gridRejectedDate?: string;
  gridApprovalDate?: string;

  // Section 5: Installation & Logistics
  installationStatus?: string;
  installationBookingDate?: string;
  installationBookedBy?: string;
  installationCompletedMonth?: string;
  installationDocsStatus?: string;
  installationDocsReceivedDate?: string;
  installerName?: string;
  installerInvoiceDate?: string;
  installerInvoiceNumber?: string;
  installerInvoiceAmount?: number | string;
  installerInvoiceStatus?: string;
  customerInvoiceNumber?: string;

  // Section 6: Warehouse & Equipment Dispatch
  warehouse?: string;
  salesOrderNo?: string;
  warehouseInvoiceDate?: string;
  warehouseInvoiceNumber?: string;
  warehouseInvoiceAmount?: number | string;
  warehouseInvoiceStatus?: string;
  stockStatus?: string;
  stockUsedProject?: string;
  warehouseInvoicePaidDate?: string;

  // Section 7: Financials, Payment & Finance Brokerage
  balancePayable?: number | string;
  balancePayableDate?: string;
  remainingPayment?: number | string;
  isOnFinance?: string;
  financeCompanyName?: string;
  financeAppliedDate?: string;
  financeApprovedDate?: string;
  financeApprovedAmount?: number | string;
  financeStatus?: string;

  // Section 8: STC Claims & Clean Energy Regulator (CER)
  stcTradedPortal?: string;
  stcJobNo?: string;
  solarStcs?: number | string;
  solarStcsAmount?: number | string;
  solarStcReceivedDate?: string;
  batteryStcs?: number | string;
  batteryStcsAmount?: number | string;
  batteryStcReceivedDate?: string;
  totalStcAmountReceived?: number | string;
  adminCharges?: string;
  stcStatus?: string;
  stcSubmittedDate?: string;

  // Additional associations & activities
  activities?: LeadActivity[];
  hasCompany?: boolean;
  companyName?: string;
  companyOwner?: string;
  companyAbn?: string;
  companyPhone?: string;
  companyCity?: string;
  companyCountry?: string;
  companyType?: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  projectId: string;
  projectCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  title: string;
  description: string;
  category: 'Inverter Fault / Error Code' | 'WiFi Monitoring Drop' | 'Panel Damage / Shading' | 'Switchboard Trip' | 'Roof Leak Inspection' | 'General Query';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'New' | 'Assigned' | 'Technician Scheduled' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  assignedTechnician?: string;
  resolutionNotes?: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  projectId: string;
  projectCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  state: AustralianState;
  installationDate: string;
  nextPeriodicServiceDueDate: string; // 2 years from install
  status: 'Pending' | 'Notification Sent' | 'Scheduled' | 'Overdue' | 'Completed';
  lastNotificationSentAt?: string;
  assignedTechnician?: string;
  serviceCompletedDate?: string;
  checklistPassed?: boolean;
  notes?: string;
}

export interface SubContractor {
  id: string;
  name: string;
  companyName: string;
  abn: string;
  phone: string;
  email: string;
  state: AustralianState;
  metroAreas: string[]; // e.g. ["Sydney Metro", "Wollongong", "Newcastle"] or ["Brisbane Metro", "Gold Coast"]
  cecAccreditationNumber: string;
  saaLicenseNumber: string;
  insuranceExpiryDate: string;
  rating: number; // 4.8
  completedInstalls: number;
  activeJobsCount: number;
  complianceVerified: boolean;
}

export interface SalesOrderItem {
  id?: string;
  sku?: string;
  partNumber?: string;
  description: string;
  quantity: number;
  unitCostAud: number;
  totalAud?: number;
  totalCostAud?: number;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  projectId: string;
  projectCode: string;
  customerName: string;
  supplierName: string;
  status: 'Draft' | 'Allocated' | 'Picking' | 'Dispatched' | 'Dispatched from Warehouse' | 'Delivered to Site' | 'Ordered';
  orderDate: string;
  dispatchDate?: string;
  warehouseLocation?: string;
  totalCostAud: number;
  items: SalesOrderItem[];
}

export interface InstallOrder {
  id: string;
  orderNumber: string; // e.g. "INST-2026-081"
  projectId: string;
  projectCode: string;
  customerName: string;
  address: string;
  state: AustralianState;
  systemSizeKw: number;
  roofType: string;
  storeys: 'Single Storey' | 'Two Storey' | 'Commercial Flat';
  specialRequirements: string;
  status: 'RFQ Sent' | 'Quotes Received' | 'Awarded' | 'Work in Progress' | 'Completed' | 'Invoiced in Xero';
  submittedRequirements: {
    panelCount: number;
    inverterType: string;
    batteryIncluded: boolean;
    switchboardUpgradeRequired: boolean;
    siteAccessInstructions: string;
  };
  quotes: {
    id: string;
    subcontractorId: string;
    subcontractorName: string;
    amountAud: number;
    estimatedDays: number;
    crewSize: number;
    notes: string;
    submittedAt: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
  }[];
  awardedSubcontractorId?: string;
  awardedAmountAud?: number;
}

export interface ProjectPL {
  projectId: string;
  projectCode: string;
  customerName: string;
  state: AustralianState;
  systemSizeKw: number;
  contractRevenueAud: number;
  stcRebateAud: number;
  customerStcRebateAud?: number; // STC amount deducted on customer invoice
  internalStcClaimAud?: number; // Internal STC amount claimed from CER/BridgeSelect
  stcTradingMarginAud?: number; // Profit spread from STC: internalStcClaimAud - customerStcRebateAud
  totalRealizedRevenueAud?: number; // Customer Contract Revenue + Internal STC Claim
  equipmentSalesOrderCostAud: number;
  equipmentCostAud?: number;
  subcontractorInstallLaborCostAud: number;
  installerCostAud?: number;
  complianceAndPermitCostAud: number;
  totalCostAud: number;
  grossProfitAud: number;
  grossMarginPercentage: number;
  marginPercentage?: number;
}

export interface CustomerReview {
  id: string;
  customerId: string;
  customerName: string;
  suburb: string;
  state: AustralianState;
  rating: number; // 1-5
  comment: string;
  systemDetails: string; // e.g. "10.4kW AIKO Solar + 5kW Sungrow Inverter"
  createdAt: string;
  googleMyBusinessSynced: boolean;
  published: boolean;
  adminReply?: string;
}

export interface MessageMediaSMS {
  id: string;
  direction: 'inbound' | 'outbound';
  senderNumber: string; // VoIPLine AU number or customer mobile
  recipientNumber: string;
  contactId?: string;
  contactName?: string;
  projectId?: string;
  messageText: string;
  timestamp: string;
  status: 'delivered' | 'received' | 'sent';
}

export interface VoIPCallLog {
  id: string;
  direction: 'inbound' | 'outbound';
  callerNumber: string;
  recipientNumber: string;
  contactName?: string;
  durationSeconds: number;
  timestamp: string;
  status: 'answered' | 'missed' | 'voicemail';
  recordingUrl?: string;
}

export interface PanelHierarchyItem {
  id: string;
  manufacturer: string;
  sizeW: number | string; // e.g. 440, 475, 500
  series: string; // e.g. "Neostar 2P", "Vertex S+", "Tiger Neo N-Type"
  model: string; // e.g. "AIKO-A440-MAH54Mb", "TSM-NEG9R.28", "JKM440N-54HL4R-V"
}

export interface InverterHierarchyItem {
  id: string;
  manufacturer: string;
  sizeKw: number | string; // e.g. 5.0, 8.2, 10.0
  model: string; // e.g. "SG5.0RS-ADA", "Primo GEN24 5.0 Plus", "SigenStor 5.0TP"
}

export interface BatteryHierarchyItem {
  id: string;
  manufacturer: string;
  usableCapacityKwh: number | string; // e.g. 9.6, 13.5, 16.0
  model: string; // e.g. "SBR096 High Voltage", "Powerwall 3", "BATTERY-BOX PREMIUM HVS 10.2"
  size: string; // e.g. "Compact Wall Mount", "Modular Tower (3 Modules)", "Integrated All-in-One"
}

export interface DynamicDropdownConfig {
  panelBrands: string[];
  inverterBrands: string[];
  batteryBrands: string[];
  leadSources: string[];
  roofTypes: string[];
  projectStatuses: string[];
  ticketCategories: string[];
  ticketPriorities: string[];
  dnspsNSW: string[];
  dnspsQLD: string[];
  employeeDepartments: string[];
  referralPaymentStatuses: string[];
  states: string[];
  contactTypes: string[];
  companyTypes: string[];
  platforms?: string[];
  salesPersons?: string[];
  leadStatuses?: string[];
  houseStoreys?: string[];
  phases?: string[];
  docsReceivedOptions?: string[];
  existingSystemTemplates?: string[];
  panelHierarchy?: PanelHierarchyItem[];
  inverterHierarchy?: InverterHierarchyItem[];
  batteryHierarchy?: BatteryHierarchyItem[];

  // Project Management Dropdowns
  projectStages?: string[];
  ebCustomerNameMatchOptions?: string[];
  ebAddressMatchOptions?: string[];
  ebMeterMatchOptions?: string[];
  ebMeterPhaseOptions?: string[];
  ebOpenSolarSystemMatchOptions?: string[];
  ebOpenSolarPricingMatchOptions?: string[];
  electricityDistributors?: string[];
  energyRetailers?: string[];
  gridApplicationStatuses?: string[];
  installationStatuses?: string[];
  installationBookedByOptions?: string[];
  installationMonths?: string[];
  installationDocsStatuses?: string[];
  installerInvoiceStatuses?: string[];
  warehouses?: string[];
  warehouseInvoiceStatuses?: string[];
  stockStatuses?: string[];
  isFinanceOptions?: string[];
  financeCompanies?: string[];
  financeStatuses?: string[];
  stcPortals?: string[];
  stcStatuses?: string[];
}

export type ViewMode = 'pipeline' | 'table' | 'grid';

export interface ReferralAttachment {
  id: string;
  name: string;
  sizeBytes?: number;
  url?: string;
  uploadedAt: string;
  fileType?: string;
}

export interface ReferralBonus {
  id: string;
  referralCode: string; // e.g. "REF-2026-001"
  referredById: string; // Contact ID of the referrer
  referredByName: string; // Contact Name of referrer
  referralContactId: string; // Contact ID of the referred customer
  referralName: string; // Contact Name of referred customer
  address: string; // Property address for the referral project
  phone: string; // Auto-populated from contacts
  email: string; // Auto-populated from contacts
  referralAmountAud: number; // e.g. 500
  referralStatus: string; // Auto-populated from Project stage (e.g. "Installation Completed", "Install Scheduled")
  linkedProjectId?: string;
  linkedProjectCode?: string;
  paymentStatus: string; // Dropdown managed from Settings (e.g. 'Pending Review', 'Approved for Payment', 'Paid via EFT', 'On Hold')
  paymentReference?: string;
  notes?: string;
  attachments: ReferralAttachment[];
  createdAt: string;
  paidAt?: string;
}

export type SupportTicket = Ticket;
export type TicketStatus = Ticket['status'];

export interface IntegrationConfig {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  description: string;
  lastSyncTime?: string;
  configFields?: Record<string, string>;
}

export interface DomainVerificationRecord {
  domain: string;
  status: 'verified' | 'pending' | 'failed';
  verificationToken: string;
  verificationMethod: 'dns_txt' | 'google_workspace_sso' | 'meta_tag';
  verifiedAt?: string;
  lastChecked?: string;
  dnsExpectedHost: string;
  dnsExpectedType: 'TXT';
  dnsExpectedValue: string;
  dnsAlternativeHost?: string;
  dnsCnameHost?: string;
  dnsCnameValue?: string;
  matchedAccount?: string;
  notes?: string;
}

export interface PortalAddressConfig {
  portalType: 'customer' | 'installer';
  label: string;
  subdomain: string; // e.g. 'customer' or 'installers'
  baseDomain: string; // e.g. 'mysolarcrm.com.au'
  path: string; // e.g. '/customer' or '/installer'
  routingMode: 'subdomain' | 'path' | 'custom_domain';
  customDomain?: string;
  isSslActive: boolean;
  dnsCnameStatus: 'verified' | 'pending' | 'unconfigured';
  dnsExpectedCname: string;
  customTitle: string;
  customSubtitle: string;
  supportPhone: string;
  supportEmail: string;
  allowSmsOtp: boolean;
  allowEmailMagicLink: boolean;
  allowPasswordLogin: boolean;
  requireCecVerification?: boolean; // for installer
  lastUpdated: string;
}

export interface SystemPortalAddresses {
  customerPortal: PortalAddressConfig;
  installerPortal: PortalAddressConfig;
  enforceSeparateLogins: boolean;
  enableAutoRouting: boolean;
}

export interface GoogleWorkspaceIntegrationSettings {
  expectedDomain: string;
  requireCorporateDomain: boolean;
  connectedAccountEmail?: string;
  connectedAccountName?: string;
  connectedAccountPhoto?: string;
  lastVerifiedAt?: string;
  gmail: {
    senderDisplayName: string;
    replyToEmail?: string;
    defaultBcc?: string;
    defaultProposalTemplate: string;
    alwaysConfirmBeforeSend: boolean;
    syncIntervalMinutes: number;
  };
  calendar: {
    targetCalendar: 'primary' | 'solar_assessments' | 'solar_installations';
    calendarName?: string;
    defaultDurationMinutes: number;
    defaultBufferMinutes: number;
    defaultReminderMinutes: number;
    emailReminderHours: number;
    autoAddCustomerAsAttendee: boolean;
  };
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Annual Leave' | 'Sick & Carer Leave' | 'Rostered Day Off (RDO)' | 'Compassionate Leave' | string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: string;
}

export interface DropdownCategoryConfig {
  key: string;
  label: string;
  options: string[];
}

export interface CompanyProfile {
  companyName: string;
  legalName: string;
  abn: string;
  acn?: string;
  logoUrl: string; // Legacy / fallback logo
  headerLogoUrl?: string; // Logo displayed in top navbar header post-login
  loginLogoUrl?: string; // Logo displayed on login pages & auth screens
  logoPreset?: 'sun' | 'solar-panel' | 'energy' | 'leaf' | 'modern';
  headerLogoPreset?: 'sun' | 'solar-panel' | 'energy' | 'leaf' | 'modern';
  loginLogoPreset?: 'sun' | 'solar-panel' | 'energy' | 'leaf' | 'modern';
  primaryColor: string;
  accentColor: string;
  tagline: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  cecRetailerNumber: string;
  portalWelcomeText: string;
  portalBannerUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'lead' | 'project' | 'referral' | 'ticket' | 'maintenance' | 'system';
  read: boolean;
  targetSection?: string;
  targetId?: string;
}

export interface RoleAccessConfig {
  role: UserRole;
  roleName: string;
  description: string;
  canViewLeads: boolean;
  canEditLeads: boolean;
  canViewProjects: boolean;
  canEditProjects: boolean;
  canViewTickets: boolean;
  canResolveTickets: boolean;
  canViewFinancials: boolean;
  canManageSettings: boolean;
  canAccessPortals: boolean;
}

// CER BridgeSelect STC Portal Settings
export interface BridgeSelectPortalSettings {
  recRegistryAgentId: string;
  apiKey: string;
  webhookSecret: string;
  environment: 'production' | 'staging';
  aggregator: 'BridgeSelect' | 'Formbay' | 'Greenbank' | 'TradeSTCs' | 'REC Registry Direct';
  stcSpotRateAud: number;
  requireCecAccreditation: boolean;
  requireSaaLicense: boolean;
  requireSerialVerification: boolean;
  requireGeotaggedPhotos: boolean;
  requireDigitalSignature: boolean;
  autoSubmitOnCompletion: boolean;
  lastSyncTime?: string;
}

// Xero Cloud Accounting Integration Types
export interface XeroLineItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  accountCode: string;
  taxType: string;
  taxAmount: number;
  lineAmount: number;
}

export type XeroInvoiceStatus = 'DRAFT' | 'AUTHORISED' | 'PAID' | 'VOIDED';
export type XeroQuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'INVOICED' | 'VOIDED';
export type XeroBillStatus = 'DRAFT' | 'AUTHORISED' | 'PAID' | 'VOIDED';

export interface XeroInvoice {
  id: string;
  invoiceNumber: string;
  type: 'ACCREC';
  contactId: string;
  contactName: string;
  contactEmail?: string;
  date: string;
  dueDate: string;
  status: XeroInvoiceStatus;
  lineItems: XeroLineItem[];
  subTotal: number;
  totalTax: number;
  total: number;
  amountDue: number;
  amountPaid: number;
  reference?: string;
  currencyCode: 'AUD';
  voidReason?: string;
  updatedAt: string;
}

export interface XeroQuotation {
  id: string;
  quoteNumber: string;
  contactId: string;
  contactName: string;
  contactEmail?: string;
  date: string;
  expiryDate: string;
  status: XeroQuoteStatus;
  lineItems: XeroLineItem[];
  subTotal: number;
  totalTax: number;
  total: number;
  title: string;
  summary?: string;
  terms?: string;
  currencyCode: 'AUD';
  voidReason?: string;
  convertedInvoiceId?: string;
  updatedAt: string;
}

export interface XeroBill {
  id: string;
  billNumber: string;
  type: 'ACCPAY';
  contactId: string;
  contactName: string;
  supplierType: 'Equipment Distributor' | 'Installation Subcontractor' | 'Freight / Logistics' | string;
  date: string;
  dueDate: string;
  status: XeroBillStatus;
  lineItems: XeroLineItem[];
  subTotal: number;
  totalTax: number;
  total: number;
  amountDue: number;
  amountPaid: number;
  reference?: string;
  currencyCode: 'AUD';
  voidReason?: string;
  updatedAt: string;
}

export interface XeroContactSyncItem {
  crmContactId: string;
  xeroContactId: string;
  name: string;
  email: string;
  phone: string;
  contactType: 'Customer' | 'Subcontractor' | 'Supplier';
  syncStatus: 'Synced' | 'Pending Push' | 'Error';
  lastSyncedAt: string;
  balanceAud?: number;
}

export interface XeroIntegrationSettings {
  organizationName: string;
  tenantId: string;
  isConnected: boolean;
  connectedEmail: string;
  tokenExpiresAt: string;
  salesAccountCode: string;
  stcClearingAccountCode: string;
  cogsAccountCode: string;
  installerLabourAccountCode: string;
  bankAccountCode: string;
  defaultInvoiceTermsDays: number;
  defaultQuoteTermsDays: number;
  autoSyncNewContacts: boolean;
  autoCreateInvoiceOnContract: boolean;
  lastSyncTime: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  isDemoAccount?: boolean;
}

// OpenSolar Platform Integration Types
export interface OpenSolarIntegrationSettings {
  orgId: string;
  apiKey: string;
  environment: 'production' | 'sandbox';
  partnerCode: string;
  defaultCurrency: 'AUD';
  autoCreateProjectOnSigned: boolean;
  syncNearmap3dImagery: boolean;
  syncPricingAndBom: boolean;
  syncIntervalMinutes: number;
  webhookSecret: string;
  webhookEndpoint: string;
  lastSyncTime: string;
  status: 'connected' | 'disconnected' | 'error';
  enableLiveSync: boolean;
  defaultProposalTemplate: string;
}

export interface OpenSolarSyncedProposal {
  id: string;
  proposalId: string; // e.g. OS-PROP-2026-88
  projectId?: string;
  customerName: string;
  address: string;
  suburb: string;
  state: 'NSW' | 'QLD';
  systemSizeKw: number;
  panelCount: number;
  panelModel: string;
  inverterModel: string;
  batteryModel?: string;
  totalPriceAud: number;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Signed' | 'Rejected';
  pdfUrl: string;
  design3dUrl: string;
  signedAt?: string;
  lastSyncedAt: string;
}

// MessageMedia SMS Gateway Integration Types
export interface MessageMediaIntegrationSettings {
  apiKey: string;
  apiSecret: string;
  accountNumber: string;
  senderId: string; // e.g. '+61 488 842 910' or 'AUS-SOLAR'
  dedicatedVirtualNumber: string;
  accountStatus: 'Active' | 'Suspended' | 'Trial';
  remainingCredits: number;
  environment: 'production' | 'sandbox';
  inboundWebhookUrl: string;
  dlrWebhookUrl: string;
  appendSpamActOptOut: boolean; // Australian Spam Act 2003 'Reply STOP to opt out'
  autoSendOnSurveyBooked: boolean;
  autoSendOnInstallEnRoute: boolean;
  autoSendOnDnspApproval: boolean;
  autoSendOnMaintenanceDue: boolean;
  matchStaffSenderLine: boolean;
  lastSyncTime: string;
}

export interface MessageMediaSMSLogItem {
  id: string;
  direction: 'inbound' | 'outbound';
  senderNumber: string;
  recipientNumber: string;
  contactName?: string;
  contactId?: string;
  projectId?: string;
  messageText: string;
  status: 'DELIVERED' | 'SENT' | 'RECEIVED' | 'FAILED' | 'PENDING';
  creditsUsed: number;
  timestamp: string;
  deliveryLatencyMs?: number;
}

// Mailchimp Integration & Two-Way Sync Types
export interface MailchimpIntegrationSettings {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
  audienceName: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  webhookSecret: string;
  webhookEndpoint: string;
  status: 'connected' | 'disconnected' | 'error';
  autoSyncNewLeads: boolean;
  autoSyncNewClients: boolean;
  twoWayEmailSyncEnabled: boolean;
  trackOpensAndClicks: boolean;
  syncIntervalMinutes: number;
  lastSyncTime: string;
  totalSubscribers: number;
  syncedLeadsCount: number;
  syncedClientsCount: number;
}

export interface MailchimpCampaign {
  id: string;
  webId: string;
  title: string;
  subjectLine: string;
  previewText: string;
  segment: 'All Leads & Clients' | 'Meta Ads Leads' | 'Existing Clients' | 'NSW Region' | 'QLD Region' | 'Battery Upgrade Prospects';
  status: 'SENT' | 'SCHEDULED' | 'DRAFT' | 'SENDING';
  sentAt: string;
  recipientsCount: number;
  openRatePercent: number;
  clickRatePercent: number;
  repliesCount: number;
  unsubscribedCount: number;
}

export interface MailchimpTwoWayEmail {
  id: string;
  campaignId?: string;
  campaignTitle?: string;
  direction: 'outbound' | 'inbound';
  senderEmail: string;
  senderName: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyText: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied' | 'bounced';
  contactId?: string;
  contactName?: string;
  leadId?: string;
  isLead: boolean;
  read: boolean;
  tags?: string[];
}

// 1. WhatsApp Business API Integration Types
export interface WhatsAppIntegrationSettings {
  wabaId: string; // WhatsApp Business Account ID
  phoneNumberId: string; // Business Phone Number ID
  displayPhoneNumber: string;
  verifiedName: string;
  apiToken: string;
  apiVersion: string;
  webhookCallbackUrl: string;
  webhookVerifyToken: string;
  status: 'connected' | 'disconnected' | 'error';
  autoSendQuoteNotification: boolean;
  autoSendInstallArrivalAlert: boolean;
  autoSendPhotoRequest: boolean;
  allowInboundPhotoIngestion: boolean;
  lastSyncTime: string;
  qualityRating: 'GREEN' | 'YELLOW' | 'RED';
  dailyMessageLimit: number;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  bodyText: string;
  parameters: string[];
}

export interface WhatsAppMessageLog {
  id: string;
  direction: 'inbound' | 'outbound';
  customerName: string;
  customerPhone: string;
  messageType: 'text' | 'template' | 'image' | 'document';
  content: string;
  mediaUrl?: string;
  mediaCaption?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  templateName?: string;
}

// 2. VoIPLine Telecom AU Settings Types
export interface VoIPLineIntegrationSettings {
  accountNumber: string;
  apiKey: string;
  apiSecret: string;
  sipDomain: string;
  sipPort: number;
  callerIdNumber: string;
  callerIdName: string;
  status: 'connected' | 'disconnected' | 'error';
  enableCallRecording: boolean;
  recordingAnnouncement: boolean;
  enableScreenPopWebhook: boolean;
  screenPopWebhookUrl: string;
  enableClickToCall: boolean;
  callDispositionTags: string[];
  maxConcurrentLines: number;
  lastPingLatencyMs: number;
  lastSyncTime: string;
  webrtcGatewayUrl: string;
}

export interface VoIPLineExtensionMapping {
  id: string;
  extension: string;
  staffName: string;
  staffRole: string;
  directDid: string;
  status: 'Online' | 'Busy' | 'Offline';
  forwardToMobile?: string;
}

// 3. Meta Ads & Messenger Lead Sync Types
export interface MetaAdsIntegrationSettings {
  appId: string;
  appSecret: string;
  businessManagerId: string;
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  webhookCallbackUrl: string;
  webhookVerifyToken: string;
  status: 'connected' | 'disconnected' | 'error';
  autoAssignLeads: boolean;
  assignmentMethod: 'round_robin' | 'state_based' | 'lead_type';
  defaultAssignedRep: string;
  enableMessengerChatSync: boolean;
  enableInstantWelcomeSms: boolean;
  instantWelcomeMessage: string;
  syncIntervalMinutes: number;
  lastSyncTime: string;
  totalLeadsIngested: number;
}

export interface MetaLeadFormConfig {
  id: string;
  formId: string;
  formName: string;
  campaignName: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  leadsCount: number;
  createdDate: string;
  fieldMappings: {
    formField: string;
    crmField: string;
  }[];
}

export interface MetaIngestedLead {
  id: string;
  leadgenId: string;
  formName: string;
  campaignName: string;
  customerName: string;
  phone: string;
  email: string;
  suburb: string;
  state: 'NSW' | 'QLD' | 'VIC' | 'SA';
  quarterlyBillAud: number;
  roofType: string;
  homeOwnership: 'Own' | 'Mortgage' | 'Rent';
  batteryInterest: boolean;
  receivedAt: string;
  status: 'Imported' | 'Assigned' | 'Contacted';
  assignedTo: string;
}

// 4. Microsoft Teams Webhook Settings Types
export interface TeamsIntegrationSettings {
  teamName: string;
  tenantId: string;
  status: 'connected' | 'disconnected' | 'error';
  defaultChannelWebhookUrl: string;
  enableSalesWinsCards: boolean;
  salesWinsWebhookUrl: string;
  salesMinContractValueAud: number;
  enableInstallDispatchCards: boolean;
  installDispatchWebhookUrl: string;
  enableDnspApprovalsCards: boolean;
  dnspApprovalsWebhookUrl: string;
  enableCustomerEscalationCards: boolean;
  customerEscalationsWebhookUrl: string;
  enableDailySummaryDigest: boolean;
  digestDispatchTime: string;
  cardThemeColor: string;
  lastDispatchedAt: string;
  totalCardsDispatched: number;
}

export interface TeamsDispatchedCard {
  id: string;
  channel: 'sales-wins' | 'installation-dispatch' | 'dnsp-approvals' | 'customer-escalations';
  title: string;
  summary: string;
  systemSizeKw?: number;
  contractValueAud?: number;
  clientName?: string;
  assignedStaff?: string;
  status: 'SUCCESS' | 'FAILED';
  httpResponseCode: number;
  dispatchedAt: string;
}

// 5. Google My Business (Google Business Profile) Settings Types
export interface GmbReviewReply {
  comment: string;
  updateTime: string;
  authorName: string;
}

export interface GmbReview {
  reviewId: string;
  reviewerName: string;
  reviewerPhotoUrl?: string;
  isVerifiedCustomer: boolean;
  linkedProjectCode?: string;
  starRating: number; // 1 to 5
  comment: string;
  createTime: string;
  suburb: string;
  state: 'NSW' | 'QLD' | 'VIC' | 'SA' | 'WA';
  systemInstalled?: string;
  reply?: GmbReviewReply;
}

export interface GmbPost {
  id: string;
  summary: string;
  callToActionType: 'LEARN_MORE' | 'CALL' | 'BOOK' | 'GET_OFFER';
  actionUrl: string;
  imageUrl?: string;
  offerCouponCode?: string;
  status: 'PUBLISHED' | 'SCHEDULED' | 'DRAFT';
  publishedAt: string;
  viewsCount: number;
  clicksCount: number;
}

export interface GoogleMyBusinessSettings {
  accountId: string;
  locationId: string;
  businessName: string;
  primaryCategory: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  isGoogleVerified: boolean;
  googleMapsPlaceId: string;
  googleMapsListingUrl: string;
  directReviewShortlink: string;
  phoneAud: string;
  websiteUrl: string;
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
  serviceAreas: string[];
  averageRating: number;
  totalReviewsCount: number;
  lastSyncAt: string;

  // Review Automation Settings
  enableAutoSyncReviews: boolean;
  syncIntervalMinutes: number;
  enableAutoReviewRequests: boolean;
  requestTriggerEvent: 'INSTALL_COMPLETED' | 'STC_SUBMITTED' | 'INVOICE_PAID';
  requestDelayHours: number;
  requestChannel: 'SMS' | 'EMAIL' | 'BOTH';
  smsTemplateText: string;
  autoReplyTo5StarReviews: boolean;
  autoReplyTemplate: string;
  alertOnNegativeReview: boolean;
  negativeReviewAlertEmail: string;
}

export interface GmbInsightMetrics {
  period: string;
  searchImpressions: number;
  mapsViews: number;
  websiteClicks: number;
  directionRequests: number;
  phoneCallClicks: number;
  reviewRequestSentCount: number;
  reviewConversionRatePercent: number;
}


