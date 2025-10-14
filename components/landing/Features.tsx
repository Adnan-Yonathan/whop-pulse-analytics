import { 
  Brain, 
  Target, 
  BarChart3, 
  Zap,
  Users,
  TrendingUp,
  Shield,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Predictive Churn Analysis",
    description: "AI-powered ML model with 94.2% accuracy identifies members likely to cancel in the next 30 days, enabling proactive retention strategies.",
    gradient: "bg-gradient-primary"
  },
  {
    icon: Target,
    title: "Content Performance Scoring",
    description: "Track engagement and completion rates across all content types. Identify top performers and optimize underperforming content.",
    gradient: "bg-gradient-accent"
  },
  {
    icon: Users,
    title: "Member Segmentation",
    description: "Automatic cohort analysis groups members into meaningful segments with targeted strategies for each group's unique needs.",
    gradient: "bg-gradient-byzantine"
  },
  {
    icon: BarChart3,
    title: "Engagement Heatmaps",
    description: "Visual activity patterns show when members are most active and which platforms they use most, optimizing your content timing.",
    gradient: "bg-gradient-primary"
  },
  {
    icon: TrendingUp,
    title: "Revenue Attribution",
    description: "Multi-touch attribution tracks which marketing channels drive the highest-value members and best ROI.",
    gradient: "bg-gradient-accent"
  },
  {
    icon: Shield,
    title: "Comparative Benchmarks",
    description: "Anonymous industry data shows how your metrics compare to similar communities, identifying growth opportunities.",
    gradient: "bg-gradient-byzantine"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background-snow">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-midnight sm:text-4xl lg:text-5xl">
            Everything you need to grow your community
          </h2>
          <p className="mt-6 text-lg leading-8 text-midnight-600">
            Powerful analytics tools designed specifically for Whop communities. 
            Make data-driven decisions that drive real growth.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`relative flex flex-col gap-6 p-8 rounded-2xl ${
                  index % 2 === 0 ? 'bg-midnight-100' : 'bg-background-snow'
                } hover:shadow-lg transition-shadow duration-300`}
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.gradient} shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <dt className="text-xl font-semibold leading-7 text-midnight">
                    {feature.title}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-midnight-600">
                    {feature.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-gradient-midnight rounded-3xl p-8 lg:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-2xl font-bold text-text-light sm:text-3xl">
              Trusted by growing communities
            </h3>
            <p className="mt-4 text-lg text-midnight-100">
              Join hundreds of Whop creators who are already using Pulse Analytics
            </p>
          </div>
          
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-text-light">500+</div>
              <div className="text-sm text-midnight-100">Active Communities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-text-light">$2.4M</div>
              <div className="text-sm text-midnight-100">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-text-light">94.2%</div>
              <div className="text-sm text-midnight-100">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-text-light">+40%</div>
              <div className="text-sm text-midnight-100">Avg. Growth Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
