
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Facebook SDK types
declare global {
  interface Window {
    FB: {
      init: (params: any) => void;
      login: (callback: (response: any) => void, params?: any) => void;
      api: (path: string, callback: (response: any) => void) => void;
      getLoginStatus: (callback: (response: any) => void) => void;
    };
    fbAsyncInit: () => void;
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
    handleGoogleSignIn: (response: any) => void;
    googleSignInInit: () => void;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    // Set up Google Sign-In callback
    window.handleGoogleSignIn = (response) => {
      setIsGoogleLoading(true);
      setError('');

      try {
        // Decode the JWT token to get user information
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        if (payload) {
          // Store user session with Google data
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userEmail', payload.email || '');
          localStorage.setItem('userName', payload.name || '');
          localStorage.setItem('userPicture', payload.picture || '');
          localStorage.setItem('loginMethod', 'google');
          localStorage.setItem('googleId', payload.sub || '');
          
          // Navigate to home page
          navigate('/', { replace: true });
        } else {
          setError('Failed to get user information from Google.');
        }
      } catch (error) {
        setError('Failed to process Google login response.');
      } finally {
        setIsGoogleLoading(false);
      }
    };

    // Initialize Google Sign-In if not already done
    if (window.google && window.googleSignInInit) {
      window.googleSignInInit();
    }

    // Cleanup function
    return () => {
      if (window.handleGoogleSignIn) {
        delete window.handleGoogleSignIn;
      }
    };
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, any email/password combo works
      if (formData.email && formData.password) {
        // Store user session
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('loginMethod', 'email');
        
        // Navigate to home page
        navigate('/', { replace: true });
      } else {
        setError('Please fill in all fields');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    setIsFacebookLoading(true);
    setError('');

    // Check if Facebook SDK is loaded
    if (typeof window.FB === 'undefined') {
      setError('Facebook SDK not loaded. Please refresh the page and try again.');
      setIsFacebookLoading(false);
      return;
    }

    window.FB.login((response) => {
      if (response.authResponse) {
        // User successfully logged in with Facebook
        window.FB.api('/me', { fields: 'name,email,picture' }, (userInfo) => {
          if (userInfo && !userInfo.error) {
            // Store user session with Facebook data
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', userInfo.email || '');
            localStorage.setItem('userName', userInfo.name || '');
            localStorage.setItem('userPicture', userInfo.picture?.data?.url || '');
            localStorage.setItem('loginMethod', 'facebook');
            localStorage.setItem('facebookId', userInfo.id || '');
            
            // Navigate to home page
            navigate('/', { replace: true });
          } else {
            setError('Failed to get user information from Facebook.');
          }
          setIsFacebookLoading(false);
        });
      } else {
        // User cancelled login or didn't authorize
        setError('Facebook login was cancelled or failed.');
        setIsFacebookLoading(false);
      }
    }, { scope: 'email,public_profile' });
  };

  const handleGoogleLogin = () => {
    setError('');
    setIsGoogleLoading(true);

    // Check if Google SDK is loaded
    if (typeof window.google === 'undefined') {
      setError('Google SDK not loaded. Please refresh the page and try again.');
      setIsGoogleLoading(false);
      return;
    }

    try {
      // Trigger Google Sign-In popup
      window.google.accounts.id.prompt();
    } catch (error) {
      setError('Failed to initialize Google Sign-In. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setIsResetting(true);

    try {
      // Simulate password reset process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (resetEmail) {
        setResetSuccess(true);
        // Auto close modal after 3 seconds
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetSuccess(false);
          setResetEmail('');
        }, 3000);
      } else {
        setResetError('Please enter your email address');
      }
    } catch (error) {
      setResetError('Failed to send reset email. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4">
            <img 
              src="https://static.readdy.ai/image/c8fa67cf25818f8977dc6c7bfc4f6111/6aaef037c8e44e8eb9ec2616da6136a8.png" 
              alt="EsusuHub Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-emerald-600 tracking-wide mb-2" style={{fontFamily: 'Fredoka One, cursive'}}>
            EsusuHub
          </h1>
          <p className="text-lg font-medium text-blue-900 mb-6">Team up Cash up Climb up!</p>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your savings account</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="ri-mail-line text-gray-400 text-lg"></i>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-12 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="ri-lock-line text-gray-400 text-lg"></i>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <i className="ri-error-warning-line text-red-600 text-sm"></i>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="space-y-3">
            <button 
              onClick={handleFacebookLogin}
              disabled={isFacebookLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFacebookLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-gray-700 font-medium">Connecting...</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                    <i className="ri-facebook-fill text-white text-sm"></i>
                  </div>
                  <span className="text-gray-700 font-medium">Continue with Facebook</span>
                </>
              )}
            </button>
            
            <button 
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                  <span className="text-gray-700 font-medium">Connecting...</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                    <i className="ri-google-fill text-white text-sm"></i>
                  </div>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              Register here
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <div className="flex items-start space-x-2">
            <i className="ri-information-line text-blue-600 text-sm mt-0.5"></i>
            <div>
              <p className="text-sm font-medium text-blue-800">Demo Mode</p>
              <p className="text-xs text-blue-700 mt-1">
                Enter any email and password to sign in, or use Facebook/Google login to explore the app features.
              </p>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
          <div className="flex items-start space-x-2">
            <i className="ri-settings-line text-yellow-600 text-sm mt-0.5"></i>
            <div>
              <p className="text-sm font-medium text-yellow-800">Setup Required</p>
              <p className="text-xs text-yellow-700 mt-1">
                Replace 'YOUR_FACEBOOK_APP_ID' and 'YOUR_GOOGLE_CLIENT_ID' in index.html with your actual app credentials to enable social login.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <button className="hover:text-emerald-600">Privacy Policy</button>
            <button className="hover:text-emerald-600">Terms of Service</button>
            <button className="hover:text-emerald-600">Help</button>
          </div>
          <p className="text-xs text-gray-400">
            © 2024 EsusuHub. All rights reserved.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Reset Password</h3>
              <button 
                onClick={closeForgotPasswordModal}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {resetSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-emerald-600 text-2xl"></i>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Email Sent!</h4>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to <strong>{resetEmail}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Check your email and follow the instructions to reset your password.
                </p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="ri-information-line text-blue-600 text-sm mt-0.5"></i>
                    <div>
                      <p className="text-sm text-blue-800">Didn't receive the email?</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Check your spam folder or try again in a few minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => {
                        setResetEmail(e.target.value);
                        setResetError('');
                      }}
                      className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      placeholder="Enter your email"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <i className="ri-mail-line text-gray-400 text-lg"></i>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {resetError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <i className="ri-error-warning-line text-red-600 text-sm"></i>
                      <p className="text-sm text-red-700">{resetError}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <button 
                    type="button"
                    onClick={closeForgotPasswordModal}
                    className="flex-1 py-3 px-4 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    disabled={isResetting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isResetting || !resetEmail}
                    className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isResetting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line"></i>
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Help Text */}
                <div className="bg-gray-50 rounded-lg p-3 mt-4">
                  <div className="flex items-start space-x-2">
                    <i className="ri-lightbulb-line text-gray-500 text-sm mt-0.5"></i>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Remember your password?</p>
                      <button
                        type="button"
                        onClick={closeForgotPasswordModal}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline mt-1"
                      >
                        Back to sign in
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
