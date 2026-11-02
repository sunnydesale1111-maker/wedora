import { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerProfile, MAX_ADDITIONAL_FAMILY_PROFILES } from '@/types/profile';
import { WeddingEvent } from '@/types/event';

interface ManageFamilyProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: CustomerProfile[];
  primaryProfile: CustomerProfile;
  events: WeddingEvent[];
  onAddProfile: (data: {
    name: string;
    email: string;
    relationship: string;
    avatar: string;
    canViewBudget: boolean;
    sharedEventIds: string[];
  }) => void;
  onUpdateProfile: (id: string, updates: Partial<CustomerProfile>) => void;
  onDeleteProfile: (id: string) => void;
}

const AVATAR_OPTIONS = [
  { id: 'avatar-1', label: 'Classic Plum', bg: 'bg-plum text-gold' },
  { id: 'avatar-2', label: 'Royal Gold', bg: 'bg-gold-soft text-navy border border-gold/40' },
  { id: 'avatar-3', label: 'Emerald Sage', bg: 'bg-emerald-100 text-emerald-900 border border-emerald-300' },
  { id: 'avatar-4', label: 'Burgundy Rose', bg: 'bg-rose-100 text-rose-900 border border-rose-300' },
  { id: 'avatar-5', label: 'Sapphire Navy', bg: 'bg-navy text-primary-foreground' },
  { id: 'avatar-6', label: 'Warm Amber', bg: 'bg-amber-100 text-amber-900 border border-amber-300' },
];

const RELATIONSHIP_OPTIONS = [
  'Spouse / Partner',
  'Mother / Mother-in-Law',
  'Father / Father-in-Law',
  'Sister / Sister-in-Law',
  'Brother / Brother-in-Law',
  'Close Family Relative',
  'Family Member',
];

