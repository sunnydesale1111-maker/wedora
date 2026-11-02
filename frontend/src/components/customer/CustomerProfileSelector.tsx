import { useState } from 'react';
import {
  Users,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Eye,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mandala } from '@/components/brand';
import { CustomerProfile, MAX_ADDITIONAL_FAMILY_PROFILES } from '@/types/profile';

interface CustomerProfileSelectorProps {
  profiles: CustomerProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onOpenManageModal: () => void;
  primaryProfile: CustomerProfile;
}

const AVATAR_STYLES: Record<string, { bg: string; ring: string }> = {
  'avatar-1': { bg: 'bg-plum text-gold', ring: 'ring-plum/40' },
  'avatar-2': { bg: 'bg-gold-soft text-navy border border-gold/40', ring: 'ring-gold/50' },
  'avatar-3': { bg: 'bg-emerald-100 text-emerald-900 border border-emerald-300', ring: 'ring-emerald-400' },
  'avatar-4': { bg: 'bg-rose-100 text-rose-900 border border-rose-300', ring: 'ring-rose-400' },
  'avatar-5': { bg: 'bg-navy text-primary-foreground', ring: 'ring-navy/50' },
  'avatar-6': { bg: 'bg-amber-100 text-amber-900 border border-amber-300', ring: 'ring-amber-400' },
};

export function CustomerProfileSelector({
  profiles,
  activeProfileId,
  onSelectProfile,
  onOpenManageModal,
  primaryProfile,
}: CustomerProfileSelectorProps) {
  const familyCount = profiles.filter((p) => p.role === 'FAMILY_MEMBER').length;
  const isLimitReached = familyCount >= MAX_ADDITIONAL_FAMILY_PROFILES;

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center p-6 text-center animate-rise">
      <Mandala className="absolute -top-16 -right-16 size-80 text-gold/15 pointer-events-none" />
      <Mandala className="absolute -bottom-16 -left-16 size-80 text-plum/10 pointer-events-none" />

      {/* Main Heading */}
      <div className="relative z-10 max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
          Wedora Shared Celebrations
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold text-plum">
          Who's Planning Today?
        </h1>
        <p className="text-sm text-muted-foreground">
          Select a profile to access your wedding celebration, vendor shortlists, and coordinated milestones.
        </p>
      </div>

      {/* Netflix-Style Profile Grid */}
      <div className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-4xl mx-auto">
        {profiles.map((profile) => {
          const isSelected = activeProfileId === profile.id;
          const isPrimary = profile.role === 'PRIMARY';
          const avatarConfig = AVATAR_STYLES[profile.avatar] || AVATAR_STYLES['avatar-1'];

          return (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile.id)}
              className={`group flex flex-col items-center rounded-3xl p-4 sm:p-5 transition-all duration-300 focus:outline-none cursor-pointer ${
                isSelected
                  ? 'bg-gold-soft/40 ring-2 ring-gold scale-105 shadow-float'
                  : 'hover:bg-card/80 hover:scale-105 hover:shadow-soft'
              }`}
              style={{ width: '150px' }}
            >
              {/* Profile Avatar Card */}
              <div
                className={`relative flex size-24 sm:size-28 items-center justify-center rounded-3xl font-display text-3xl sm:text-4xl font-bold shadow-md transition-transform duration-300 group-hover:shadow-lg ${avatarConfig.bg} ${
                  isSelected ? 'ring-4 ring-gold' : 'border border-gold/30'
                }`}
              >
                {profile.name[0]?.toUpperCase()}

                {isPrimary && (
                  <span
                    className="absolute -top-2 -right-2 rounded-full bg-gold px-2 py-0.5 text-[9px] font-black text-navy uppercase tracking-wider shadow-xs border border-white/40"
                    title="Primary Account Holder"
                  >
                    Primary
                  </span>
                )}
              </div>

              {/* Profile Name */}
              <span className="mt-3.5 block font-display font-semibold text-sm sm:text-base text-navy group-hover:text-plum line-clamp-1">
                {profile.name}
              </span>

              {/* Role / Relationship Tag */}
              <span
                className={`mt-1 block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                  isPrimary
                    ? 'text-plum bg-gold/20 font-semibold'
                    : 'text-muted-foreground bg-secondary'
                }`}
              >
                {isPrimary ? 'Primary Account' : profile.relationship}
              </span>

              {/* Permission Indicator */}
              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                {isPrimary ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="size-3 text-emerald-600" /> Full Access
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Eye className="size-3 text-gold" /> View Only
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Add Profile Tile (For Primary Account Holder) */}
        {!isLimitReached ? (
          <button
            onClick={onOpenManageModal}
            className="group flex flex-col items-center rounded-3xl p-4 sm:p-5 transition-all duration-300 hover:bg-card/80 hover:scale-105 hover:shadow-soft focus:outline-none cursor-pointer"
            style={{ width: '150px' }}
          >
            <div className="flex size-24 sm:size-28 items-center justify-center rounded-3xl border-2 border-dashed border-gold/60 bg-gold-soft/20 text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold-soft/40 shadow-xs">
              <Plus className="size-10 transition-transform duration-300 group-hover:scale-110" />
            </div>

            <span className="mt-3.5 block font-display font-semibold text-sm sm:text-base text-plum group-hover:text-gold">
              Add Profile
            </span>
            <span className="mt-1 block text-[11px] text-muted-foreground">
              {familyCount} / {MAX_ADDITIONAL_FAMILY_PROFILES} Family
            </span>
          </button>
        ) : (
          <div
            className="flex flex-col items-center rounded-3xl p-4 sm:p-5 opacity-60 cursor-not-allowed"
            style={{ width: '150px' }}
            title="Maximum of 5 additional family profiles reached."
          >
            <div className="flex size-24 sm:size-28 items-center justify-center rounded-3xl border-2 border-dashed border-muted bg-secondary text-muted-foreground">
              <Lock className="size-8" />
            </div>
            <span className="mt-3.5 block font-display font-semibold text-xs text-muted-foreground">
              Limit Reached
            </span>
            <span className="mt-1 block text-[10px] text-amber-700 font-semibold">
              Max 5 Family Members
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-4">
        <Button
          onClick={onOpenManageModal}
          variant="outline"
          className="rounded-full border-gold/60 text-plum hover:bg-gold-soft px-6 text-xs font-semibold gap-2 shadow-2xs"
        >
          <Settings className="size-3.5 text-gold" />
          <span>Manage Family Profiles</span>
        </Button>
      </div>
    </div>
  );
}

