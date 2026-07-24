export default function ContactPage() {
  return (
    <div className="bg-cream min-h-screen py-16 md:py-24 font-montserrat text-primary">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <span className="text-label-caps text-gold mb-4 block tracking-[0.2em]">Get in Touch</span>
          <h1 className="text-display-lg-mobile md:text-display-lg font-garamond mb-6">Contact Us</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto"></div>
        </div>

        <div className="bg-white p-8 md:p-12 border border-outline/10 shadow-sm max-w-2xl mx-auto text-center space-y-10">
          
          <div>
            <h2 className="text-2xl font-garamond mb-4">Customer Support</h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Have questions about an order, custom measurements, or shipping? Reach out to our team directly. We're here to help.
            </p>
            <div className="flex flex-col gap-4 text-lg">
              <a href="https://wa.me/923172774216" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 hover:text-gold transition-colors">
                <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.013 2c-5.514 0-10 4.486-10 10 0 1.956.556 3.79 1.541 5.346L2 22l4.802-1.493A9.957 9.957 0 0012.013 22c5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.174a8.136 8.136 0 01-4.148-1.129l-.297-.176-3.084.958.975-3.003-.194-.308A8.138 8.138 0 013.826 12c0-4.512 3.673-8.185 8.187-8.185 4.513 0 8.186 3.673 8.186 8.185s-3.673 8.174-8.186 8.174zm4.5-6.143c-.247-.123-1.46-.723-1.687-.806-.226-.083-.39-.123-.555.124-.164.246-.637.805-.78 9.69-.143-.114-.306-.328-1.29-.718-2.584-1.185-4.244-3.414-4.373-3.585-.129-.172-1.045-1.391-1.045-2.656s.655-1.892.883-2.138c.228-.246.495-.308.66-.308.164 0 .329 0 .472.008.15.008.348-.056.531.39.186.452.639 1.564.697 1.687.058.124.098.267.016.432-.083.164-.124.267-.247.41-.123.144-.261.314-.37.426-.123.123-.252.261-.11.508.143.246.638 1.054 1.368 1.706.942.84 1.737 1.101 1.984 1.224.247.124.39.103.535-.062.143-.164.616-.718.78-9.64.164-.246.327-.205.555-.124.228.082 1.442.718 1.69 8.42.247.123.41.185.472.287.062.103.062.616-.185 1.11z" clipRule="evenodd" />
                </svg>
                WhatsApp: 03172774216
              </a>
              <a href="mailto:khizarfabricstore@gmail.com" className="flex items-center justify-center gap-3 hover:text-gold transition-colors">
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email: khizarfabricstore@gmail.com
              </a>
            </div>
            <p className="mt-6 text-sm text-text-muted">Working Hours: Monday to Saturday, 10:00 AM – 7:00 PM</p>
          </div>

          <div className="pt-10 border-t border-outline/10">
            <h2 className="text-xl font-garamond mb-6">Follow Us</h2>
            <div className="flex justify-center gap-6">
              <a href="https://www.instagram.com/khizerfabricstore2266/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center border border-outline/30 rounded-full hover:bg-gold hover:text-white hover:border-gold transition-all text-primary" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.facebook.com/p/khizarfabric-2266-61584450820684/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center border border-outline/30 rounded-full hover:bg-gold hover:text-white hover:border-gold transition-all text-primary" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@khizarfabric2266?_r=1&_t=ZS-98FAIWlQhFc" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center border border-outline/30 rounded-full hover:bg-gold hover:text-white hover:border-gold transition-all text-primary" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
