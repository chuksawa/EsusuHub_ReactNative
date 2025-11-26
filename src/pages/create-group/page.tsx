
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateGroup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    groupName: '',
    description: '',
    monthlyContribution: '',
    totalMembers: '',
    payoutOrder: 'random',
    penaltyFee: '',
    startDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/groups');
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-emerald-600 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Group Created!</h2>
          <p className="text-gray-600 mb-4">Your savings group has been successfully created</p>
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
            <h1 className="text-lg font-bold text-emerald-800">Create New Group</h1>
            <div className="w-8 h-8"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-4 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <h3 className="font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                <input
                  type="text"
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter group name"
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder="Describe the purpose of your savings group"
                  rows={3}
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 characters</p>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <h3 className="font-semibold text-gray-800 mb-4">Financial Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="number"
                    name="monthlyContribution"
                    value={formData.monthlyContribution}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="25000"
                    min="1000"
                    max="1000000"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Amount each member contributes monthly</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Members</label>
                <input
                  type="number"
                  name="totalMembers"
                  value={formData.totalMembers}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="12"
                  min="3"
                  max="50"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of group members</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Penalty Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="number"
                    name="penaltyFee"
                    value={formData.penaltyFee}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="5000"
                    min="0"
                    max="50000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Fee for late payments (optional)</p>
              </div>
            </div>
          </div>

          {/* Group Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
            <h3 className="font-semibold text-gray-800 mb-4">Group Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payout Order</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payoutOrder"
                      value="random"
                      checked={formData.payoutOrder === 'random'}
                      onChange={handleInputChange}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.payoutOrder === 'random' ? 'border-emerald-600' : 'border-gray-300'
                    }`}>
                      {formData.payoutOrder === 'random' && (
                        <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Random Order</p>
                      <p className="text-sm text-gray-500">System randomly selects payout order</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payoutOrder"
                      value="fixed"
                      checked={formData.payoutOrder === 'fixed'}
                      onChange={handleInputChange}
                      className="opacity-0 absolute"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.payoutOrder === 'fixed' ? 'border-emerald-600' : 'border-gray-300'
                    }`}>
                      {formData.payoutOrder === 'fixed' && (
                        <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Fixed Order</p>
                      <p className="text-sm text-gray-500">Admin manually sets payout order</p>
                    </div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">When the group will start collecting contributions</p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4">Group Preview</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-emerald-100">Monthly Pool:</span>
                <span className="font-medium">
                  ₦{formData.monthlyContribution && formData.totalMembers 
                    ? (parseInt(formData.monthlyContribution) * parseInt(formData.totalMembers)).toLocaleString()
                    : '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-100">Duration:</span>
                <span className="font-medium">{formData.totalMembers || '0'} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-100">Total Savings:</span>
                <span className="font-medium">
                  ₦{formData.monthlyContribution && formData.totalMembers 
                    ? (parseInt(formData.monthlyContribution) * parseInt(formData.totalMembers) * parseInt(formData.totalMembers)).toLocaleString()
                    : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating Group...</span>
                </>
              ) : (
                <>
                  <i className="ri-add-circle-fill"></i>
                  <span>Create Group</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <i className="ri-information-fill text-blue-600"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Group Creation</p>
              <p className="text-xs text-blue-600 mt-1">As the group creator, you will be the admin and can manage members and settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
