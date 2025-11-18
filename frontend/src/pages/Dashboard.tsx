import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- STYLES ---
// NEW: Re-skinned styles inspired by the user-provided image.
// Uses a clean blue primary color, light gray background, and white cards.
const styles: { [key: string]: React.CSSProperties } = {
  // Page layout
  pageContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f7f9fc', // Light gray background
    minHeight: '100vh',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '20px 32px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)', // Softer shadow
    marginBottom: '24px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c', // Dark title
    margin: 0,
  },
  
  // Main Content Wrapper (Flex)
  contentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    alignItems: 'flex-start',
  },

  // Vertical Navigation
  verticalNav: {
    display: 'flex',
    flexDirection: 'column',
    width: '240px',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)', // Softer shadow
    padding: '12px',
  },

  // Content Area
  contentArea: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)', // Softer shadow
    padding: '32px',
    minHeight: '400px',
  },

  // --- UPDATED: Tab Button Styling ---
  tabButton: {
    width: '100%',
    padding: '16px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    color: '#4a5568', // Medium gray text
    textAlign: 'left',
    transition: 'background-color 0.2s, color 0.2s',
  },
  tabButtonActive: {
    color: '#2563eb', // Darker blue text (matches primary)
    backgroundColor: '#eff6ff', // Light blue background
    fontWeight: '700',
  },

  // Card styles
  cardTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a202c',
    margin: '0 0 24px 0',
    borderBottom: '1px solid #e2e8f0', // Light border
    paddingBottom: '12px',
  },
  // Detail rows
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '16px',
    marginBottom: '18px',
  },
  detailLabel: {
    color: '#718096', // Lighter gray label
    fontWeight: '500',
  },
  detailValue: {
    color: '#1a202c', // Dark value
    fontWeight: '600',
  },
  
  // Status Badges (This style already matches the image)
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusActive: { backgroundColor: '#e0f7f0', color: '#06a664' }, // Green from image
  statusSuspended: { backgroundColor: '#fffbeb', color: '#b45309' },
  statusExpired: { backgroundColor: '#fff1f2', color: '#be123c' },
  
  // Quick actions
  quickActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '24px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '24px',
  },
  // --- UPDATED: Button colors ---
  actionButton: {
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#3b82f6', // NEW: Primary Blue
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s, box-shadow 0.2s',
  },
  actionButtonSecondary: {
    backgroundColor: '#e2e8f0', // NEW: Light gray
    color: '#2d3748', // Dark text
  },
  
  // Asset/Progress bar
  assetUsage: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  progressBarContainer: {
    height: '12px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6', // NEW: Primary Blue
    borderRadius: '6px',
    transition: 'width 0.3s',
  },
  
  // Invoice list
  invoiceList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  invoiceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  invoiceLink: {
    color: '#3b82f6', // NEW: Primary Blue
    textDecoration: 'none',
    fontWeight: '600',
  },
  
  // Logout button
  logoutButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#ef4444', // Modern red
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
};

// --- TYPESCRIPT INTERFACES ---
interface Invoice {
  id: string;
  date: string;
  amount: number;
  url: string;
}

type AccountStatus = "Active" | "Suspended" | "Expired";

interface UserData {
  planName: string;
  renewalDate: string;
  memberSince: string;
  accountStatus: AccountStatus;
  assetsLimit: number;
  assetsUsed: number;
  planPrice: number;
  nextPaymentDate: string;
  paymentMethod: string;
  invoiceHistory: Invoice[];
}

// --- MOCK DATA ---
const mockUserData: UserData = {
  planName: "Pro",
  renewalDate: "2026-10-28",
  memberSince: "2024-01-15",
  accountStatus: "Active",
  assetsLimit: 200,
  assetsUsed: 145,
  planPrice: 49.99,
  nextPaymentDate: "2025-11-28",
  paymentMethod: "Credit Card (**** 4242)",
  invoiceHistory: [
    { id: "INV-003", date: "2025-10-28", amount: 49.99, url: "/invoices/inv-003.pdf" },
    { id: "INV-002", date: "2025-09-28", amount: 49.99, url: "/invoices/inv-002.pdf" },
    { id: "INV-001", date: "2025-08-28", amount: 49.99, url: "/invoices/inv-001.pdf" },
  ]
};

// --- HELPER FUNCTIONS ---
// UPDATED: Changed emojis to match image
const getStatusBadge = (status: AccountStatus) => {
  const statusMap: { [key in AccountStatus]: React.CSSProperties } = {
    Active: styles.statusActive,
    Suspended: styles.statusSuspended,
    Expired: styles.statusExpired,
  };
  const emojiMap: { [key in AccountStatus]: string } = {
    Active: '✅', // Using checkmark like in the image
    Suspended: '⚠️',
    Expired: '❌',
  };
  const specificStyle = statusMap[status];
  
  return (
    <span style={{ ...styles.statusBadge, ...specificStyle }}>
      {emojiMap[status]}
      <span style={{ marginLeft: '4px' }}>{status}</span>
    </span>
  );
};

