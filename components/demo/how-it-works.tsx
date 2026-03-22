export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Fill Out the Form",
      description:
        "Upload photos for an accurate estimate. The more detail, the faster we can help.",
    },
    {
      number: "2",
      title: "Get a Quote",
      description:
        "Clear pricing before we start. No hidden fees or surprises on the day.",
    },
    {
      number: "3",
      title: "Job Done Right",
      description:
        "We arrive on time, complete the work to a high standard, and clean up after ourselves.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-accent-amber font-semibold text-sm uppercase tracking-wider mb-2">
            How It Works
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-900">
            Simple Process, Quality Results
          </h2>
        </div>

        {/* Steps */}
        <div className="relative mt-12">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading text-2xl font-bold text-navy-800">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-navy-900 mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
