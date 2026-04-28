import Link from "next/link";
import { Button } from "@Poneglyph/ui/components/button";
import { Input } from "@Poneglyph/ui/components/input";
import { Textarea } from "@Poneglyph/ui/components/textarea";
import "../../(auth)/auth.css";
import { IconMail, IconPhone, IconMapPin, IconSend } from "@tabler/icons-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background" data-accent="lime">
      {/* Hero Section */}
      <section className="border-b border-[var(--border)] py-20 text-center">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="font-heading font-normal text-[34px] leading-[1.1] tracking-[-0.015em] text-foreground md:text-[42px]">
            Contact <em className="italic" style={{ color: "color-mix(in oklch, var(--primary) 75%, var(--foreground))" }}>Us</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[14.5px] text-muted-foreground">
            Have questions or want to collaborate? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-[var(--radius-xl)] border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.1)]">
              <h2 className="font-heading font-normal text-[28px] leading-tight tracking-tight text-foreground mb-6">
                Send us a Message
              </h2>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label mb-2 block text-[13px] font-medium text-foreground">
                      First Name
                    </label>
                    <Input placeholder="John" className="h-10 rounded-[var(--radius-md)]" />
                  </div>
                  <div>
                    <label className="label mb-2 block text-[13px] font-medium text-foreground">
                      Last Name
                    </label>
                    <Input placeholder="Doe" className="h-10 rounded-[var(--radius-md)]" />
                  </div>
                </div>
                <div>
                  <label className="label mb-2 block text-[13px] font-medium text-foreground">Email</label>
                  <Input type="email" placeholder="john@example.com" className="h-10 rounded-[var(--radius-md)]" />
                </div>
                <div>
                  <label className="label mb-2 block text-[13px] font-medium text-foreground">Subject</label>
                  <Input placeholder="How can we help?" className="h-10 rounded-[var(--radius-md)]" />
                </div>
                <div>
                  <label className="label mb-2 block text-[13px] font-medium text-foreground">Message</label>
                  <Textarea placeholder="Tell us about your inquiry..." className="min-h-[150px] rounded-[var(--radius-md)]" />
                </div>
                <Button type="submit" className="btn w-full gap-2 h-11">
                  <IconSend className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading font-normal text-[28px] leading-tight tracking-tight text-foreground mb-6">
                  Get in Touch
                </h2>
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                  Our team is here to help you with any questions about datasets, volunteer
                  opportunities, or partnerships.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: IconMail,
                    title: "Email Us",
                    details: ["info@poneglyph.org", "support@poneglyph.org"],
                  },
                  {
                    icon: IconPhone,
                    title: "Call Us",
                    details: ["+1 (555) 123-4567", "Mon-Fri 9am-6pm EST"],
                  },
                  {
                    icon: IconMapPin,
                    title: "Visit Us",
                    details: ["123 Data Street", "San Francisco, CA 94102"],
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-normal text-[18px] text-foreground">{item.title}</h3>
                      {item.details.map((detail) => (
                        <p key={detail} className="text-[13px] text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Link */}
              <div className="rounded-[var(--radius-xl)] border border-border bg-muted/30 p-6">
                <h3 className="font-heading font-normal text-[18px] text-foreground mb-2">Frequently Asked Questions</h3>
                <p className="text-[13px] text-muted-foreground mb-4">
                  Find quick answers to common questions in our FAQ section.
                </p>
                <Link href="#">
                  <Button variant="outline" size="sm" className="h-9 text-[13px] font-medium">
                    Visit FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
