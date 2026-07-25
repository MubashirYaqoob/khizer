import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping, Exchange & Return Policy | Khizar Fabric Store",
  description: "Read Khizar Fabric Store's full shipping, exchange, and return policy. Fast nationwide delivery, hassle-free exchanges within 7 days.",
};

const navItems = [
  { id: "shipping", label: "Shipping" },
  { id: "exchange", label: "Exchange" },
  { id: "returns", label: "Returns" },
  { id: "contact", label: "Contact" },
];

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen font-jost text-primary">

      {/* ── Page Hero ── */}
      <div className="bg-[#0e0c09] py-20 md:py-28 relative overflow-hidden">
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #B8962E 0px, #B8962E 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #B8962E 0px, #B8962E 1px, transparent 1px, transparent 60px)" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-[#B8962E] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
            Policies & Guidelines
          </span>
          <h1 className="font-garamond text-white text-4xl md:text-6xl mb-6">
            Shipping, Exchange & Returns
          </h1>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#B8962E] to-transparent mx-auto mb-6" />
          <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            We want every order to reach you perfectly. Read our policies below to understand delivery timelines, exchange conditions, and how to get in touch.
          </p>
        </div>
      </div>

      {/* ── Sticky Sidebar Layout ── */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row gap-12">

        {/* Sidebar nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="sticky top-32 space-y-1">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#B8962E] mb-4">Policy Sections</p>
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded text-sm text-on-surface-variant hover:text-[#B8962E] hover:bg-[#B8962E]/5 transition-colors duration-200 group"
              >
                <span className="w-1 h-1 rounded-full bg-[#B8962E] opacity-0 group-hover:opacity-100 transition-opacity" />
                {n.label}
              </a>
            ))}
            <div className="pt-6 mt-6 border-t border-outline/10">
              <p className="text-[10px] text-on-surface-variant/60 leading-relaxed">
                Last updated: July 2025
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* ─── Shipping ─── */}
          <section id="shipping" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#B8962E]/10 rounded-full flex items-center justify-center text-[#B8962E] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <h2 className="font-garamond text-3xl">Shipping Policy</h2>
                <p className="text-on-surface-variant text-sm mt-0.5">Nationwide delivery across Pakistan</p>
              </div>
            </div>

            <p className="text-on-surface-variant mb-6 leading-relaxed">
              We process and dispatch all orders within <strong className="text-primary font-semibold">1–3 working days</strong> after order confirmation. Delivery timelines depend on your location:
            </p>

            {/* Delivery table – styled */}
            <div className="overflow-x-auto mb-8 rounded-lg border border-outline/15 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#0e0c09] text-white">
                    <th className="px-5 py-3.5 font-medium tracking-wide">Location</th>
                    <th className="px-5 py-3.5 font-medium tracking-wide">Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline/10">
                  {[
                    ["Karachi", "1–2 working days"],
                    ["Lahore, Islamabad, Rawalpindi", "2–4 working days"],
                    ["Other Major Cities", "3–6 working days"],
                    ["Remote & Rural Areas", "5–8 working days"],
                  ].map(([loc, time]) => (
                    <tr key={loc} className="hover:bg-[#B8962E]/5 transition-colors">
                      <td className="px-5 py-3.5 text-primary font-medium">{loc}</td>
                      <td className="px-5 py-3.5 text-on-surface-variant">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-on-surface-variant mb-6 leading-relaxed">
              Shipping charges are calculated at checkout. Once dispatched, a <strong className="text-primary font-semibold">tracking number</strong> is shared via WhatsApp or SMS.
            </p>

            {/* Note box */}
            <div className="bg-[#faf7f0] border-l-4 border-[#B8962E] px-6 py-5 rounded-r-lg">
              <p className="text-primary font-semibold text-sm mb-2">Please Note</p>
              <ul className="space-y-1.5 text-sm text-on-surface-variant">
                <li className="flex items-start gap-2"><span className="text-[#B8962E] mt-0.5">•</span>Orders are processed Monday to Saturday only</li>
                <li className="flex items-start gap-2"><span className="text-[#B8962E] mt-0.5">•</span>Delivery times may extend during sale seasons, Eid, or public holidays</li>
                <li className="flex items-start gap-2"><span className="text-[#B8962E] mt-0.5">•</span>Khizar Fabric Store is not responsible for delays caused by courier partners</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-outline/20 to-transparent" />

          {/* ─── Exchange ─── */}
          <section id="exchange" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#B8962E]/10 rounded-full flex items-center justify-center text-[#B8962E] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <div>
                <h2 className="font-garamond text-3xl">Exchange Policy</h2>
                <p className="text-on-surface-variant text-sm mt-0.5">Exchange within 7 days of delivery</p>
              </div>
            </div>

            <p className="text-on-surface-variant mb-8 leading-relaxed">
              We want you to love what you receive. If for any reason you're not satisfied, we offer an exchange within <strong className="text-primary font-semibold">7 days of delivery</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <p className="font-semibold text-green-900 text-sm">Exchange Allowed If</p>
                </div>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">→</span>Item received is damaged or defective</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">→</span>Wrong item was delivered</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">→</span>Size issue (for stitched suits)</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <p className="font-semibold text-red-900 text-sm">Exchange NOT Allowed If</p>
                </div>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>Item has been worn, washed, or altered</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>Tags have been removed</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>More than 7 days have passed since delivery</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>Item was purchased on sale</li>
                </ul>
              </div>
            </div>

            <p className="font-semibold text-primary mb-3 text-sm">How to Exchange:</p>
            <ol className="space-y-3 mb-6">
              {[
                "Contact us within 7 days of delivery via WhatsApp or email",
                "Share your order number and photos of the item",
                "Our team will confirm your exchange request within 24 hours",
                "Ship the item back to us at your cost — we cover the return delivery",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4 text-sm text-on-surface-variant">
                  <span className="w-6 h-6 rounded-full bg-[#B8962E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="bg-[#faf7f0] border border-[#B8962E]/20 rounded-lg px-6 py-4 text-sm text-on-surface-variant">
              <strong className="text-primary font-semibold">Shipping Cost:</strong> The customer pays delivery charges for returning the item. Khizar Fabric Store covers shipping on the replacement item sent back to you.
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-outline/20 to-transparent" />

          {/* ─── Returns ─── */}
          <section id="returns" className="scroll-mt-32">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#B8962E]/10 rounded-full flex items-center justify-center text-[#B8962E] flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </div>
              <div>
                <h2 className="font-garamond text-3xl">Return Policy</h2>
                <p className="text-on-surface-variant text-sm mt-0.5">Returns accepted within 7 days of delivery</p>
              </div>
            </div>

            <p className="text-on-surface-variant mb-8 leading-relaxed">
              We accept returns within <strong className="text-primary font-semibold">7 days of delivery</strong> under the following conditions.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <p className="font-semibold text-green-900 text-sm">Return Allowed If</p>
                </div>
                <ul className="space-y-2 text-sm text-green-900">
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">→</span>Item received is damaged or defective</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">→</span>Wrong item was delivered</li>
                  <li className="flex items-start gap-2"><span className="text-green-600 mt-0.5">→</span>Significantly different from what was shown online</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  <p className="font-semibold text-red-900 text-sm">Return NOT Allowed If</p>
                </div>
                <ul className="space-y-2 text-sm text-red-900">
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>Item has been worn, washed, or altered</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>Tags have been removed</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>More than 7 days since delivery</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>Customized / made-to-measure order</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">→</span>Item purchased during a sale</li>
                </ul>
              </div>
            </div>

            {/* Customized orders warning */}
            <div className="bg-red-50 border-l-4 border-red-400 px-6 py-5 rounded-r-lg mb-8">
              <p className="text-red-900 font-semibold text-sm mb-1">Important — Customized Orders</p>
              <p className="text-red-800 text-sm leading-relaxed">
                Customized suits are made specifically to your measurements and preferences. They are <strong>strictly non-returnable and non-exchangeable</strong> unless there is a manufacturing defect on our part.
              </p>
            </div>

            <p className="font-semibold text-primary mb-3 text-sm">How to Return:</p>
            <ol className="space-y-3 mb-6">
              {[
                "Contact us within 7 days of delivery via WhatsApp or email",
                "Share your order number and clear photos of the issue",
                "Our team will review and confirm your return request within 24–48 hours",
                "Ship the item back to us at your own cost",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-4 text-sm text-on-surface-variant">
                  <span className="w-6 h-6 rounded-full bg-[#B8962E] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="bg-[#faf7f0] border border-[#B8962E]/20 rounded-lg px-6 py-4 text-sm text-on-surface-variant mb-4">
              <strong className="text-primary font-semibold">Shipping Cost:</strong> The customer is responsible for their own delivery charges. Original shipping charges are non-refundable.
            </div>

            <div className="bg-[#faf7f0] border border-[#B8962E]/20 rounded-lg px-6 py-4 text-sm text-on-surface-variant">
              <strong className="text-primary font-semibold">Refund Process:</strong> Once we receive and inspect the returned item, your refund will be processed within <strong>5–7 working days</strong> via original payment method or bank transfer.
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-outline/20 to-transparent" />

          {/* ─── Contact ─── */}
          <section id="contact" className="scroll-mt-32">
            <div className="bg-[#0e0c09] rounded-2xl p-8 md:p-12 text-center">
              <div className="w-12 h-12 bg-[#B8962E]/10 rounded-full flex items-center justify-center text-[#B8962E] mx-auto mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <h3 className="font-garamond text-white text-2xl md:text-3xl mb-3">Need Help?</h3>
              <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto">For any shipping, exchange, or return queries, our team is ready to assist you.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/923493955066"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase rounded hover:bg-[#128C7E] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp: 03172774216 / 03493955066
                </a>
                <a
                  href="mailto:khizarfabricstore@gmail.com"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase rounded hover:border-[#B8962E] hover:text-[#B8962E] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  Email Us
                </a>
              </div>
              <p className="text-white/30 text-xs mt-6">Working Hours: Monday to Saturday, 10:00 AM – 7:00 PM</p>
              <p className="text-white/20 text-xs mt-3">Khizar Fabric Store reserves the right to update this policy. Changes will be reflected on this page.</p>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