// --- COMPONENT ---
type TabName = 'summary' | 'membership' | 'billing';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabName>('summary');

  // Auth Guard
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login', { replace: true });
  };

  const assetUsagePercent = (mockUserData.assetsUsed / mockUserData.assetsLimit) * 100;

  const getTabStyle = (tabName: TabName) => {
    return activeTab === tabName
      ? { ...styles.tabButton, ...styles.tabButtonActive }
      : styles.tabButton;
  };
  
  const getTabHoverStyle = (tabName: TabName) => {
    if (activeTab === tabName) return {};
    return {
      backgroundColor: '#f8fafc', // Very light hover for inactive
      color: '#1a202c'
    };
  };

  return (
    <div style={styles.pageContainer}>

      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Account Dashboard</h1>
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
          // NEW: Updated hover colors
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#dc2626')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#ef4444')}
        >
          Logout
        </button>
      </header>
      
      <div style={styles.contentWrapper}>
      
        <nav style={styles.verticalNav}>
          <button
            style={getTabStyle('summary')}
            onClick={() => setActiveTab('summary')}
            onMouseOver={e => {
                if (activeTab !== 'summary') {
                    e.currentTarget.style.backgroundColor = getTabHoverStyle('summary').backgroundColor;
                    e.currentTarget.style.color = getTabHoverStyle('summary').color;
                }
            }}
            onMouseOut={e => {
                if (activeTab !== 'summary') {
                    e.currentTarget.style.backgroundColor = getTabStyle('summary').backgroundColor;
                    e.currentTarget.style.color = getTabStyle('summary').color;
                }
            }}
          >
            Account Summary
          </button>
          <button
            style={getTabStyle('membership')}
            onClick={() => setActiveTab('membership')}
            onMouseOver={e => {
                if (activeTab !== 'membership') {
                    e.currentTarget.style.backgroundColor = getTabHoverStyle('membership').backgroundColor;
                    e.currentTarget.style.color = getTabHoverStyle('membership').color;
                }
            }}
            onMouseOut={e => {
                if (activeTab !== 'membership') {
                    e.currentTarget.style.backgroundColor = getTabStyle('membership').backgroundColor;
                    e.currentTarget.style.color = getTabStyle('membership').color;
                }
            }}
          >
            Membership & Plan
          </button>
          <button
            style={getTabStyle('billing')}
            onClick={() => setActiveTab('billing')}
            onMouseOver={e => {
                if (activeTab !== 'billing') {
                    e.currentTarget.style.backgroundColor = getTabHoverStyle('billing').backgroundColor;
                    e.currentTarget.style.color = getTabHoverStyle('billing').color;
                }
            }}
            onMouseOut={e => {
                if (activeTab !== 'billing') {
                    e.currentTarget.style.backgroundColor = getTabStyle('billing').backgroundColor;
                    e.currentTarget.style.color = getTabStyle('billing').color;
                }
            }}
          >
            Billing Details
          </button>
        </nav>
        
        <div style={styles.contentArea}>
          {activeTab === 'summary' && (
            <>
              <h2 style={styles.cardTitle}>Account Summary</h2>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Plan Name</span>
                <span style={styles.detailValue}>{mockUserData.planName}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Status</span>
                {getStatusBadge(mockUserData.accountStatus)}
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Next Renewal</span>
                <span style={styles.detailValue}>{mockUserData.renewalDate}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Member Since</span>
                <span style={styles.detailValue}>{mockUserData.memberSince}</span>
              </div>
              <div style={styles.quickActions}>
                <button
                  style={styles.actionButton}
                  // NEW: Updated hover colors
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#2563eb')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                >
                  Upgrade Plan
                </button>
                <button
                  style={{ ...styles.actionButton, ...styles.actionButtonSecondary }}
                  // NEW: Updated hover colors
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#cbd5e1')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                >
                  Manage Billing
                </button>
                <button
                  style={{ ...styles.actionButton, ...styles.actionButtonSecondary }}
                  // NEW: Updated hover colors
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = '#cbd5e1')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                >
                  Request Support
                </button>
              </div>
            </>
          )}

          {activeTab === 'membership' && (
            <>
              <h2 style={styles.cardTitle}>Membership & Plan Details</h2>
              <div style={styles.assetUsage}>
                <span style={styles.detailLabel}>Asset Usage: </span>
                <span style={styles.detailValue}>
                  {mockUserData.assetsUsed} / {mockUserData.assetsLimit}
                </span>
              </div>
              <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBar, width: `${assetUsagePercent}%` }} />
              </div>
              <div style={{ ...styles.detailRow, marginTop: '20px' }}>
                <span style={styles.detailLabel}>Assets Remaining</span>
                <span style={styles.detailValue}>
                  {mockUserData.assetsLimit - mockUserData.assetsUsed}
                </span>
              </div>
            </>
          )}

          {activeTab === 'billing' && (
            <>
              <h2 style={styles.cardTitle}>Billing Summary</h2>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Current Plan Price</span>
                <span style={styles.detailValue}>${mockUserData.planPrice} / mo</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Next Payment</span>
                <span style={styles.detailValue}>{mockUserData.nextPaymentDate}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Payment Method</span>
                <span style={styles.detailValue}>{mockUserData.paymentMethod}</span>
              </div>

              <h3 style={{ ...styles.cardTitle, fontSize: '18px', marginTop: '30px' }}>
                Invoice History
              </h3>
              <ul style={styles.invoiceList}>
                {mockUserData.invoiceHistory.map((invoice, index) => (
                  <li 
                    key={invoice.id} 
                    style={{
                      ...styles.invoiceItem, 
                      // Remove bottom border for the last item
                      borderBottom: index === mockUserData.invoiceHistory.length - 1 ? 'none' : '1px solid #f1f5f9'
                    }}
                  >
                    <span>{invoice.date} - ${invoice.amount}</span>
                    <a href={invoice.url} target="_blank" rel="noopener noreferrer" style={styles.invoiceLink}>
                      Download PDF
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}