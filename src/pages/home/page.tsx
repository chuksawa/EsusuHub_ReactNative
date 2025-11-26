
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMoreModal, setShowMoreModal] = useState(false);

  const savings = {
    totalSaved: 1250000,
    monthlyContribution: 50000,
    nextPayout: 'March 15, 2024',
    groupSize: 12,
    position: 3
  };

  // Mock pending notifications count
  const pendingNotificationsCount = 2;

  const recentActivity = [
    { id: 1, type: 'contribution', amount: 50000, date: 'Feb 10', member: 'You', group: 'Unity Savings Circle' },
    { id: 2, type: 'payout', amount: 600000, date: 'Feb 8', member: 'Sarah Johnson', group: 'Unity Savings Circle' },
    { id: 3, type: 'contribution', amount: 25000, date: 'Feb 5', member: 'You', group: 'Obiozo Traders et al' },
    { id: 4, type: 'contribution', amount: 75000, date: 'Feb 3', member: 'You', group: 'Hajiya Nafisat Group' },
    { id: 5, type: 'payout', amount: 250000, date: 'Feb 1', member: 'Michael Chen', group: 'Obiozo Traders et al' },
    { id: 6, type: 'contribution', amount: 30000, date: 'Jan 28', member: 'You', group: 'Community Development' },
    { id: 7, type: 'contribution', amount: 50000, date: 'Jan 25', member: 'You', group: 'Unity Savings Circle' },
    { id: 8, type: 'payout', amount: 450000, date: 'Jan 22', member: 'Grace Adebayo', group: 'Community Development' }
  ];

  const groupMembers = [
    { id: 1, name: 'You', handle: '@admin_user', status: 'paid', avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20business%20attire%2C%20confident%20smile%2C%20clean%20white%20background%2C%20high%20quality%20headshot%20photography&width=100&height=100&seq=user1&orientation=squarish' },
    { id: 2, name: 'Sarah Johnson', handle: '@sarah_j', status: 'paid', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20business%20casual%2C%20friendly%20expression%2C%20clean%20white%20background%2C%20diverse%20ethnicity%20headshot&width=100&height=100&seq=user2&orientation=squarish' },
    { id: 3, name: 'Michael Chen', handle: '@mike_chen', status: 'paid', avatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20man%20portrait%2C%20business%20shirt%2C%20confident%20look%2C%20clean%20white%20background%2C%20corporate%20headshot%20photography&width=100&height=100&seq=user3&orientation=squarish' },
    { id: 4, name: 'Amara Okafor', handle: '@amara_ok', status: 'pending', avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20elegant%20attire%2C%20warm%20smile%2C%20clean%20white%20background%2C%20business%20headshot%20photography&width=100&height=100&seq=user4&orientation=squarish' },
    { id: 5, name: 'David Kim', handle: '@david_kim', status: 'paid', avatar: 'https://readdy.ai/api/search-image?query=Professional%20man%20portrait%2C%20business%20casual%2C%20approachable%20smile%2C%20clean%20white%20background%2C%20modern%20headshot%20photography&width=100&height=100&seq=user5&orientation=squarish' },
    { id: 6, name: 'Grace Adebayo', handle: '@grace_ade', status: 'paid', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20colorful%20headwrap%2C%20confident%20expression%2C%20clean%20white%20background%2C%20cultural%20business%20photography&width=100&height=100&seq=user6&orientation=squarish' }
  ];

  const moreServices = [
    { id: 1, name: 'Loans', icon: 'ri-money-dollar-circle-fill', color: 'bg-green-100 text-green-600', description: 'Quick loans for members' },
    { id: 2, name: 'Insurance', icon: 'ri-shield-check-fill', color: 'bg-blue-100 text-blue-600', description: 'Protect your savings' },
    { id: 3, name: 'Investments', icon: 'ri-line-chart-fill', color: 'bg-purple-100 text-purple-600', description: 'Grow your money' },
    { id: 4, name: 'Bill Payments', icon: 'ri-bill-fill', color: 'bg-orange-100 text-orange-600', description: 'Pay bills easily' },
    { id: 5, name: 'Airtime & Data', icon: 'ri-smartphone-fill', color: 'bg-pink-100 text-pink-600', description: 'Top up your phone' },
    { id: 6, name: 'Referrals', icon: 'ri-user-add-fill', color: 'bg-indigo-100 text-indigo-600', description: 'Invite friends & earn' },
    { id: 7, name: 'Support', icon: 'ri-customer-service-2-fill', color: 'bg-teal-100 text-teal-600', description: 'Get help anytime' },
    { id: 8, name: 'Settings', icon: 'ri-settings-3-fill', color: 'bg-gray-100 text-gray-600', description: 'App preferences' }
  ];

  const handleMoreServiceClick = (service: any) => {
    setShowMoreModal(false);
    // Add navigation logic for each service
    switch(service.name) {
      case 'Support':
        // You can add a support page later
        alert('Support feature coming soon!');
        break;
      case 'Settings':
        // You can add a settings page later
        alert('Settings feature coming soon!');
        break;
      case 'Referrals':
        alert('Referral program coming soon!');
        break;
      default:
        alert(`${service.name} feature coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex-shrink-0">
                <img 
                  src="https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/6aaef037c8e44e8eb9ec2616da6136a8.png" 
                  alt="EsusuHub Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-emerald-600 tracking-wide" style={{fontFamily: 'Fredoka One, cursive'}}>EsusuHub</h1>
                <p className="text-sm font-medium text-blue-900">Team up Cash up Climb up!</p>
              </div>
              
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/notifications')}
                  className="w-8 h-8 flex items-center justify-center relative"
                >
                  <i className="ri-notification-2-line text-emerald-600 text-xl"></i>
                  {pendingNotificationsCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{pendingNotificationsCount}</span>
                    </div>
                  )}
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full overflow-hidden"
                >
                  <img src="https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20business%20attire%2C%20confident%20smile%2C%20clean%20white%20background%2C%20high%20quality%20headshot%20photography&width=100&height=100&seq=profileuser&orientation=squarish" alt="Profile" className="w-full h-full object-cover object-top" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="pt-20 pb-20 px-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-emerald-100 text-sm">Total Saved</p>
                  <h2 className="text-xl font-bold">₦{savings.totalSaved.toLocaleString()}</h2>
                </div>
                <div className="w-7 h-7 flex items-center justify-center">
                  <i className="ri-wallet-3-fill text-xl"></i>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-emerald-100">Monthly</p>
                  <p className="font-semibold">₦{savings.monthlyContribution.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-emerald-100">Position</p>
                  <p className="font-semibold">{savings.position} of {savings.groupSize}</p>
                </div>
              </div>
            </div>

            {/* Next Payout */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="ri-calendar-check-fill text-emerald-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Next Payout</h3>
                    <p className="text-emerald-600 font-medium">{savings.nextPayout}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">₦600K</p>
                  <p className="text-sm text-gray-5">Your turn</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button 
                onClick={() => navigate('/payment')}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-hand-coin-fill text-emerald-600 text-xl"></i>
                </div>
                <p className="text-xs font-medium text-gray-800">Pay</p>
              </button>
              <button 
                onClick={() => navigate('/groups')}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-group-fill text-blue-600 text-xl"></i>
                </div>
                <p className="text-xs font-medium text-gray-800">Groups</p>
              </button>
              <button 
                onClick={() => navigate('/banking')}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-bank-fill text-purple-600 text-xl"></i>
                </div>
                <p className="text-xs font-medium text-gray-800">Banking</p>
              </button>
              <button 
                onClick={() => setShowMoreModal(true)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-more-fill text-orange-600 text-xl"></i>
                </div>
                <p className="text-xs font-medium text-gray-800">More</p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'contribution' ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        <i className={`${
                          activity.type === 'contribution' ? 'ri-arrow-up-line text-emerald-600' : 'ri-arrow-down-line text-amber-600'
                        } text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.member}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        activity.type === 'contribution' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {activity.type === 'contribution' ? '+' : '-'}₦{activity.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'group' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h3 className="font-semibold text-gray-800 mb-4">Group Members ({groupMembers.length})</h3>
              <div className="space-y-4">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{member.name}</p>
                        <p className="text-sm text-emerald-600 font-medium">{member.handle}</p>
                        <p className="text-xs text-gray-400">Member since 2023</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {member.status === 'paid' ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h3 className="font-semibold text-gray-800 mb-4">Payment History (all groups)</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'contribution' ? 'bg-emerald-100' : 'bg-amber-100'
                      }`}>
                        <i className={`${
                          activity.type === 'contribution' ? 'ri-arrow-up-line text-emerald-600' : 'ri-arrow-down-line text-amber-600'
                        } text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{activity.member}</p>
                        <p className="text-sm text-emerald-600 font-medium">{activity.group}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        activity.type === 'contribution' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {activity.type === 'contribution' ? '+' : '-'}₦{activity.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* More Services Modal */}
      {showMoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">More Services</h3>
                <button 
                  onClick={() => setShowMoreModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Loans */}
                <button 
                  onClick={() => alert('Loans feature coming soon!')}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <i className="ri-money-dollar-circle-fill text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Loans</h4>
                  <p className="text-sm text-gray-500">Quick loans for members</p>
                </button>

                {/* Bill Payments */}
                <button 
                  onClick={() => alert('Bill Payments feature coming soon!')}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3">
                    <i className="ri-bill-fill text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Bill Payments</h4>
                  <p className="text-sm text-gray-500">Pay bills easily</p>
                </button>

                {/* Airtime & Data */}
                <button 
                  onClick={() => alert('Airtime & Data feature coming soon!')}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-3">
                    <i className="ri-smartphone-fill text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Airtime & Data</h4>
                  <p className="text-sm text-gray-500">Top up your phone</p>
                </button>

                {/* Referrals */}
                <button 
                  onClick={() => alert('Referrals feature coming soon!')}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                    <i className="ri-user-add-fill text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Referrals</h4>
                  <p className="text-sm text-gray-500">Invite friends &amp; earn</p>
                </button>

                {/* Support */}
                <button 
                  onClick={() => alert('Support feature coming soon!')}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-3">
                    <i className="ri-customer-service-2-fill text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Support</h4>
                  <p className="text-sm text-gray-500">Get help anytime</p>
                </button>

                {/* Settings */}
                <button 
                  onClick={() => alert('Settings feature coming soon!')}
                  className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow text-left"
                >
                  <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center mb-3">
                    <i className="ri-settings-3-fill text-xl"></i>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">Settings</h4>
                  <p className="text-sm text-gray-500">App preferences</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t border-emerald-100">
        <div className="grid grid-cols-3 px-0 py-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-2 space-y-1 ${
              activeTab === 'dashboard' ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-dashboard-3-fill text-xl"></i>
            </div>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/groups')}
            className="flex flex-col items-center justify-center py-2 space-y-1 text-gray-500"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-group-fill text-xl"></i>
            </div>
            <span className="text-xs font-medium">Groups</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center py-2 space-y-1 ${
              activeTab === 'history' ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-history-fill text-xl"></i>
            </div>
            <span className="text-xs font-medium">History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
