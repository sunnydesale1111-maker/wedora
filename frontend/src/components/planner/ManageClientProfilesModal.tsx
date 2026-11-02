import { useState } from 'react';
import {
  Briefcase,
  Plus,
  Users,
  Calendar,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Archive,
  CheckCircle2,
  X,
  ArrowRight,
  Sparkles,
  Edit2,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OrganizerClientProfile } from '@/types/profile';
import { WeddingEvent } from '@/types/event';

interface ManageClientProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: OrganizerClientProfile[];
  activeClientId: string;
  events: WeddingEvent[];
  onSelectClient: (clientId: string) => void;
  onAddClient: (data: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    company?: string;
    notes?: string;
    initialEvent?: Omit<WeddingEvent, 'id' | 'createdAt'>;
  }) => void;
  onUpdateClient: (id: string, updates: Partial<OrganizerClientProfile>) => void;
  onArchiveClient: (id: string) => void;
  onCreateClientEvent: (clientId: string, eventData: Omit<WeddingEvent, 'id' | 'createdAt'>) => void;
}

export function ManageClientProfilesModal({
  isOpen,
  onClose,
  clients,
  activeClientId,
  events,
  onSelectClient,
  onAddClient,
  onUpdateClient,
  onArchiveClient,
  onCreateClientEvent,
}: ManageClientProfilesModalProps) {
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [addingEventForClientId, setAddingEventForClientId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ACTIVE');

  // Client form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');

  // Event form states
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Traditional Hindu Wedding & Reception');
  const [eventDate, setEventDate] = useState('2026-12-28');
  const [eventCity, setEventCity] = useState<'Mumbai' | 'Pune'>('Pune');
  const [eventArea, setEventArea] = useState('Baner');
  const [eventVenue, setEventVenue] = useState('');
  const [eventGuests, setEventGuests] = useState(500);
  const [eventBudget, setEventBudget] = useState(2500000);

  if (!isOpen) return null;

  const resetClientForm = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setCompany('');
    setNotes('');
    setIsAddingClient(false);
    setEditingClientId(null);
  };

  const resetEventForm = () => {
    setEventName('');
    setEventType('Traditional Hindu Wedding & Reception');
    setEventDate('2026-12-28');
    setEventCity('Pune');
    setEventArea('Baner');
    setEventVenue('');
    setEventGuests(500);
    setEventBudget(2500000);
    setAddingEventForClientId(null);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    if (editingClientId) {
      onUpdateClient(editingClientId, {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone.trim(),
        company: company.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      resetClientForm();
    } else {
      onAddClient({
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim().toLowerCase(),
        clientPhone: clientPhone.trim(),
        company: company.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      resetClientForm();
    }
  };

  const handleCreateEventForClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingEventForClientId || !eventName.trim()) return;

    onCreateClientEvent(addingEventForClientId, {
      eventName: eventName.trim(),
      eventType,
      eventDate,
      city: eventCity,
      area: eventArea,
      venueName: eventVenue || undefined,
      venueStatus: 'FINALIZED',
      guestCount: Number(eventGuests),
      estimatedBudget: Number(eventBudget),
      ownerRole: 'PLANNER',
      ownerName: 'Aditi Sharma (Lead Planner)',
    });

    resetEventForm();
  };

  const filteredClients = clients.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-gold/40 bg-card p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-plum text-gold font-semibold shadow-xs">
              <Briefcase className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-plum">
                Manage Client Profiles
              </h2>
              <p className="text-xs text-muted-foreground">
                Independent client workspaces for weddings, birthdays, and corporate events.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              resetClientForm();
              resetEventForm();
              onClose();
            }}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Toolbar: Filter & Add New Client */}
        {!isAddingClient && !editingClientId && !addingEventForClientId && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div className="inline-flex rounded-xl border bg-secondary/50 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setFilterStatus('ACTIVE')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === 'ACTIVE'
                    ? 'bg-plum text-gold font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Active Clients ({clients.filter((c) => c.status === 'ACTIVE').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === 'ALL'
                    ? 'bg-plum text-gold font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({clients.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('ARCHIVED')}
                className={`px-3 py-1 rounded-lg transition ${
                  filterStatus === 'ARCHIVED'
                    ? 'bg-plum text-gold font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Archived ({clients.filter((c) => c.status === 'ARCHIVED').length})
              </button>
            </div>

            <Button
              onClick={() => {
                resetClientForm();
                setIsAddingClient(true);
              }}
              variant="hero"
              size="sm"
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="size-3.5" /> Create New Client Profile
            </Button>
          </div>
        )}

        {/* Modal Body */}
        <div className="mt-5 max-h-[60vh] overflow-y-auto pr-1 space-y-4">
          {/* 1. Add / Edit Client Form */}
          {(isAddingClient || editingClientId) && (
            <form onSubmit={handleSaveClient} className="space-y-4 rounded-2xl border bg-secondary/40 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-plum">
                  {editingClientId ? 'Edit Client Profile' : 'Create New Client Profile'}
                </h3>
                <Button type="button" variant="ghost" size="sm" onClick={resetClientForm} className="text-xs">
                  Cancel
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-navy">Client / Couple Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karan & Meera Shah"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Client Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@enterprise.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98200 12345"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Company / Family Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Shah Family / TechCorp India"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy">Event Scope & Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Multi-day wedding, sangeet, or corporate anniversary banquet."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="ghost" size="sm" onClick={resetClientForm} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="hero" size="sm" className="text-xs">
                  {editingClientId ? 'Save Client Profile' : 'Create Client Profile'}
                </Button>
              </div>
            </form>
          )}

          {/* 2. Add New Event For a Client Form */}
          {addingEventForClientId && (
            <form onSubmit={handleCreateEventForClient} className="space-y-4 rounded-2xl border bg-gold-soft/20 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-semibold text-plum">
                    Create Event for{' '}
                    <span className="text-navy">
                      {clients.find((c) => c.id === addingEventForClientId)?.clientName}
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Organizers can manage multiple events under the same client profile.
                  </p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={resetEventForm} className="text-xs">
                  Cancel
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-navy">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reception Gala & Sangeet"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Event Category / Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="Traditional Hindu Wedding & Reception">Traditional Hindu Wedding & Reception</option>
                    <option value="Grand Sangeet & Royal Wedding">Grand Sangeet & Royal Wedding</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Corporate Event & Executive Banquet">Corporate Event & Executive Banquet</option>
                    <option value="Housewarming Ceremony (Griha Pravesh)">Housewarming Ceremony (Griha Pravesh)</option>
                    <option value="Baby Shower / Dohale Jevan">Baby Shower / Dohale Jevan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Target Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">City & Vicinity</label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <select
                      value={eventCity}
                      onChange={(e) => setEventCity(e.target.value as any)}
                      className="rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                    >
                      <option value="Pune">Pune</option>
                      <option value="Mumbai">Mumbai</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Area (e.g. Baner)"
                      value={eventArea}
                      onChange={(e) => setEventArea(e.target.value)}
                      className="rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Guest Count</label>
                  <input
                    type="number"
                    value={eventGuests}
                    onChange={(e) => setEventGuests(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={eventBudget}
                    onChange={(e) => setEventBudget(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy">Target Venue / Hall (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Emerald Meadows Lawns"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="ghost" size="sm" onClick={resetEventForm} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="hero" size="sm" className="text-xs">
                  Create Event Under Client
                </Button>
              </div>
            </form>
          )}

          {/* 3. Client Profiles Grid */}
          {!isAddingClient && !editingClientId && !addingEventForClientId && (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClients.map((client) => {
                const isSelected = activeClientId === client.id;
                const clientEvents = events.filter((e) => client.eventIds.includes(e.id));
                const isArchived = client.status === 'ARCHIVED';

                return (
                  <div
                    key={client.id}
                    className={`flex flex-col rounded-2xl border p-5 transition shadow-2xs ${
                      isSelected
                        ? 'border-gold bg-gold-soft/30 ring-2 ring-gold/60'
                        : isArchived
                        ? 'bg-secondary/40 opacity-75 border-dashed'
                        : 'bg-card hover:border-gold/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-base font-bold text-plum">{client.clientName}</h4>
                          {isSelected && (
                            <span className="rounded-full bg-plum text-gold px-2 py-0.5 text-[9px] font-bold">
                              Active Context
                            </span>
                          )}
                          {isArchived && (
                            <span className="rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[9px] font-bold">
                              Archived
                            </span>
                          )}
                        </div>
                        {client.company && (
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {client.company}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingClientId(client.id);
                            setClientName(client.clientName);
                            setClientEmail(client.clientEmail);
                            setClientPhone(client.clientPhone);
                            setCompany(client.company || '');
                            setNotes(client.notes || '');
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-gold-soft hover:text-plum transition"
                          title="Edit Client Details"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => onArchiveClient(client.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                          title={isArchived ? 'Restore Client' : 'Archive Client'}
                        >
                          <Archive className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Contact details */}
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Mail className="size-3 text-gold shrink-0" />
                        <span className="truncate">{client.clientEmail}</span>
                      </div>
                      {client.clientPhone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="size-3 text-gold shrink-0" />
                          <span>{client.clientPhone}</span>
                        </div>
                      )}
                      {client.notes && (
                        <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2 italic bg-background/50 p-2 rounded-lg border">
                          "{client.notes}"
                        </p>
                      )}
                    </div>

                    {/* Managed Events for this client */}
                    <div className="mt-4 pt-3 border-t flex-1">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-navy flex items-center gap-1">
                          <Calendar className="size-3 text-gold" />
                          <span>Events ({clientEvents.length})</span>
                        </span>
                        <button
                          onClick={() => {
                            resetEventForm();
                            setAddingEventForClientId(client.id);
                          }}
                          className="text-[11px] text-plum hover:text-gold font-semibold flex items-center gap-0.5 transition"
                        >
                          <Plus className="size-3" /> Add Event
                        </button>
                      </div>

                      {clientEvents.length > 0 ? (
                        <div className="space-y-1.5">
                          {clientEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="flex items-center justify-between text-xs rounded-lg bg-background/80 px-2.5 py-1.5 border"
                            >
                              <div className="truncate pr-2">
                                <span className="font-medium text-navy truncate block">{ev.eventName}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {ev.eventDate} · {ev.city} ({ev.area})
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-plum bg-gold/15 px-2 py-0.5 rounded-full shrink-0">
                                ₹{(ev.estimatedBudget / 100000).toFixed(1)}L
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-muted-foreground italic py-1">
                          No events linked to this client profile yet.
                        </p>
                      )}
                    </div>

                    {/* Footer Action */}
                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                      {isSelected ? (
                        <span className="text-xs font-semibold text-success flex items-center gap-1">
                          <CheckCircle2 className="size-3.5 text-success" /> Active Client Workspace
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="soft"
                          onClick={() => {
                            onSelectClient(client.id);
                            onClose();
                          }}
                          className="text-xs font-semibold ml-auto"
                        >
                          Open Client Workspace <ArrowRight className="size-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
          <span>Wedora Organizer Multi-Client Architecture</span>
          <Button
            variant="soft"
            size="sm"
            onClick={() => {
              resetClientForm();
              resetEventForm();
              onClose();
            }}
            className="text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
