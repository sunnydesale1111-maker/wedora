import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  CheckSquare,
  AlertTriangle,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Plus,
  Building2,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Panel, Status, SimpleTable } from '@/components/dashboard';
import { useDemoSession } from '@/hooks/useDemoSession';
import { WeddingEvent, TimelineTask } from '@/types/event';
import { Booking } from '@/types/booking';
import { SimulatedPaymentModal } from '@/components/payments/SimulatedPaymentModal';

interface CustomerBookingsAndChecklistProps {
  activeEvent: WeddingEvent;
  onNavigateToDiscovery?: () => void;
}

const ESSENTIAL_CATEGORIES = [
  'Catering and Food Services',
  'Photography and Cinematography',
  'Banquet Halls and Venues',
  'Floral and Decor Design',
];

export const CustomerBookingsAndChecklist: React.FC<CustomerBookingsAndChecklistProps> = ({
  activeEvent,
  onNavigateToDiscovery,
}) => {
  const {
    bookings,
    payments,
    quotations,
    timelineTasks,
    recordSimulatedPayment,
    addTimelineTask,
    toggleTimelineTask,
    acceptQuotationAndBook,
  } = useDemoSession();

  // Payment modal state
  const [payBooking, setPayBooking] = useState<Booking | null>(null);

  // New task form state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Planning');
  const [newTaskDeadline, setNewTaskDeadline] = useState(activeEvent.eventDate);

  // Filter bookings for active event
  const eventBookings = useMemo(() => {
    return bookings.filter((b) => b.eventId === activeEvent.id);
  }, [bookings, activeEvent.id]);

  // Filter payments for active event
  const eventPayments = useMemo(() => {
    return payments.filter((p) => p.eventId === activeEvent.id);
  }, [payments, activeEvent.id]);

  // Filter timeline tasks for active event
  const eventTasks = useMemo(() => {
    return timelineTasks.filter((t) => t.eventId === activeEvent.id || !t.eventId);
  }, [timelineTasks, activeEvent.id]);

  // Quotations awaiting acceptance for active event
  const pendingQuotations = useMemo(() => {
    return quotations.filter((q) => q.status === 'SENT');
  }, [quotations]);

  // Budget Fluctuation Calculations
  const totalBudget = activeEvent.estimatedBudget || 0;
  const committedCost = eventBookings.reduce((sum, b) => sum + (b.agreedAmount || 0), 0);
  const totalPaid = eventBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const outstandingBalance = Math.max(0, committedCost - totalPaid);
  const remainingBudget = totalBudget - committedCost;
  const isOverBudget = remainingBudget < 0;
  const overBudgetAmount = Math.abs(remainingBudget);

  // Essential categories check
  const bookedCategoryNames = useMemo(() => {
    return new Set(eventBookings.map((b) => b.serviceCategory.toLowerCase()));
  }, [eventBookings]);

  const unfinalizedCategories = useMemo(() => {
    return ESSENTIAL_CATEGORIES.filter(
      (cat) => !bookedCategoryNames.has(cat.toLowerCase())
    );
  }, [bookedCategoryNames]);

  // Task completion calculation
  const completedTaskCount = eventTasks.filter((t) => t.status === 'COMPLETED').length;
  const totalTaskCount = eventTasks.length;
  const progressPercent = totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    addTimelineTask(newTaskName.trim(), newTaskCategory, newTaskDeadline);
    setNewTaskName('');
    setShowAddTask(false);
  };

  return (
    <div className="space-y-8 animate-rise min-w-0 max-w-full overflow-x-hidden">
      {/* 1. Active Event Details Banner */}
      <div className="rounded-3xl border border-gold/30 bg-card p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2.5 py-0.5 rounded-full">
                Management Ledger & Checklist
              </span>
              <span className="text-[11px] font-bold text-navy bg-gold-soft px-2.5 py-0.5 rounded-full">
                {activeEvent.clientName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display text-plum font-bold mt-1.5">
              {activeEvent.eventName}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Venue: <strong>{activeEvent.venueName || 'Venue Not Finalized'}</strong> · {activeEvent.area || activeEvent.city}, {activeEvent.city}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-2xl bg-secondary text-navy border">
              Date: <strong>{activeEvent.eventDate}</strong>
            </span>
          </div>
        </div>

        {/* 2. Budget Tracking & Fluctuation Tracker Box */}
        <div className="rounded-2xl bg-gradient-to-br from-gold-soft/30 via-card to-card border border-gold/40 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
            <div>
              <h3 className="text-base font-display text-plum font-bold flex items-center gap-2">
                <DollarSign className="size-4 text-gold" />
                Budget & Expense Fluctuation Tracker
              </h3>
              <p className="text-xs text-muted-foreground">
                Real-time tracking of committed vendor contracts versus allocated celebration budget.
              </p>
            </div>

            {/* Over / Under Budget Indicator Badge */}
            {isOverBudget ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300">
                <AlertTriangle className="size-3.5 text-rose-600" />
                <span>Exceeding Budget by ₹{overBudgetAmount.toLocaleString('en-IN')}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>Under Budget / Uncommitted: ₹{remainingBudget.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-card border">
              <span className="text-[11px] text-muted-foreground uppercase font-medium block">Total Planned Budget</span>
              <strong className="text-base text-navy font-bold block mt-1">
                ₹{totalBudget.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-card border">
              <span className="text-[11px] text-muted-foreground uppercase font-medium block">Committed Contracts</span>
              <strong className="text-base text-plum font-bold block mt-1">
                ₹{committedCost.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-card border">
              <span className="text-[11px] text-muted-foreground uppercase font-medium block">Total Paid to Date</span>
              <strong className="text-base text-emerald-700 dark:text-emerald-400 font-bold block mt-1">
                ₹{totalPaid.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="p-3 rounded-xl bg-card border">
              <span className="text-[11px] text-muted-foreground uppercase font-medium block">Outstanding Balance</span>
              <strong className="text-base text-amber-700 dark:text-amber-400 font-bold block mt-1">
                ₹{outstandingBalance.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Actionable Event Checklist */}
      <div className="rounded-3xl border bg-card p-5 sm:p-6 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="size-5 text-gold" />
              <h3 className="text-lg font-display text-plum font-bold">
                Actionable Event Checklist & Milestones
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track vendor contracts, quotation reviews, and preparatory deadlines.
            </p>
          </div>

          <Button
            size="sm"
            variant="soft"
            onClick={() => setShowAddTask(!showAddTask)}
            className="text-xs font-semibold"
          >
            <Plus className="size-3.5 mr-1" /> Add Custom Milestone
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Planning Readiness</span>
            <span className="text-plum">
              {completedTaskCount} of {totalTaskCount} tasks completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden border">
            <div
              className="bg-gold h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Unfinalized Essential Vendors Alert */}
        {unfinalizedCategories.length > 0 && (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 p-4 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Action Required: Unfinalized Vendors</strong>
                <span>
                  You have not yet booked vendors for:{' '}
                  <strong>{unfinalizedCategories.join(', ')}</strong>.
                </span>
              </div>
            </div>

            {onNavigateToDiscovery && (
              <Button
                size="sm"
                variant="gold"
                onClick={onNavigateToDiscovery}
                className="text-xs font-semibold shrink-0"
              >
                Discover Vendors <ArrowRight className="size-3 ml-1" />
              </Button>
            )}
          </div>
        )}

        {/* Formal Quotations Awaiting 1-Click Acceptance */}
        {pendingQuotations.length > 0 && (
          <div className="rounded-2xl bg-gold-soft/50 border border-gold/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-plum flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-gold" />
                Quotations Awaiting Your Approval ({pendingQuotations.length})
              </span>
            </div>

            <div className="space-y-2">
              {pendingQuotations.map((q) => (
                <div
                  key={q.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-card border text-xs"
                >
                  <div>
                    <strong className="text-navy">{q.vendorBusinessName}</strong>
                    <span className="text-muted-foreground block text-[11px] truncate max-w-md">
                      {q.serviceScope}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <strong className="text-plum font-semibold">
                      ₹{q.quotedAmount.toLocaleString('en-IN')}
                    </strong>
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={() => {
                        acceptQuotationAndBook(q.id);
                        alert(`Accepted quote from ${q.vendorBusinessName}! Booking confirmed.`);
                      }}
                      className="text-xs py-1"
                    >
                      Accept & Confirm
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Task Inline Form */}
        {showAddTask && (
          <form
            onSubmit={handleCreateTask}
            className="p-4 rounded-2xl bg-secondary/70 border border-border space-y-3 animate-rise"
          >
            <div className="font-semibold text-xs text-navy">Add New Milestone / Task</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Task description (e.g. Confirm guest count with caterer)"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className="bg-card px-3 py-2 rounded-xl border text-xs outline-none sm:col-span-2"
                required
              />
              <input
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                className="bg-card px-3 py-2 rounded-xl border text-xs outline-none"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowAddTask(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="hero" className="text-xs font-semibold">
                Save Task
              </Button>
            </div>
          </form>
        )}

        {/* Checklist Task Items - Contained Scrollable Container */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1.5 overscroll-contain scrollbar-thin scrollbar-thumb-gold/30 hover:scrollbar-thumb-gold/50">
          {eventTasks.length > 0 ? (
            eventTasks.map((task) => {
              const isDone = task.status === 'COMPLETED';
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTimelineTask(task.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer select-none ${
                    isDone
                      ? 'bg-secondary/40 border-border opacity-70'
                      : 'bg-card border-border hover:border-gold/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}} // handled by row click
                      className="size-4 accent-gold rounded cursor-pointer"
                    />
                    <div>
                      <span
                        className={`text-xs font-medium block ${
                          isDone ? 'line-through text-muted-foreground' : 'text-navy font-semibold'
                        }`}
                      >
                        {task.taskName}
                      </span>
                      {task.assignedVendorName && (
                        <span className="text-[10px] text-muted-foreground block">
                          Assigned: {task.assignedVendorName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Calendar className="size-3 text-gold" />
                    <span>{task.deadline || activeEvent.eventDate}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              No tasks added yet. Click "Add Custom Milestone" to start your planning checklist!
            </p>
          )}
        </div>
      </div>

      {/* 4. Bookings & Payments Table - Contained Scrollable Container */}
      <Panel title="Confirmed Vendor Contracts & Advances">
        {eventBookings.length > 0 ? (
          <div className="max-h-[320px] overflow-y-auto pr-1 overscroll-contain scrollbar-thin scrollbar-thumb-gold/30 hover:scrollbar-thumb-gold/50">
            <SimpleTable
              head={['Vendor / Organizer', 'Category', 'Event Date', 'Agreed Total', 'Paid to Date', 'Balance', 'Action']}
              rows={eventBookings.map((b) => {
                const paid = b.paidAmount || 0;
                const balance = Math.max(0, b.agreedAmount - paid);
                return [
                  <strong key={b.id} className="text-navy">{b.vendorBusinessName}</strong>,
                  b.serviceCategory,
                  b.eventDate,
                  `₹${b.agreedAmount.toLocaleString('en-IN')}`,
                  <span key={b.id} className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    ₹{paid.toLocaleString('en-IN')}
                  </span>,
                  <span key={b.id} className={balance > 0 ? 'text-amber-700 font-semibold' : 'text-muted-foreground'}>
                    ₹{balance.toLocaleString('en-IN')}
                  </span>,
                  balance > 0 ? (
                    <Button
                      key={b.id}
                      size="sm"
                      variant="gold"
                      onClick={() => setPayBooking(b)}
                      className="text-xs font-semibold py-1"
                    >
                      Make Demo Payment
                    </Button>
                  ) : (
                    <span key={b.id} className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Fully Paid
                    </span>
                  ),
                ];
              })}
            />
          </div>
        ) : (
          <div className="text-center py-8 space-y-2">
            <p className="text-xs text-muted-foreground">
              No confirmed contracts yet. Request quotes in the Vendor Directory to begin finalizing contracts.
            </p>
            {onNavigateToDiscovery && (
              <Button size="sm" variant="soft" onClick={onNavigateToDiscovery} className="text-xs">
                Browse Vendors
              </Button>
            )}
          </div>
        )}
      </Panel>

      {/* 5. Simulated Transaction Ledger - Contained Scrollable Container */}
      <Panel title="Simulated Transaction Ledger">
        {eventPayments.length > 0 ? (
          <div className="max-h-[280px] overflow-y-auto pr-1 overscroll-contain scrollbar-thin scrollbar-thumb-gold/30 hover:scrollbar-thumb-gold/50">
            <SimpleTable
              head={['Reference', 'Payee', 'Amount', 'Payment Purpose', 'Simulation Badge', 'Date']}
              rows={eventPayments.map((p) => [
                <span key={p.id} className="font-mono text-[11px] text-plum font-semibold">
                  {p.transactionRef}
                </span>,
                p.payeeName,
                `₹${p.amount.toLocaleString('en-IN')}`,
                p.paymentPurpose,
                <span
                  key={p.id}
                  className="text-[10px] text-gold font-bold uppercase tracking-wider bg-gold-soft px-2 py-0.5 rounded-full border border-gold/30"
                >
                  Demo Simulation
                </span>,
                new Date(p.createdAt).toLocaleDateString('en-IN'),
              ])}
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-6">
            No simulated payments recorded yet. Click "Make Demo Payment" on any active booking above to test payment ledger tracking.
          </p>
        )}
      </Panel>

      {/* Simulated Payment Modal */}
      {payBooking && (
        <SimulatedPaymentModal
          booking={payBooking}
          onClose={() => setPayBooking(null)}
          onConfirmPayment={(bookingId, amount, purpose) => {
            recordSimulatedPayment({
              bookingId,
              eventId: payBooking.eventId,
              payeeName: payBooking.vendorBusinessName,
              amount,
              purpose,
            });
            setPayBooking(null);
          }}
        />
      )}
    </div>
  );
};

