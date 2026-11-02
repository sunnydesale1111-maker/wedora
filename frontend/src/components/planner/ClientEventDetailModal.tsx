import { useState } from 'react';
import {
  Calendar,
  Building2,
  Users,
  CreditCard,
  CheckSquare,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  Store,
  MapPin,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WeddingEvent, TimelineTask } from '@/types/event';
import { Booking, Quotation } from '@/types/booking';
import { CustomerProfile } from '@/types/profile';

interface ClientEventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: WeddingEvent | null;
  tasks: TimelineTask[];
  bookings: Booking[];
  quotations: Quotation[];
  sharedProfiles: CustomerProfile[];
  onToggleTask: (taskId: string) => void;
  onAddTask?: (taskName: string, category?: string, deadline?: string) => void;
  onPayBooking?: (booking: Booking) => void;
  onNavigateToDiscovery?: (eventId: string) => void;
}

export function ClientEventDetailModal({
  isOpen,
  onClose,
  event,
  tasks,
  bookings,
  quotations,
  sharedProfiles,
  onToggleTask,
  onAddTask,
  onPayBooking,
  onNavigateToDiscovery,
}: ClientEventDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'budget' | 'vendors'>('overview');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('General Planning');
  const [newTaskDeadline, setNewTaskDeadline] = useState(event?.eventDate || '2026-12-15');

  if (!isOpen || !event) return null;

  // Filter tasks & bookings for this event
  const eventTasks = tasks.filter((t) => t.eventId === event.id || !t.eventId);
  const completedTasks = eventTasks.filter((t) => t.status === 'COMPLETED');
  const pendingTasks = eventTasks.filter((t) => t.status !== 'COMPLETED');
  const eventBookings = bookings.filter((b) => b.eventId === event.id);
  const eventQuotes = quotations.filter((q) => q.inquiryId?.includes(event.id) || true); // relevant quotes

  // Budget Fluctuation Calculations
  const originalBudget = event.originalBudget && event.originalBudget > 0 ? event.originalBudget : event.estimatedBudget;
  const currentBudget = event.estimatedBudget || 0;
  const budgetDiff = currentBudget - originalBudget;
  const budgetVariancePct = originalBudget > 0 ? (budgetDiff / originalBudget) * 100 : 0;
  const confirmedSpending = eventBookings.reduce((sum, b) => sum + b.agreedAmount, 0);
  const paidAmount = eventBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const remainingBudget = Math.max(0, currentBudget - confirmedSpending);
  const spendingRatio = currentBudget > 0 ? Math.min(100, Math.round((confirmedSpending / currentBudget) * 100)) : 0;

  // Shared family members for this event
  const eventSharedMembers = sharedProfiles.filter(
    (p) => p.sharedEventIds?.includes(event.id) || p.role === 'PRIMARY'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-card p-6 sm:p-7 shadow-float border border-gold/40 relative animate-rise my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-border/70">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold-soft/60 px-2.5 py-0.5 rounded-full border border-gold/30">
                {event.eventType}
              </span>
              <span className="text-[11px] font-bold bg-plum/10 text-plum px-2.5 py-0.5 rounded-full border border-plum/20">
                {event.venueStatus === 'FINALIZED' ? 'Confirmed Venue' : 'Planning Active'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-plum">
              {event.eventName}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client: <strong className="text-navy">{event.clientName || 'Private Client'}</strong> • {event.city} ({event.area})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Navigation inside Popup */}
        <div className="flex items-center gap-1 border-b border-border/70 mt-3 overflow-x-auto text-xs font-semibold py-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-plum text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="size-3.5" /> Event Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'checklist'
                ? 'bg-plum text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckSquare className="size-3.5" /> Planning Checklist ({completedTasks.length}/{eventTasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'budget'
                ? 'bg-plum text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSign className="size-3.5" /> Budget Fluctuation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vendors'
                ? 'bg-plum text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Store className="size-3.5" /> Vendors & Contracts ({eventBookings.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* ================= 1. EVENT OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Event Details & Schedule
                  </span>
                  <div className="space-y-1.5 text-xs text-navy font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gold shrink-0" />
                      <span>Date: <strong>{event.eventDate}</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="size-4 text-gold shrink-0 mt-0.5" />
                      <span>Venue: {event.venueName || 'To Be Finalized'} ({event.area}, {event.city})</span>
                    </div>
                    {event.venueAddress && (
                      <div className="flex items-start gap-2 text-muted-foreground text-[11px]">
                        <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span>{event.venueAddress}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-gold shrink-0" />
                      <span>Guest Count: <strong>{event.guestCount} Guests</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Client Contact & Account
                  </span>
                  <div className="space-y-1.5 text-xs text-navy font-medium">
                    <div>
                      <span className="text-muted-foreground text-[11px]">Primary Contact:</span>
                      <p className="font-semibold text-plum">{event.clientName || 'Client'}</p>
                    </div>
                    {event.clientEmail && (
                      <div>
                        <span className="text-muted-foreground text-[11px]">Email:</span>
                        <p>{event.clientEmail}</p>
                      </div>
                    )}
                    {event.clientPhone && (
                      <div>
                        <span className="text-muted-foreground text-[11px]">Phone:</span>
                        <p>{event.clientPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Members with Whom Event is Shared */}
              <div className="p-4 rounded-2xl border border-gold/30 bg-gold-soft/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                    <Users className="size-4 text-gold" />
                    Members with Whom Event is Shared ({eventSharedMembers.length})
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Role-Based Event Access
                  </span>
                </div>
                {eventSharedMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {eventSharedMembers.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border/50 text-xs"
                      >
                        <div
                          className={`size-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            m.role === 'PRIMARY'
                              ? 'bg-gold-soft text-navy border border-gold/40'
                              : 'bg-plum/10 text-plum'
                          }`}
                        >
                          {m.name[0]?.toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-navy truncate">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {m.relationship || (m.role === 'PRIMARY' ? 'Primary Account Holder' : 'Family Member')} •{' '}
                            {m.role === 'PRIMARY' ? 'Full Access' : 'View Only'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    Event is currently private to primary account holder {event.clientName}.
                  </p>
                )}
              </div>

              {event.description && (
                <div className="p-3.5 rounded-2xl bg-card border border-border/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Event Brief & Requirements
                  </span>
                  <p className="text-xs text-navy/80 leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>
          )}

          {/* ================= 2. PLANNING CHECKLIST & MILESTONES ================= */}
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              {/* Checklist Progress */}
              <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-navy">Milestone Execution Progress</span>
                  <span className="text-plum">
                    {completedTasks.length} of {eventTasks.length} Milestones Completed (
                    {eventTasks.length > 0 ? Math.round((completedTasks.length / eventTasks.length) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-gold transition-all duration-300"
                    style={{
                      width: `${eventTasks.length > 0 ? (completedTasks.length / eventTasks.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Task Items List */}
              <div className="space-y-2">
                {eventTasks.length > 0 ? (
                  eventTasks.map((t) => {
                    const isDone = t.status === 'COMPLETED';
                    return (
                      <div
                        key={t.id}
                        onClick={() => onToggleTask(t.id)}
                        className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer select-none ${
                          isDone
                            ? 'bg-muted/30 border-border/40 opacity-75'
                            : 'bg-card border-border hover:border-gold/50 shadow-2xs'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}} // Handled by parent onClick
                          className="size-4 mt-0.5 rounded text-plum focus:ring-gold cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-xs text-navy ${
                              isDone ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {t.taskName}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                            {t.category && (
                              <span className="bg-muted px-2 py-0.5 rounded-md text-[10px] font-medium">
                                {t.category}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="size-3 text-gold" /> Target: {t.deadline}
                            </span>
                            {t.assignedVendorName && (
                              <span className="text-plum font-medium">
                                • Vendor: {t.assignedVendorName}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-700'
                              : 'bg-amber-500/10 text-amber-700'
                          }`}
                        >
                          {isDone ? 'Done' : 'Pending'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No milestone tasks registered for this event yet.
                  </p>
                )}
              </div>

              {/* Add New Milestone */}
              {onAddTask && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTaskName.trim()) return;
                    onAddTask(newTaskName.trim(), newTaskCategory, newTaskDeadline);
                    setNewTaskName('');
                  }}
                  className="p-3 rounded-2xl border border-dashed border-gold/50 bg-gold-soft/10 flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="New milestone task name (e.g. Schedule final food tasting)..."
                    className="flex-1 rounded-xl border bg-background px-3 py-1.5 text-xs outline-none focus:border-gold"
                  />
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="rounded-xl border bg-background px-2.5 py-1.5 text-xs outline-none focus:border-gold"
                  />
                  <Button type="submit" size="sm" variant="hero" className="text-xs font-semibold shrink-0">
                    <Plus className="size-3.5" /> Add Task
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* ================= 3. BUDGET FLUCTUATION ================= */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              {/* 4-Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Original Baseline
                  </span>
                  <p className="text-base font-display font-bold text-navy">
                    ₹{originalBudget.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-muted-foreground">Initial Target</span>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Current Estimated
                  </span>
                  <p className="text-base font-display font-bold text-plum">
                    ₹{currentBudget.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-muted-foreground">Active Scope</span>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Confirmed Contracts
                  </span>
                  <p className="text-base font-display font-bold text-emerald-700">
                    ₹{confirmedSpending.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-muted-foreground">{eventBookings.length} Vendors Locked</span>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border/70 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Remaining Unallocated
                  </span>
                  <p className="text-base font-display font-bold text-navy">
                    ₹{remainingBudget.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] text-muted-foreground">Available Margin</span>
                </div>
              </div>

              {/* Fluctuation & Variance Analysis Card */}
              <div className="p-4 rounded-2xl border border-gold/40 bg-card space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-navy">Baseline Fluctuation Variance:</span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-0.5 rounded-full ${
                        budgetDiff > 0
                          ? 'bg-amber-500/10 text-amber-800 border border-amber-300'
                          : budgetDiff < 0
                          ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-300'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {budgetDiff > 0 ? (
                        <TrendingUp className="size-3.5 text-amber-700" />
                      ) : budgetDiff < 0 ? (
                        <TrendingDown className="size-3.5 text-emerald-700" />
                      ) : null}
                      {budgetDiff > 0 ? '+' : ''}₹{budgetDiff.toLocaleString('en-IN')} ({budgetDiff > 0 ? '+' : ''}
                      {budgetVariancePct.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {budgetDiff > 0
                    ? `Scope expansion: Current estimated budget has adjusted by +₹${budgetDiff.toLocaleString('en-IN')} (+${budgetVariancePct.toFixed(1)}%) over original allocation due to enhanced guest hospitality, venue inclusions, and catering revisions.`
                    : budgetDiff < 0
                    ? `Cost savings achieved: Estimated celebration budget is ₹${Math.abs(budgetDiff).toLocaleString('en-IN')} (${budgetVariancePct.toFixed(1)}%) under original baseline allocation.`
                    : 'The celebration budget is running on the exact original baseline target with 0.0% variance.'}
                </p>

                {/* Progress Visualizer */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Committed to Vendors: <strong>₹{confirmedSpending.toLocaleString('en-IN')} ({spendingRatio}%)</strong></span>
                    <span>Remaining Buffer: <strong>₹{remainingBudget.toLocaleString('en-IN')}</strong></span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-plum to-gold transition-all duration-300"
                      style={{ width: `${spendingRatio}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. VENDORS, BOOKINGS & CHECKOUT ================= */}
          {activeTab === 'vendors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy">
                  Confirmed Vendor Contracts ({eventBookings.length})
                </span>
                {onNavigateToDiscovery && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onClose();
                      onNavigateToDiscovery(event.id);
                    }}
                    className="text-xs border-gold text-plum hover:bg-gold-soft font-semibold gap-1.5 cursor-pointer"
                  >
                    <Store className="size-3.5 text-gold" /> Find More Vendors in Directory
                  </Button>
                )}
              </div>

              {eventBookings.length > 0 ? (
                <div className="space-y-2.5">
                  {eventBookings.map((b) => {
                    const paid = b.paidAmount || 0;
                    const balance = Math.max(0, b.agreedAmount - paid);
                    return (
                      <div
                        key={b.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/70 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-navy text-xs">{b.vendorBusinessName}</h4>
                            <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                              {b.serviceCategory}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Contract Value: <strong className="text-navy">₹{b.agreedAmount.toLocaleString('en-IN')}</strong> •{' '}
                            Paid to date:{' '}
                            <span className="text-emerald-700 font-medium">₹{paid.toLocaleString('en-IN')}</span>{' '}
                            {balance > 0 ? `(Remaining: ₹${balance.toLocaleString('en-IN')})` : '(Settled in full)'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {balance > 0 && onPayBooking ? (
                            <Button
                              size="sm"
                              variant="hero"
                              onClick={() => {
                                onClose();
                                onPayBooking(b);
                              }}
                              className="text-xs font-semibold gap-1.5 cursor-pointer"
                            >
                              <CreditCard className="size-3.5" /> Make Demo Payment
                            </Button>
                          ) : (
                            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="size-3.5 text-emerald-600" /> Settled
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-border bg-muted/20 text-center space-y-2">
                  <Store className="size-8 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    No vendors booked for this event yet. Use the Vendor Directory to request quotes and reserve capacity.
                  </p>
                  {onNavigateToDiscovery && (
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={() => {
                        onClose();
                        onNavigateToDiscovery(event.id);
                      }}
                      className="text-xs font-semibold gap-1.5"
                    >
                      <Store className="size-3.5" /> Explore AI Vendor Directory
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/70 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Wedora Client Management • Real-time event coordination
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
