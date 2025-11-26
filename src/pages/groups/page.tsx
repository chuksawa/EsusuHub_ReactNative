
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Groups() {
  const navigate = useNavigate();

  const userGroups = [
    {
      id: 1,
      name: 'Unity Savings Circle',
      description: 'Professional savings group for wealth building',
      members: 6,
      totalMembers: 12,
      monthlyContribution: 50000,
      nextPayout: 'March 15, 2024',
      status: 'active',
      role: 'admin',
      totalSaved: 1250000,
      joinDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Obiozo Traders et al',
      description: 'Extended family emergency fund and support system',
      members: 8,
      totalMembers: 10,
      monthlyContribution: 25000,
      nextPayout: 'April 1, 2024',
      status: 'active',
      role: 'member',
      totalSaved: 400000,
      joinDate: '2023-03-10'
    },
    {
      id: 3,
      name: 'Hajiya Nafisat Group',
      description: "Business owners supporting each other's growth",
      members: 10,
      totalMembers: 15,
      monthlyContribution: 75000,
      nextPayout: 'March 28, 2024',
      status: 'active',
      role: 'member',
      totalSaved: 950000,
      joinDate: '2023-06-20'
    },
    {
      id: 4,
      name: 'Community Development',
      description: 'Local community improvement and development fund',
      members: 15,
      totalMembers: 20,
      monthlyContribution: 30000,
      nextPayout: 'May 10, 2024',
      status: 'active',
      role: 'member',
      totalSaved: 675000,
      joinDate: '2023-08-05'
    }
  ];

  const totalSavingsAcrossGroups = userGroups.reduce((total, group) => total + group.totalSaved, 0);
  const totalMonthlyContributions = userGroups.reduce((total, group) => total + group.monthlyContribution, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-emerald-800">My Groups</h1>
              <p className="text-sm text-emerald-600">{userGroups.length} Active Groups</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/notifications')}
                className="w-8 h-8 flex items-center justify-center relative"
              >
                <i className="ri-notification-2-line text-emerald-600 text-xl"></i>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
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

      {/* Main Content */}
      <div className="pt-20 pb-20 px-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-wallet-3-fill text-lg"></i>
              </div>
              <p className="text-emerald-100 text-xs">Total Saved</p>
            </div>
            <p className="text-lg font-bold">₦{(totalSavingsAcrossGroups / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-money-dollar-circle-fill text-emerald-600 text-lg"></i>
              </div>
              <p className="text-gray-600 text-xs">Monthly Total</p>
            </div>
            <p className="text-lg font-bold text-gray-800">₦{totalMonthlyContributions.toLocaleString()}</p>
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-4">
          {userGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => navigate(`/group/${group.id}`)}
              className="w-full bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-800 text-left">{group.name}</h3>
                      {group.role === 'admin' && (
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">Admin</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 text-left">{group.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Members</p>
                    <p className="font-medium text-gray-800">{group.members}/{group.totalMembers}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monthly</p>
                    <p className="font-medium text-gray-800">₦{group.monthlyContribution.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Saved</p>
                    <p className="font-semibold text-emerald-600">₦{(group.totalSaved / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Payout</p>
                    <p className="font-medium text-gray-800">{new Date(group.nextPayout).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Group Progress</span>
                    <span className="text-xs font-medium text-emerald-600">{Math.round((group.members / group.totalMembers) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full" 
                      style={{width: `${(group.members / group.totalMembers) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Add New Group Button */}
        <button 
          onClick={() => navigate('/create-group')}
          className="w-full bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-2xl p-6 mt-6 hover:bg-emerald-100 transition-colors"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <i className="ri-add-line text-emerald-600 text-xl"></i>
            </div>
            <h3 className="font-medium text-emerald-700">Create New Group</h3>
            <p className="text-sm text-emerald-600">Start your own savings group</p>
          </div>
        </button>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-full bg-white border-t border-emerald-100">
          <div className="grid grid-cols-3 px-0 py-2">
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center justify-center py-2 space-y-1 text-gray-500"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-home-5-fill text-xl"></i>
              </div>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center py-2 space-y-1 text-emerald-600">
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-group-fill text-xl"></i>
              </div>
              <span className="text-xs font-medium">Groups</span>
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center justify-center py-2 space-y-1 text-gray-500"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-user-fill text-xl"></i>
              </div>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
