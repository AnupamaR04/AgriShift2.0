import React, { useState } from 'react';
import { Landmark, Search, ExternalLink, ShieldCheck, Filter, CheckCircle2, Bookmark, BookmarkCheck } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export function SchemesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [savedSchemes, setSavedSchemes] = useState(() => {
    try {
      const data = localStorage.getItem('agrishift_saved_schemes');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const toggleSave = (id) => {
    let updated;
    if (savedSchemes.includes(id)) {
      updated = savedSchemes.filter((s) => s !== id);
    } else {
      updated = [...savedSchemes, id];
    }
    setSavedSchemes(updated);
    localStorage.setItem('agrishift_saved_schemes', JSON.stringify(updated));
  };

  const schemes = [
    {
      id: 'subhiksha-keralam',
      title: 'Subhiksha Keralam (സുഭിക്ഷ കേരളം പദ്ധതി)',
      dept: 'Department of Agriculture Development and Farmers Welfare, Govt of Kerala',
      category: 'state',
      type: 'State Government Scheme',
      benefits: 'Financial assistance for bringing fallow land under cultivation; 50% subsidy on certified seeds, organic manures, and micro-irrigation systems.',
      eligibility: 'Individual farmers, Kudumbashree JLGs, self-help groups, and agricultural collectives cultivating vegetables, paddy, tubers, and fruits.',
      documents: 'Aadhaar Card, Land Tax Receipt (പോക്കുവരവ് രസീത്), Bank Passbook copy, Registration on AIMS portal.',
      portal: 'https://keralaagriculture.gov.in',
      verifiedDate: 'November 2026',
    },
    {
      id: 'aims-crop-insurance',
      title: 'State Crop Insurance Scheme (സംസ്ഥാന വിള ഇൻഷുറൻസ്)',
      dept: 'AIMS Portal — Agriculture Department, Government of Kerala',
      category: 'state',
      type: 'State Crop Insurance',
      benefits: 'Comprehensive compensation for loss of 25+ notifying crops caused by natural calamities (floods, landslides, drought) and wildlife attacks.',
      eligibility: 'All agricultural landowners and verified tenant farmers cultivating land in Kerala.',
      documents: 'Land possession certificate, Tax receipt, Photo of crop field, Bank account details.',
      portal: 'https://aims.kerala.gov.in',
      verifiedDate: 'November 2026',
    },
    {
      id: 'pm-kisan',
      title: 'PM-KISAN Samman Nidhi (പ്രധാനമന്ത്രി കിസാൻ സമ്മാൻ നിധി)',
      dept: 'Ministry of Agriculture and Farmers Welfare, Government of India',
      category: 'central',
      type: 'Direct Benefit Transfer (DBT)',
      benefits: 'Direct financial assistance of ₹6,000 per year delivered in three four-monthly installments of ₹2,000 directly into the farmer bank account.',
      eligibility: 'All small and marginal landholding farmer families who hold cultivable land in their names.',
      documents: 'Aadhaar Card, Land Title Deed (ആധാരം/പട്ടയം), Active bank account linked with Aadhaar and eKYC completed.',
      portal: 'https://pmkisan.gov.in',
      verifiedDate: 'November 2026',
    },
    {
      id: 'pmfby',
      title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      dept: 'Ministry of Agriculture and Farmers Welfare',
      category: 'central',
      type: 'Comprehensive Crop Insurance',
      benefits: 'Provides an insurance cover against non-preventable natural risks from pre-sowing to post-harvest for notified crops at low uniform farmer premiums (1.5% to 2%).',
      eligibility: 'Farmers growing notified crops (paddy, banana, etc.) in notified Kerala districts.',
      documents: 'Crop sowing certificate from Krishi Bhavan, Land record (ROR), Bank passbook.',
      portal: 'https://pmfby.gov.in',
      verifiedDate: 'November 2026',
    },
    {
      id: 'cdb-replanting',
      title: 'Coconut Palm Removal & Replanting Scheme',
      dept: 'Coconut Development Board (CDB), Kochi, Kerala',
      category: 'board',
      type: 'Commodity Board Subsidy',
      benefits: 'Subsidy of ₹1,000 per palm for cutting diseased/senile palms and financial assistance for replanting with disease-tolerant high-yielding hybrid varieties.',
      eligibility: 'Coconut growers across all 14 districts having senile, unproductive, or root-wilt affected coconut palms.',
      documents: 'Application verified by Agricultural Officer of local Krishi Bhavan, Land possession proof.',
      portal: 'https://coconutboard.gov.in',
      verifiedDate: 'November 2026',
    },
    {
      id: 'soil-health-card',
      title: 'Soil Health Card Scheme (സോയിൽ ഹെൽത്ത് കാർഡ്)',
      dept: 'Department of Soil Survey & Soil Conservation, Kerala',
      category: 'state',
      type: 'Free Soil Testing & Advisory',
      benefits: 'Free laboratory analysis of 12 soil chemical parameters (pH, EC, N, P, K, S, micronutrients) with personalized lime and fertilizer dosage recommendations.',
      eligibility: 'All farmers in Kerala with cultivable land holdings.',
      documents: 'Soil sample collected according to Krishi Bhavan instructions, Farm survey number.',
      portal: 'https://soilhealth.dac.gov.in',
      verifiedDate: 'November 2026',
    },
  ];

  const filtered = schemes.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.benefits.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-agri-sand">
        <Badge variant="forest" size="md" className="mb-2">
          Direct Official Portals
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
          Kerala &amp; Central Government Schemes
        </h1>
        <p className="text-sm text-agri-forest/70 mt-1">
          Verified agricultural subsidies, insurance schemes, and income assistance. No middlemen or unauthorized fees.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-agri-forest/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search schemes, subsidies, insurance..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-agri-sand bg-white text-xs text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === 'all'
                ? 'bg-agri-forest text-white'
                : 'bg-white border border-agri-sand text-agri-forest/70 hover:text-agri-forest'
            }`}
          >
            All Schemes ({schemes.length})
          </button>
          <button
            onClick={() => setCategoryFilter('state')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === 'state'
                ? 'bg-agri-forest text-white'
                : 'bg-white border border-agri-sand text-agri-forest/70 hover:text-agri-forest'
            }`}
          >
            Kerala State Govt
          </button>
          <button
            onClick={() => setCategoryFilter('central')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === 'central'
                ? 'bg-agri-forest text-white'
                : 'bg-white border border-agri-sand text-agri-forest/70 hover:text-agri-forest'
            }`}
          >
            Central Govt (DBT)
          </button>
          <button
            onClick={() => setCategoryFilter('board')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === 'board'
                ? 'bg-agri-forest text-white'
                : 'bg-white border border-agri-sand text-agri-forest/70 hover:text-agri-forest'
            }`}
          >
            Commodity Boards
          </button>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((scheme) => (
          <Card key={scheme.id} className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-agri-mist text-agri-forest">
                  {scheme.type}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSave(scheme.id)}
                  className="p-1 rounded-lg text-agri-forest/50 hover:text-agri-paddy transition-colors"
                  title="Save scheme"
                >
                  {savedSchemes.includes(scheme.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-agri-leaf" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>

              <h3 className="font-display font-bold text-lg text-agri-forest">
                {scheme.title}
              </h3>
              <p className="text-xs text-agri-forest/60 mt-0.5">{scheme.dept}</p>

              <div className="mt-4 space-y-2.5 text-xs">
                <div>
                  <span className="font-bold text-agri-forest">Benefits: </span>
                  <span className="text-agri-forest/80 leading-relaxed">{scheme.benefits}</span>
                </div>
                <div>
                  <span className="font-bold text-agri-forest">Eligibility: </span>
                  <span className="text-agri-forest/80 leading-relaxed">{scheme.eligibility}</span>
                </div>
                <div>
                  <span className="font-bold text-agri-forest">Required Documents: </span>
                  <span className="text-agri-forest/80 leading-relaxed">{scheme.documents}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-agri-sand flex items-center justify-between text-xs">
              <span className="text-[11px] text-agri-forest/50">Verified: {scheme.verifiedDate}</span>
              <a
                href={scheme.portal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-agri-paddy hover:text-agri-forest transition-colors"
              >
                Apply on Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SchemesPage;
