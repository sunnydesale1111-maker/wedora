import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  UserCheck,
  Users,
  Plus,
  Settings,
  Check,
  Shield,
  Eye,
  Lock,
} from 'lucide-react';
import { CustomerProfile, MAX_ADDITIONAL_FAMILY_PROFILES } from '@/types/profile';

interface CustomerProfileDropdownProps {
  profiles: CustomerProfile[];
  activeProfile: CustomerProfile | null;
  onSelectProfile: (profileId: string) => void;
  onAddFamilyMember: () => void;
  onManageProfiles: () => void;
  canManageProfiles: boolean;
}

export function CustomerProfileDropdown({
  profiles,
  activeProfile,
  onSelectProfile,
  onAddFamilyMember,
  onManageProfiles,
  canManageProfiles,
}: CustomerProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Profiles breakdown
  const primaryProfile = profiles.find((p) => p.role === 'PRIMARY') || profiles[0];
  const familyProfiles = profiles.filter((p) => p.role === 'FAMILY_MEMBER');
  const familyCount = familyProfiles.length;
  const isLimitReached = familyCount >= MAX_ADDITIONAL_FAMILY_PROFILES;
  const isFamilyMember = activeProfile?.role === 'FAMILY_MEMBER';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Existing Customer Profile Control with Dropdown Arrow */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-90 transition cursor-pointer select-none group"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Account & Family Profiles"
      >
        <div
          className={`flex size-8 items-center justify-center rounded-full font-display font-semibold text-sm transition shadow-2xs ${
            isFamilyMember
              ? 'bg-plum text-gold border border-gold/40'
              : 'bg-gold-soft text-plum border border-gold/40'
          }`}
        >
          {activeProfile?.name ? activeProfile.name[0]?.toUpperCase() : 'U'}
        </div>

        <div className="hidden md:flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-navy leading-none">
              {activeProfile?.name || 'Customer Account'}
            </span>
            <ChevronDown
              className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-plum' : 'group-hover:text-plum'
              }`}
            />
          </div>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            {isFamilyMember ? 'Family Member (View Only)' : 'Primary Account Holder'}
          </span>
        </div>

        {/* Mobile-only Chevron */}
        <ChevronDown
          className={`size-3.5 text-muted-foreground md:hidden transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-plum' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl border border-gold/40 bg-card p-2 shadow-float z-50 animate-in fade-in zoom-in-95">
          {/* Active Profile Status Header */}
          <div className="p-3 bg-muted/40 rounded-xl mb-2 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                Current Active Profile
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isFamilyMember
                    ? 'bg-plum/10 text-plum border border-plum/20'
                    : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                }`}
              >
                {isFamilyMember ? 'View Only' : 'Full Access'}
              </span>
            </div>
            <p className="text-xs font-semibold text-navy mt-1 truncate">
              {activeProfile?.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {activeProfile?.email} • {activeProfile?.relationship || (isFamilyMember ? 'Family Member' : 'Primary Account')}
            </p>
          </div>

          {/* Switch Profile Section */}
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Switch Profile ({profiles.length}/6)
            </span>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto py-1">
            {/* Primary Profile */}
            {primaryProfile && (
              <button
                type="button"
                onClick={() => {
                  onSelectProfile(primaryProfile.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer text-left ${
                  activeProfile?.id === primaryProfile.id
                    ? 'bg-gold-soft/50 text-navy font-semibold border border-gold/30'
                    : 'hover:bg-muted/60 text-navy'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="size-7 rounded-full bg-gold-soft text-plum font-semibold text-xs flex items-center justify-center shrink-0 border border-gold/40">
                    {primaryProfile.name[0]?.toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="truncate text-xs font-medium text-navy">
                      {primaryProfile.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Primary Account Holder
                    </p>
                  </div>
                </div>
                {activeProfile?.id === primaryProfile.id && (
                  <Check className="size-4 text-emerald-600 shrink-0 ml-2" />
                )}
              </button>
            )}

            {/* Family Members */}
            {familyProfiles.map((p) => {
              const isActive = activeProfile?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProfile(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-gold-soft/50 text-navy font-semibold border border-gold/30'
                      : 'hover:bg-muted/60 text-navy'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="size-7 rounded-full bg-plum/10 text-plum font-semibold text-xs flex items-center justify-center shrink-0 border border-plum/20">
                      {p.name[0]?.toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="truncate text-xs font-medium text-navy">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {p.relationship || 'Family Member'} • View Only
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <Check className="size-4 text-emerald-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Management Actions (Only available to Primary Account Holder) */}
          <div className="mt-2 pt-2 border-t border-border/60 space-y-1">
            {canManageProfiles ? (
              <>
                <button
                  type="button"
                  disabled={isLimitReached}
                  onClick={() => {
                    setIsOpen(false);
                    onAddFamilyMember();
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isLimitReached
                      ? 'text-muted-foreground/60 cursor-not-allowed bg-muted/20'
                      : 'text-plum hover:bg-gold-soft/50 font-semibold'
                  }`}
                  title={isLimitReached ? 'Maximum of 5 additional family profiles reached' : 'Add a family member'}
                >
                  <Plus className="size-3.5 text-gold shrink-0" />
                  <span>
                    Add Family Member {isLimitReached ? '(Max 5 Reached)' : `(${familyCount}/5)`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onManageProfiles();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-navy hover:bg-muted/60 transition cursor-pointer"
                >
                  <Users className="size-3.5 text-navy/70 shrink-0" />
                  <span>Manage Family Members</span>
                </button>
              </>
            ) : (
              <div className="px-3 py-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Lock className="size-3 text-muted-foreground" />
                <span>Family profile settings managed by Primary Account</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