export function ManageFamilyProfilesModal({
  isOpen,
  onClose,
  profiles,
  primaryProfile,
  events,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
}: ManageFamilyProfilesModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Spouse / Partner');
  const [avatar, setAvatar] = useState('avatar-2');
  const [canViewBudget, setCanViewBudget] = useState(true);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(() => events.map((e) => e.id));
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const familyProfiles = profiles.filter((p) => p.role === 'FAMILY_MEMBER');
  const familyCount = familyProfiles.length;
  const isLimitReached = familyCount >= MAX_ADDITIONAL_FAMILY_PROFILES;

  const resetForm = () => {
    setName('');
    setEmail('');
    setRelationship('Spouse / Partner');
    setAvatar('avatar-2');
    setCanViewBudget(true);
    setSelectedEventIds(events.map((e) => e.id));
    setErrorMsg('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    if (isLimitReached) {
      setErrorMsg(
        `A primary customer account can have up to ${MAX_ADDITIONAL_FAMILY_PROFILES} additional family profiles (maximum reached).`
      );
      return;
    }
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (profile: CustomerProfile) => {
    resetForm();
    setEditingId(profile.id);
    setName(profile.name);
    setEmail(profile.email);
    setRelationship(profile.relationship);
    setAvatar(profile.avatar);
    setCanViewBudget(Boolean(profile.permissions.canViewBudgets));
    setSelectedEventIds(profile.sharedEventIds || []);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Profile name is required.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email address is required for independent family authentication.');
      return;
    }

    if (editingId) {
      onUpdateProfile(editingId, {
        name: name.trim(),
        relationship,
        avatar,
        sharedEventIds: selectedEventIds,
        permissions: {
          canViewEvents: true,
          canViewVendors: true,
          canViewTasks: true,
          canViewBudgets: canViewBudget,
          canViewBookings: true,
          canMakeBookings: false,
          canManagePayments: false,
          canManageEvents: false,
          canModifyBudgets: false,
          canUpdateTasks: false,
          canManageProfiles: false,
          canInviteMembers: false,
        },
      });
      resetForm();
    } else {
      if (familyCount >= MAX_ADDITIONAL_FAMILY_PROFILES) {
        setErrorMsg(
          `A primary customer account cannot exceed ${MAX_ADDITIONAL_FAMILY_PROFILES} additional family profiles.`
        );
        return;
      }

      try {
        onAddProfile({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          relationship,
          avatar,
          canViewBudget,
          sharedEventIds: selectedEventIds.length > 0 ? selectedEventIds : events.map((e) => e.id),
        });
        resetForm();
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to add family profile.');
      }
    }
  };

  const toggleEventSelection = (eventId: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl border border-gold/40 bg-card p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-gold-soft text-plum font-semibold">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-plum">
                Manage Family Profiles
              </h2>
              <p className="text-xs text-muted-foreground">
                Primary Account: <strong className="text-navy">{primaryProfile.name}</strong> ·{' '}
                <span className={isLimitReached ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-medium'}>
                  {familyCount} / {MAX_ADDITIONAL_FAMILY_PROFILES} Family Profiles Added
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Limit Warning if reached */}
        {isLimitReached && !isAdding && !editingId && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-amber-600" />
            <span>
              Maximum limit reached: You have added the maximum of {MAX_ADDITIONAL_FAMILY_PROFILES} family profiles.
              To add a new member, remove an existing profile first.
            </span>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1 space-y-4">
          {isAdding || editingId ? (
            /* Add / Edit Form */
            <form onSubmit={handleSave} className="space-y-4 rounded-2xl border bg-secondary/30 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-plum">
                  {editingId ? 'Edit Family Profile' : 'Invite New Family Member'}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-navy">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunita Kulkarni"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled={Boolean(editingId)}
                    placeholder="e.g. sunita@family.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none disabled:opacity-60"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    Used for independent family member login.
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-navy">Relationship to Couple</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  >
                    {RELATIONSHIP_OPTIONS.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Avatar Theme</label>
                  <div className="mt-1 flex items-center gap-2">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAvatar(opt.id)}
                        className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition ${opt.bg} ${
                          avatar === opt.id ? 'ring-2 ring-gold ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={opt.label}
                      >
                        {name ? name[0]?.toUpperCase() : 'F'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permissions & Shared Events */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="canViewBudget"
                    checked={canViewBudget}
                    onChange={(e) => setCanViewBudget(e.target.checked)}
                    className="mt-0.5 size-4 rounded text-gold focus:ring-gold"
                  />
                  <div>
                    <label htmlFor="canViewBudget" className="text-xs font-semibold text-navy cursor-pointer">
                      Permit viewing event budget and contract figures
                    </label>
                    <p className="text-[11px] text-muted-foreground">
                      When unchecked, financial numbers will be masked for this family profile.
                    </p>
                  </div>
                </div>

                {events.length > 1 && (
                  <div>
                    <label className="text-xs font-semibold text-navy block mb-1">
                      Share Specific Celebrations
                    </label>
                    <div className="space-y-1.5">
                      {events.map((ev) => (
                        <label
                          key={ev.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedEventIds.includes(ev.id)}
                            onChange={() => toggleEventSelection(ev.id)}
                            className="size-3.5 rounded text-gold"
                          />
                          <span>{ev.eventName} ({ev.eventDate})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-gold-soft/40 border border-gold/30 p-2.5 text-[11px] text-navy">
                  <div className="flex items-center gap-1.5 font-semibold text-plum">
                    <ShieldCheck className="size-3.5 text-gold" />
                    <span>Family Member Access Policy</span>
                  </div>
                  <p className="mt-0.5 text-muted-foreground leading-normal">
                    Family members have view-only access to celebrations, shortlisted vendors, and timelines.
                    They cannot sign contracts, approve payments, or edit wedding plans.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={resetForm} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="hero" size="sm" className="text-xs">
                  {editingId ? 'Save Changes' : 'Invite Family Member'}
                </Button>
              </div>
            </form>
          ) : (
            /* List of existing profiles */
            <div className="space-y-3">
              {/* Primary Profile Card */}
              <div className="flex items-center justify-between rounded-2xl border border-gold/50 bg-gold-soft/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-plum text-gold font-display font-bold text-base shadow-xs">
                    {primaryProfile.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy text-sm">{primaryProfile.name}</span>
                      <span className="rounded-full bg-gold/30 text-plum border border-gold/50 px-2 py-0.5 text-[10px] font-bold">
                        Primary Account Holder
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{primaryProfile.email}</p>
                    <p className="text-[11px] text-success flex items-center gap-1 mt-0.5 font-medium">
                      <CheckCircle2 className="size-3 text-success" /> Full Administrative Permissions
                    </p>
                  </div>
                </div>
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-card rounded-lg border">
                  Owner
                </div>
              </div>

              {/* Family Member Profiles */}
              {familyProfiles.map((fam) => {
                const avatarStyle = AVATAR_OPTIONS.find((a) => a.id === fam.avatar) || AVATAR_OPTIONS[1];
                return (
                  <div
                    key={fam.id}
                    className="flex items-center justify-between rounded-2xl border bg-card p-4 hover:border-gold/60 transition shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-11 items-center justify-center rounded-2xl font-display font-bold text-base shadow-2xs ${avatarStyle.bg}`}
                      >
                        {fam.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-navy text-sm">{fam.name}</span>
                          <span className="rounded-full bg-secondary text-muted-foreground border px-2 py-0.5 text-[10px] font-medium">
                            {fam.relationship}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{fam.email}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Eye className="size-3 text-gold" />
                          <span>View-Only Access</span>
                          {fam.permissions.canViewBudgets ? (
                            <span className="text-emerald-700">· Budget Visible</span>
                          ) : (
                            <span className="text-amber-700 flex items-center gap-0.5">
                              · <Lock className="size-2.5" /> Budget Hidden
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(fam)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-gold-soft hover:text-plum transition"
                        title="Edit Profile"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProfile(fam.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                        title="Remove Profile"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Profile Option Button */}
              {!isLimitReached && (
                <Button
                  onClick={handleStartAdd}
                  variant="outline"
                  className="w-full border-dashed border-gold/60 text-plum hover:bg-gold-soft/50 py-5 rounded-2xl font-semibold gap-2 mt-2"
                >
                  <Plus className="size-4 text-gold" /> Add Family Profile ({familyCount} / {MAX_ADDITIONAL_FAMILY_PROFILES})
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>Wedora Family Profiles · Up to 5 additional members</span>
          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-xs"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

