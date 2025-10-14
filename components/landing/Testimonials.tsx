import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Community Owner",
    company: "Trading Academy",
    content: "Pulse Analytics helped us reduce churn by 40% and increase revenue by 60%. The predictive insights are incredibly accurate and actionable.",
    avatar: "SC",
    rating: 5,
    metrics: {
      label: "Revenue Growth",
      value: "+60%"
    }
  },
  {
    name: "Marcus Rodriguez",
    role: "Content Creator",
    company: "Fitness Community",
    content: "The content performance scoring feature completely transformed how we create content. We now know exactly what resonates with our audience.",
    avatar: "MR",
    rating: 5,
    metrics: {
      label: "Engagement Rate",
      value: "+85%"
    }
  },
  {
    name: "Emily Watson",
    role: "Community Manager",
    company: "Tech Learning Hub",
    content: "The member segmentation insights helped us personalize experiences for different user types. Our retention rate improved dramatically.",
    avatar: "EW",
    rating: 5,
    metrics: {
      label: "Retention Rate",
      value: "+45%"
    }
  },
  {
    name: "David Kim",
    role: "Founder",
    company: "Crypto Education",
    content: "Pulse Analytics gave us the data we needed to make strategic decisions. The revenue attribution feature showed us exactly where to invest our marketing budget.",
    avatar: "DK",
    rating: 5,
    metrics: {
      label: "ROI Improvement",
      value: "+120%"
    }
  }
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Loved by community creators
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            See how Pulse Analytics is helping creators grow their communities 
            and increase revenue with data-driven insights.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`flex flex-col justify-between p-8 rounded-2xl ${
                index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
              } shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-slate-300 mb-4" />
                
                <blockquote className="text-slate-900 mb-6">
                  <p className="text-lg leading-relaxed">"{testimonial.content}"</p>
                </blockquote>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <div className="text-sm text-slate-500">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{testimonial.metrics.value}</div>
                  <div className="text-sm text-slate-600">{testimonial.metrics.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Stories Grid */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-8 lg:p-12">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Real results from real communities
            </h3>
            <p className="mt-4 text-lg text-slate-300">
              See the measurable impact Pulse Analytics has had on community growth
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">40%</div>
              <div className="text-sm text-slate-300">Average Churn Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">+65%</div>
              <div className="text-sm text-slate-300">Content Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">+85%</div>
              <div className="text-sm text-slate-300">Member Retention</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">+120%</div>
              <div className="text-sm text-slate-300">Marketing ROI</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
