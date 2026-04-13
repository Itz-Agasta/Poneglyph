export default function PrivacyPage() {
  const sections = [
    {
      title: "Information we collect",
      content:
        "We collect information you provide directly (name, email, company details) and usage data (pages visited, features used). We do not sell your personal data to third parties.",
    },
    {
      title: "How we use your information",
      content:
        "We use collected data to operate and improve Poneglyph, communicate with you, process payments, and comply with legal obligations. We use industry-standard security practices to protect your data.",
    },
    {
      title: "Data retention",
      content:
        "We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us.",
    },
    {
      title: "Third-party services",
      content:
        "We use trusted third-party services for payments (Stripe), analytics, and infrastructure. These partners are bound by data processing agreements and may not use your data for their own purposes.",
    },
    {
      title: "Your rights",
      content:
        "Depending on your location, you may have rights including access, correction, deletion, and portability of your personal data. Contact us at privacy@poneglyph.io to exercise your rights.",
    },
    {
      title: "Cookies",
      content:
        "We use cookies to maintain your session, remember preferences, and understand how users interact with Poneglyph. You can control cookie settings in your browser.",
    },
    {
      title: "Changes to this policy",
      content:
        "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice.",
    },
  ];

  return (
    <>
      <section className="py-20 border-b border-grey-3">
        <div className="container-max max-w-3xl">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1 mb-4">legal</p>
          <h1 className="text-[clamp(36px,5vw,52px)] font-medium leading-tight tracking-tight text-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-body text-grey-1">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-max max-w-3xl flex flex-col gap-10">
          <p className="text-body text-grey-1 leading-relaxed">
            At Poneglyph, we take your privacy seriously. This policy explains how we collect, use, and protect your personal data when you use our platform and services.
          </p>
          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-3">
              <h2 className="text-lg font-medium text-black">{s.title}</h2>
              <p className="text-body text-grey-1 leading-relaxed">{s.content}</p>
            </div>
          ))}
          <div className="border-t border-grey-3 pt-8">
            <p className="text-sm text-grey-1">
              Questions about this policy? Contact us at{" "}
              <a href="mailto:privacy@poneglyph.io" className="text-black underline">
                privacy@poneglyph.io
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
