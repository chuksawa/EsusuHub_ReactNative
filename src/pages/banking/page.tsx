
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Banking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [transferForm, setTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [depositForm, setDepositForm] = useState({
    account: '',
    amount: '',
    method: 'card'
  });
  const [withdrawForm, setWithdrawForm] = useState({
    account: '',
    amount: '',
    method: 'bank_transfer'
  });
  const [applicationForm, setApplicationForm] = useState({
    accountType: 'savings',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    occupation: '',
    monthlyIncome: '',
    idType: 'nin',
    idNumber: '',
    bvn: ''
  });

  // Mock user bank accounts
  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      accountNumber: '2034567890',
      accountName: 'Adebayo Olumide',
      accountType: 'Savings',
      balance: 2450000,
      currency: 'NGN',
      status: 'active',
      openDate: '2023-01-15',
      branch: 'Victoria Island',
      interestRate: 5.5,
      minimumBalance: 1000
    },
    {
      id: 2,
      accountNumber: '3045678901',
      accountName: 'Adebayo Olumide',
      accountType: 'Current',
      balance: 850000,
      currency: 'NGN',
      status: 'active',
      openDate: '2023-03-20',
      branch: 'Victoria Island',
      interestRate: 0,
      minimumBalance: 5000
    }
  ]);

  // Mock recent transactions
  const recentTransactions = [
    { id: 1, type: 'credit', description: 'Salary Payment', amount: 450000, date: '2024-02-15', account: '2034567890', balance: 2450000 },
    { id: 2, type: 'debit', description: 'ATM Withdrawal', amount: 50000, date: '2024-02-14', account: '2034567890', balance: 2000000 },
    { id: 3, type: 'credit', description: 'Transfer from Savings', amount: 200000, date: '2024-02-13', account: '3045678901', balance: 850000 },
    { id: 4, type: 'debit', description: 'Online Purchase', amount: 25000, date: '2024-02-12', account: '3045678901', balance: 650000 },
    { id: 5, type: 'credit', description: 'Dividend Payment', amount: 75000, date: '2024-02-10', account: '2034567890', balance: 2050000 }
  ];

  // Mock pending applications
  const [pendingApplications, setPendingApplications] = useState([
    {
      id: 1,
      accountType: 'Fixed Deposit',
      applicationDate: '2024-02-10',
      status: 'under_review',
      estimatedApproval: '2024-02-20'
    }
  ]);

  const handleApplyAccount = () => {
    const newApplication = {
      id: Date.now(),
      accountType: applicationForm.accountType,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      estimatedApproval: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setPendingApplications(prev => [newApplication, ...prev]);
    setShowApplyModal(false);
    setApplicationForm({
      accountType: 'savings',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      occupation: '',
      monthlyIncome: '',
      idType: 'nin',
      idNumber: '',
      bvn: ''
    });
  };

  const handleTransfer = () => {
    // Mock transfer logic
    setShowTransferModal(false);
    setTransferForm({
      fromAccount: '',
      toAccount: '',
      amount: '',
      description: ''
    });
  };

  const handleDeposit = () => {
    // Mock deposit logic
    setShowDepositModal(false);
    setDepositForm({
      account: '',
      amount: '',
      method: 'card'
    });
  };

  const handleWithdraw = () => {
    // Mock withdrawal logic
    setShowWithdrawModal(false);
    setWithdrawForm({
      account: '',
      amount: '',
      method: 'bank_transfer'
    });
  };

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-blue-100 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
                <i className="ri-arrow-left-line text-blue-600 text-xl"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-blue-800">EsusuBank</h1>
                <p className="text-sm text-blue-600">Digital Banking Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-notification-3-line text-blue-600 text-xl"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center">
                <i className="ri-customer-service-2-line text-blue-600 text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="fixed top-16 w-full bg-white/95 backdrop-blur-sm border-b border-blue-100 z-40">
        <div className="flex px-2 py-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'accounts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Accounts
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'transactions' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Transactions
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'services' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
            }`}
          >
            Services
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-6 px-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Total Balance Card */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-blue-100 text-sm">Total Balance</p>
                  <h2 className="text-3xl font-bold">₦{totalBalance.toLocaleString()}</h2>
                  <p className="text-blue-100 text-sm mt-1">Across {bankAccounts.length} accounts</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-bank-fill text-2xl"></i>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Deposit
                </button>
                <button 
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Withdraw
                </button>
                <button 
                  onClick={() => setShowTransferModal(true)}
                  className="flex-1 bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Transfer
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowApplyModal(true)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-add-circle-fill text-green-600 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Open Account</p>
                    <p className="text-sm text-gray-500">Apply for new account</p>
                  </div>
                </div>
              </button>
              <button className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-credit-card-fill text-purple-600 text-xl"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Request Card</p>
                    <p className="text-sm text-gray-500">Get debit/credit card</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-4">My Accounts</h3>
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        account.accountType === 'Savings' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <i className={`${
                          account.accountType === 'Savings' ? 'ri-safe-fill text-green-600' : 'ri-bank-card-fill text-blue-600'
                        } text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{account.accountType}</p>
                        <p className="text-sm text-gray-500">****{account.accountNumber.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₦{account.balance.toLocaleString()}</p>
                      <button 
                        onClick={() => {
                          setSelectedAccount(account);
                          setShowAccountDetails(true);
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <i className={`${
                          transaction.type === 'credit' ? 'ri-arrow-down-line text-green-600' : 'ri-arrow-up-line text-red-600'
                        } text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date} • ****{transaction.account.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Applications */}
            {pendingApplications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-4">Pending Applications</h3>
                <div className="space-y-3">
                  {pendingApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800">{application.accountType} Account</p>
                        <p className="text-sm text-gray-500">Applied on {new Date(application.applicationDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium mb-1">
                          {application.status.replace('_', ' ')}
                        </div>
                        <p className="text-xs text-gray-500">Est. approval: {new Date(application.estimatedApproval).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Bank Accounts</h3>
              <button 
                onClick={() => setShowApplyModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Open Account</span>
              </button>
            </div>

            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <div key={account.id} className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        account.accountType === 'Savings' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        <i className={`${
                          account.accountType === 'Savings' ? 'ri-safe-fill text-green-600' : 'ri-bank-card-fill text-blue-600'
                        } text-xl`}></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{account.accountType} Account</h4>
                        <p className="text-sm text-gray-500">{account.accountNumber}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      account.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {account.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Balance</p>
                      <p className="text-2xl font-bold text-gray-800">₦{account.balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Name</p>
                      <p className="font-medium text-gray-800">{account.accountName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Branch</p>
                      <p className="font-medium text-gray-700">{account.branch}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Opened</p>
                      <p className="font-medium text-gray-700">{new Date(account.openDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="font-medium text-gray-700">{account.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Min. Balance</p>
                      <p className="font-medium text-gray-700">₦{account.minimumBalance.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => {
                        setSelectedAccount(account);
                        setShowAccountDetails(true);
                      }}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button className="flex-1 bg-gray-50 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium">
                      Download Statement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Transaction History</h3>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <i className="ri-filter-line"></i>
                <span>Filter</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100">
              {recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className={`p-4 ${index !== recentTransactions.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <i className={`${
                          transaction.type === 'credit' ? 'ri-arrow-down-line text-green-600' : 'ri-arrow-up-line text-red-600'
                        } text-xl`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                        <p className="text-xs text-gray-400">Account: ****{transaction.account.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Balance: ₦{transaction.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <h3 className="font-semibold text-gray-800">Banking Services</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowApplyModal(true)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-add-circle-fill text-green-600 text-xl"></i>
                </div>
                <p className="font-medium text-gray-800 text-sm">Open Account</p>
                <p className="text-xs text-gray-500 mt-1">Savings, Current, Fixed Deposit</p>
              </button>

              <button className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-credit-card-fill text-purple-600 text-xl"></i>
                </div>
                <p className="font-medium text-gray-800 text-sm">Request Card</p>
                <p className="text-xs text-gray-500 mt-1">Debit & Credit Cards</p>
              </button>

              <button className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-money-dollar-circle-fill text-blue-600 text-xl"></i>
                </div>
                <p className="font-medium text-gray-800 text-sm">Loans</p>
                <p className="text-xs text-gray-500 mt-1">Personal & Business Loans</p>
              </button>

              <button className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-line-chart-fill text-orange-600 text-xl"></i>
                </div>
                <p className="font-medium text-gray-800 text-sm">Investments</p>
                <p className="text-xs text-gray-500 mt-1">Mutual Funds & Bonds</p>
              </button>

              <button className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-shield-check-fill text-teal-600 text-xl"></i>
                </div>
                <p className="font-medium text-gray-800 text-sm">Insurance</p>
                <p className="text-xs text-gray-500 mt-1">Life & General Insurance</p>
              </button>

              <button className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-exchange-dollar-fill text-pink-600 text-xl"></i>
                </div>
                <p className="font-medium text-gray-800 text-sm">Forex</p>
                <p className="text-xs text-gray-500 mt-1">Foreign Exchange</p>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
              <h4 className="font-semibold text-gray-800 mb-4">Digital Services</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-smartphone-line text-blue-600"></i>
                    </div>
                    <span className="text-gray-700">Mobile Banking</span>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-qr-code-line text-green-600"></i>
                    </div>
                    <span className="text-gray-700">QR Payments</span>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="ri-bill-line text-purple-600"></i>
                    </div>
                    <span className="text-gray-700">Bill Payments</span>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="ri-phone-line text-orange-600"></i>
                    </div>
                    <span className="text-gray-700">Airtime & Data</span>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply for Account Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Apply for Bank Account</h3>
                <button onClick={() => setShowApplyModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="accountType"
                      value="savings"
                      checked={applicationForm.accountType === 'savings'}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, accountType: e.target.value }))}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      applicationForm.accountType === 'savings' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {applicationForm.accountType === 'savings' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Savings Account</p>
                      <p className="text-sm text-gray-500">Earn 5.5% interest annually</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="accountType"
                      value="current"
                      checked={applicationForm.accountType === 'current'}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, accountType: e.target.value }))}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      applicationForm.accountType === 'current' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {applicationForm.accountType === 'current' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Current Account</p>
                      <p className="text-sm text-gray-500">For business transactions</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="accountType"
                      value="fixed_deposit"
                      checked={applicationForm.accountType === 'fixed_deposit'}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, accountType: e.target.value }))}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      applicationForm.accountType === 'fixed_deposit' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {applicationForm.accountType === 'fixed_deposit' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Fixed Deposit</p>
                      <p className="text-sm text-gray-500">Higher interest rates, fixed term</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={applicationForm.firstName}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    placeholder="Enter first name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={applicationForm.lastName}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    placeholder="Enter last name" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter email address" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={applicationForm.phone}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="+234 xxx xxx xxxx" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  value={applicationForm.address}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter full address" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    value={applicationForm.city}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    placeholder="Enter city" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select 
                    value={applicationForm.state}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="">Select State</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="kano">Kano</option>
                    <option value="rivers">Rivers</option>
                    <option value="ogun">Ogun</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input 
                  type="text" 
                  value={applicationForm.occupation}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter occupation" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
                <select 
                  value={applicationForm.monthlyIncome}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select Income Range</option>
                  <option value="below_50k">Below ₦50,000</option>
                  <option value="50k_100k">₦50,000 - ₦100,000</option>
                  <option value="100k_250k">₦100,000 - ₦250,000</option>
                  <option value="250k_500k">₦250,000 - ₦500,000</option>
                  <option value="above_500k">Above ₦500,000</option>
                </select>
              </div>

              {/* Identification */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                  <select 
                    value={applicationForm.idType}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, idType: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="nin">NIN</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="voters_card">Voter's Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input 
                    type="text" 
                    value={applicationForm.idNumber}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, idNumber: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    placeholder="Enter ID number" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BVN (Bank Verification Number)</label>
                <input 
                  type="text" 
                  value={applicationForm.bvn}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, bvn: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter 11-digit BVN" 
                  maxLength={11}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <i className="ri-information-line text-blue-600 text-sm mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Application Process</p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
                      <li>• Application review takes 3-5 business days</li>
                      <li>• You'll receive SMS/email updates on status</li>
                      <li>• Initial deposit required upon approval</li>
                      <li>• Valid ID and BVN verification required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApplyAccount}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Transfer Money</h3>
              <button onClick={() => setShowTransferModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                <select 
                  value={transferForm.fromAccount}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, fromAccount: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select account</option>
                  {bankAccounts.map((account) => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountType} - ****{account.accountNumber.slice(-4)} (₦{account.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                <input 
                  type="text" 
                  value={transferForm.toAccount}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, toAccount: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter account number" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter amount" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  value={transferForm.description}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter description" 
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTransfer}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium"
                >
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Deposit Money</h3>
              <button onClick={() => setShowDepositModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                <select 
                  value={depositForm.account}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, account: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select account</option>
                  {bankAccounts.map((account) => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountType} - ****{account.accountNumber.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter amount" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="depositMethod"
                      value="card"
                      checked={depositForm.method === 'card'}
                      onChange={(e) => setDepositForm(prev => ({ ...prev, method: e.target.value }))}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      depositForm.method === 'card' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {depositForm.method === 'card' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700">Debit/Credit Card</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="depositMethod"
                      value="bank_transfer"
                      checked={depositForm.method === 'bank_transfer'}
                      onChange={(e) => setDepositForm(prev => ({ ...prev, method: e.target.value }))}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      depositForm.method === 'bank_transfer' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {depositForm.method === 'bank_transfer' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700">Bank Transfer</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeposit}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium"
                >
                  Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Withdraw Money</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
                <select 
                  value={withdrawForm.account}
                  onChange={(e) => setWithdrawForm(prev => ({ ...prev, account: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Select account</option>
                  {bankAccounts.map((account) => (
                    <option key={account.id} value={account.accountNumber}>
                      {account.accountType} - ****{account.accountNumber.slice(-4)} (₦{account.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Enter amount" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="withdrawMethod"
                      value="atm"
                      checked={withdrawForm.method === 'atm'}
                      onChange={(e) => setWithdrawForm(prev => ({ ...prev, method: e.target.value }))}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      withdrawForm.method === 'atm' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {withdrawForm.method === 'atm' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700">ATM Withdrawal</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="withdrawMethod"
                      value="bank_transfer"
                      checked={withdrawForm.method === 'bank_transfer'}
                      onChange={(e) => setWithdrawForm(prev => ({ ...prev, method: e.target.value }))}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      withdrawForm.method === 'bank_transfer' ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {withdrawForm.method === 'bank_transfer' && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700">Bank Transfer</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleWithdraw}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg font-medium"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {showAccountDetails && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
                <button onClick={() => setShowAccountDetails(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Account Info */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold">{selectedAccount.accountType} Account</h4>
                    <p className="text-blue-100">{selectedAccount.accountNumber}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedAccount.accountType === 'Savings' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <i className={`${
                      selectedAccount.accountType === 'Savings' ? 'ri-safe-fill text-green-600' : 'ri-bank-card-fill text-blue-600'
                    } text-xl`}></i>
                  </div>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Current Balance</p>
                  <p className="text-3xl font-bold">₦{selectedAccount.balance.toLocaleString()}</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Account Name</p>
                    <p className="font-medium text-gray-800">{selectedAccount.accountName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      selectedAccount.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedAccount.status}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-medium text-gray-800">{selectedAccount.branch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Opened</p>
                    <p className="font-medium text-gray-800">{new Date(selectedAccount.openDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="font-medium text-gray-800">{selectedAccount.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minimum Balance</p>
                    <p className="font-medium text-gray-800">₦{selectedAccount.minimumBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
                    <i className="ri-download-line"></i>
                    <span>Statement</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-600 rounded-lg font-medium">
                    <i className="ri-printer-line"></i>
                    <span>Print</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-600 rounded-lg font-medium">
                    <i className="ri-share-line"></i>
                    <span>Share</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 bg-orange-50 text-orange-600 rounded-lg font-medium">
                    <i className="ri-settings-3-line"></i>
                    <span>Settings</span>
                  </button>
                </div>
              </div>

              {/* Recent Transactions for this account */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Recent Transactions</h4>
                <div className="space-y-3">
                  {recentTransactions
                    .filter(t => t.account === selectedAccount.accountNumber)
                    .slice(0, 3)
                    .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <i className={`${
                            transaction.type === 'credit' ? 'ri-arrow-down-line text-green-600' : 'ri-arrow-up-line text-red-600'
                          } text-sm`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <p className={`font-semibold text-sm ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
