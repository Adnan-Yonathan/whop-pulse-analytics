"use client";

import { DemoModeBanner } from "@/components/ui/DemoModeBanner";

interface ComparativeBenchmarksProps {
  companyId: string;
  isDemoMode?: boolean;
}

export function ComparativeBenchmarks({ companyId, isDemoMode = false }: ComparativeBenchmarksProps) {
  return (
    <div className="space-y-6">
      {isDemoMode && <DemoModeBanner />}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comparative Benchmarks</h2>
        <p className="text-gray-600 mb-6">
          Anonymous aggregate data showing how your metrics compare to similar communities
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Retention Rate</h3>
            <p className="text-3xl font-bold text-green-600">92%</p>
            <p className="text-sm text-green-700">Above 85% industry average</p>
          </div>
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Engagement Score</h3>
            <p className="text-3xl font-bold text-blue-600">78</p>
            <p className="text-sm text-blue-700">Above 65 industry average</p>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Growth Rate</h3>
            <p className="text-3xl font-bold text-purple-600">+24%</p>
            <p className="text-sm text-purple-700">Above +15% industry average</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Comparison</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Monthly Revenue Growth</div>
              <div className="text-sm text-gray-600">Your community vs similar communities</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">+24%</div>
              <div className="text-sm text-gray-500">vs +15% average</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Member Satisfaction</div>
              <div className="text-sm text-gray-600">Based on engagement and retention</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">94%</div>
              <div className="text-sm text-gray-500">vs 87% average</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Content Completion Rate</div>
              <div className="text-sm text-gray-600">Average lesson completion</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-purple-600">67%</div>
              <div className="text-sm text-gray-500">vs 52% average</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
