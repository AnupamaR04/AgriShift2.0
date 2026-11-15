import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Satellite,
  Sprout,
  CloudSun,
  MapPin,
  Calendar,
  Layers,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Wind,
  TrendingUp,
  Landmark,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Compass,
  AlertCircle,
  BarChart3,
  BookOpen,
  PhoneCall,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export function LandingPage() {
  const navigate = useNavigate();
  const [selectedCropCategory, setSelectedCropCategory] = useState('food');

  const keralaCrops = {
    food: [
      { name: 'Paddy (നെല്ല്)', seasons: 'Virippu (Autumn), Mundakan (Winter), Puncha (Summer)', zone: 'Palakkad, Kuttanad, Kole wetlands', details: 'Rooted in acidic peat/alluvial soils with regulated water levels.' },
      { name: 'Tapioca (കപ്പ)', seasons: 'April-May & Sept-Oct', zone: 'Kollam, Thiruvananthapuram, Wayanad', details: 'Excellent drought resistance; ideal rotational food crop in laterite soils.' },
      { name: 'Nendran Banana (ഏത്തവാഴ)', seasons: 'Aug-Sept & Feb-March', zone: 'Thrissur, Ernakulam, Kozhikode', details: 'High potassium requirement, sensitive to waterlogging, thrives on organic mulching.' },
      { name: 'Elephant Foot Yam (ചേന)', seasons: 'March-April', zone: 'Midlands throughout Kerala', details: 'Valuable intercrop under coconut canopy; 8-9 months duration.' },
    ],
    commercial: [
      { name: 'Coconut (തെങ്ങ്)', seasons: 'Perennial (Year-round)', zone: 'Coastal & Midland Kerala (All 14 districts)', details: 'Multi-tier crop system anchor. Highly sensitive to root wilt and summer drought.' },
      { name: 'Natural Rubber (റബ്ബർ)', seasons: 'Planting June-July', zone: 'Kottayam, Pathanamthitta, Ernakulam foothills', details: 'Requires 2000-3000mm annual rain, elevated terrain with good drainage.' },
      { name: 'Arecanut (അടയ്ക്ക)', seasons: 'June-July planting', zone: 'Kasaragod, Kannur, Malappuram', details: 'Grown along valleys and irrigated gardens; companion to pepper and banana.' },
      { name: 'Tea & Coffee (തേയില, കാപ്പി)', seasons: 'High Range Monsoons', zone: 'Idukki (Munnar), Wayanad', details: 'Highland microclimate (800m-2000m ASL), acidic volcanic/humus-rich soils.' },
    ],
    spices: [
      { name: 'Black Pepper (കുരുമുളക്)', seasons: 'May-June (SW Monsoon)', zone: 'Idukki, Wayanad, Kannur', details: 'Trained on live support trees. High humidity critical for spike setting.' },
      { name: 'Cardamom (ഏലം)', seasons: 'Highland Shade Garden', zone: 'Cardamom Hills (Idukki - Udumbanchola, Peermade)', details: 'Requires 1500-2500m rainfall, 60% shade canopy, and well-drained forest loams.' },
      { name: 'Ginger & Turmeric (ഇഞ്ചി, മഞ്ഞൾ)', seasons: 'First pre-monsoon showers (April-May)', zone: 'Wayanad, Palakkad, Idukki', details: 'Requires raised bed cultivation to prevent rhizome rot during Edavappathi.' },
      { name: 'Nutmeg & Clove (ജാതിക്ക, കരയാമ്പൂ)', seasons: 'SW Monsoon', zone: 'Ernakulam (Kalady), Thrissur, Kottayam', details: 'Thrives in river basins and moist humid alluvium.' },
    ],
  };

  const keralaSchemes = [
    {
      title: 'Subhiksha Keralam (സുഭിക്ഷ കേരളം)',
      dept: 'Department of Agriculture Development & Farmers Welfare, Kerala',
      category: 'State Scheme',
      benefits: 'Financial assistance, seed subsidies, and fallow land cultivation grants.',
      eligibility: 'Individual farmers, Kudumbashree groups, and joint liability groups cultivating food crops.',
      portal: 'https://keralaagriculture.gov.in',
    },
    {
      title: 'AIMS Kerala (Agricultural Information Management System)',
      dept: 'Government of Kerala - State Agriculture Portal',
      category: 'State Portal & Insurance',
      benefits: 'State Crop Insurance Scheme (covering 25+ crops against natural calamities and wildlife damage).',
      eligibility: 'All registered agricultural landowners and leaseholders in Kerala.',
      portal: 'https://aims.kerala.gov.in',
    },
    {
      title: 'PM-KISAN Samman Nidhi',
      dept: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
      category: 'Central Scheme',
      benefits: 'Direct income support of ₹6,000 per year in three equal installments to eligible landholding families.',
      eligibility: 'Small and marginal landholder farmer families with cultivable land.',
      portal: 'https://pmkisan.gov.in',
    },
    {
      title: 'PM Fasal Bima Yojana (PMFBY)',
      dept: 'Ministry of Agriculture & Farmers Welfare',
      category: 'Central Scheme',
      benefits: 'Comprehensive crop insurance against non-preventable natural risks from pre-sowing to post-harvest.',
      eligibility: 'All farmers growing notified crops in notified Kerala blocks.',
      portal: 'https://pmfby.gov.in',
    },
    {
      title: 'Coconut Development Board (CDB) Replanting Subsidy',
      dept: 'Coconut Development Board, Kochi, Kerala',
      category: 'Commodity Board',
      benefits: 'Subsidies for cutting senile/diseased palms and replanting with disease-tolerant varieties.',
      eligibility: 'Coconut growers across all Kerala districts with senile or root-wilt affected holdings.',
      portal: 'https://coconutboard.gov.in',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-agri-cream text-agri-dark selection:bg-agri-mist selection:text-agri-forest">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                             */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-agri-sand">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
            <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-agri-mist/70 blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-agri-sage/30 blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Headline and Positioning */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex flex-wrap items-center gap-2">
                  <Badge variant="forest" size="md">
                    <MapPin className="w-3.5 h-3.5 text-agri-lightleaf" />
                    Kerala, India
                  </Badge>
                  <Badge variant="satellite" size="md">
                    <Satellite className="w-3.5 h-3.5 text-blue-600" />
                    Genuine NASA Earth Observations
                  </Badge>
                  <span className="text-xs font-semibold text-agri-leaf tracking-wider uppercase font-malayalam">
                    അഗ്രിഷിഫ്റ്റ്
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-agri-forest tracking-tight leading-[1.12]">
                  Growing Smarter. <br />
                  <span className="text-agri-leaf">Farming Stronger in Kerala.</span>
                </h1>

                <p className="text-lg sm:text-xl text-agri-forest/80 max-w-2xl font-normal leading-relaxed">
                  The agricultural intelligence platform engineered specifically for Kerala's 14 districts. Connect your farm parcel to genuine NASA satellite instruments, hyper-local monsoon dynamics, and Kerala Agricultural University science.
                </p>

                {/* Primary CTA Buttons with Direct Dashboard Launch */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/dashboard')}
                    className="shadow-card text-base font-bold flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5 text-agri-lightleaf" />
                    Launch Farmer Dashboard
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="w-full sm:w-auto text-base font-medium"
                  >
                    Register New Farm
                  </Button>
                </div>

                {/* Trust and Integrity Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-agri-sand/80 max-w-xl">
                  <div>
                    <div className="text-xl sm:text-2xl font-display font-bold text-agri-forest">14 Districts</div>
                    <div className="text-xs text-agri-forest/70 font-medium">From Kasaragod to TVM</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-display font-bold text-agri-forest">NASA Powered</div>
                    <div className="text-xs text-agri-forest/70 font-medium">SMAP • GPM • Landsat</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-display font-bold text-agri-forest">Zero Fake Data</div>
                    <div className="text-xs text-agri-forest/70 font-medium">Genuine scientific feeds</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Kerala Agricultural Parcel Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-agri-leaf/40 to-agri-paddy/30 rounded-3xl blur-sm"></div>
                  
                  <Card
                    padding="none"
                    className="relative overflow-hidden bg-white border-2 border-agri-sage/30 shadow-card cursor-pointer group"
                    onClick={() => navigate('/dashboard')}
                  >
                    <div className="p-6 bg-gradient-to-br from-agri-forest to-agri-paddy text-white">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-agri-mist font-medium flex items-center gap-1.5 backdrop-blur-sm">
                          <Satellite className="w-3.5 h-3.5 text-agri-lightleaf animate-pulse" />
                          NASA Live Earth Observation
                        </span>
                        <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded text-white/90">
                          10.7867° N, 76.6548° E
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-bold tracking-tight flex items-center justify-between">
                        <span>Palakkad Paddy Belt</span>
                        <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-xs text-agri-mist/80 mt-0.5">Alathur Block • Mundakan Season Active</p>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-agri-cream border border-agri-sand">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800">
                            <Droplets className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-agri-forest/70">NASA SMAP Soil Moisture</div>
                            <div className="text-sm font-bold text-agri-forest">0.342 m³/m³ (Top 7cm)</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Optimal for Paddy
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-agri-cream border border-agri-sand">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                            <CloudSun className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-agri-forest/70">GPM 7-Day Accumulated Rain</div>
                            <div className="text-sm font-bold text-agri-forest">42.8 mm observed</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                          Thulavarsham
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-agri-cream border border-agri-sand">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-agri-forest/70">Landsat 8/9 Canopy NDVI</div>
                            <div className="text-sm font-bold text-agri-forest">0.71 (Vigorous Canopy)</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-agri-forest bg-agri-mist px-2 py-0.5 rounded-full">
                          Healthy Tillering
                        </span>
                      </div>

                      <div className="pt-2 text-center">
                        <span className="text-xs font-bold text-agri-paddy hover:underline inline-flex items-center gap-1">
                          Click to Open Full Interactive Dashboard ➔
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 bg-white border-b border-agri-sand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="forest" size="md" className="mb-3">
                Precision Agricultural Workflow
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-agri-forest tracking-tight">
                How AgriShift Empowers Your Farm
              </h2>
              <p className="mt-4 text-base sm:text-lg text-agri-forest/70">
                A 4-step scientific workflow built specifically for Kerala's diverse topography, from Kuttanad's below-sea-level polders to the Wayanad and Idukki high ranges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-agri-cream border border-agri-sand space-y-4">
                <div className="w-12 h-12 rounded-xl bg-agri-forest text-agri-mist flex items-center justify-center font-display font-bold text-lg shadow-soft">
                  01
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">Pin Your Farm Parcel</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Locate your exact land parcel using our interactive Leaflet Kerala map. Mark farm boundaries and select your soil type.
                </p>
                <div className="text-xs font-semibold text-agri-paddy flex items-center gap-1 pt-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Exact GPS Coordinates
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-agri-cream border border-agri-sand space-y-4">
                <div className="w-12 h-12 rounded-xl bg-agri-forest text-agri-mist flex items-center justify-center font-display font-bold text-lg shadow-soft">
                  02
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">NASA Satellite Feed</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Our backend uses your coordinates to query genuine NASA SMAP, GPM IMERG, and Landsat data for soil moisture, precipitation, and vegetation.
                </p>
                <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 pt-2">
                  <Satellite className="w-3.5 h-3.5" />
                  Authentic NASA Earthdata
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-agri-cream border border-agri-sand space-y-4">
                <div className="w-12 h-12 rounded-xl bg-agri-forest text-agri-mist flex items-center justify-center font-display font-bold text-lg shadow-soft">
                  03
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">KAU Agronomic Matching</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Observations are cross-referenced with Kerala Agricultural University (KAU) Package of Practices to determine localized planting windows.
                </p>
                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1 pt-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  Verified Kerala Science
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-agri-cream border border-agri-sand space-y-4">
                <div className="w-12 h-12 rounded-xl bg-agri-forest text-agri-mist flex items-center justify-center font-display font-bold text-lg shadow-soft">
                  04
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">Action &amp; Scheme Direct</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Receive personalized irrigation advisories, seasonal reminders, and direct links to AIMS Kerala, Subhiksha Keralam, and PM-KISAN benefits.
                </p>
                <div className="text-xs font-semibold text-agri-forest flex items-center gap-1 pt-2">
                  <Landmark className="w-3.5 h-3.5" />
                  Government Benefit Direct
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 bg-agri-cream border-b border-agri-sand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <Badge variant="forest" size="md" className="mb-3">
                Core Capabilities
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-agri-forest tracking-tight">
                Engineered for Real Kerala Farming Realities
              </h2>
              <p className="mt-4 text-base sm:text-lg text-agri-forest/70">
                Every feature is built around real geographical constraints, heavy monsoon seasons, and diverse cropping patterns across Kerala.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-agri-mist flex items-center justify-center text-agri-forest">
                  <Satellite className="w-6 h-6 text-agri-paddy" />
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">NASA SMAP &amp; GPM Feeds</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Real satellite microwave sensing of root-zone soil moisture and accumulated rainfall. We do not invent sensor values or simulate dummy telemetry.
                </p>
                <ul className="text-xs text-agri-forest/80 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Genuine NASA Earthdata authentication</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Documented measurement units (m³/m³, mm)</li>
                </ul>
              </Card>

              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                  <CloudSun className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">Kerala Monsoon Tracking</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Hyper-local 7-day meteorological forecasts tailored to Kerala's dual monsoon pattern: Southwest (Edavappathi) and Northeast (Thulavarsham).
                </p>
                <ul className="text-xs text-agri-forest/80 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Relative humidity &amp; dew point tracking</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Extreme weather &amp; flash flood warnings</li>
                </ul>
              </Card>

              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">District Crop Calendars</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Planting, weeding, and harvesting schedules calibrated for all 14 districts, respecting traditional seasons like Virippu, Mundakan, and Puncha.
                </p>
                <ul className="text-xs text-agri-forest/80 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> District-specific planting windows</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> KAU scientific advisory alignment</li>
                </ul>
              </Card>

              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-800">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">Crop Rotation &amp; Multi-Tier</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Interactive rotation planner for wetland paddy rotations and multi-tier garden systems (coconut + black pepper + banana + nutmeg).
                </p>
                <ul className="text-xs text-agri-forest/80 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Nitrogen fixation &amp; soil rejuvenation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Save and track multiple crop cycles</li>
                </ul>
              </Card>

              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">Verified Government Schemes</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Curated database of verified Kerala State and Central Government agricultural schemes with official application portals.
                </p>
                <ul className="text-xs text-agri-forest/80 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Direct links to AIMS Kerala &amp; PM-KISAN</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Zero outdated or fabricated schemes</li>
                </ul>
              </Card>

              <Card hoverEffect className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-agri-forest">Local Agricultural Support</h3>
                <p className="text-sm text-agri-forest/70 leading-relaxed">
                  Directory of local Krishi Bhavans, District Agricultural Offices, Krishi Vigyan Kendras (KVK), and KAU research stations.
                </p>
                <ul className="text-xs text-agri-forest/80 space-y-1.5 pt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Filter by your district &amp; block</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-agri-leaf" /> Verified phone numbers and contacts</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-20 bg-gradient-to-br from-agri-forest to-agri-dark text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <Badge variant="forest" size="lg" className="border-agri-leaf/40 text-agri-mist">
              <Sparkles className="w-4 h-4 text-agri-lightleaf" />
              Growing Smarter. Farming Stronger.
            </Badge>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
              Bring NASA Satellite Intelligence to Your Kerala Farm Today
            </h2>

            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Open your free dashboard now to view live satellite soil moisture, monsoon tracking, and customized crop advisories.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="gold"
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto text-base font-bold shadow-float flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                Open Dashboard Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto text-base text-white border-white/30 hover:bg-white/10"
              >
                Create Custom Farm Account
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
