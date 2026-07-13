/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building, 
  Briefcase, 
  Newspaper, 
  TrendingUp, 
  Atom, 
  PhoneCall, 
  Truck, 
  ArrowLeftRight, 
  DollarSign, 
  Bot, 
  ShieldCheck, 
  FileText, 
  Cookie, 
  Target, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Loader2, 
  Search, 
  Send, 
  X, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Sparkles, 
  Download, 
  AlertCircle, 
  ThumbsUp,
  Printer,
  Calendar,
  Layers,
  Heart,
  ExternalLink,
  Info
} from "lucide-react";
import { useNotification } from "../context/NotificationContext";

interface InfoPageProps {
  tabId: string;
  navigate: (path: string) => void;
}

// Sub-page structural types
interface TabItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface TabGroup {
  name: string;
  items: TabItem[];
}

export const InfoPage: React.FC<InfoPageProps> = ({ tabId, navigate }) => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<string>(tabId);

  // Sync state if route prop changes
  useEffect(() => {
    if (tabId) {
      setActiveTab(tabId);
    }
  }, [tabId]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    navigate(`info/${id}`);
  };

  const groups: TabGroup[] = [
    {
      name: "Company",
      items: [
        { id: "about-qkart", name: "About QKart", icon: <Building className="w-4 h-4" /> },
        { id: "careers", name: "Careers", icon: <Briefcase className="w-4 h-4" /> },
        { id: "press-releases", name: "Press Releases", icon: <Newspaper className="w-4 h-4" /> },
        { id: "investor-relations", name: "Investor Relations", icon: <TrendingUp className="w-4 h-4" /> },
        { id: "qkart-science", name: "QKart Science", icon: <Atom className="w-4 h-4" /> }
      ]
    },
    {
      name: "Help & Support",
      items: [
        { id: "contact-support", name: "Contact Support", icon: <PhoneCall className="w-4 h-4" /> },
        { id: "shipping-delivery", name: "Shipping & Delivery", icon: <Truck className="w-4 h-4" /> },
        { id: "returns-exchanges", name: "Returns & Exchanges", icon: <ArrowLeftRight className="w-4 h-4" /> },
        { id: "refund-policies", name: "Refund Policies", icon: <DollarSign className="w-4 h-4" /> },
        { id: "qkart-assistant", name: "QKart Assistant", icon: <Bot className="w-4 h-4" /> }
      ]
    },
    {
      name: "Policies",
      items: [
        { id: "privacy-policy", name: "Privacy Policy", icon: <ShieldCheck className="w-4 h-4" /> },
        { id: "terms-use", name: "Terms of Use", icon: <FileText className="w-4 h-4" /> },
        { id: "cookie-preferences", name: "Cookie Preferences", icon: <Cookie className="w-4 h-4" /> },
        { id: "interest-ads", name: "Interest-Based Ads", icon: <Target className="w-4 h-4" /> },
        { id: "ewaste-management", name: "E-Waste Management", icon: <Trash2 className="w-4 h-4" /> }
      ]
    }
  ];

  // Helper to flat list items
  const allTabs = groups.flatMap(g => g.items);
  const currentTabObj = allTabs.find(t => t.id === activeTab) || allTabs[0];

  return (
    <div className="max-w-7xl mx-auto px-1 sm:px-2 py-6" id="qkart-info-hub">
      {/* Title Header */}
      <div className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-amber-500 text-zinc-950 rounded-xl shadow-sm">QK</span>
          QKart Knowledge & Support Center
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Explore our company values, research initiatives, official store policies, or contact our interactive help channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6" id="info-sidebar-container">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm sticky top-24">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest px-3 mb-4">Navigation Hub</h3>
            <nav className="flex flex-col gap-6">
              {groups.map((group) => (
                <div key={group.name} className="flex flex-col gap-1.5">
                  <h4 className="text-[11px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider px-3 flex items-center justify-between">
                    {group.name}
                    <span className="text-[10px] font-normal text-zinc-400">({group.items.length})</span>
                  </h4>
                  <div className="flex flex-col gap-1 mt-1">
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          id={`tab-btn-${item.id}`}
                          key={item.id}
                          onClick={() => handleTabChange(item.id)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-md shadow-amber-500/10"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            {item.icon}
                            <span>{item.name}</span>
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? "translate-x-0.5" : "opacity-30"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Active Content Panel */}
        <div className="lg:col-span-3 min-h-[60vh] flex flex-col" id="info-content-panel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 shadow-sm flex-1 flex flex-col justify-between"
              id={`panel-container-${activeTab}`}
            >
              <ActivePanelContent activeTab={activeTab} showNotification={showNotification} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   DYNAMIC SUB-PAGES RENDERER
   ========================================================================== */

interface ActivePanelProps {
  activeTab: string;
  showNotification: (msg: string, type?: "success" | "warning" | "error" | "info") => void;
}

const ActivePanelContent: React.FC<ActivePanelProps> = ({ activeTab, showNotification }) => {
  switch (activeTab) {
    case "about-qkart":
      return <AboutQKartSection />;
    case "careers":
      return <CareersSection showNotification={showNotification} />;
    case "press-releases":
      return <PressReleasesSection />;
    case "investor-relations":
      return <InvestorRelationsSection showNotification={showNotification} />;
    case "qkart-science":
      return <QKartScienceSection />;
    case "contact-support":
      return <ContactSupportSection showNotification={showNotification} />;
    case "shipping-delivery":
      return <ShippingDeliverySection />;
    case "returns-exchanges":
      return <ReturnsExchangesSection showNotification={showNotification} />;
    case "refund-policies":
      return <RefundPoliciesSection />;
    case "qkart-assistant":
      return <QKartAssistantSection />;
    case "privacy-policy":
      return <PrivacyPolicySection />;
    case "terms-use":
      return <TermsOfUseSection />;
    case "cookie-preferences":
      return <CookiePreferencesSection showNotification={showNotification} />;
    case "interest-ads":
      return <InterestAdsSection showNotification={showNotification} />;
    case "ewaste-management":
      return <EWasteSection showNotification={showNotification} />;
    default:
      return (
        <div className="text-center py-16">
          <h2 className="text-xl font-bold">Page Under Development</h2>
          <p className="text-zinc-500 mt-2">Section content will appear here shortly.</p>
        </div>
      );
  }
};

/* ==========================================================================
   1. ABOUT QKART
   ========================================================================== */
const AboutQKartSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-6" id="about-qkart-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Who We Are</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Our Story & Mission</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-1">
          Founded in 2024, QKart has grown from a visionary technology startup into a premier hyper-responsive multi-category e-commerce marketplace. We empower millions of global consumers by partnering directly with premium brands and offering seamless, secure logistics and deep analytical recommendation models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">1</div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Customer Centricity</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Every shipping route, custom discount engine, and checkout step is tailored to ensure absolute delight and trust.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">2</div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Pure Innovation</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We merge software design, supply-chain AI, and high-performance computing to create a lightning-fast catalog.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-2 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">3</div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Zero Waste Policy</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            We sponsor massive clean-energy hubs and state-approved electronic recycling pickup centers to offset computing footprints.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <Layers className="w-4.5 h-4.5 text-amber-500" />
          QKart Key Milestones
        </h3>
        <div className="border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 pl-6 flex flex-col gap-6">
          <div className="relative">
            <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-amber-500 rounded-full ring-4 ring-white dark:ring-zinc-900"></span>
            <span className="text-xs font-black text-amber-500">2026</span>
            <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">Expanded Fashion & Children Datasets</h5>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
              Fully integrated FakeStoreAPI options and added premium Baby, Infant, Toddler, and Teens segments across all genders.
            </p>
          </div>
          <div className="relative">
            <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-zinc-300 dark:bg-zinc-700 rounded-full ring-4 ring-white dark:ring-zinc-900"></span>
            <span className="text-xs font-black text-zinc-400">2025</span>
            <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">Launched QKart Science Laboratory</h5>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
              Pioneered logistics simulation models that shaved delivery duration on smart appliances by an average of 18 hours.
            </p>
          </div>
          <div className="relative">
            <span className="absolute -left-[31px] top-1.5 w-4 h-4 bg-zinc-300 dark:bg-zinc-700 rounded-full ring-4 ring-white dark:ring-zinc-900"></span>
            <span className="text-xs font-black text-zinc-400">2024</span>
            <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">Founding of QKart Marketplaces</h5>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
              Bootstrapped with 5 founders and primary partners to create a fast, clean, high-performance platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. CAREERS (WITH FILTERABLE BOARD + APPLICATION MODAL)
   ========================================================================== */
interface Job {
  id: string;
  title: string;
  dept: "tech" | "ops" | "design" | "support" | "marketing";
  location: string;
  type: string;
  salary: string;
  summary: string;
  requirements: string[];
}

const CareersSection: React.FC<{ showNotification: any }> = ({ showNotification }) => {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [activeJobModal, setActiveJobModal] = useState<Job | null>(null);
  
  // Application form states
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantCover, setApplicantCover] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobs: Job[] = [
    {
      id: "job-1",
      title: "Senior Full-Stack React & Node Engineer",
      dept: "tech",
      location: "San Jose, CA (Hybrid)",
      type: "Full-Time",
      salary: "$145,000 - $180,000",
      summary: "Optimize custom state stores, improve Vite compilation times, and integrate serverless cloud routers into QKart's core system.",
      requirements: [
        "5+ years React, Node.js, and TypeScript expertise",
        "Demonstrated knowledge of Vite bundler optimization and CommonJS compilation structures",
        "Experience building high-capacity secure commerce API endpoints"
      ]
    },
    {
      id: "job-2",
      title: "Senior UI/UX & Visual Designer",
      dept: "design",
      location: "Remote (US/Canada)",
      type: "Full-Time",
      salary: "$110,000 - $140,000",
      summary: "Drive visual rhythm, typography pairings, and layout systems. Own design components and coordinate with developers.",
      requirements: [
        "Mastery of Figma, design systems, and negative-space balanced wireframes",
        "Deep understanding of Tailwind CSS naming standards and motion micro-interactions",
        "Strong digital portfolio highlighting e-commerce portals"
      ]
    },
    {
      id: "job-3",
      title: "Logistics Orchestration Specialist",
      dept: "ops",
      location: "Indianapolis, IN (On-Site)",
      type: "Full-Time",
      salary: "$85,000 - $110,000",
      summary: "Supervise shipping partner routes, automate fulfillment algorithms, and scale nationwide express deliveries.",
      requirements: [
        "Experience optimizing high-volume warehouse fulfillment metrics",
        "Analytical background with SQL, dispatch software, or supply chain theory",
        "Willingness to experiment with real-time green carbon offset models"
      ]
    },
    {
      id: "job-4",
      title: "Interactive Support Escalation Lead",
      dept: "support",
      location: "Remote (Global)",
      type: "Full-Time",
      salary: "$65,000 - $80,000",
      summary: "Manage support queues, refine QKart Assistant conversational triggers, and guarantee 100% resolution speeds.",
      requirements: [
        "Prior experience leading ticketing teams in a dynamic tech workspace",
        "Excellent written and analytical problem-solving skills",
        "Expertise with Zendesk, Intercom, or CRM database workflows"
      ]
    },
    {
      id: "job-5",
      title: "Brand Engagement Marketing Lead",
      dept: "marketing",
      location: "New York, NY",
      type: "Full-Time",
      salary: "$95,000 - $125,000",
      summary: "Launch brand partnerships, coordinate social media expansions, and acquire users for our child and teen segments.",
      requirements: [
        "Proven record of running viral influencer or brand collaboration campaigns",
        "Familiarity with tracking metrics (CAC, LTV, conversion, retargeting)",
        "Experience with direct-to-consumer apparel or lifestyle marketing"
      ]
    }
  ];

  const filteredJobs = selectedDept === "all" ? jobs : jobs.filter(j => j.dept === selectedDept);

  const simulateResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeName(file.name);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          showNotification("Resume parsed successfully and attached.", "success");
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail || !resumeName) {
      showNotification("Please complete all required fields and upload your resume.", "warning");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showNotification(`Application submitted! Reference number: APP-${Math.floor(Math.random() * 90000) + 10000}`, "success");
      // Reset
      setApplicantName("");
      setApplicantEmail("");
      setApplicantCover("");
      setResumeName("");
      setActiveJobModal(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6" id="careers-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Join The Team</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Open Opportunities</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          At QKart, we build products with desktop-first precision and mobile responsiveness. Help us innovate digital commerce in a fun, balanced workspace.
        </p>
      </div>

      {/* Dept Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        {["all", "tech", "design", "ops", "support", "marketing"].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
              selectedDept === dept
                ? "bg-amber-500 text-zinc-950"
                : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Jobs Feed */}
      <div className="flex flex-col gap-4 mt-2">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Briefcase className="w-8 h-8 text-zinc-300 mx-auto" />
            <span className="text-xs font-bold text-zinc-400 block mt-2">No positions open in this category.</span>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500/50 dark:hover:border-amber-500/30 hover:shadow-xs transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded">
                    {job.dept}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{job.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{job.summary}</p>
              </div>
              <div className="flex items-center gap-3 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300">{job.salary}</span>
                <button
                  onClick={() => {
                    setActiveJobModal(job);
                    setResumeName("");
                  }}
                  className="px-3.5 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-amber-500 dark:hover:bg-amber-500 text-white dark:text-zinc-950 hover:text-zinc-950 font-bold text-xs rounded-xl transition-colors duration-150"
                >
                  View details & Apply
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Careers Detail & Apply Modal */}
      <AnimatePresence>
        {activeJobModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black bg-amber-500 text-zinc-950 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {activeJobModal.dept}
                  </span>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mt-2.5">{activeJobModal.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-zinc-400">
                    <span>{activeJobModal.location}</span>
                    <span>•</span>
                    <span>{activeJobModal.type}</span>
                    <span>•</span>
                    <span>{activeJobModal.salary}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveJobModal(null)}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <h5 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 mb-2">Role Objective</h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{activeJobModal.summary}</p>
                </div>

                <div>
                  <h5 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 mb-2">Requirements</h5>
                  <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 pl-1">
                    {activeJobModal.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <hr className="border-zinc-100 dark:border-zinc-800" />

                {/* Application Form */}
                <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                  <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">Quick Application Form</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Why QKart? (Short Cover Letter)</label>
                    <textarea
                      value={applicantCover}
                      onChange={(e) => setApplicantCover(e.target.value)}
                      rows={3}
                      className="p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
                      placeholder="Tell us why you would be a great fit..."
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Resume Upload (PDF/DOCX) *</label>
                    <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-all duration-150">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={simulateResumeUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Briefcase className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
                      <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">
                        {resumeName ? `Selected: ${resumeName}` : "Click or drag your resume to upload"}
                      </span>
                    </div>

                    {isUploading && (
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                          <span>Uploading Resume...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="mt-2 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Official Application"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==========================================================================
   3. PRESS RELEASES
   ========================================================================== */
interface PressRelease {
  id: string;
  date: string;
  category: string;
  title: string;
  lead: string;
  body: string;
}

const PressReleasesSection: React.FC = () => {
  const [expandedRelease, setExpandedRelease] = useState<string | null>(null);

  const releases: PressRelease[] = [
    {
      id: "press-1",
      date: "July 12, 2026",
      category: "Corporate Expansion",
      title: "QKart Partners with Global Importers to Introduce All-Gender Children Wear",
      lead: "Leading e-commerce workspace QKart successfully integrates hundreds of high-quality organic cotton clothing items for babies, toddler-age brackets, and young teens.",
      body: "We are thrilled to unveil our dedicated fashion initiative. Following our integration with reliable mock JSON providers, we launched a curated collection of Baby Clothing, Kids Shoes, Boys/Girls Wear, and Teens Tie-Dye streetwear. Over 80 original brands are joining this catalog. These items are backed by our signature 100% Secure payment protocols and standard 10-day returns."
    },
    {
      id: "press-2",
      date: "May 10, 2026",
      category: "Sustainability",
      title: "QKart Launches Nationwide Electronic Waste Pickup Portal",
      lead: "In a bold move toward zero landfill electronic waste, QKart introduces direct scheduled home pickup for old computing hardware.",
      body: "The newly introduced 'E-Waste Management' dashboard empowers registered customers to book free home collection for old laptops, workstations, phones, and chargers. These electronics are routed to certified eco-friendly scrap-processing centers, ensuring precious mineral recovery. QKart offers an instant voucher worth up to $35 for qualifying corporate laptops returned under this scheme."
    },
    {
      id: "press-3",
      date: "March 18, 2026",
      category: "Financials",
      title: "QKart Reports Outstanding 23% Growth in Q1 Fiscal Transactions",
      lead: "Driven by massive demand in premium smartphones and customizable design workstations, total marketplace volume sets a new quarterly record.",
      body: "We are proud to share that Q1 transaction volumes surpassed our projections by 8.5%. Our custom recommendations engine, developed at the QKart Science facility, was responsible for over 30% of total checkouts, solidifying the power of state-stabilized shopping widgets. Active registered users increased by 1.2M."
    }
  ];

  return (
    <div className="flex flex-col gap-6" id="press-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Newsroom</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Press Releases</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Keep up with recent corporate updates, strategic integrations, and eco-initiatives launched from the QKart ecosystem.
        </p>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        {releases.map((rel) => {
          const isExpanded = expandedRelease === rel.id;
          return (
            <div
              key={rel.id}
              className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-3 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase text-amber-500">{rel.category}</span>
                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {rel.date}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">{rel.title}</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">{rel.lead}</p>
              
              {isExpanded && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3 mt-1">
                  {rel.body}
                </p>
              )}

              <button
                onClick={() => setExpandedRelease(isExpanded ? null : rel.id)}
                className="self-start text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-amber-500 flex items-center gap-1 mt-1 transition-colors"
              >
                {isExpanded ? "Collapse Text" : "Read Full Press Release"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================================================
   4. INVESTOR RELATIONS (WITH LIVE MOCK STOCK CHART & REPORT DOWNLOADS)
   ========================================================================== */
const InvestorRelationsSection: React.FC<{ showNotification: any }> = ({ showNotification }) => {
  const [stockPrice, setStockPrice] = useState(148.50);
  const [stockChange, setStockChange] = useState(1.24);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stock price live simulator
  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.48) * 0.40;
      setStockPrice(prev => {
        const newPrice = parseFloat((prev + delta).toFixed(2));
        const originalBase = 145.00;
        const changePercent = parseFloat((((newPrice - originalBase) / originalBase) * 100).toFixed(2));
        setStockChange(changePercent);
        return newPrice;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Simple static canvas chart render simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and draw grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(228, 228, 231, 0.15)";
    ctx.lineWidth = 1;

    // Draw horizontal grid lines
    for (let i = 20; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw price trend line (mock area chart)
    const points = [
      { x: 0, y: 120 }, { x: 50, y: 110 }, { x: 100, y: 115 },
      { x: 150, y: 95 }, { x: 200, y: 100 }, { x: 250, y: 70 },
      { x: 300, y: 80 }, { x: 350, y: 65 }, { x: 400, y: 55 },
      { x: 450, y: 50 }
    ];

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(450, 150);
    ctx.lineTo(0, 150);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, "rgba(245, 158, 11, 0.25)");
    gradient.addColorStop(1, "rgba(245, 158, 11, 0)");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.stroke();

  }, [stockPrice]);

  const triggerDownload = (report: string) => {
    showNotification(`Downloading ${report} report package in PDF format...`, "success");
  };

  return (
    <div className="flex flex-col gap-6" id="investor-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Stakeholder Desk</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Investor Relations</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Review financial performance ratios, download annual audit files, or observe the real-time simulation of QKRT common equity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Stock Widget */}
        <div className="md:col-span-2 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Equity Ticker</span>
              <span className="text-base font-black text-zinc-100 flex items-center gap-1.5">
                NASDAQ: QKRT <span className="bg-amber-500/10 text-amber-500 text-[10px] px-1.5 py-0.5 rounded">Live Simulated</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-500 font-mono">${stockPrice.toFixed(2)}</span>
              <span className={`text-[11px] font-bold block ${stockChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {stockChange >= 0 ? "+" : ""}{stockChange}% YTD
              </span>
            </div>
          </div>

          <div className="h-[120px] bg-zinc-900/60 rounded-xl overflow-hidden flex items-center justify-center p-2">
            <canvas ref={canvasRef} width={450} height={120} className="w-full h-full" />
          </div>
        </div>

        {/* Core Ratios */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col justify-between gap-3">
          <h4 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500">Q1 Financial Summary</h4>
          <div className="flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Total Revenue:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">$48.6M</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span className="text-zinc-400">EBITDA margin:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">18.4%</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
              <span className="text-zinc-400">Net Profit Ratio:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">12.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Liquid Cash:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">$12.4M</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 leading-normal bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
            * Audited independently for Sarbanes-Oxley regulatory compliance.
          </span>
        </div>
      </div>

      {/* Reports Download */}
      <div className="mt-4">
        <h3 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 mb-3">Download Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => triggerDownload("FY2025 Annual Audit Report")}
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500 dark:hover:border-amber-500 flex items-center justify-between gap-3 text-left transition-all duration-150"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">FY2025 Annual Audit Report</h5>
                <p className="text-[10px] text-zinc-400 font-mono">PDF, 4.2 MB • Released Feb 2026</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-zinc-400 hover:text-amber-500" />
          </button>

          <button
            onClick={() => triggerDownload("Q1 2026 Earnings Slide Package")}
            className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500 dark:hover:border-amber-500 flex items-center justify-between gap-3 text-left transition-all duration-150"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Q1 2026 Earnings Presentation</h5>
                <p className="text-[10px] text-zinc-400 font-mono">PDF, 2.8 MB • Released May 2026</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-zinc-400 hover:text-amber-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   5. QKART SCIENCE (TECH MONO-ACCENTS ON DEEP SYSTEMS RESEARCH)
   ========================================================================== */
const QKartScienceSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 font-sans" id="qkart-science-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded self-start">R&D Laboratory</span>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-sans">QKart Science</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Explore the algorithmic rigor and deep logistical optimization routines behind QKart. Here is how we build ultra-low latency catalog databases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">1. Predictive Demand Dispatch</h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Instead of routing packages purely post-order, our machine learning pipeline forecasts category demand waves across 14 geographical regions. This allows us to pre-stage smartphones and clothing items at local partner nodes, decreasing delivery timelines under 24 hours.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
            P(Dispatch) = σ(W_d * Demand_hist + W_t * Trend_coeff + Bias)
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">2. Highly-Stable Cache Engine</h4>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            By compiling our main Express router and bundling with advanced build systems (e.g., using `esbuild` target Node CommonJS files), we bypass relative file-resolution lookups on Cloud instances, facilitating catalog sub-millisecond response rates under 100 concurrent threads.
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
            $ esbuild backend/server.ts --bundle --platform=node
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-amber-500/20 dark:border-amber-500/10 bg-amber-500/5 dark:bg-amber-500/2 flex flex-col gap-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Eco-Responsible Infrastructure
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Every predictive calculation consumes electrical power. To balance this, our warehouses are paired with sustainable green offsets, and our electronic products are linked directly with an active e-waste pickup program to ensure zero landfill residue.
        </p>
      </div>
    </div>
  );
};

/* ==========================================================================
   6. CONTACT SUPPORT (DYNAMIC FORM WITH PROGRESS & TICKET RESPONSE SIMULATION)
   ========================================================================== */
const ContactSupportSection: React.FC<{ showNotification: any }> = ({ showNotification }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orderId, setOrderId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !subject || !message) {
      showNotification("Please fill in all required fields.", "warning");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const randTicket = `TICKET-${new Date().getFullYear()}-QK${Math.floor(Math.random() * 90000) + 10000}`;
      setCreatedTicket(randTicket);
      showNotification("Support ticket submitted successfully!", "success");
    }, 1500);
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setOrderId("");
    setSubject("");
    setMessage("");
    setPriority("medium");
    setCreatedTicket(null);
  };

  return (
    <div className="flex flex-col gap-6" id="contact-support-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Customer Experience</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Contact Support</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Submit an official inquiry to our desk. Our support representatives typically respond within 3 hours.
        </p>
      </div>

      {createdTicket ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Support Ticket Generated!</h3>
            <p className="text-zinc-500 text-xs mt-1">Your ticket has been recorded in our dispatch center.</p>
          </div>

          <div className="bg-white dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl font-mono text-xs max-w-sm w-full flex flex-col gap-2 text-left shadow-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Ticket ID:</span>
              <span className="font-bold text-zinc-900 dark:text-white">{createdTicket}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Subject:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[180px]">{subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Priority:</span>
              <span className="font-bold text-amber-500 uppercase">{priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Est. Response Time:</span>
              <span className="font-bold text-emerald-500">Under 3 Hours</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-amber-500 dark:hover:bg-amber-500 text-white dark:text-zinc-950 hover:text-zinc-950 font-bold text-xs rounded-xl transition-colors duration-150"
          >
            Submit Another Ticket
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="John"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Order ID (Optional)</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none font-mono"
                placeholder="e.g. ORD-2026-X8"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Priority Level *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none"
              >
                <option value="low">Low (General Inquiry)</option>
                <option value="medium">Medium (Order assistance)</option>
                <option value="high">High (Faulty / Return issue)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none"
              placeholder="e.g., Shipping Delay on Laptop"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Message Inquiry *</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none resize-none"
              placeholder="Provide explicit details to help our desk review your case..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Filing Ticket...
              </>
            ) : (
              "Submit Official Ticket"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

/* ==========================================================================
   7. SHIPPING & DELIVERY (ACCORDION FAQs + TRACKING STEPPER WIDGET)
   ========================================================================== */
interface ShippingFAQ {
  q: string;
  a: string;
}

const ShippingDeliverySection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs: ShippingFAQ[] = [
    {
      q: "How fast will my QKart package ship?",
      a: "Orders placed before 2:00 PM local time are dispatched the same business day. For Prime eligible items and major cities, next-day shipping is standard. Standard shipping takes 3-5 business days."
    },
    {
      q: "Which delivery partners do you use?",
      a: "We partner directly with FedEx, UPS, DHL, and local premier courier services to ensure all packages are tracked securely with end-to-end GPS coordinates."
    },
    {
      q: "Do you ship internationally?",
      a: "Yes, QKart provides global shipping options to over 45 countries. International delivery rates are calculated dynamically at checkout based on package weight and location."
    },
    {
      q: "How can I track my active dispatch?",
      a: "Once dispatched, you will receive an SMS and email containing your tracking ID. You can also view real-time delivery checkpoints on your 'Orders' dashboard."
    }
  ];

  return (
    <div className="flex flex-col gap-6" id="shipping-delivery-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Logistics Desk</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Shipping & Delivery</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Review standard courier dispatch durations, check estimated shipping costs, or review our active shipping status layout.
        </p>
      </div>

      {/* Visual Stepper Widget */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-4">
        <h4 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500">Logistics Tracking Pipeline</h4>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
          {[
            { step: "01", name: "Order Verified", desc: "Payment checked & approved", active: true },
            { step: "02", name: "Fulfillment", desc: "Package labeled at hub", active: true },
            { step: "03", name: "In Transit", desc: "En route with carrier", active: false },
            { step: "04", name: "Out for Delivery", desc: "Arriving at doorstep", active: false }
          ].map((s, idx) => (
            <div key={idx} className="flex-1 flex gap-3 md:flex-col items-start md:items-center relative">
              <div className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center ${s.active ? "bg-amber-500 text-zinc-950 shadow-sm" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"}`}>
                {s.step}
              </div>
              <div className="flex flex-col md:items-center md:text-center">
                <span className={`text-xs font-bold ${s.active ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400"}`}>{s.name}</span>
                <span className="text-[10px] text-zinc-400 mt-0.5 max-w-[140px] leading-normal">{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable FAQs Accordion */}
      <div>
        <h3 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500 mb-3">Frequently Asked Logistics Questions</h3>
        <div className="flex flex-col gap-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFAQ === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900"
              >
                <button
                  onClick={() => setOpenFAQ(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-850 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   8. RETURNS & EXCHANGES (INTERACTIVE RETURN LABEL GENERATOR WIZARD)
   ========================================================================== */
const ReturnsExchangesSection: React.FC<{ showNotification: any }> = ({ showNotification }) => {
  const [orderNum, setOrderNum] = useState("");
  const [returnStep, setReturnStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedItem, setSelectedItem] = useState("item-1");
  const [labelGenerated, setLabelGenerated] = useState(false);

  const startReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum) return;
    setReturnStep(2);
  };

  const finalizeReturn = () => {
    if (!selectedReason) {
      showNotification("Please specify a reason for return.", "warning");
      return;
    }
    setReturnStep(3);
    setLabelGenerated(true);
    showNotification("Return authorized. Printable shipping label generated.", "success");
  };

  const resetWizard = () => {
    setOrderNum("");
    setReturnStep(1);
    setSelectedReason("");
    setLabelGenerated(false);
  };

  return (
    <div className="flex flex-col gap-6" id="returns-exchanges-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Claims Center</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Returns & Exchanges</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Generate an official return label. We support a hassle-free 10-day return policy for 100% money-back refunds.
        </p>
      </div>

      {returnStep === 1 && (
        <form onSubmit={startReturn} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-4">
          <h4 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500">Initiate a Claim</h4>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Order ID Number *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={orderNum}
                onChange={(e) => setOrderNum(e.target.value)}
                className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-1 focus:ring-amber-500 outline-none flex-1 font-mono uppercase"
                placeholder="e.g. QK-ORD-2026-X839"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-zinc-900 dark:bg-zinc-100 hover:bg-amber-500 dark:hover:bg-amber-500 text-white dark:text-zinc-950 hover:text-zinc-950 font-bold text-xs rounded-xl transition-colors duration-150"
              >
                Track Order Items
              </button>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 leading-relaxed bg-white dark:bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800">
            * Items must be in their original packaging, undamaged, and shipped within 10 days of physical delivery to be eligible.
          </span>
        </form>
      )}

      {returnStep === 2 && (
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500">Select Items & Spec</h4>
            <span className="text-[10px] font-mono text-zinc-400">Order: {orderNum.toUpperCase()}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Select items to return:</span>
            <div
              onClick={() => setSelectedItem("item-1")}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                selectedItem === "item-1"
                  ? "border-amber-500 bg-amber-500/5"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">IMG</div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Essence Mascara Lash Princess</h5>
                  <p className="text-[10px] text-zinc-400">Category: Beauty • Price: $9.99</p>
                </div>
              </div>
              <div className={`w-4 py-0.5 rounded-full border ${selectedItem === "item-1" ? "bg-amber-500 border-amber-500 text-zinc-950 flex items-center justify-center" : "border-zinc-300"}`}>
                {selectedItem === "item-1" && <Check className="w-3 h-3" />}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Reason for return *</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-1 focus:ring-amber-500 outline-none"
            >
              <option value="">-- Choose Reason --</option>
              <option value="faulty">Item arrived damaged/defective</option>
              <option value="not-as-desc">Doesn't match catalog images</option>
              <option value="wrong-item">Received incorrect color or size</option>
              <option value="acc-buy">Accidentally bought wrong item</option>
            </select>
          </div>

          <div className="flex gap-2.5 mt-2">
            <button
              onClick={() => setReturnStep(1)}
              className="px-4 py-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl transition-colors duration-150"
            >
              Back
            </button>
            <button
              onClick={finalizeReturn}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md text-center hover:from-amber-600 hover:to-amber-700"
            >
              Generate Printable RMA Label
            </button>
          </div>
        </div>
      )}

      {returnStep === 3 && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center gap-4 text-center"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">RMA Authorization Complete!</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Please print and attach this mock label to your package.</p>
          </div>

          <div className="bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-300 dark:border-zinc-800 p-5 rounded-2xl w-full max-w-sm flex flex-col gap-3 text-left shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black tracking-widest text-zinc-400">QKART LOGISTICS DEPT</span>
              <span className="text-[9px] bg-zinc-900 text-white font-mono px-2 py-0.5 rounded">PREPAID</span>
            </div>
            <div className="border-t border-b border-zinc-100 dark:border-zinc-900 py-2.5 font-mono text-[10px]">
              <p className="font-bold text-zinc-800 dark:text-zinc-200">FROM: Return claim customer</p>
              <p className="text-zinc-400 mt-1">TO: QKart Returns Fulfillment Center<br />100 Warehouse Way, Sector 4<br />Indianapolis, IN 46201</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold">RMA: {Math.floor(Math.random() * 90000000) + 10000000}</span>
              <button
                onClick={() => window.print()}
                className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-amber-500"
                title="Print label"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={resetWizard}
            className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-amber-500 dark:hover:bg-amber-500 text-white dark:text-zinc-950 hover:text-zinc-950 font-bold text-xs rounded-xl transition-colors duration-150"
          >
            Submit Another Return
          </button>
        </motion.div>
      )}
    </div>
  );
};

/* ==========================================================================
   9. REFUND POLICIES
   ========================================================================== */
const RefundPoliciesSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-6" id="refund-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Financial Policy</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Refund Policies</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Understand refund schedules, processing routes, and eligibility rules.
        </p>
      </div>

      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200">Estimated Processing Times</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-500 dark:text-zinc-400 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-850 text-zinc-700 dark:text-zinc-300 font-bold">
                <th className="pb-2">Payment Method</th>
                <th className="pb-2">Refund Route</th>
                <th className="pb-2 text-right">Processing Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850/60 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 font-bold">Credit / Debit Card</td>
                <td className="py-2.5">Original Card Gateway</td>
                <td className="py-2.5 text-right text-emerald-500">3-5 Business Days</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold">NetBanking / UPI</td>
                <td className="py-2.5">Direct Bank Account</td>
                <td className="py-2.5 text-right text-emerald-500">1-2 Business Days</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold">Cash on Delivery (COD)</td>
                <td className="py-2.5">QKart Wallet / Bank Transfer</td>
                <td className="py-2.5 text-right text-emerald-500">24-48 Hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-1.5">
        <h4 className="text-xs font-black uppercase text-zinc-400 dark:text-zinc-500">Key Guidelines</h4>
        <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400 space-y-2 pl-1.5">
          <li><strong>Quality Inspection:</strong> Refunds are approved immediately after ourIndianapolis fulfillment team conducts a brief physical inspection. This takes no longer than 24 hours from arrival.</li>
          <li><strong>Promo Deductions:</strong> If a promo coupon code was used during checkout, the discount fraction is proportionately deducted from the total refund amount.</li>
          <li><strong>Failed Shipments:</strong> Packages refused at doorstep (cash on delivery or damaged in transit) are automatically eligible for a full, zero-deduction refund.</li>
        </ul>
      </div>
    </div>
  );
};

/* ==========================================================================
   10. QKART ASSISTANT (FULLY FUNCTIONAL INTELLIGENT BOT CONVERSATION)
   ========================================================================== */
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

const QKartAssistantSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Hello! I am your virtual QKart Assistant. How can I help you optimize your e-commerce experience today?",
      time: "Just Now"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: "Just Now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I am sorry, I couldn't find a direct resolution for that. Please use our 'Contact Support' form to log an official support ticket.";
      const query = text.toLowerCase();

      if (query.includes("order") || query.includes("status")) {
        botResponse = "To track your order, please navigate to the 'Orders' link in the top menu or the shipping section. You will find real-time delivery GPS pins there.";
      } else if (query.includes("refund") || query.includes("return") || query.includes("rma")) {
        botResponse = "Under our Returns policy, you can generate a printable prepaid Indianapolis shipping label. Use the 'Returns & Exchanges' tab on our Knowledge sidebar.";
      } else if (query.includes("coupon") || query.includes("discount")) {
        botResponse = "Coupons are applied directly at checkout! Registered users receive exclusive 10-25% discount codes via our email newsletter.";
      } else if (query.includes("human") || query.includes("chat") || query.includes("agent")) {
        botResponse = "Filing a ticket in our 'Contact Support' panel immediately routes your query to ourIndianapolis human representatives who typically respond in under 3 hours.";
      }

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponse,
        time: "Just Now"
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const chips = [
    "Where is my order?",
    "Can I return an item?",
    "Speak to a human",
    "Coupons & promo codes"
  ];

  return (
    <div className="flex flex-col h-[520px] justify-between border border-zinc-200 dark:border-zinc-850 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 overflow-hidden" id="assistant-view">
      {/* Header */}
      <div className="bg-zinc-950 text-white p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold">QKart AI Assistant</h4>
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online • Live Support bot
          </span>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] flex flex-col gap-1 rounded-2xl p-3.5 text-xs leading-relaxed ${
              m.sender === "bot"
                ? "self-start bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                : "self-end bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-xs"
            }`}
          >
            <span>{m.text}</span>
            <span className={`text-[9px] mt-1 text-right ${m.sender === "bot" ? "text-zinc-400" : "text-zinc-950/60 font-medium"}`}>{m.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="self-start bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 text-zinc-400 rounded-2xl p-3 text-xs italic flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
            <span>Assistant is thinking...</span>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Suggested Chips & Input */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex flex-col gap-3">
        {/* Quick Helper Chips */}
        <div className="flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <button
              key={i}
              onClick={() => sendUserMessage(c)}
              className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-amber-500 hover:text-zinc-950 rounded-lg text-[10px] font-bold transition-all"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendUserMessage(inputVal);
            }}
            placeholder="Type your query (e.g., 'refund order')..."
            className="flex-1 p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-1 focus:ring-amber-500 outline-none"
          />
          <button
            onClick={() => sendUserMessage(inputVal)}
            className="p-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/10 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   11. PRIVACY POLICY (WITH SECTION JUMP TABLE OF CONTENTS & SEARCH FILTER)
   ========================================================================== */
const PrivacyPolicySection: React.FC = () => {
  const [filterText, setFilterText] = useState("");

  const articles = [
    {
      id: "sec-1",
      title: "1. Information We Collect",
      body: "We collect information you provide directly to us, including your full name, shipping addresses, email addresses, phone contacts, and order choices. Payment transaction processing is handled via secure, PCI-compliant partner gateways (such as Stripe) and is never persisted directly in our catalog database."
    },
    {
      id: "sec-2",
      title: "2. Algorithmic Recommendations",
      body: "To improve your experience, QKart Science pipelines analyze search records, wishlist items, and historical purchases. This data feeds client-side and server-side model scripts to present matching discount vouchers, without selling your profile coordinates to unauthorized agencies."
    },
    {
      id: "sec-3",
      title: "3. Cookie Tracking & Analytics",
      body: "We implement cookie files to stabilize your cart drawers, remember active sessions, and observe platform page-load telemetry. You can adjust your functional, marketing, and performance tracking choices at any time on our dedicated 'Cookie Preferences' panel."
    }
  ];

  const filteredArticles = articles.filter(
    a => a.title.toLowerCase().includes(filterText.toLowerCase()) || 
         a.body.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6" id="privacy-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Official Document</span>
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Privacy Policy</h2>
          <button onClick={() => window.print()} className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-500 flex items-center gap-1 text-[10px] font-bold">
            <Printer className="w-3.5 h-3.5" /> PRINT
          </button>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Last revised: June 1, 2026. This legal notice governs storage, retention, and collection of user identifiers on QKart.
        </p>
      </div>

      {/* Live search filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter policy sections (e.g., 'Cookie')..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 focus:ring-1 focus:ring-amber-500 outline-none"
        />
      </div>

      {/* Layout Content */}
      <div className="flex flex-col gap-5 mt-2">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-6 text-zinc-400 text-xs font-bold">No matches found. Try search query 'Cookie' or 'recommend'.</div>
        ) : (
          filteredArticles.map((art) => (
            <div key={art.id} className="border-l-2 border-amber-500/40 pl-4 py-0.5 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{art.title}</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{art.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   12. TERMS OF USE
   ========================================================================== */
const TermsOfUseSection: React.FC = () => {
  return (
    <div className="flex flex-col gap-6" id="terms-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Official Document</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Terms of Use</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Last revised: June 1, 2026. Please read this customer agreement thoroughly prior to completing marketplace checkouts.
        </p>
      </div>

      <div className="flex flex-col gap-4 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pl-1.5 space-y-2">
        <p>
          Welcome to QKart. By registering accounts, browsing products, or clicking checkout triggers, you authorize total compliance with our standard operating procedures.
        </p>
        <div>
          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">1. User Commitment</h4>
          <p>You agree to supply authentic first and last names, registered physical delivery destinations, and verified credentials. Standard credit card operations must belong directly to the account handler.</p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">2. Platform Safeguards</h4>
          <p>Any system injection, mock data script crawling, rate-limiting violations, or attempts to disrupt Vite/Node cloud assets are strictly prohibited and results in immediate, irreversible account terminations.</p>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   13. COOKIE PREFERENCES (WITH INTERACTIVE STATE & LOCAL STORAGE SAVING)
   ========================================================================== */
const CookiePreferencesSection: React.FC<{ showNotification: any }> = ({ showNotification }) => {
  const [essential, setEssential] = useState(true); // Locked
  const [analytical, setAnalytical] = useState(() => localStorage.getItem("cookie_analytical") !== "false");
  const [functional, setFunctional] = useState(() => localStorage.getItem("cookie_functional") !== "false");
  const [targeting, setTargeting] = useState(() => localStorage.getItem("cookie_targeting") === "true");

  const saveSettings = () => {
    localStorage.setItem("cookie_analytical", analytical ? "true" : "false");
    localStorage.setItem("cookie_functional", functional ? "true" : "false");
    localStorage.setItem("cookie_targeting", targeting ? "true" : "false");
    showNotification("Cookie consent preferences successfully updated.", "success");
  };

  return (
    <div className="flex flex-col gap-6" id="cookie-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Tracking Manager</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Cookie Preferences</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Adjust functional and targeting cookie settings. Customize what identifiers our recommendation layers track.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {/* Toggle 1: Essential */}
        <div className="flex items-start justify-between gap-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-800/10">
          <div className="flex flex-col gap-1 max-w-lg">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Essential Cookies (Always Active)</span>
            <span className="text-[10px] text-zinc-400 leading-normal">Required to stabilize active login sessions, persistent cart drawer items, and page notifications. Cannot be disabled.</span>
          </div>
          <div className="w-9 h-5 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full flex items-center justify-end p-0.5 cursor-not-allowed">
            <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
          </div>
        </div>

        {/* Toggle 2: Analytical */}
        <div className="flex items-start justify-between gap-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-800/10">
          <div className="flex flex-col gap-1 max-w-lg">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Analytical & Performance Cookies</span>
            <span className="text-[10px] text-zinc-400 leading-normal">Helps us monitor page loads, identify slower database routines, and ensure fluid micro-interactions.</span>
          </div>
          <button
            onClick={() => setAnalytical(!analytical)}
            className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${analytical ? "bg-amber-500 justify-end" : "bg-zinc-200 dark:bg-zinc-800 justify-start"}`}
          >
            <div className={`w-4 h-4 rounded-full shadow-xs ${analytical ? "bg-zinc-950" : "bg-zinc-400"}`}></div>
          </button>
        </div>

        {/* Toggle 3: Functional */}
        <div className="flex items-start justify-between gap-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-800/10">
          <div className="flex flex-col gap-1 max-w-lg">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Functional Cookies</span>
            <span className="text-[10px] text-zinc-400 leading-normal">Enables enhanced personalization features, such as remembering your specific layout preferences and last searched categories.</span>
          </div>
          <button
            onClick={() => setFunctional(!functional)}
            className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${functional ? "bg-amber-500 justify-end" : "bg-zinc-200 dark:bg-zinc-800 justify-start"}`}
          >
            <div className={`w-4 h-4 rounded-full shadow-xs ${functional ? "bg-zinc-950" : "bg-zinc-400"}`}></div>
          </button>
        </div>

        {/* Toggle 4: Targeting */}
        <div className="flex items-start justify-between gap-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-800/10">
          <div className="flex flex-col gap-1 max-w-lg">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Targeting & Marketing Cookies</span>
            <span className="text-[10px] text-zinc-400 leading-normal">Coordinates with approved marketing partners to display tailored product alerts on other networks based on your browsing interests.</span>
          </div>
          <button
            onClick={() => setTargeting(!targeting)}
            className={`w-9 h-5 rounded-full flex items-center p-0.5 transition-colors ${targeting ? "bg-amber-500 justify-end" : "bg-zinc-200 dark:bg-zinc-800 justify-start"}`}
          >
            <div className={`w-4 h-4 rounded-full shadow-xs ${targeting ? "bg-zinc-950" : "bg-zinc-400"}`}></div>
          </button>
        </div>
      </div>

      <button
        onClick={saveSettings}
        className="mt-2 w-full py-3.5 bg-zinc-950 hover:bg-amber-500 dark:bg-zinc-100 dark:hover:bg-amber-500 text-white dark:text-zinc-950 hover:text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
      >
        Save Consent Settings
      </button>
    </div>
  );
};

/* ==========================================================================
   14. INTEREST-BASED ADS (OPT-OUT SIMULATOR)
   ========================================================================== */
const InterestAdsSection: React.FC<{ showNotification: any }> = ({ showNotification }) => {
  const [optedOut, setOptedOut] = useState(() => localStorage.getItem("opt_out_ads") === "true");

  const toggleOptOut = () => {
    const newState = !optedOut;
    setOptedOut(newState);
    localStorage.setItem("opt_out_ads", newState ? "true" : "false");
    showNotification(
      newState 
        ? "Personalized ads opt-out active. General ads will still display."
        : "Opted-in to interest-based personalized ads.",
      "info"
    );
  };

  return (
    <div className="flex flex-col gap-6" id="ads-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Ad Controls</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Interest-Based Ads</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Review personalized advertising protocols and manage your preference values securely.
        </p>
      </div>

      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200">Opt-Out Preferences</h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          We respect privacy boundaries. If you choose to opt out of interest-based ads, we will restrict tracking cookies from storing your product search metrics for external ad retargeting.
        </p>
        <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800/60 pt-4 mt-2">
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Opt-Out of Interest-Based Tracking</span>
          <button
            onClick={toggleOptOut}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors duration-150 ${
              optedOut 
                ? "bg-amber-500 text-zinc-950" 
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {optedOut ? "Opt-Out Active" : "Opt-In (Standard)"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   15. E-WASTE MANAGEMENT (ZIP LOCATOR + PICKUP SCHEDULING FORM)
   ========================================================================== */
interface RecycleCenter {
  zip: string;
  name: string;
  address: string;
  phone: string;
}

const EWasteSection: React.FC<{ showNotification: any }> = ({ showNotification }) => {
  const [zipCode, setZipCode] = useState("");
  const [foundCenters, setFoundCenters] = useState<RecycleCenter[] | null>(null);
  
  // Pickup form state
  const [pickupItem, setPickupItem] = useState("laptop");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  const centers: RecycleCenter[] = [
    { zip: "10001", name: "Manhattan Eco-Tech Solutions", address: "405 W 23rd St, New York, NY 10011", phone: "(212) 555-0143" },
    { zip: "46201", name: "Indianapolis Certified Scrap LLC", address: "1405 Prospect St, Indianapolis, IN 46203", phone: "(317) 555-0922" },
    { zip: "94043", name: "Google Silicon Valley Recycle Hub", address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043", phone: "(650) 555-0199" },
    { zip: "90001", name: "Los Angeles Eco-Waste Processing", address: "1250 S Grand Ave, Los Angeles, CA 90015", phone: "(213) 555-0188" }
  ];

  const searchZip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode) return;
    const matched = centers.filter(c => c.zip === zipCode);
    setFoundCenters(matched);
    if (matched.length === 0) {
      showNotification("No authorized collection centers found for this ZIP. Listing nearest national hubs instead.", "info");
      setFoundCenters(centers.slice(0, 2));
    } else {
      showNotification("Local certified recycling center located!", "success");
    }
  };

  const schedulePickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupDate || !pickupAddress) {
      showNotification("Please select a date and enter an address.", "warning");
      return;
    }

    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      showNotification(`E-Waste pickup successfully scheduled for ${pickupDate}! Reference ID: REC-${Math.floor(Math.random() * 90000) + 10000}`, "success");
      setPickupDate("");
      setPickupAddress("");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6" id="ewaste-view">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Green Initiative</span>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">E-Waste Management</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          QKart sponsors environmentally friendly processing for obsolete hardware. Find drop-off sites or book custom pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Zip Locator */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200">1. Authorized Site Locator</h4>
          <form onSubmit={searchZip} className="flex gap-2">
            <input
              type="text"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP Code (e.g. 46201)..."
              maxLength={5}
              className="p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-1 focus:ring-amber-500 outline-none flex-1 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-amber-500 dark:hover:bg-amber-500 text-white dark:text-zinc-950 hover:text-zinc-950 font-bold text-xs rounded-xl transition-colors duration-150"
            >
              Search
            </button>
          </form>

          {foundCenters && (
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Drop-off locations found:</span>
              {foundCenters.map((c, i) => (
                <div key={i} className="p-3 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl text-[11px] leading-relaxed flex flex-col gap-1 shadow-2xs">
                  <span className="font-bold text-zinc-800 dark:text-zinc-100">{c.name}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{c.address}</span>
                  <span className="text-zinc-400 font-mono">Phone: {c.phone}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pickup Booking */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10 flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase text-zinc-800 dark:text-zinc-200">2. Schedule Pickups</h4>
          <form onSubmit={schedulePickup} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Item Category</label>
                <select
                  value={pickupItem}
                  onChange={(e) => setPickupItem(e.target.value)}
                  className="p-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none"
                >
                  <option value="laptop">Workstation / Laptop</option>
                  <option value="phone">Smartphones / Tablets</option>
                  <option value="home">Kitchen / Appliances</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase">Pickup Date</label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="p-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-zinc-400 uppercase">Home Address</label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Street address, city, state, zip..."
                className="p-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isScheduling}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
            >
              {isScheduling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Certified Pickup"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
