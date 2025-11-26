
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('members');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showSendInvite, setShowSendInvite] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [inviteForm, setInviteForm] = useState({ handle: '', message: '' });
  const [handleSearchResults, setHandleSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  // Mock data - in real app this would be fetched based on groupId
  const groupData = {
    1: { name: 'Unity Savings Circle', monthlyContribution: 50000, currentMembers: 6, totalMembers: 12, startDate: '2023-01-15' },
    2: { name: 'Obiozo Traders et al', monthlyContribution: 25000, currentMembers: 8, totalMembers: 10, startDate: '2023-03-10' },
    3: { name: 'Hajiya Nafisat Group', monthlyContribution: 75000, currentMembers: 10, totalMembers: 15, startDate: '2023-06-20' },
    4: { name: 'Community Development', monthlyContribution: 30000, currentMembers: 15, totalMembers: 20, startDate: '2023-08-05' }
  };

  const currentGroup = groupData[groupId as keyof typeof groupData] || groupData[1];

  // Mock users database for searching handles
  const allUsers = [
    { id: 101, handle: '@john_doe', name: 'John Doe', email: 'john@email.com', phone: '+234 807 123 4567', avatar: 'https://readdy.ai/api/search-image?query=Professional%20man%20portrait%2C%20business%20casual%2C%20friendly%20smile%2C%20clean%20white%20background%2C%20modern%20headshot%20photography&width=100&height=100&seq=john_doe&orientation=squarish', verified: true },
    { id: 102, handle: '@mary_smith', name: 'Mary Smith', email: 'mary@email.com', phone: '+234 808 234 5678', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20business%20attire%2C%20confident%20expression%2C%20clean%20white%20background%2C%20diverse%20ethnicity%20headshot&width=100&height=100&seq=mary_smith&orientation=squarish', verified: true },
    { id: 103, handle: '@peter_johnson', name: 'Peter Johnson', email: 'peter@email.com', phone: '+234 809 345 6789', avatar: 'https://readdy.ai/api/search-image?query=Professional%20man%20portrait%2C%20business%20shirt%2C%20approachable%20look%2C%20clean%20white%20background%2C%20corporate%20headshot%20photography&width=100&height=100&seq=peter_johnson&orientation=squarish', verified: false },
    { id: 104, handle: '@ada_okafor', name: 'Ada Okafor', email: 'ada@email.com', phone: '+234 810 456 7890', avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20elegant%20attire%2C%20warm%20smile%2C%20clean%20white%20background%2C%20business%20headshot%20photography&width=100&height=100&seq=ada_okafor&orientation=squarish', verified: true },
    { id: 105, handle: '@taiwo_bello', name: 'Taiwo Bello', email: 'taiwo@email.com', phone: '+234 811 567 8901', avatar: 'https://readdy.ai/api/search-image?query=Professional%20Nigerian%20man%20portrait%2C%20traditional%20attire%2C%20confident%20look%2C%20clean%20white%20background%2C%20cultural%20business%20photography&width=100&height=100&seq=taiwo_bello&orientation=squarish', verified: true },
    { id: 106, handle: '@kemi_adams', name: 'Kemi Adams', email: 'kemi@email.com', phone: '+234 812 678 9012', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20colorful%20headwrap%2C%20bright%20smile%2C%20clean%20white%20background%2C%20cultural%20business%20photography&width=100&height=100&seq=kemi_adams&orientation=squarish', verified: false }
  ];

  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'You', handle: '@admin_user', phone: '+234 801 234 5678', status: 'paid', role: 'admin', joinDate: '2023-01-15', avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20business%20attire%2C%20confident%20smile%2C%20clean%20white%20background%2C%20high%20quality%20headshot%20photography&width=100&height=100&seq=admin1&orientation=squarish' },
    { id: 2, name: 'Sarah Johnson', handle: '@sarah_j', phone: '+234 802 345 6789', status: 'paid', role: 'member', joinDate: '2023-01-20', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20business%20casual%2C%20friendly%20expression%2C%20clean%20white%20background%2C%20diverse%20ethnicity%20headshot&width=100&height=100&seq=admin2&orientation=squarish' },
    { id: 3, name: 'Michael Chen', handle: '@mike_chen', phone: '+234 803 456 7890', status: 'paid', role: 'member', joinDate: '2023-02-01', avatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20man%20portrait%2C%20business%20shirt%2C%20confident%20look%2C%20clean%20white%20background%2C%20corporate%20headshot%20photography&width=100&height=100&seq=admin3&orientation=squarish' },
    { id: 4, name: 'Amara Okafor', handle: '@amara_ok', phone: '+234 804 567 8901', status: 'pending', role: 'member', joinDate: '2023-02-05', avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20elegant%20attire%2C%20warm%20smile%2C%20clean%20white%20background%2C%20business%20headshot%20photography&width=100&height=100&seq=admin4&orientation=squarish' },
    { id: 5, name: 'David Kim', handle: '@david_kim', phone: '+234 805 678 9012', status: 'paid', role: 'member', joinDate: '2023-02-10', avatar: 'https://readdy.ai/api/search-image?query=Professional%20man%20portrait%2C%20business%20casual%2C%20approachable%20smile%2C%20clean%20white%20background%2C%20modern%20headshot%20photography&width=100&height=100&seq=admin5&orientation=squarish' },
    { id: 6, name: 'Grace Adebayo', handle: '@grace_ade', phone: '+234 806 789 0123', status: 'paid', role: 'member', joinDate: '2023-02-12', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20colorful%20headwrap%2C%20confident%20expression%2C%20clean%20white%20background%2C%20cultural%20business%20photography&width=100&height=100&seq=admin6&orientation=squarish' }
  ]);

  const [groupSettings, setGroupSettings] = useState({
    name: 'Unity Savings Circle',
    monthlyContribution: 50000,
    totalMembers: 12,
    currentMembers: 6,
    startDate: '2023-01-15',
    payoutOrder: 'fixed',
    penaltyFee: 5000,
    description: 'A trusted savings group for professionals looking to build wealth together through monthly contributions and rotating payouts.'
  });

  const [sentInvites, setSentInvites] = useState([
    { id: 1, handle: '@john_doe', name: 'John Doe', status: 'pending', sentDate: '2024-02-12', message: 'Join our Unity Savings Circle!' },
    { id: 2, handle: '@mary_smith', name: 'Mary Smith', status: 'accepted', sentDate: '2024-02-10', message: "You're invited to join our savings group" },
    { id: 3, handle: '@peter_johnson', name: 'Peter Johnson', status: 'declined', sentDate: '2024-02-08', message: 'Come save with us!' }
  ]);

  const [paymentHistory, setPaymentHistory] = useState([
    { id: 1, member: 'Sarah Johnson', amount: 50000, date: '2024-02-10', status: 'completed', method: 'Bank Transfer' },
    { id: 2, member: 'Michael Chen', amount: 50000, date: '2024-02-08', status: 'completed', method: 'Mobile Money' },
    { id: 3, member: 'David Kim', amount: 50000, date: '2024-02-05', status: 'completed', method: 'Debit Card' },
    { id: 4, member: 'Grace Adebayo', amount: 50000, date: '2024-02-03', status: 'completed', method: 'Bank Transfer' },
    { id: 5, member: 'Amara Okafor', amount: 50000, date: '2024-01-28', status: 'pending', method: 'Bank Transfer' },
  ]);

  const [showStopPaymentModal, setShowStopPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const [paymentAccounts, setPaymentAccounts] = useState([
    {
      id: 1,
      type: 'bank',
      name: 'Primary Business Account',
      accountName: 'Unity Savings Circle',
      accountNumber: '0123456789',
      bankName: 'First Bank of Nigeria',
      bankCode: '011',
      isDefault: true,
      status: 'active',
      addedDate: '2023-01-15'
    },
    {
      id: 2,
      type: 'mobile',
      name: 'Mobile Money',
      accountName: 'Adebayo Olumide',
      phoneNumber: '+234 801 234 5678',
      provider: 'MTN Mobile Money',
      isDefault: false,
      status: 'active',
      addedDate: '2023-02-10'
    },
    {
      id: 3,
      type: 'digital',
      name: 'CashApp Account',
      accountName: 'Adebayo Olumide',
      username: '@adebayo_olu',
      provider: 'CashApp',
      isDefault: false,
      status: 'active',
      addedDate: '2023-03-05'
    }
  ]);

  const [accountForm, setAccountForm] = useState({
    type: 'bank',
    name: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankCode: '',
    phoneNumber: '',
    provider: '',
    username: '',
    isDefault: false
  });

  const handleRemoveMember = (memberId: number) => {
    setGroupMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const handleUpdateMemberStatus = (memberId: number, newStatus: string) => {
    setGroupMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ));
  };

  const handleSearch = (query: string) => {
    if (query.length < 2) {
      setHandleSearchResults([]);
      return;
    }

    setIsSearching(true);
    // Simulate API search delay
    setTimeout(() => {
      const results = allUsers.filter(user => 
        user.handle.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setHandleSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setInviteForm(prev => ({ ...prev, handle: user.handle }));
    setHandleSearchResults([]);
  };

  const handleSendInvite = () => {
    if (selectedUser) {
      const newInvite = {
        id: Date.now(),
        handle: selectedUser.handle,
        name: selectedUser.name,
        status: 'pending',
        sentDate: new Date().toISOString().split('T')[0],
        message: inviteForm.message || "You're invited to join our savings group!"
      };
      setSentInvites(prev => [newInvite, ...prev]);
      setInviteForm({ handle: '', message: '' });
      setSelectedUser(null);
      setShowSendInvite(false);
    }
  };

  const handleStopPayment = (payment: any) => {
    setSelectedPayment(payment);
    setShowStopPaymentModal(true);
  };

  const confirmStopPayment = () => {
    if (selectedPayment) {
      setPaymentHistory(prev => prev.map(payment => 
        payment.id === selectedPayment.id 
          ? { ...payment, status: 'stopped', stoppedDate: new Date().toISOString().split('T')[0] }
          : payment
      ));
      setShowStopPaymentModal(false);
      setSelectedPayment(null);
    }
  };

  const handleAddAccount = () => {
    const newAccount = {
      id: Date.now(),
      ...accountForm,
      status: 'active',
      addedDate: new Date().toISOString().split('T')[0]
    };
    setPaymentAccounts(prev => [newAccount, ...prev]);
    setAccountForm({
      type: 'bank',
      name: '',
      accountName: '',
      accountNumber: '',
      bankName: '',
      bankCode: '',
      phoneNumber: '',
      provider: '',
      username: '',
      isDefault: false
    });
    setShowAddAccount(false);
  };

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setAccountForm({
      type: account.type,
      name: account.name,
      accountName: account.accountName,
      accountNumber: account.accountNumber || '',
      bankName: account.bankName || '',
      bankCode: account.bankCode || '',
      phoneNumber: account.phoneNumber || '',
      provider: account.provider || '',
      username: account.username || '',
      isDefault: account.isDefault
    });
    setShowEditAccount(true);
  };

  const handleUpdateAccount = () => {
    setPaymentAccounts(prev => prev.map(account => 
      account.id === selectedAccount.id 
        ? { ...account, ...accountForm }
        : account
    ));
    setShowEditAccount(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (accountId: number) => {
    setPaymentAccounts(prev => prev.filter(account => account.id !== accountId));
  };

  const handleSetDefaultAccount = (accountId: number) => {
    setPaymentAccounts(prev => prev.map(account => ({
      ...account,
      isDefault: account.id === accountId
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
                <i className="ri-arrow-left-line text-emerald-600 text-xl"></i>
              </button>
              <div>
                <h1 className="text-xl font-bold text-emerald-800">Admin Panel</h1>
                <p className="text-sm text-emerald-600">{currentGroup.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowEditGroup(true)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-settings-3-line text-emerald-600 text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="fixed top-16 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-40">
        <div className="flex px-2 py-2">
          <button 
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'members' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
            }`}
          >
            Members
          </button>
          <button 
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'accounts' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
            }`}
          >
            Accounts
          </button>
          <button 
            onClick={() => setActiveTab('invites')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'invites' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
            }`}
          >
            Invites
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'payments' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
            }`}
          >
            Payments
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 px-2 text-xs font-medium rounded-lg ${
              activeTab === 'analytics' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-6 px-4">
        {/* Group Overview */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">{currentGroup.name}</h2>
              <p className="text-emerald-100">Active since {new Date(currentGroup.startDate).toLocaleDateString()}</p>
            </div>
            <div className="w-8 h-8 flex items-center justify-center">
              <i className="ri-shield-check-fill text-2xl"></i>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-emerald-100">Active Members</p>
              <p className="font-semibold text-lg">{currentGroup.currentMembers}/{currentGroup.totalMembers}</p>
            </div>
            <div>
              <p className="text-emerald-100">Monthly Pool</p>
              <p className="font-semibold text-lg">₦{(currentGroup.monthlyContribution * currentGroup.currentMembers).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Manage Members</h3>
              <button 
                onClick={() => setShowAddMember(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Add Member</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100">
              {groupMembers.map((member) => (
                <div key={member.id} className="p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-800">{member.name}</p>
                          {member.role === 'admin' && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">Admin</span>
                          )}
                        </div>
                        <p className="text-sm text-emerald-600 font-medium">{member.handle}</p>
                        <p className="text-xs text-gray-400">{member.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {member.status === 'paid' ? 'Paid' : 'Pending'}
                      </div>
                      {member.role !== 'admin' && (
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleUpdateMemberStatus(member.id, member.status === 'paid' ? 'pending' : 'paid')}
                            className="w-8 h-8 flex items-center justify-center text-emerald-600"
                          >
                            <i className="ri-refresh-line"></i>
                          </button>
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-600"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invites' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Sent Invitations</h3>
              <button 
                onClick={() => setShowSendInvite(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <i className="ri-mail-send-line"></i>
                <span>Send Invite</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100">
              {sentInvites.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-mail-line text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500">No invitations sent yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start inviting new members to your group</p>
                </div>
              ) : (
                sentInvites.map((invite) => (
                  <div key={invite.id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{invite.name}</p>
                        <p className="text-sm text-emerald-600 font-medium">{invite.handle}</p>
                        <p className="text-xs text-gray-400 mt-1">Sent on {new Date(invite.sentDate).toLocaleDateString()}</p>
                        {invite.message && (
                          <p className="text-xs text-gray-600 mt-2 italic">"{invite.message}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          invite.status === 'pending' 
                            ? 'bg-amber-100 text-amber-700'
                            : invite.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                        </div>
                        {invite.status === 'pending' && (
                          <button className="text-xs text-emerald-600 mt-1 hover:underline">
                            Resend
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Payment History</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{payment.member}</p>
                      <p className="text-sm text-gray-500">{payment.date} • {payment.method}</p>
                      {payment.stoppedDate && (
                        <p className="text-xs text-red-500">Stopped on {payment.stoppedDate}</p>
                      )}
                    </div>
                    <div className="text-right flex items-center space-x-3">
                      <div>
                        <p className="font-semibold text-gray-800">₦{payment.amount.toLocaleString()}</p>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : payment.status === 'stopped'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {payment.status}
                        </div>
                      </div>
                      {payment.status === 'completed' && (
                        <button 
                          onClick={() => handleStopPayment(payment)}
                          className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg"
                          title="Stop/Reverse Payment"
                        >
                          <i className="ri-stop-circle-line text-lg"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Payment Accounts</h3>
              <button 
                onClick={() => setShowAddAccount(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
              >
                <i className="ri-add-line"></i>
                <span>Add Account</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100">
              {paymentAccounts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-bank-line text-2xl text-gray-400"></i>
                  </div>
                  <p className="text-gray-500">No payment accounts added yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add your bank account or digital wallet</p>
                </div>
              ) : (
                paymentAccounts.map((account) => (
                  <div key={account.id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          account.type === 'bank' ? 'bg-blue-100' :
                          account.type === 'mobile' ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          <i className={`${
                            account.type === 'bank' ? 'ri-bank-fill text-blue-600' :
                            account.type === 'mobile' ? 'ri-smartphone-fill text-green-600' : 
                            'ri-wallet-3-fill text-purple-600'
                          } text-xl`}></i>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-800">{account.name}</p>
                            {account.isDefault && (
                              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{account.accountName}</p>
                          {account.type === 'bank' && (
                            <p className="text-xs text-gray-500">{account.bankName} • {account.accountNumber}</p>
                          )}
                          {account.type === 'mobile' && (
                            <p className="text-xs text-gray-500">{account.provider} • {account.phoneNumber}</p>
                          )}
                          {account.type === 'digital' && (
                            <p className="text-xs text-gray-500">{account.provider} • {account.username}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          account.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {account.status}
                        </div>
                        <div className="flex space-x-1">
                          {!account.isDefault && (
                            <button 
                              onClick={() => handleSetDefaultAccount(account.id)}
                              className="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-lg"
                              title="Set as Default"
                            >
                              <i className="ri-star-line"></i>
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditAccount(account)}
                            className="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteAccount(account.id)}
                            className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="ri-money-dollar-circle-fill text-emerald-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">₦300K</p>
                    <p className="text-sm text-gray-500">This Month</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <i className="ri-error-warning-fill text-amber-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">1</p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h4 className="font-semibold text-gray-800 mb-4">Payment Completion Rate</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">February 2024</span>
                  <span className="text-sm font-medium text-emerald-600">83%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{width: '83%'}}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h4 className="font-semibold text-gray-800 mb-4">Member Activity</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Members</span>
                  <span className="text-sm font-medium text-emerald-600">5/6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On-time Payments</span>
                  <span className="text-sm font-medium text-emerald-600">4/6</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Late Payments</span>
                  <span className="text-sm font-medium text-amber-600">1/6</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Member</h3>
              <button onClick={() => setShowAddMember(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="Enter full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Handle</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="Enter handle (e.g., @username)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" className="w-full p-3 border border-gray-200 rounded-lg text-sm" placeholder="Enter phone number" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Group Settings</h3>
              <button onClick={() => setShowEditGroup(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input type="text" value={groupSettings.name} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Contribution</label>
                <input type="number" value={groupSettings.monthlyContribution} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Fee</label>
                <input type="number" value={groupSettings.penaltyFee} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowEditGroup(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowEditGroup(false)}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Invite Modal */}
      {showSendInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Send Group Invitation</h3>
              <button onClick={() => setShowSendInvite(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search User Handle *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={inviteForm.handle}
                    onChange={(e) => {
                      setInviteForm(prev => ({ ...prev, handle: e.target.value }));
                      handleSearch(e.target.value);
                      if (e.target.value !== selectedUser?.handle) {
                        setSelectedUser(null);
                      }
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm pr-10" 
                    placeholder="Type @handle or name to search..." 
                  />
                  <div className="absolute right-3 top-3">
                    {isSearching ? (
                      <i className="ri-loader-4-line text-gray-400 animate-spin"></i>
                    ) : (
                      <i className="ri-search-line text-gray-400"></i>
                    )}
                  </div>
                </div>
                
                {/* Search Results */}
                {handleSearchResults.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {handleSearchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-800">{user.name}</p>
                            {user.verified && (
                              <i className="ri-verified-badge-fill text-emerald-500 text-sm"></i>
                            )}
                          </div>
                          <p className="text-sm text-emerald-600">{user.handle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected User Display */}
                {selectedUser && (
                  <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-emerald-800">{selectedUser.name}</p>
                          {selectedUser.verified && (
                            <i className="ri-verified-badge-fill text-emerald-600 text-sm"></i>
                          )}
                        </div>
                        <p className="text-sm text-emerald-600">{selectedUser.handle}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedUser(null);
                          setInviteForm(prev => ({ ...prev, handle: '' }));
                        }}
                        className="w-6 h-6 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 rounded-full"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (Optional)</label>
                <textarea 
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm h-20 resize-none" 
                  placeholder="Add a personal message to your invitation..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-400 mt-1">{inviteForm.message.length}/200 characters</p>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-emerald-800 mb-2">Group Details</h4>
                <div className="text-xs text-emerald-700 space-y-1">
                  <p>• Monthly Contribution: ₦{groupSettings.monthlyContribution.toLocaleString()}</p>
                  <p>• Total Members: {groupSettings.totalMembers}</p>
                  <p>• Current Members: {groupSettings.currentMembers}</p>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowSendInvite(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendInvite}
                  disabled={!selectedUser}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add Payment Account</h3>
              <button onClick={() => setShowAddAccount(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountForm(prev => ({ ...prev, type: 'bank' }))}
                    className={`p-3 rounded-lg border text-center ${
                      accountForm.type === 'bank' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <i className="ri-bank-fill text-xl mb-1 block"></i>
                    <span className="text-xs font-medium">Bank</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountForm(prev => ({ ...prev, type: 'mobile' }))}
                    className={`p-3 rounded-lg border text-center ${
                      accountForm.type === 'mobile' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <i className="ri-smartphone-fill text-xl mb-1 block"></i>
                    <span className="text-xs font-medium">Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountForm(prev => ({ ...prev, type: 'digital' }))}
                    className={`p-3 rounded-lg border text-center ${
                      accountForm.type === 'digital' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <i className="ri-wallet-3-fill text-xl mb-1 block"></i>
                    <span className="text-xs font-medium">Digital</span>
                  </button>
                </div>
              </div>

              {/* Common Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name/Label</label>
                <input 
                  type="text" 
                  value={accountForm.name}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="e.g., Primary Business Account" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                <input 
                  type="text" 
                  value={accountForm.accountName}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, accountName: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                  placeholder="Full name as registered" 
                />
              </div>

              {/* Bank Account Fields */}
              {accountForm.type === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input 
                      type="text" 
                      value={accountForm.bankName}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, bankName: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                      placeholder="e.g., First Bank of Nigeria" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input 
                      type="text" 
                      value={accountForm.accountNumber}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                      placeholder="10-digit account number" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Code (Optional)</label>
                    <input 
                      type="text" 
                      value={accountForm.bankCode}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, bankCode: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                      placeholder="e.g., 011" 
                    />
                  </div>
                </>
              )}

              {/* Mobile Money Fields */}
              {accountForm.type === 'mobile' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <select 
                      value={accountForm.provider}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="">Select Provider</option>
                      <option value="MTN Mobile Money">MTN Mobile Money</option>
                      <option value="Airtel Money">Airtel Money</option>
                      <option value="9mobile Money">9mobile Money</option>
                      <option value="Glo Mobile Money">Glo Mobile Money</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={accountForm.phoneNumber}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                      placeholder="+234 xxx xxx xxxx" 
                    />
                  </div>
                </>
              )}

              {/* Digital Wallet Fields */}
              {accountForm.type === 'digital' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <select 
                      value={accountForm.provider}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="">Select Provider</option>
                      <option value="CashApp">CashApp</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Venmo">Venmo</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Opay">Opay</option>
                      <option value="PalmPay">PalmPay</option>
                      <option value="Kuda">Kuda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username/Handle</label>
                    <input 
                      type="text" 
                      value={accountForm.username}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                      placeholder="@username or email" 
                    />
                  </div>
                </>
              )}

              {/* Set as Default */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="setDefault"
                  checked={accountForm.isDefault}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="opacity-0 absolute"
                />
                <label htmlFor="setDefault" className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${accountForm.isDefault ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}>
                    {accountForm.isDefault && (
                      <i className="ri-check-line text-white text-sm"></i>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Set as default payment account</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowAddAccount(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddAccount}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditAccount && selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit Payment Account</h3>
              <button onClick={() => setShowEditAccount(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              {/* Same form fields as Add Account but with update functionality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name/Label</label>
                <input 
                  type="text" 
                  value={accountForm.name}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                <input 
                  type="text" 
                  value={accountForm.accountName}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, accountName: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                />
              </div>

              {/* Conditional fields based on account type */}
              {accountForm.type === 'bank' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input 
                      type="text" 
                      value={accountForm.bankName}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, bankName: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input 
                      type="text" 
                      value={accountForm.accountNumber}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    />
                  </div>
                </>
              )}

              {accountForm.type === 'mobile' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input 
                      type="text" 
                      value={accountForm.provider}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={accountForm.phoneNumber}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    />
                  </div>
                </>
              )}

              {accountForm.type === 'digital' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input 
                      type="text" 
                      value={accountForm.provider}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username/Handle</label>
                    <input 
                      type="text" 
                      value={accountForm.username}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm" 
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="editSetDefault"
                  checked={accountForm.isDefault}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="opacity-0 absolute"
                />
                <label htmlFor="editSetDefault" className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${accountForm.isDefault ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}>
                    {accountForm.isDefault && (
                      <i className="ri-check-line text-white text-sm"></i>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Set as default payment account</span>
                </label>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowEditAccount(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateAccount}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium"
                >
                  Update Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stop Payment Modal */}
      {showStopPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Stop Payment</h3>
              <button onClick={() => setShowStopPaymentModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-error-warning-fill text-red-600"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-800">Warning</p>
                    <p className="text-xs text-red-600 mt-1">This action will stop/reverse the payment and mark it as cancelled. This cannot be undone.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member:</span>
                    <span className="font-medium">{selectedPayment.member}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">₦{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedPayment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">{selectedPayment.method}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setShowStopPaymentModal(false)}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={confirmStopPayment}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              >
                Stop Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
