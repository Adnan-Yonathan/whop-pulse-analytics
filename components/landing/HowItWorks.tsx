import { 
  ArrowRight, 
  Database, 
  Brain, 
  Target, 
  TrendingUp 
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Connect Your Data",
    description: "Seamlessly integrate with your Whop community. We automatically sync member data, content engagement, and revenue metrics.",
    gradient: "bg-gradient-primary"
  },
  {
    number: "02", 
    icon: Brain,
    title: "AI Analysis",
    description: "Our machine learning models analyze patterns in your data to identify trends, predict churn, and surface actionable insights.",
    gradient: "bg-gradient-byzantine"
  },
  {
    number: "03",
    icon: Target,
    title: "Get Recommendations",
    description: "Receive personalized recommendations for content optimization, member retention strategies, and growth opportunities.",
    gradient: "bg-gradient-accent"
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Scale & Grow",
    description: "Implement insights to reduce churn, increase engagement, and grow revenue. Track your progress with real-time analytics.",
    gradient: "bg-gradient-primary"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 bg-midnight-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-midnight sm:text-4xl lg:text-5xl">
            How it works
          </h2>
          <p className="mt-6 text-lg leading-8 text-midnight-600">
            Get started in minutes and see results in days. Our simple 4-step process 
            transforms your community data into growth opportunities.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative flex flex-col items-start gap-6 p-8 bg-background-snow rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${step.gradient} shadow-lg`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-midnight-500">{step.number}</div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-midnight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-midnight-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-midnight-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-bold text-midnight mb-4">
              Ready to transform your community?
            </h3>
            <p className="text-midnight-600 mb-8">
              Join hundreds of creators who are already growing their communities with data-driven insights.
            </p>
            <a
              href="/discover"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dragonfire transition-all duration-300"
            >
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
