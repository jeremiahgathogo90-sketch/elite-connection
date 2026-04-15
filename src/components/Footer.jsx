import { Link } from 'react-router-dom'
import { Phone, MapPin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white pt-12 pb-6 px-4 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-[#F4D000] font-bold text-lg font-serif mb-3">Elite Connections Ltd</h3>
          <p className="text-green-300 text-sm leading-relaxed">
            Dealers in non-woven bags, fashion bags, gift bags, khaki bags, straws, plastic cups, plates & more.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-green-400">Quick Links</h4>
          <ul className="space-y-2 text-sm text-green-300">
            {['All Products','Gift Bags','Non-woven Bags','Straws','Disposable Cups'].map(l => (
              <li key={l}><Link to="/products" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-green-400">Contact Us</h4>
          <ul className="space-y-2 text-sm text-green-300">
            <li className="flex items-center gap-2"><Phone size={14} /> 0723 041 535 / 0707 579 033</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Nairobi, Kenya</li>
            <li className="flex items-center gap-2"><Mail size={14} /> info@eliteconnections.co.ke</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-green-800 pt-4 text-center text-green-500 text-xs">
        © {new Date().getFullYear()} Elite Connections Limited. All rights reserved.
      </div>
    </footer>
  )
}