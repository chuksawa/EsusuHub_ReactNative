// Centralized user data to ensure consistency across all pages
export const mockUsers = [
  { id: 1, name: 'You', handle: '@admin_user', phone: '+234 801 234 5678', status: 'paid', role: 'admin', joinDate: '2023-01-15', avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20business%20attire%2C%20confident%20smile%2C%20clean%20white%20background%2C%20high%20quality%20headshot%20photography&width=100&height=100&seq=admin1&orientation=squarish' },
  { id: 2, name: 'Sarah Johnson', handle: '@sarah_j', phone: '+234 802 345 6789', status: 'paid', role: 'member', joinDate: '2023-01-20', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20business%20casual%2C%20friendly%20expression%2C%20clean%20white%20background%2C%20diverse%20ethnicity%20headshot&width=100&height=100&seq=admin2&orientation=squarish' },
  { id: 3, name: 'Michael Chen', handle: '@mike_chen', phone: '+234 803 456 7890', status: 'paid', role: 'member', joinDate: '2023-02-01', avatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20man%20portrait%2C%20business%20shirt%2C%20confident%20look%2C%20clean%20white%20background%2C%20corporate%20headshot%20photography&width=100&height=100&seq=admin3&orientation=squarish' },
  { id: 4, name: 'Amara Okafor', handle: '@amara_ok', phone: '+234 804 567 8901', status: 'pending', role: 'member', joinDate: '2023-02-05', avatar: 'https://readdy.ai/api/search-image?query=Professional%20African%20woman%20portrait%2C%20elegant%20attire%2C%20warm%20smile%2C%20clean%20white%20background%2C%20business%20headshot%20photography&width=100&height=100&seq=admin4&orientation=squarish' },
  { id: 5, name: 'David Kim', handle: '@david_kim', phone: '+234 805 678 9012', status: 'paid', role: 'member', joinDate: '2023-02-10', avatar: 'https://readdy.ai/api/search-image?query=Professional%20man%20portrait%2C%20business%20casual%2C%20approachable%20smile%2C%20clean%20white%20background%2C%20modern%20headshot%20photography&width=100&height=100&seq=admin5&orientation=squarish' },
  { id: 6, name: 'Grace Adebayo', handle: '@grace_ade', phone: '+234 806 789 0123', status: 'paid', role: 'member', joinDate: '2023-02-12', avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20portrait%2C%20colorful%20headwrap%2C%20confident%20expression%2C%20clean%20white%20background%2C%20cultural%20business%20photography&width=100&height=100&seq=admin6&orientation=squarish' }
];

export const mockActivity = [
  { id: 1, type: 'contribution', amount: 50000, date: 'Feb 10', member: 'You', handle: '@admin_user', group: 'Unity Savings Circle' },
  { id: 2, type: 'payout', amount: 600000, date: 'Feb 8', member: 'Sarah Johnson', handle: '@sarah_j', group: 'Unity Savings Circle' },
  { id: 3, type: 'contribution', amount: 50000, date: 'Feb 5', member: 'Michael Chen', handle: '@mike_chen', group: 'Unity Savings Circle' },
  { id: 4, type: 'contribution', amount: 50000, date: 'Feb 3', member: 'Amara Okafor', handle: '@amara_ok', group: 'Unity Savings Circle' },
  { id: 5, type: 'contribution', amount: 50000, date: 'Feb 1', member: 'David Kim', handle: '@david_kim', group: 'Unity Savings Circle' },
  { id: 6, type: 'contribution', amount: 50000, date: 'Jan 28', member: 'Grace Adebayo', handle: '@grace_ade', group: 'Unity Savings Circle' }
];

export const mockPaymentHistory = [
  { id: 1, member: 'Sarah Johnson', handle: '@sarah_j', amount: 50000, date: '2024-02-10', status: 'completed', method: 'Bank Transfer' },
  { id: 2, member: 'Michael Chen', handle: '@mike_chen', amount: 50000, date: '2024-02-08', status: 'completed', method: 'Mobile Money' },
  { id: 3, member: 'David Kim', handle: '@david_kim', amount: 50000, date: '2024-02-05', status: 'completed', method: 'Debit Card' },
  { id: 4, member: 'Grace Adebayo', handle: '@grace_ade', amount: 50000, date: '2024-02-03', status: 'completed', method: 'Bank Transfer' },
  { id: 5, member: 'Amara Okafor', handle: '@amara_ok', amount: 50000, date: '2024-01-28', status: 'pending', method: 'Bank Transfer' }
];

export const mockInvites = [
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
];