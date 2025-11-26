
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invites');

  const [groupInvites, setGroupInvites] = useState([
    {
      id: 1,
      groupName: 'Tech Professionals Circle',
      adminName: 'Sarah Johnson',
      adminHandle: '@sarah_j',
      adminAvatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20business%20casual%2C%20friendly%20expression%2C%20clean%20white%20background%2C%20diverse%20ethnicity%20headshot&width=100&height=100&seq=admin_sarah&orientation=squarish',
      monthlyContribution: 75000,
      totalMembers: 15,
      currentMembers: 8,
      message: 'Join our tech professionals savings group! We meet monthly and support each other\'s financial goals.',
      receivedDate: '2024-02-12',
      status: 'pending'
    },
    {
      id: 2,
      groupName: 'Young Entrepreneurs Fund',
      adminName: 'Michael Chen',
      adminHandle: '@mike_chen',
      adminAvatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20man%20portrait%2C%20business%20shirt%2C%20confident%20look%2C%20clean%20white%20background%2C%20corporate%20headshot%20photography&width=100&height=100&seq=admin_michael&orientation=squarish',
      monthlyContribution: 100000,
      totalMembers: 10,
      currentMembers: 6,
      message: 'We\'re building a community of young entrepreneurs. Would you like to join our savings circle?',
      receivedDate: '2024-02-10',
      status: 'pending'
    },
    {
      id: 3,
      groupName: 'Community Builders',
      adminName: 'Grace Adebayo',
      adminHandle: '@grace_ade',
      adminAvatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20colorful%20headwrap%2C%20confident%20expression%2C%20clean%20white%20background%2C%20cultural%20business%20photography&width=100&height=100&seq=admin_grace&orientation=squarish',
      monthlyContribution: 50000,
      totalMembers: 20,
      currentMembers: 12,
      message: 'Join our community development savings group. Together we can achieve more!',
      receivedDate: '2024-02-08',
      status: 'accepted'
    }
  ]);

  const [generalNotifications] = useState([
    {
      id: 1,
      type: 'payment_reminder',
      title: 'Payment Due Tomorrow',
      message: 'Your monthly contribution for Unity Savings Circle is due tomorrow.',
      date: '2024-02-11',
      read: false,
      icon: 'ri-calendar-check-line',
      color: 'text-amber-600 bg-amber-100'
    },
    {
      id: 2,
      type: 'payout_notification',
      title: 'Payout Received',
      message: 'You received ₦250,000 from Obiozo Traders et al group.',
      date: '2024-02-08',
      read: true,
      icon: 'ri-money-dollar-circle-line',
      color: 'text-emerald-600 bg-emerald-100'
    },
    {
      id: 3,
      type: 'member_joined',
      title: 'New Member Joined',
      message: 'David Kim (@david_kim) joined your Unity Savings Circle group.',
      date: '2024-02-05',
      read: true,
      icon: 'ri-user-add-line',
      color: 'text-blue-600 bg-blue-100'
    }
  ]);

  const handleInviteResponse = (inviteId: number, response: 'accepted' | 'declined') => {
    setGroupInvites(prev => prev.map(invite => 
      invite.id === inviteId ? { ...invite, status: response } : invite
    ));
  };

  const pendingInvites = groupInvites.filter(invite => invite.status === 'pending');
  const respondedInvites = groupInvites.filter(invite => invite.status !== 'pending');

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
                <h1 className="text-xl font-bold text-emerald-800">Notifications</h1>
                <p className="text-sm text-emerald-600">{pendingInvites.length} pending invites</p>
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-emerald-600">
              <i className="ri-check-double-line text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="fixed top-16 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-40">
        <div className="flex px-4 py-2">
          <button 
            onClick={() => setActiveTab('invites')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg ${
              activeTab === 'invites' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
            }`}
          >
            Group Invites ({pendingInvites.length})
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg ${
              activeTab === 'notifications' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600'
            }`}
          >
            Updates
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-6 px-4">
        {activeTab === 'invites' && (
          <div className="space-y-6">
            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Pending Invitations</h3>
                <div className="space-y-4">
                  {pendingInvites.map((invite) => (
                    <div key={invite.id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={invite.adminAvatar} alt={invite.adminName} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-800">{invite.groupName}</h4>
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">New</span>
                          </div>
                          <p className="text-sm text-gray-600">Invited by {invite.adminName}</p>
                          <p className="text-sm text-emerald-600 font-medium">{invite.adminHandle}</p>
                          <p className="text-xs text-gray-400">{new Date(invite.receivedDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-500">Monthly Contribution</p>
                            <p className="font-medium text-gray-800">₦{invite.monthlyContribution.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Members</p>
                            <p className="font-medium text-gray-800">{invite.currentMembers}/{invite.totalMembers}</p>
                          </div>
                        </div>
                        {invite.message && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Message:</p>
                            <p className="text-sm text-gray-700 italic">"{invite.message}"</p>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleInviteResponse(invite.id, 'declined')}
                          className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={() => handleInviteResponse(invite.id, 'accepted')}
                          className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600"
                        >
                          Accept &amp; Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Responded Invites */}
            {respondedInvites.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Previous Invitations</h3>
                <div className="space-y-3">
                  {respondedInvites.map((invite) => (
                    <div key={invite.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src={invite.adminAvatar} alt={invite.adminName} className="w-full h-full object-cover object-top" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{invite.groupName}</p>
                            <p className="text-xs text-gray-500">by {invite.adminName}</p>
                            <p className="text-xs text-emerald-600 font-medium">{invite.adminHandle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invite.status === 'accepted' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{new Date(invite.receivedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingInvites.length === 0 && respondedInvites.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-mail-line text-2xl text-gray-400"></i>
                </div>
                <p className="text-gray-500">No group invitations</p>
                <p className="text-sm text-gray-400 mt-1">You'll see invitations from group administrators here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {generalNotifications.map((notification) => (
              <div key={notification.id} className={`bg-white rounded-xl p-4 shadow-sm border ${
                notification.read ? 'border-gray-100' : 'border-emerald-200 bg-emerald-50/50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.color}`}>
                    <i className={`${notification.icon} text-lg`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-800">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-400">{new Date(notification.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
