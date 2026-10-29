import { useState } from 'react';
import { MapPin, Navigation, Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { City } from '@/types/vendor';
import { detectCityFromGeolocation } from '@/utils/locationHelpers';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: City;
  onSelectCity: (city: City) => void;
}

export function CitySelectorModal({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}: CitySelectorModalProps) {
  const [detecting, setDetecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleDetectLocation = async () => {
    setDetecting(true);
    setStatusMsg('Requesting browser location permission...');
    try {
      const result = await detectCityFromGeolocation();
      onSelectCity(result.city);
      setStatusMsg(`Detected location closest to ${result.city}!`);
      setTimeout(() => {
        setStatusMsg('');
        onClose();
      }, 900);
    } catch {
      setStatusMsg('Location permission denied or unavailable. Please choose below:');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float border border-gold/40 relative animate-rise">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground hover:text-foreground transition"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-plum text-gold">
            <MapPin className="size-5" />
          </div>
          <div>
            <h3 className="text-xl font-display text-plum">Select Your City</h3>
            <p className="text-xs text-muted-foreground">
              Initial city detection for vendor discovery
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Wedora operates across Mumbai and Pune. Your current city sets your default vendor discovery view, but event venues remain independently configurable.
        </p>

        {/* GPS Detection Button */}
        <div className="my-5">
          <Button
            variant="soft"
            className="w-full flex items-center justify-center gap-2 py-5 rounded-2xl border-dashed border-gold/60 text-plum hover:bg-gold-soft font-medium"
            onClick={handleDetectLocation}
            disabled={detecting}
          >
            <Navigation className={`size-4 text-gold ${detecting ? 'animate-spin' : ''}`} />
            {detecting ? 'Detecting Nearest City...' : 'Auto-Detect My Current City (GPS)'}
          </Button>
          {statusMsg && (
            <p className="text-center text-xs mt-2 text-gold font-medium animate-pulse">
              {statusMsg}
            </p>
          )}
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">Supported Demo Cities</span>
          </div>
        </div>

        {/* Manual City Options */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => {
              onSelectCity('Pune');
              onClose();
            }}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition ${
              currentCity === 'Pune'
                ? 'border-gold bg-gold-soft/50 ring-2 ring-gold/40'
                : 'hover:border-gold/60 bg-secondary/50'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-display text-lg text-plum">Pune</span>
              {currentCity === 'Pune' && <Check className="size-4 text-gold" />}
            </div>
            <span className="text-xs text-muted-foreground mt-1">50 Demo Vendors</span>
            <span className="text-[11px] text-navy font-medium mt-2 bg-card px-2 py-0.5 rounded-md border border-gold/20">
              Baner, Wakad, Kothrud +9
            </span>
          </button>

          <button
            onClick={() => {
              onSelectCity('Mumbai');
              onClose();
            }}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition ${
              currentCity === 'Mumbai'
                ? 'border-gold bg-gold-soft/50 ring-2 ring-gold/40'
                : 'hover:border-gold/60 bg-secondary/50'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-display text-lg text-plum">Mumbai</span>
              {currentCity === 'Mumbai' && <Check className="size-4 text-gold" />}
            </div>
            <span className="text-xs text-muted-foreground mt-1">50 Demo Vendors</span>
            <span className="text-[11px] text-navy font-medium mt-2 bg-card px-2 py-0.5 rounded-md border border-gold/20">
              Bandra, Powai, Andheri +10
            </span>
          </button>
        </div>

        <div className="mt-6 pt-3 border-t text-[11px] text-muted-foreground text-center">
          <Sparkles className="size-3 text-gold inline mr-1" />
          You can toggle your city anytime using the city indicator in the top navigation bar.
        </div>
      </div>
    </div>
  );
}
