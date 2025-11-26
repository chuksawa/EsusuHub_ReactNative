
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!acceptTerms) {
        setError('Please accept the Terms of Service and Privacy Policy');
        setIsLoading(false);
        return;
      }

      const passwordValidation = validatePassword(formData.password);
      if (passwordValidation) {
        setError(passwordValidation);
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (formData.email && formData.password && formData.firstName && formData.lastName) {
        // Store user session
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
        
        // Navigate to home page
        navigate('/', { replace: true });
      } else {
        setError('Please fill in all required fields');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join thousands saving together</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="ri-mail-line text-gray-400"></i>
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="+234 800 000 0000"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="ri-phone-line text-gray-400"></i>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Create password"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="ri-lock-line text-gray-400"></i>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.password.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs ${
                      formData.password.length >= 8 ? 'text-emerald-600' : 'text-gray-500'
                    }`}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs ${
                      /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'text-emerald-600' : 'text-gray-500'
                    }`}>Upper and lowercase letters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      /\d/.test(formData.password) ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs ${
                      /\d/.test(formData.password) ? 'text-emerald-600' : 'text-gray-500'
                    }`}>At least one number</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  placeholder="Confirm password"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <i className="ri-lock-line text-gray-400"></i>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={`${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-1 flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.password === formData.confirmPassword ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs ${
                    formData.password === formData.confirmPassword ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="opacity-0 absolute"
                />
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                  acceptTerms ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'
                }`}>
                  {acceptTerms && (
                    <i className="ri-check-line text-white text-sm"></i>
                  )}
                </div>
              </label>
              <div className="text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" className="text-emerald-600 hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="text-emerald-600 hover:underline">Privacy Policy</button>
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

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <i className="ri-user-add-line"></i>
                  <span>Create Account</span>
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

          {/* Social Registration Options */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                <i className="ri-facebook-fill text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium">Sign up with Facebook</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                <i className="ri-google-fill text-white text-sm"></i>
              </div>
              <span className="text-gray-700 font-medium">Sign up with Google</span>
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              Sign in here
            </button>
          </p>
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
    </div>
  );
}
