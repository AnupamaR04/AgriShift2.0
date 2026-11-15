import React, { useState } from 'react';
import { Layers, Plus, Trash2, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card, { CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export function CropRotationPage() {
  const { profile } = useAuth();

  const [rotationSteps, setRotationSteps] = useState([
    { season: 'Season 1 (Virippu / SW Monsoon)', crop: profile?.current_crop || 'Paddy (Uma)', category: 'Grain', purpose: 'Primary food grain cultivation during peak monsoon rainfall' },
    { season: 'Season 2 (Mundakan / NE Monsoon)', crop: 'Mundakan Paddy / Vegetables', category: 'Grain / Vegetable', purpose: 'Winter paddy crop utilizing residual irrigation' },
    { season: 'Season 3 (Puncha / Summer)', crop: 'Cowpea (പയർ) / Sesame', category: 'Legume', purpose: 'Nitrogen fixation, weed suppression, and soil health restoration' },
  ]);

  const [newSeason, setNewSeason] = useState('');
  const [newCrop, setNewCrop] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleAddStep = (e) => {
    e.preventDefault();
    if (!newSeason || !newCrop) return;
    setRotationSteps([
      ...rotationSteps,
      {
        season: newSeason,
        crop: newCrop,
        category: 'Custom Crop',
        purpose: newPurpose || 'Seasonal rotation',
      },
    ]);
    setNewSeason('');
    setNewCrop('');
    setNewPurpose('');
    setIsSaved(false);
  };

  const handleRemoveStep = (index) => {
    setRotationSteps(rotationSteps.filter((_, idx) => idx !== index));
    setIsSaved(false);
  };

  const handleSavePlan = () => {
    localStorage.setItem('agrishift_rotation_plan', JSON.stringify(rotationSteps));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-agri-sand">
        <div>
          <Badge variant="forest" size="md" className="mb-2">
            Soil Fertility Preservation
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-agri-forest">
            Kerala Crop Rotation &amp; Multi-Tier Planner
          </h1>
          <p className="text-sm text-agri-forest/70 mt-1">
            Build sustainable, nitrogen-fixing rotation sequences for your {profile?.farm_size || 1} {profile?.farm_size_unit || 'acre'} parcel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Rotation Plan Saved
            </span>
          )}
          <Button variant="primary" size="md" onClick={handleSavePlan} className="shadow-soft">
            Save Rotation Plan
          </Button>
        </div>
      </div>

      {/* Rotation Visual Steps */}
      <Card className="p-6">
        <CardHeader
          title="Active Crop Rotation Sequence"
          subtitle="Chronological sequence of crops designed to prevent soil pathogen accumulation"
          icon={Layers}
        />

        <div className="space-y-4">
          {rotationSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-agri-cream border border-agri-sand flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-agri-forest text-agri-mist flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-xs font-semibold text-agri-leaf uppercase tracking-wider">
                    {step.season}
                  </div>
                  <h4 className="font-display font-bold text-base text-agri-forest mt-0.5">
                    {step.crop}
                  </h4>
                  <p className="text-xs text-agri-forest/70 mt-1">{step.purpose}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleRemoveStep(idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove step"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Custom Rotation Step Form */}
      <Card className="p-6">
        <CardHeader
          title="Add Seasonal Crop Phase"
          subtitle="Expand your rotation calendar"
          icon={Plus}
        />

        <form onSubmit={handleAddStep} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-agri-forest uppercase mb-1">
              Season / Timeframe *
            </label>
            <input
              type="text"
              required
              value={newSeason}
              onChange={(e) => setNewSeason(e.target.value)}
              placeholder="e.g. Summer Puncha (March - May)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-agri-sand bg-agri-cream/40 text-xs text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
            />
          </div>

          <div>
            <label className="block font-bold text-agri-forest uppercase mb-1">
              Crop &amp; Variety *
            </label>
            <input
              type="text"
              required
              value={newCrop}
              onChange={(e) => setNewCrop(e.target.value)}
              placeholder="e.g. Green Manure (Daincha / Sunnhemp)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-agri-sand bg-agri-cream/40 text-xs text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
            />
          </div>

          <div>
            <label className="block font-bold text-agri-forest uppercase mb-1">
              Agronomic Purpose
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newPurpose}
                onChange={(e) => setNewPurpose(e.target.value)}
                placeholder="e.g. Green manure incorporation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-agri-sand bg-agri-cream/40 text-xs text-agri-forest focus:outline-none focus:ring-1 focus:ring-agri-leaf"
              />
              <Button type="submit" variant="primary" size="md" className="shrink-0">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Agronomic Science Explanation */}
      <div className="p-5 rounded-2xl bg-agri-mist/40 border border-agri-leaf/30 flex items-start gap-3.5 text-xs text-agri-forest">
        <BookOpen className="w-5 h-5 text-agri-paddy shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-sm font-display font-bold block">
            Why Crop Rotation is Critical for Kerala Soils:
          </strong>
          <p className="text-agri-forest/80 leading-relaxed">
            Continuous single-crop paddy or rubber exhausts specific soil micronutrients (Zinc, Boron) and promotes fungal pathogens (like Rhizoctonia solani). Incorporating legumes (cowpea, green gram) or green manure crops (daincha) replenishes organic carbon and breaks pest reproductive lifecycles naturally.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CropRotationPage;
