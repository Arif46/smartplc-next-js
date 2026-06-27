"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "How do I find parts compatible with my motorcycle?",
    a: "Use the 'Shop Your Ride' button in the header to select your bike manufacturer and model. We'll filter products to show only compatible parts.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD), bKash, Nagad, and credit/debit cards.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery within Dhaka takes 1-2 business days. Outside Dhaka, delivery typically takes 3-5 business days.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day return policy for unused items in original packaging. Contact our support team to initiate a return.",
  },
  {
    q: "Are your parts genuine/OEM?",
    a: "We stock both genuine OEM parts and high-quality aftermarket alternatives. Product listings clearly indicate part numbers and compatibility.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes! Orders over ৳2,000 qualify for free shipping within Bangladesh.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships, you'll receive a tracking number via email. You can also check order status in your customer dashboard.",
  },
  {
    q: "Can I use coupon codes?",
    a: "Yes! Enter your coupon code at checkout. Try WELCOME10 for 10% off your first order.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-foreground pr-4">{q}</span>
        {open ? <ChevronUp className="h-5 w-5 shrink-0 text-primary" /> : <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed animate-fade-in-up">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="section-title text-center mb-2">Frequently Asked Questions</h1>
      <p className="section-subtitle text-center mb-10">
        Everything you need to know about shopping at Smart PLC Eco System
      </p>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <FaqItem key={faq.q} {...faq} />
        ))}
      </div>
    </div>
  );
}
