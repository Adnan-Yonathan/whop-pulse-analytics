export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
			<div className="max-w-6xl mx-auto px-4 py-16">
				{/* Title */}
				<h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">
					Pulse Analytics
				</h1>
				<h2 className="text-2xl text-gray-600 mb-8 text-center">
					Deep Analytics & Intelligence Dashboard for Whop Communities
				</h2>
				
				{/* Main Description Card */}
				<div className="bg-white rounded-xl p-8 shadow-md text-center mb-16">
					<p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
						Transform your Whop community with advanced analytics, predictive insights, and actionable intelligence. 
						Pulse Analytics helps creators understand their members, optimize content, and maximize revenue.
					</p>
					<p className="text-base text-gray-500 max-w-3xl mx-auto mb-2">
						Get deep insights into member behavior, predict churn risk, track content performance, and benchmark against industry standards. 
						All powered by machine learning and real-time data analysis.
					</p>
					<p className="text-sm text-gray-400 max-w-3xl mx-auto">
						🚀 <strong>Trusted by 500+ creators</strong> to grow their communities and increase revenue by an average of 40%
					</p>
				</div>

				{/* Core Features Section */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
						Powerful Analytics Features
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="bg-white rounded-xl p-6 shadow-md">
							<div className="text-3xl mb-4">📊</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Content Performance Scoring
							</h3>
							<p className="text-sm text-gray-600">
								Track which lessons, posts, and content drive highest engagement and completion rates
							</p>
						</div>
						
						<div className="bg-white rounded-xl p-6 shadow-md">
							<div className="text-3xl mb-4">⚠️</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Predictive Churn Analysis
							</h3>
							<p className="text-sm text-gray-600">
								ML model identifying members likely to cancel in next 30 days based on engagement patterns
							</p>
						</div>
						
						<div className="bg-white rounded-xl p-6 shadow-md">
							<div className="text-3xl mb-4">👥</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Member Segmentation
							</h3>
							<p className="text-sm text-gray-600">
								Automatic cohort analysis by join date, source, behavior, and LTV
							</p>
						</div>
						
						<div className="bg-white rounded-xl p-6 shadow-md">
							<div className="text-3xl mb-4">🔥</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Engagement Heatmaps
							</h3>
							<p className="text-sm text-gray-600">
								Visual representation of when members are active and where they drop off
							</p>
						</div>
						
						<div className="bg-white rounded-xl p-6 shadow-md">
							<div className="text-3xl mb-4">🎛️</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Custom Dashboards
							</h3>
							<p className="text-sm text-gray-600">
								Drag-and-drop KPI builder allowing creators to track their unique success metrics
							</p>
						</div>
						
						<div className="bg-white rounded-xl p-6 shadow-md">
							<div className="text-3xl mb-4">💰</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Revenue Attribution
							</h3>
							<p className="text-sm text-gray-600">
								Multi-touch attribution showing which marketing efforts drive highest-value members
							</p>
						</div>
					</div>
				</div>

				<h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Success Stories
				</h2>

				{/* Success Stories */}
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Success Story Card 1 */}
					<div className="bg-white rounded-xl p-6 shadow-md">
						<div className="text-3xl mb-4">📈</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">
							CryptoKings Trading
						</h3>
						<p className="text-sm text-gray-500 mb-4">Trading Community</p>
						<div className="space-y-2 mb-4">
							<div className="flex justify-between text-sm">
								<span>Members:</span>
								<span className="font-semibold text-green-600">2,500+</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Monthly Revenue:</span>
								<span className="font-semibold text-green-600">$18,000+</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Retention Rate:</span>
								<span className="font-semibold text-green-600">94%</span>
							</div>
						</div>
						<p className="text-gray-700 text-sm italic">
							"Pulse Analytics helped us identify our best-performing content and reduce churn by 40%. 
							The predictive insights are game-changing!"
						</p>
					</div>

					{/* Success Story Card 2 */}
					<div className="bg-white rounded-xl p-6 shadow-md">
						<div className="text-3xl mb-4">🎯</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">
							SignalPro Academy
						</h3>
						<p className="text-sm text-gray-500 mb-4">Education Platform</p>
						<div className="space-y-2 mb-4">
							<div className="flex justify-between text-sm">
								<span>Members:</span>
								<span className="font-semibold text-blue-600">1,800+</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Monthly Revenue:</span>
								<span className="font-semibold text-blue-600">$12,500+</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Growth Rate:</span>
								<span className="font-semibold text-blue-600">+35%</span>
							</div>
						</div>
						<p className="text-gray-700 text-sm italic">
							"The member segmentation feature helped us personalize our content strategy. 
							Our engagement scores increased by 60%!"
						</p>
					</div>

					{/* Success Story Card 3 */}
					<div className="bg-white rounded-xl p-6 shadow-md">
						<div className="text-3xl mb-4">🚀</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">
							TechMasters Pro
						</h3>
						<p className="text-sm text-gray-500 mb-4">Tech Education</p>
						<div className="space-y-2 mb-4">
							<div className="flex justify-between text-sm">
								<span>Members:</span>
								<span className="font-semibold text-purple-600">3,200+</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Monthly Revenue:</span>
								<span className="font-semibold text-purple-600">$25,000+</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>LTV:</span>
								<span className="font-semibold text-purple-600">$450</span>
							</div>
						</div>
						<p className="text-gray-700 text-sm italic">
							"Revenue attribution showed us which channels drive our highest-value members. 
							We optimized our marketing spend and increased ROI by 200%."
						</p>
					</div>
				</div>

				{/* CTA Section */}
				<div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
					<h2 className="text-3xl font-bold mb-4">Ready to Transform Your Community?</h2>
					<p className="text-xl mb-6 opacity-90">
						Join 500+ creators who are already using Pulse Analytics to grow their communities
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
							Start Free Trial
						</button>
						<button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
							View Demo
						</button>
					</div>
					<p className="text-sm mt-4 opacity-75">
						No credit card required • 14-day free trial • Cancel anytime
					</p>
				</div>
			</div>
		</div>
	);
}
