import React, { useState } from 'react';
import { PhoneCall, MapPin, Building, Globe, ExternalLink, ShieldCheck, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KERALA_DISTRICTS } from '../utils/keralaData';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export function SupportPage() {
  const { profile } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState(profile?.district || 'palakkad');

  const districtAgriOffices = {
    palakkad: { pao: 'Principal Agricultural Officer, Civil Station, Palakkad', phone: '0491-2505282', email: 'paopalakkad@gmail.com', kvk: 'KVK Mele Pattambi, Palakkad (0466-2212275)' },
    alappuzha: { pao: 'Principal Agricultural Officer, Sanathanapuram, Alappuzha', phone: '0477-2268487', email: 'paoalappuzha@gmail.com', kvk: 'KVK Kayamkulam, CPCRI Campus (0479-2449268)' },
    ernakulam: { pao: 'Principal Agricultural Officer, Civil Station, Kakkanad', phone: '0484-2422262', email: 'paoernakulam@gmail.com', kvk: 'KVK Narakkal, CMFRI Campus (0484-2492450)' },
    idukki: { pao: 'Principal Agricultural Officer, Civil Station, Painavu, Kuyilimala', phone: '0486-2232244', email: 'paoidukki@gmail.com', kvk: 'KVK Santhanpara, Idukki (04868-247551)' },
    kannur: { pao: 'Principal Agricultural Officer, Civil Station, Kannur', phone: '0497-2700547', email: 'paokannur@gmail.com', kvk: 'KVK Panniyur, KAU Campus (04982-277045)' },
    kasaragod: { pao: 'Principal Agricultural Officer, Vidyanagar, Kasaragod', phone: '04994-255140', email: 'paokasaragod@gmail.com', kvk: 'KVK CPCRI Campus, Kasaragod (04994-232993)' },
    kollam: { pao: 'Principal Agricultural Officer, Civil Station, Kollam', phone: '0474-2794354', email: 'paokollam@gmail.com', kvk: 'KVK Sadanandapuram, Kottarakkara (0474-2663599)' },
    kottayam: { pao: 'Principal Agricultural Officer, Collectorate, Kottayam', phone: '0481-2562413', email: 'paokottayam@gmail.com', kvk: 'KVK Kumarakom, RARS Campus (0481-2523120)' },
    kozhikode: { pao: 'Principal Agricultural Officer, Civil Station, Kozhikode', phone: '0495-2371946', email: 'paokozhikode@gmail.com', kvk: 'KVK Peruvannamuzhi, IISR Campus (0496-2244583)' },
    malappuram: { pao: 'Principal Agricultural Officer, Civil Station, Malappuram', phone: '0483-2734914', email: 'paomalappuram@gmail.com', kvk: 'KVK Tavanur, KAU Campus (0494-2686329)' },
    pathanamthitta: { pao: 'Principal Agricultural Officer, Mini Civil Station, Pathanamthitta', phone: '0468-2222590', email: 'paopathanamthitta@gmail.com', kvk: 'KVK CARD, Kolabhagom, Thiruvalla (0469-2662094)' },
    thiruvananthapuram: { pao: 'Principal Agricultural Officer, Vikas Bhavan, Thiruvananthapuram', phone: '0471-2303991', email: 'paotvm@gmail.com', kvk: 'KVK Mitraniketan, Vellanad (0472-2882045)' },
    thrissur: { pao: 'Principal Agricultural Officer, Civil Station, Ayyanthole, Thrissur', phone: '0487-2361241', email: 'paothrissur@gmail.com', kvk: 'KVK Vellanikkara, KAU Main Campus (0487-2438330)' },
    wayanad: { pao: 'Principal Agricultural Officer, Civil Station, Kalpetta, Wayanad', phone: '04936-202271', email: 'paowayanad@gmail.com', kvk: 'KVK Ambalavayal, RARS Campus (04936-260411)' },
  };

  const currentOffice = districtAgriOffices[selectedDistrict] || districtAgriOffices.palakkad;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-agri-sand">
        <Badge variant="kerala" size="md" className="mb-2">
          Grassroots Agricultural Network
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
          Kerala Agricultural Support Directory
        </h1>
        <p className="text-sm text-agri-forest/70 mt-1">
          Verified direct contacts for Krishi Bhavans, District Agricultural Offices, KAU research stations, and helplines.
        </p>
      </div>

      {/* Emergency Helplines Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-agri-sand shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-agri-forest text-agri-mist flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-agri-lightleaf" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-agri-forest/60 uppercase">Kerala Karshaka Helpline</div>
            <div className="text-base font-display font-extrabold text-agri-forest">1800-425-1661</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-agri-sand shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-agri-forest/60 uppercase">National Kisan Call Centre</div>
            <div className="text-base font-display font-extrabold text-agri-forest">1800-180-1551</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-agri-sand shadow-soft flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-agri-forest/60 uppercase">KAU Headquarters</div>
            <div className="text-base font-display font-extrabold text-agri-forest">0487-2438011</div>
          </div>
        </div>
      </div>

      {/* District Selector */}
      <div className="p-6 bg-white rounded-2xl border border-agri-sand shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg text-agri-forest">
              District Agricultural Office (PAO) &amp; KVK
            </h3>
            <p className="text-xs text-agri-forest/70">
              Select any of the 14 Kerala revenue districts to view official agricultural contacts
            </p>
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 rounded-xl border border-agri-sand bg-agri-cream text-xs font-bold text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
          >
            {KERALA_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Office Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-5 rounded-2xl bg-agri-cream border border-agri-sand space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-agri-paddy" />
              <span className="font-bold text-sm text-agri-forest">Principal Agricultural Office</span>
            </div>
            <p className="text-agri-forest/80 leading-relaxed font-medium">{currentOffice.pao}</p>
            <div className="flex items-center gap-2 text-agri-forest font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-agri-leaf" />
              <span>{currentOffice.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-agri-forest">
              <Mail className="w-3.5 h-3.5 text-agri-leaf" />
              <span className="font-mono">{currentOffice.email}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-agri-cream border border-agri-sand space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-agri-paddy" />
              <span className="font-bold text-sm text-agri-forest">Krishi Vigyan Kendra (KVK - ICAR/KAU)</span>
            </div>
            <p className="text-agri-forest/80 leading-relaxed font-medium">{currentOffice.kvk}</p>
            <div className="text-xs text-agri-forest/70 pt-1">
              Provides technical training, high-yielding variety seeds, soil testing verification, and pest clinic diagnosis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
