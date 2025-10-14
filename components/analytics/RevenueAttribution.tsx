"use client";

interface RevenueAttributionProps {
  companyId: string;
}

export function RevenueAttribution({ companyId }: RevenueAttributionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Revenue Attribution</h2>
        <p className="text-gray-600 mb-6">
          Multi-touch attribution analysis showing which marketing efforts drive highest-value members
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-blue-600">$12,450</p>
            <p className="text-sm text-blue-700">+18% vs last month</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Top Channel</h3>
            <p className="text-2xl font-bold text-green-600">Social Media</p>
            <p className="text-sm text-green-700">42% of revenue</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">ROI Leader</h3>
            <p className="text-2xl font-bold text-purple-600">Email Marketing</p>
            <p className="text-sm text-purple-700">340% ROI</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attribution Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <div className="font-medium text-gray-900">Social Media</div>
                <div className="text-sm text-gray-600">Facebook, Instagram, Twitter</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">$5,230</div>
              <div className="text-sm text-gray-500">42% of revenue</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📧</span>
              <div>
                <div className="font-medium text-gray-900">Email Marketing</div>
                <div className="text-sm text-gray-600">Newsletters, campaigns</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">$3,890</div>
              <div className="text-sm text-gray-500">31% of revenue</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <div className="font-medium text-gray-900">Organic Search</div>
                <div className="text-sm text-gray-600">Google, SEO</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">$2,180</div>
              <div className="text-sm text-gray-500">17% of revenue</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-medium text-gray-900">Referrals</div>
                <div className="text-sm text-gray-600">Member referrals</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">$1,150</div>
              <div className="text-sm text-gray-500">9% of revenue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
