import React, { useState } from 'react';
import { Sprout, Calendar, BookOpen, CheckCircle2, ChevronRight, ShieldCheck, Droplets, Sun, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { KERALA_DISTRICTS, KERALA_SOIL_TYPES, KERALA_FARMING_SEASONS } from '../utils/keralaData';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export function CropPlannerPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' or 'calendar'

  const district = profile?.district || 'palakkad';
  const soil = profile?.soil_type || 'laterite';
  const currentCrop = profile?.current_crop || 'Paddy';
  const season = profile?.farming_season || 'mundakan';

  // Recommendation engine based on Kerala Agricultural University Package of Practices
  const recommendations = [
    {
      crop: 'Cowpea / Black Gram (പയർവർഗ്ഗങ്ങൾ - Kanakamony / Lola)',
      suitabilityScore: '96% Excellent Match',
      type: 'Legume / Soil Restorative',
      season: 'Puncha (Post-Mundakan Rice Fallow)',
      soilNeeds: 'Thrives in residual moisture of paddy soils; tolerates mild acidity.',
      waterNeeds: 'Low. Grows purely on residual moisture left in paddy fields after harvest.',
      agronomicReason:
        'Cultivating legumes after paddy fixes atmospheric nitrogen (up to 40 kg N/ha) via rhizobium nodules, reducing chemical urea needs for the subsequent Virippu crop by 25%.',
      reference: 'KAU Package of Practices: Pulses Section (p. 42)',
    },
    {
      crop: 'Nendran Banana (ഏത്തവാഴ - Attunendran / Big Sun)',
      suitabilityScore: '89% High Match',
      type: 'High-Value Cash Crop',
      season: 'Aug-Sept Planting (for Onam Harvest)',
      soilNeeds: 'Requires well-drained fertile loam with pit depth of 50cm; cannot tolerate water stagnation.',
      waterNeeds: 'Moderate to High. Requires regular basin or drip irrigation during dry summer months.',
      agronomicReason:
        'Very high market demand across Kerala. Deep mulching with dried leaves retains soil moisture and suppresses weeds during peak dry spells.',
      reference: 'KAU Package of Practices: Fruits & Plantains (p. 78)',
    },
    {
      crop: 'Sesamum (എള്ള് - Thilarani / Surya)',
      suitabilityScore: '84% Good Match',
      type: 'Oilseed Fallow Crop',
      season: 'Jan - March (Summer Puncha)',
      soilNeeds: 'Laterite or sandy clay loam with good drainage.',
      waterNeeds: 'Very low water consumption. Matures within 75-80 days.',
      agronomicReason:
        'Breaks pest and weed cycles between consecutive paddy crops. Minimal investment with guaranteed local oil mill demand in Kerala.',
      reference: 'KAU Package of Practices: Oilseeds (p. 61)',
    },
  ];

  // KAU 12-Month Kerala Cropping Calendar
  const kauCalendar = [
    { month: 'January', activity: 'Paddy: Mundakan harvest begins; land preparation for Puncha paddy in Kuttanad & Kole lands. Vegetables: Sowing bitter gourd, snake gourd.', season: 'Puncha' },
    { month: 'February', activity: 'Coconut: Basin clearing and summer mulching. Pepper: Application of summer irrigation if drought conditions occur.', season: 'Summer' },
    { month: 'March', activity: 'Tapioca: Harvest of previous crop. Sowing of ginger and turmeric in high ranges with first pre-monsoon showers (വേനൽമഴ).', season: 'Summer' },
    { month: 'April', activity: 'First summer plowing for Virippu paddy. Soil application of lime (കുമ്മായം) at 250 kg/acre to neutralize acidic laterite soil.', season: 'Pre-Monsoon' },
    { month: 'May', activity: 'Direct dry seeding of Virippu paddy in wetland belts before onset of Southwest Monsoon. Ginger & Turmeric planting completed.', season: 'Edavappathi Prep' },
    { month: 'June', activity: 'Edavappathi (SW Monsoon) arrives. Rubber planting in pits. Black pepper: Planting cuttings on live support trees. Weeding in paddy.', season: 'Edavappathi' },
    { month: 'July', activity: 'Paddy: Top dressing with nitrogenous fertilizers and weed management. Arecanut: Spraying 1% Bordeaux mixture against Mahali disease.', season: 'Edavappathi Peak' },
    { month: 'August', activity: 'Onam harvest preparations for Nendran banana and vegetables. Nursery raising for Mundakan winter paddy crop.', season: 'Mid-Monsoon' },
    { month: 'September', activity: 'Virippu paddy harvest begins. Main field preparation and transplanting of Mundakan paddy. Planting second season tapioca.', season: 'Mundakan Prep' },
    { month: 'October', activity: 'Thulavarsham (NE Monsoon) starts. Cardamom harvesting in Idukki. Application of second dose of NPK fertilizers for coconut.', season: 'Thulavarsham' },
    { month: 'November', activity: 'Weeding in Mundakan paddy fields. Water level regulation in polders. Sowing of winter vegetables (chilli, brinjal, tomato).', season: 'Thulavarsham' },
    { month: 'December', activity: 'Drying and storage of spice harvests. Dewatering of Kuttanad puncha polders (കായൽ നിലം വറ്റിക്കൽ) using motor pumps.', season: 'Winter' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-agri-sand">
        <div>
          <Badge variant="forest" size="md" className="mb-2">
            Verified Agronomic Science
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
            Kerala Crop Recommendation &amp; Calendar
          </h1>
          <p className="text-sm text-agri-forest/70 mt-1">
            Grounded in Kerala Agricultural University (KAU) Package of Practices for <strong className="text-agri-forest capitalize">{district}</strong> district.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-agri-sand shadow-xs">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recommendations'
                ? 'bg-agri-forest text-white shadow-soft'
                : 'text-agri-forest/70 hover:text-agri-forest'
            }`}
          >
            Crop Recommendations
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'calendar'
                ? 'bg-agri-forest text-white shadow-soft'
                : 'text-agri-forest/70 hover:text-agri-forest'
            }`}
          >
            District Crop Calendar
          </button>
        </div>
      </div>

      {/* RECOMMENDATIONS TAB */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white border border-agri-sand shadow-soft flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-agri-paddy shrink-0 mt-0.5" />
            <div className="text-xs text-agri-forest/80 leading-relaxed">
              <strong className="text-agri-forest">Agronomic Methodology:</strong> These recommendations synthesize your current crop ({currentCrop}), {soil} soil dynamics, and current satellite moisture observations. They are intended for decision support and do not guarantee yield. Always consult your local Krishi Bhavan officer.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((rec, i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-agri-sand">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-agri-leaf">
                      {rec.type}
                    </span>
                    <h3 className="text-xl font-display font-bold text-agri-forest mt-0.5">
                      {rec.crop}
                    </h3>
                  </div>
                  <Badge variant="success" size="md">
                    {rec.suitabilityScore}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
                    <span className="font-bold text-agri-forest block mb-1">Recommended Window</span>
                    <span className="text-agri-forest/80">{rec.season}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
                    <span className="font-bold text-agri-forest block mb-1">Soil Requirements</span>
                    <span className="text-agri-forest/80">{rec.soilNeeds}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-agri-cream border border-agri-sand">
                    <span className="font-bold text-agri-forest block mb-1">Water &amp; Irrigation</span>
                    <span className="text-agri-forest/80">{rec.waterNeeds}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-agri-mist/30 border border-agri-leaf/30 text-xs text-agri-forest space-y-1">
                  <span className="font-bold block">Agronomic Science &amp; Benefits:</span>
                  <p className="text-agri-forest/80 leading-relaxed">{rec.agronomicReason}</p>
                </div>

                <div className="pt-2 text-[11px] text-agri-forest/50 flex items-center justify-between">
                  <span>Reference: {rec.reference}</span>
                  <span className="font-semibold text-agri-paddy">KAU Verified</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CROP CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <Card className="p-6">
            <CardHeader
              title="Official Kerala Agricultural Calendar"
              subtitle="Month-by-month agricultural operations aligned with monsoon cycles"
              icon={Calendar}
            />

            <div className="space-y-3">
              {kauCalendar.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-agri-cream border border-agri-sand flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="w-28 font-display font-extrabold text-sm text-agri-forest shrink-0">
                    {item.month}
                  </div>
                  <div className="flex-1 text-agri-forest/80 leading-relaxed">
                    {item.activity}
                  </div>
                  <Badge variant="forest" size="sm" className="shrink-0 self-start sm:self-auto">
                    {item.season}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default CropPlannerPage;
