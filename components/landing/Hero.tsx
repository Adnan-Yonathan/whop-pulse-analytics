import { ArrowRight, BarChart3, TrendingUp, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-background-snow to-midnight-100 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-midnight sm:text-6xl lg:text-7xl">
            Deep Analytics & Intelligence for{" "}
            <span className="text-primary-dragonfire">Whop Communities</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-midnight-700 sm:text-xl lg:text-2xl">
            Transform your community data into actionable insights. Predict churn, 
            optimize content, and grow revenue with AI-powered analytics.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/discover"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dragonfire transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-midnight hover:text-primary-dragonfire transition-colors"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-16 flow-root sm:mt-24">
          <div className="relative -m-2 rounded-xl bg-midnight-200/20 p-2 ring-1 ring-inset ring-midnight-200/30 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-md bg-background-snow p-8 shadow-2xl ring-1 ring-midnight-200/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-primary-dragonfire"></div>
                  <div className="h-3 w-3 rounded-full bg-accent-lemonlime"></div>
                  <div className="h-3 w-3 rounded-full bg-accent-byzantine"></div>
                </div>
                <div className="text-sm text-midnight-600">Pulse Analytics Dashboard</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-gradient-to-br from-midnight-300 to-midnight-400 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-midnight">94.2%</div>
                      <div className="text-sm text-midnight-600">Churn Prediction Accuracy</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-midnight-400 to-midnight-500 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-accent rounded-lg">
                      <TrendingUp className="h-5 w-5 text-midnight" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-midnight">+24%</div>
                      <div className="text-sm text-midnight-600">Revenue Growth</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-midnight-200 to-midnight-300 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-byzantine rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-midnight">1,247</div>
                      <div className="text-sm text-midnight-600">Active Members</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="mt-8 h-48 bg-gradient-to-r from-midnight-100 to-midnight-200 rounded-lg flex items-center justify-center">
                <div className="text-midnight-600 text-sm">Interactive Analytics Dashboard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-midnight-600 mb-8">Trusted by 500+ Whop communities</p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="text-midnight-500 font-semibold">Community A</div>
            <div className="text-midnight-500 font-semibold">Community B</div>
            <div className="text-midnight-500 font-semibold">Community C</div>
            <div className="text-midnight-500 font-semibold">Community D</div>
          </div>
        </div>
      </div>
    </section>
  );
}
