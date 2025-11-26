
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockUsers, mockActivity } from '../../mocks/userData';

export default function Group() {
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data - in real app this would be fetched based on groupId
  const groupData = {
    1: {
      name: 'Unity Savings Circle',
      description: 'Professional savings group for wealth building',
      monthlyContribution: 50000,
      totalSaved: 1250000,
      nextPayout: 'March 15, 2024',
      position: 3,
      members: 6,
      totalMembers: 12,
      role: 'admin'
    },
    2: {
      name: 'Obiozo Traders et al',
      description: 'Extended family emergency fund and support system',
      monthlyContribution: 25000,
      totalSaved: 400000,
      nextPayout: 'April 1, 2024',
      position: 5,
      members: 8,
      totalMembers: 10,
      role: 'member'
    },
    3: {
      name: 'Hajiya Nafisat Group',
      description: "Business owners supporting each other's growth",
      monthlyContribution: 75000,
      totalSaved: 950000,
      nextPayout: 'March 28, 2024',
      position: 7,
      members: 10,
      totalMembers: 15,
      role: 'member'
    },
    4: {
      name: 'Community Development',
      description: 'Local community improvement and development fund',
      monthlyContribution: 30000,
      totalSaved: 675000,
      nextPayout: 'May 10, 2024',
      position: 12,
      members: 15,
      totalMembers: 20,
      role: 'member'
    }
  };

  const group = groupData[groupId as keyof typeof groupData] || groupData[1];

  // Use centralized mock data
  const recentActivity = mockActivity.slice(0, 4);
  const groupMembers = mockUsers.slice(0, group.members);

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
                <h1 className="text-lg font-bold text-emerald-800">{group.name}</h1>
                <p className="text-sm text-emerald-600">{group.members} members</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/notifications')}
                className="w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-notification-2-line text-emerald-600 text-xl"></i>
              </button>
              {group.role === 'admin' && (
                <button 
                  onClick={() => navigate(`/admin/${groupId}`)}
                  className="w-8 h-8 flex items-center justify-center"
                >
                  <i className="ri-settings-3-line text-emerald-600 text-xl"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-20 px-4">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-emerald-100 text-sm">Your Savings</p>
                  <h2 className="text-2xl font-bold">₦{group.totalSaved.toLocaleString()}</h2>
                </div>
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-wallet-3-fill text-2xl"></i>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-emerald-100">Monthly</p>
                  <p className="font-semibold">₦{group.monthlyContribution.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-emerald-100">Position</p>
                  <p className="font-semibold">{group.position} of {group.totalMembers}</p>
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
                    <p className="text-emerald-600 font-medium">{group.nextPayout}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">₦{(group.monthlyContribution * group.members / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-500">Expected</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/payment', { 
                  state: { 
                    fromGroup: true, 
                    groupId: groupId,
                    groupName: group.name,
                    monthlyContribution: group.monthlyContribution
                  } 
                })}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <i className="ri-hand-coin-fill text-emerald-600 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">Make Payment</span>
              </button>
              <button 
                onClick={() => setActiveTab('members')}
                className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100 flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <i className="ri-group-fill text-emerald-600 text-xl"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">View Members</span>
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
                        <p className="text-sm text-emerald-600 font-medium">{activity.handle}</p>
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

        {activeTab === 'members' && (
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
              <h3 className="font-semibold text-gray-800 mb-4">Payment History</h3>
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
                        <p className="text-sm text-emerald-600 font-medium">{activity.handle}</p>
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
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`flex flex-col items-center justify-center py-2 space-y-1 ${
              activeTab === 'members' ? 'text-emerald-600' : 'text-gray-500'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-group-fill text-xl"></i>
            </div>
            <span className="text-xs font-medium">Members</span>
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
