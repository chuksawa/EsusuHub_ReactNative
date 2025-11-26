
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    biometricAuth: false,
    loginAlerts: true,
    dataSharing: false,
    profileVisibility: 'friends',
    activityStatus: true
  });

  const handleSignOut = async () => {
    setIsSigningOut(true);
    
    try {
      // Simulate sign out process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear any local storage or session data
      localStorage.clear();
      sessionStorage.clear();
      
      // Navigate to home page or login page
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out failed:', error);
      setIsSigningOut(false);
    }
  };

  const handlePasswordToggle = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    // Validation
    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    const passwordValidation = validatePassword(passwordForm.newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form and close modal
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowChangePassword(false);
      setShowPrivacySecurity(false);
      
      // Show success message (you could add a toast notification here)
      alert('Password changed successfully!');
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSecurityToggle = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleVisibilityChange = (value: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      profileVisibility: value
    }));
  };

  const userProfile = {
    name: 'Adebayo Olumide',
    handle: '@adebayo_olu',
    phone: '+234 801 234 5678',
    joinDate: '2023-01-15',
    totalSavings: 3275000,
    activeGroups: 4,
    completedCycles: 12,
    memberSince: '2023',
    rating: 4.8,
    totalContributions: 950000
  };

  const achievements = [
    { id: 1, title: 'Consistent Contributor', description: 'Made payments on time for 6 months', icon: 'ri-trophy-fill', color: 'bg-amber-100 text-amber-600' },
    { id: 2, title: 'Group Leader', description: 'Successfully managed a savings group', icon: 'ri-medal-fill', color: 'bg-emerald-100 text-emerald-600' },
    { id: 3, title: 'Trusted Member', description: 'Earned 4.8/5 rating from peers', icon: 'ri-star-fill', color: 'bg-blue-100 text-blue-600' },
    { id: 4, title: 'Goal Achiever', description: 'Completed first savings cycle', icon: 'ri-flag-fill', color: 'bg-purple-100 text-purple-600' }
  ];

  const recentTransactions = [
    { id: 1, type: 'contribution', group: 'Unity Savings Circle', amount: 50000, date: 'Feb 10, 2024', status: 'completed' },
    { id: 2, type: 'payout', group: 'Obiozo Traders et al', amount: 250000, date: 'Feb 8, 2024', status: 'completed' },
    { id: 3, type: 'contribution', group: 'Hajiya Nafisat Group', amount: 75000, date: 'Feb 5, 2024', status: 'completed' },
    { id: 4, type: 'contribution', group: 'Community Development', amount: 30000, date: 'Feb 3, 2024', status: 'completed' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
              <i className="ri-arrow-left-line text-emerald-600 text-xl"></i>
            </button>
            <h1 className="text-lg font-bold text-emerald-800">My Profile</h1>
            <button 
              onClick={() => setShowEditProfile(true)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <i className="ri-pencil-line text-emerald-600 text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-6 px-4">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
              <img 
                src="https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/fc4490d1743b892fb25739e543c38d07.png" 
                alt="Profile" 
                className="w-full h-full object-cover object-top" 
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-emerald-100 text-sm">{userProfile.handle}</p>
              <p className="text-emerald-100 text-sm">Member since {userProfile.memberSince}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">₦{(userProfile.totalSavings / 1000000).toFixed(1)}M</p>
              <p className="text-emerald-100 text-xs">Total Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userProfile.activeGroups}</p>
              <p className="text-emerald-100 text-xs">Active Groups</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userProfile.rating}</p>
              <p className="text-emerald-100 text-xs">Rating</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <i className="ri-repeat-fill text-emerald-600 text-xl"></i>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{userProfile.completedCycles}</p>
                <p className="text-sm text-gray-500">Completed Cycles</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-hand-coin-fill text-blue-600 text-xl"></i>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">₦{(userProfile.totalContributions / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-500">This Year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.color}`}>
                  <i className={`${achievement.icon} text-lg`}></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{achievement.title}</p>
                  <p className="text-xs text-gray-5">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'contribution' ? 'bg-emerald-100' : 'bg-amber-100'
                  }`}>
                    <i className={`${
                      transaction.type === 'contribution' ? 'ri-arrow-up-line text-emerald-600' : 'ri-arrow-down-line text-amber-600'
                    } text-lg`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{transaction.group}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${
                    transaction.type === 'contribution' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {transaction.type === 'contribution' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                  </p>
                  <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 mt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/notifications')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-notification-3-line text-gray-600"></i>
                </div>
                <span className="text-gray-700">Notifications</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            <button 
              onClick={() => setShowPrivacySecurity(true)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-line text-gray-600"></i>
                </div>
                <span className="text-gray-700">Privacy & Security</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            <button 
              onClick={() => setShowHelpSupport(true)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-question-line text-gray-600"></i>
                </div>
                <span className="text-gray-700">Help & Support</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            <button 
              onClick={() => setShowSignOutModal(true)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl text-red-600"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-logout-box-line text-red-600"></i>
                </div>
                <span>Sign Out</span>
              </div>
              <i className="ri-arrow-right-s-line text-red-400"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-logout-box-line text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sign Out</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to sign out of your account?</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSigningOut ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Signing Out...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-logout-box-line"></i>
                      <span>Yes, Sign Out</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSignOutModal(false)}
                  disabled={isSigningOut}
                  className="w-full border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <i className="ri-information-line text-amber-600 text-sm mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Note</p>
                    <p className="text-xs text-amber-700 mt-1">You'll need to sign in again to access your savings groups and make payments.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
              <button onClick={() => setShowEditProfile(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    <img 
                      src={imagePreview || "https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/fc4490d1743b892fb25739e543c38d07.png"} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover object-top" 
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <i className="ri-upload-2-line mr-2"></i>
                      Upload Image
                    </label>
                    {selectedImage && (
                      <button
                        onClick={removeImage}
                        className="ml-2 inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                      >
                        <i className="ri-delete-bin-line mr-2"></i>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload a square image for best results. Max file size: 5MB</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={userProfile.name} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Handle</label>
                <input type="text" value={userProfile.handle} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={userProfile.phone} className="w-full p-3 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpSupport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Help & Support</h3>
                <button onClick={() => setShowHelpSupport(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Quick Help Options */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Quick Help</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <i className="ri-book-line text-emerald-600"></i>
                      </div>
                      <span className="text-emerald-700 font-medium">User Guide</span>
                    </div>
                    <i className="ri-arrow-right-s-line text-emerald-600"></i>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-questionnaire-line text-blue-600"></i>
                      </div>
                      <span className="text-blue-700 font-medium">FAQs</span>
                    </div>
                    <i className="ri-arrow-right-s-line text-blue-600"></i>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-xl hover:bg-purple-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <i className="ri-video-line text-purple-600"></i>
                      </div>
                      <span className="text-purple-700 font-medium">Tutorial Videos</span>
                    </div>
                    <i className="ri-arrow-right-s-line text-purple-600"></i>
                  </button>
                </div>
              </div>

              {/* Contact Support */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Contact Support</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-chat-3-line text-green-600 text-lg"></i>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-800">Live Chat</p>
                      <p className="text-sm text-gray-500">Get instant help from our team</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Online now</span>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-mail-line text-blue-600 text-lg"></i>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-800">Email Support</p>
                      <p className="text-sm text-gray-500">support@savingsapp.com</p>
                      <p className="text-xs text-gray-400 mt-1">Response within 24 hours</p>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="ri-phone-line text-orange-600 text-lg"></i>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-800">Phone Support</p>
                      <p className="text-sm text-gray-500">+234 800 SAVINGS</p>
                      <p className="text-xs text-gray-400 mt-1">Mon-Fri 9AM-6PM WAT</p>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </button>
                </div>
              </div>

              {/* Common Issues */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Common Issues</h4>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-700 text-sm">Payment not reflecting</p>
                    <p className="text-xs text-gray-500 mt-1">Check your transaction history and contact support if needed</p>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-700 text-sm">Unable to join group</p>
                    <p className="text-xs text-gray-500 mt-1">Verify invitation link or contact group admin</p>
                  </button>
                  <button className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-700 text-sm">Account security concerns</p>
                    <p className="text-xs text-gray-500 mt-1">Update password and enable 2FA for better security</p>
                  </button>
                </div>
              </div>

              {/* App Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-800 mb-2">App Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span>2.1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Build:</span>
                    <span>2024.02.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User ID:</span>
                    <span>USR-12345</span>
                  </div>
                </div>
              </div>

              {/* Footer Links */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button className="text-emerald-600 font-medium hover:underline">Privacy Policy</button>
                  <button className="text-emerald-600 font-medium hover:underline">Terms of Service</button>
                  <button className="text-emerald-600 font-medium hover:underline">Community Guidelines</button>
                  <button className="text-emerald-600 font-medium hover:underline">Report Issue</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Security Modal */}
      {showPrivacySecurity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Privacy & Security</h3>
                <button onClick={() => setShowPrivacySecurity(false)} className="w-8 h-8 flex items-center justify-center text-gray-500">
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Security Settings */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4 flex items-center space-x-2">
                  <i className="ri-shield-check-line text-emerald-600"></i>
                  <span>Security Settings</span>
                </h4>
                <div className="space-y-4">
                  {/* ... existing toggle switches ... */}

                  <button 
                    onClick={() => setShowChangePassword(true)}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-key-2-line text-blue-600"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-blue-700 text-sm">Change Password</p>
                        <p className="text-xs text-blue-600">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-blue-600"></i>
                  </button>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4 flex items-center space-x-2">
                  <i className="ri-eye-off-line text-purple-600"></i>
                  <span>Privacy Settings</span>
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">Profile Visibility</p>
                        <p className="text-xs text-gray-500 mt-1">Who can see your profile information</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="everyone"
                          checked={securitySettings.profileVisibility === 'everyone'}
                          onChange={(e) => handleVisibilityChange(e.target.value)}
                          className="opacity-0 absolute"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          securitySettings.profileVisibility === 'everyone' ? 'border-emerald-600' : 'border-gray-300'
                        }`}>
                          {securitySettings.profileVisibility === 'everyone' && (
                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Everyone</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="friends"
                          checked={securitySettings.profileVisibility === 'friends'}
                          onChange={(e) => handleVisibilityChange(e.target.value)}
                          className="opacity-0 absolute"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          securitySettings.profileVisibility === 'friends' ? 'border-emerald-600' : 'border-gray-300'
                        }`}>
                          {securitySettings.profileVisibility === 'friends' && (
                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Group Members Only</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={securitySettings.profileVisibility === 'private'}
                          onChange={(e) => handleVisibilityChange(e.target.value)}
                          className="opacity-0 absolute"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          securitySettings.profileVisibility === 'private' ? 'border-emerald-600' : 'border-gray-300'
                        }`}>
                          {securitySettings.profileVisibility === 'private' && (
                            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">Private</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">Show Activity Status</p>
                      <p className="text-xs text-gray-500 mt-1">Let others see when you're active</p>
                    </div>
                    <button 
                      onClick={() => handleSecurityToggle('activityStatus')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        securitySettings.activityStatus ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        securitySettings.activityStatus ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">Data Sharing</p>
                      <p className="text-xs text-gray-500 mt-1">Share anonymized data for app improvement</p>
                    </div>
                    <button 
                      onClick={() => handleSecurityToggle('dataSharing')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        securitySettings.dataSharing ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        securitySettings.dataSharing ? 'translate-x-6' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4 flex items-center space-x-2">
                  <i className="ri-settings-3-line text-orange-600"></i>
                  <span>Account Management</span>
                </h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-download-2-line text-green-600"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">Download My Data</p>
                        <p className="text-xs text-gray-500">Get a copy of your account data</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-history-line text-blue-600"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">Login History</p>
                        <p className="text-xs text-gray-500">View recent account access</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <i className="ri-device-line text-purple-600"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800 text-sm">Manage Devices</p>
                        <p className="text-xs text-gray-500">See devices with access to your account</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div>
                <h4 className="font-medium text-red-600 mb-4 flex items-center space-x-2">
                  <i className="ri-error-warning-line text-red-600"></i>
                  <span>Danger Zone</span>
                </h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <i className="ri-lock-line text-red-600"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-red-700 text-sm">Deactivate Account</p>
                        <p className="text-xs text-red-600">Temporarily disable your account</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-red-600"></i>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                        <i className="ri-delete-bin-line text-red-700"></i>
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-red-800 text-sm">Delete Account</p>
                        <p className="text-xs text-red-700">Permanently remove your account and data</p>
                      </div>
                    </div>
                    <i className="ri-arrow-right-s-line text-red-700"></i>
                  </button>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-medium text-emerald-800 mb-2 flex items-center space-x-2">
                  <i className="ri-lightbulb-line text-emerald-600"></i>
                  <span>Security Tips</span>
                </h4>
                <div className="space-y-2 text-sm text-emerald-700">
                  <p>• Use a strong, unique password for your account</p>
                  <p>• Enable two-factor authentication for extra security</p>
                  <p>• Regularly review your login history</p>
                  <p>• Don't share your account credentials with others</p>
                  <p>• Keep your app updated to the latest version</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <button className="text-emerald-600 font-medium hover:underline">Privacy Policy</button>
                  <button className="text-emerald-600 font-medium hover:underline">Security Center</button>
                  <button className="text-emerald-600 font-medium hover:underline">Data Protection</button>
                  <button className="text-emerald-600 font-medium hover:underline">Report Security Issue</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Change Password</h3>
              <button 
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordError('');
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-500"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handlePasswordToggle('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`${showPasswords.current ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handlePasswordToggle('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`${showPasswords.new ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                  </button>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      passwordForm.newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs ${
                      passwordForm.newPassword.length >= 8 ? 'text-emerald-600' : 'text-gray-500'
                    }`}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      /(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword) ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs ${
                      /(?=.*[a-z])(?=.*[A-Z])/.test(passwordForm.newPassword) ? 'text-emerald-600' : 'text-gray-500'
                    }`}>Upper and lowercase letters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      /\d/.test(passwordForm.newPassword) ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs ${
                      /\d/.test(passwordForm.newPassword) ? 'text-emerald-600' : 'text-gray-500'
                    }`}>At least one number</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full p-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handlePasswordToggle('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`${showPasswords.confirm ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                  </button>
                </div>
                {passwordForm.confirmPassword && (
                  <div className="mt-1 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      passwordForm.newPassword === passwordForm.confirmPassword ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-xs ${
                      passwordForm.newPassword === passwordForm.confirmPassword ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {passwordForm.newPassword === passwordForm.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <i className="ri-error-warning-line text-red-600 text-sm"></i>
                    <p className="text-sm text-red-700">{passwordError}</p>
                  </div>
                </div>
              )}

              {/* Security Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <i className="ri-information-line text-blue-600 text-sm mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Password Security Tips</p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
                      <li>• Use a unique password you don't use elsewhere</li>
                      <li>• Consider using a password manager</li>
                      <li>• Don't share your password with anyone</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-2">
                <button 
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordError('');
                  }}
                  className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Changing...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-check-line"></i>
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
