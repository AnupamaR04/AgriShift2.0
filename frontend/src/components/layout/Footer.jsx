import React from 'react';
import { Sprout, Phone, Mail, MapPin, ExternalLink, ShieldCheck, Satellite, Heart } from 'lucide-react';

export function Footer() {
  const keralaDistricts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
    'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur',
    'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
    'Kannur', 'Kasaragod'
  ];

  return (
    <footer className="bg-agri-dark text-white border-t border-agri-forest/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri-forest flex items-center justify-center text-agri-mist">
                <Sprout className="w-5 h-5 text-agri-lightleaf" />
              </div>
              <div>
                <span className="text-2xl font-display font-extrabold text-white tracking-tight">AgriShift</span>
                <span className="block text-xs font-semibold text-agri-sage tracking-wide font-malayalam">
                  അഗ്രിഷിഫ്റ്റ് കേരളം
                </span>
              </div>
            </div>
            
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Empowering Kerala's agricultural landowners, smallholders, and plantation owners with genuine NASA satellite observations, hyper-local meteorological forecasts, and verified Kerala Agricultural University science.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-agri-forest text-agri-mist border border-agri-leaf/30 flex items-center gap-1.5">
                <Satellite className="w-3.5 h-3.5 text-agri-lightleaf" />
                NASA Earthdata Integrated
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-agri-forest text-agri-mist border border-agri-leaf/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-agri-lightleaf" />
                KAU Agronomic Standards
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-agri-mist uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#features" className="hover:text-white transition-colors">Features &amp; Capabilities</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How AgriShift Works</a></li>
              <li><a href="#nasa-tech" className="hover:text-white transition-colors">NASA Satellite Products</a></li>
              <li><a href="#kerala-agri" className="hover:text-white transition-colors">Kerala Agro-Climatic Zones</a></li>
              <li><a href="#schemes" className="hover:text-white transition-colors">Government Schemes</a></li>
            </ul>
          </div>

          {/* Kerala Agricultural Support Directory */}
          <div>
            <h4 className="text-sm font-semibold text-agri-mist uppercase tracking-wider mb-4">Official Resources</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a href="https://aims.kerala.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                  AIMS Kerala Portal <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="http://www.kau.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                  Kerala Agricultural University <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://keralaagriculture.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                  Dept of Agriculture, Kerala <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                  PM-KISAN Samman Nidhi <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="https://earthdata.nasa.gov" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1">
                  NASA Earthdata Portal <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Farmer Contact & Helpline */}
          <div>
            <h4 className="text-sm font-semibold text-agri-mist uppercase tracking-wider mb-4">Kerala Farmer Help</h4>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-agri-lightleaf mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-white/50">Kisan Call Centre (Toll-Free)</div>
                  <div className="font-semibold text-white">1800-180-1551</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-agri-lightleaf mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-white/50">Kerala Karshaka Helpline</div>
                  <div className="font-semibold text-white">1800-425-1661</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-agri-lightleaf mt-0.5 shrink-0" />
                <div className="text-xs leading-relaxed text-white/70">
                  Serving all 1,076+ Krishi Bhavans across 14 Kerala districts.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 14 Kerala Districts Footprint */}
        <div className="py-6 border-b border-white/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-agri-sage/80 mb-3">
            Covering all 14 Districts of Kerala:
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/60">
            {keralaDistricts.map((district) => (
              <span key={district} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                {district}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Credits & Integrity Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>
            © {new Date().getFullYear()} AgriShift. Dedicated to Kerala's farming communities. Growing Smarter. Farming Stronger.
          </p>
          <p className="flex items-center gap-1.5 text-agri-sage/80">
            <span>Genuine Satellite &amp; Agro-Climatic Intelligence</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
