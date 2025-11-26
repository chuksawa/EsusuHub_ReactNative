
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState('50000');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [selectedGroup, setSelectedGroup] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if coming from a specific group page
  const fromGroupPage = location.state?.fromGroup === true;
  const groupId = location.state?.groupId;
  const groupName = location.state?.groupName;
  const monthlyContribution = location.state?.monthlyContribution;

  // User's groups data
  const userGroups = [
    {
      id: '1',
      name: 'Unity Savings Circle',
      monthlyContribution: 50000,
      dueDate: 'February 15, 2024',
      status: 'due'
    },
    {
      id: '2', 
      name: 'Obiozo Traders et al',
      monthlyContribution: 25000,
      dueDate: 'February 20, 2024',
      status: 'upcoming'
    },
    {
      id: '3',
      name: 'Hajiya Nafisat Group', 
      monthlyContribution: 75000,
      dueDate: 'February 28, 2024',
      status: 'upcoming'
    },
    {
      id: '4',
      name: 'Community Development',
      monthlyContribution: 30000,
      dueDate: 'March 5, 2024', 
      status: 'upcoming'
    }
  ];

  // Set initial values based on context
  useEffect(() => {
    if (fromGroupPage && groupId) {
      setSelectedGroup(groupId);
      if (monthlyContribution) {
        setAmount(monthlyContribution.toString());
      }
    }
  }, [fromGroupPage, groupId, monthlyContribution]);

  const selectedGroupData = userGroups.find(group => group.id === selectedGroup) || userGroups[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('payment_method', paymentMethod);
    formData.append('group', fromGroupPage ? groupName : selectedGroupData.name);
    formData.append('group_id', selectedGroup);
    formData.append('member', 'Current User');

    try {
      const response = await fetch('https://readdy.ai/api/form/d38qtocs3ghg1jalfsg0', {
        method: 'POST',
        body: new URLSearchParams(formData as any)
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-emerald-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your contribution has been recorded</p>
          <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center">
              <i className="ri-arrow-left-line text-emerald-600 text-xl"></i>
            </button>
            <h1 className="text-lg font-bold text-emerald-800">Make Payment</h1>
            <div className="w-8 h-8"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-4 pb-8">
        <form id="payment-form" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Selection - Only show when NOT from a specific group page */}
          {fromGroupPage === false && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h3 className="font-semibold text-gray-800 mb-4">Select Group</h3>
              <div className="space-y-3">
                {userGroups.map((group) => (
                  <label key={group.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="group_selection"
                      value={group.id}
                      checked={selectedGroup === group.id}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        setAmount(group.monthlyContribution.toString());
                      }}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedGroup === group.id ? 'border-emerald-600' : 'border-gray-300'
                    }`}>
                      {selectedGroup === group.id && (
                        <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{group.name}</p>
                          <p className="text-sm text-gray-500">Due: {group.dueDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">₦{group.monthlyContribution.toLocaleString()}</p>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            group.status === 'due' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {group.status === 'due' ? 'Due Now' : 'Upcoming'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Group</span>
                <span className="font-medium">{fromGroupPage ? groupName : selectedGroupData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Contribution</span>
                <span className="font-medium">₦{fromGroupPage ? monthlyContribution?.toLocaleString() : selectedGroupData.monthlyContribution.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date</span>
                <span className="font-medium">{fromGroupPage ? 'Current cycle' : selectedGroupData.dueDate}</span>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                placeholder={fromGroupPage ? monthlyContribution?.toString() : selectedGroupData.monthlyContribution.toString()}
                min="1000"
                max="1000000"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Minimum: ₦1,000 | Maximum: ₦1,000,000</p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <h3 className="font-semibold text-gray-700 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment_method"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="opacity-0 absolute"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'bank' ? 'border-emerald-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'bank' && (
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-bank-fill text-blue-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Direct bank payment</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="opacity-0 absolute"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-emerald-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'card' && (
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="ri-bank-card-fill text-green-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Debit Card</p>
                    <p className="text-sm text-gray-500">Pay with your card</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment_method"
                  value="mobile"
                  checked={paymentMethod === 'mobile'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="opacity-0 absolute"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'mobile' ? 'border-emerald-600' : 'border-gray-300'
                }`}>
                  {paymentMethod === 'mobile' && (
                    <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="ri-smartphone-fill text-purple-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Mobile Money</p>
                    <p className="text-sm text-gray-500">Pay with mobile wallet</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <i className="ri-secure-payment-fill"></i>
                  <span>Complete Payment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <i className="ri-shield-check-fill text-emerald-600"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Secure Payment</p>
              <p className="text-xs text-emerald-600 mt-1">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
