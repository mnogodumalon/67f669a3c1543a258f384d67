import { useState, useEffect, useMemo } from 'react';
import type { Kursverwaltung, Kursleiterzuordnung, Teilnehmeranmeldung } from '@/types/app';
import { LivingAppsService, extractRecordId } from '@/services/livingAppsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO, formatDistance, differenceInHours, differenceInMinutes } from 'date-fns';
import { de } from 'date-fns/locale';
import { Plus, MapPin, Clock, Users, BookOpen, User, AlertCircle, RefreshCw, Calendar } from 'lucide-react';

// Countdown Ring Component
function CountdownRing({ hoursUntil, size = 100 }: { hoursUntil: number; size?: number }) {
  // Calculate fill percentage based on time until class
  // Full at 1 hour or less, empty at 24+ hours
  const maxHours = 24;
  const fillPercent = Math.max(0, Math.min(100, ((maxHours - hoursUntil) / maxHours) * 100));

  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fillPercent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(35 20% 88%)"
        strokeWidth="8"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(160 35% 35%)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-500"
      />
    </svg>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-16 flex-1 rounded-lg" />
          <Skeleton className="h-16 flex-1 rounded-lg" />
          <Skeleton className="h-16 flex-1 rounded-lg" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[65%_35%] gap-6">
        <div className="space-y-6">
          <Skeleton className="h-52 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Fehler beim Laden</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error.message}</p>
          <Button variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Erneut versuchen
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Empty State Component
function EmptyState({ onAddCourse }: { onAddCourse: () => void }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
        <Calendar className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Noch keine Kurse</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        Erstelle deinen ersten Yoga-Kurs, um loszulegen.
      </p>
      <Button onClick={onAddCourse} className="gap-2">
        <Plus className="h-4 w-4" />
        Ersten Kurs anlegen
      </Button>
    </div>
  );
}

// Add Course Dialog Component
function AddCourseDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    kurs_name: '',
    kurs_beschreibung: '',
    kurs_zeitplan: '',
    kurs_ort: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Format datetime for API: YYYY-MM-DDTHH:MM (no seconds!)
      const zeitplan = formData.kurs_zeitplan; // Already in correct format from datetime-local input

      await LivingAppsService.createKursverwaltungEntry({
        kurs_name: formData.kurs_name,
        kurs_beschreibung: formData.kurs_beschreibung || undefined,
        kurs_zeitplan: zeitplan || undefined,
        kurs_ort: formData.kurs_ort || undefined,
      });

      // Reset form and close dialog
      setFormData({
        kurs_name: '',
        kurs_beschreibung: '',
        kurs_zeitplan: '',
        kurs_ort: '',
      });
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Erstellen');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neuen Kurs anlegen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kurs_name">Kursname *</Label>
            <Input
              id="kurs_name"
              value={formData.kurs_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, kurs_name: e.target.value }))}
              placeholder="z.B. Hatha Yoga Anfänger"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kurs_zeitplan">Datum & Uhrzeit *</Label>
            <Input
              id="kurs_zeitplan"
              type="datetime-local"
              value={formData.kurs_zeitplan}
              onChange={(e) => setFormData((prev) => ({ ...prev, kurs_zeitplan: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kurs_ort">Ort</Label>
            <Input
              id="kurs_ort"
              value={formData.kurs_ort}
              onChange={(e) => setFormData((prev) => ({ ...prev, kurs_ort: e.target.value }))}
              placeholder="z.B. Studio 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kurs_beschreibung">Beschreibung</Label>
            <Textarea
              id="kurs_beschreibung"
              value={formData.kurs_beschreibung}
              onChange={(e) => setFormData((prev) => ({ ...prev, kurs_beschreibung: e.target.value }))}
              placeholder="Beschreibe den Kurs..."
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Wird erstellt...' : 'Kurs erstellen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [kurse, setKurse] = useState<Kursverwaltung[]>([]);
  const [kursleiter, setKursleiter] = useState<Kursleiterzuordnung[]>([]);
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmeranmeldung[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [kData, klData, tData] = await Promise.all([
        LivingAppsService.getKursverwaltung(),
        LivingAppsService.getKursleiterzuordnung(),
        LivingAppsService.getTeilnehmeranmeldung(),
      ]);
      setKurse(kData);
      setKursleiter(klData);
      setTeilnehmer(tData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate derived data
  const now = new Date();

  // Future courses sorted by date
  const upcomingKurse = useMemo(() => {
    return kurse
      .filter((k) => {
        if (!k.fields.kurs_zeitplan) return false;
        const kursDate = parseISO(k.fields.kurs_zeitplan);
        return kursDate > now;
      })
      .sort((a, b) => {
        const dateA = a.fields.kurs_zeitplan ? parseISO(a.fields.kurs_zeitplan).getTime() : 0;
        const dateB = b.fields.kurs_zeitplan ? parseISO(b.fields.kurs_zeitplan).getTime() : 0;
        return dateA - dateB;
      });
  }, [kurse, now]);

  // Next course (hero)
  const nextKurs = upcomingKurse[0] || null;

  // Create lookup map for kursleiter by their assigned course
  const kursleiterByKursId = useMemo(() => {
    const map = new Map<string, Kursleiterzuordnung>();
    kursleiter.forEach((kl) => {
      const kursId = extractRecordId(kl.fields.zugewiesener_kurs);
      if (kursId) {
        map.set(kursId, kl);
      }
    });
    return map;
  }, [kursleiter]);

  // Count participants per course
  const teilnehmerByKursId = useMemo(() => {
    const map = new Map<string, number>();
    teilnehmer.forEach((t) => {
      // angemeldete_kurse is multipleapplookup - can be string, array, or undefined
      const kurseField = t.fields.angemeldete_kurse;
      if (!kurseField) return;

      // Handle both string and array formats
      let urlsToProcess: string[] = [];
      if (Array.isArray(kurseField)) {
        urlsToProcess = kurseField.filter((item): item is string => typeof item === 'string');
      } else if (typeof kurseField === 'string') {
        urlsToProcess = [kurseField];
      }

      // Extract record IDs from each URL
      urlsToProcess.forEach((url) => {
        const matches = url.match(/[a-f0-9]{24}/gi);
        if (matches) {
          matches.forEach((kursId) => {
            map.set(kursId, (map.get(kursId) || 0) + 1);
          });
        }
      });
    });
    return map;
  }, [teilnehmer]);

  // Stats
  const stats = useMemo(
    () => ({
      activeKurse: upcomingKurse.length,
      totalTeilnehmer: teilnehmer.length,
      totalKursleiter: kursleiter.length,
    }),
    [upcomingKurse, teilnehmer, kursleiter]
  );

  // Get instructor name for a course
  const getInstructorName = (kursId: string) => {
    const kl = kursleiterByKursId.get(kursId);
    if (!kl) return null;
    return `${kl.fields.kursleiter_vorname || ''} ${kl.fields.kursleiter_nachname || ''}`.trim();
  };

  // Get participant count for a course
  const getParticipantCount = (kursId: string) => {
    return teilnehmerByKursId.get(kursId) || 0;
  };

  // Format time for display
  const formatKursTime = (zeitplan: string | undefined) => {
    if (!zeitplan) return '';
    try {
      const date = parseISO(zeitplan);
      return format(date, 'EEEE, HH:mm', { locale: de });
    } catch {
      return '';
    }
  };

  const formatKursDate = (zeitplan: string | undefined) => {
    if (!zeitplan) return '';
    try {
      const date = parseISO(zeitplan);
      return format(date, 'dd.MM.yyyy', { locale: de });
    } catch {
      return '';
    }
  };

  // Calculate hours until next course
  const hoursUntilNext = useMemo(() => {
    if (!nextKurs?.fields.kurs_zeitplan) return 24;
    const kursDate = parseISO(nextKurs.fields.kurs_zeitplan);
    return Math.max(0, differenceInHours(kursDate, now));
  }, [nextKurs, now]);

  const minutesUntilNext = useMemo(() => {
    if (!nextKurs?.fields.kurs_zeitplan) return 0;
    const kursDate = parseISO(nextKurs.fields.kurs_zeitplan);
    return Math.max(0, differenceInMinutes(kursDate, now));
  }, [nextKurs, now]);

  const timeUntilNext = useMemo(() => {
    if (!nextKurs?.fields.kurs_zeitplan) return '';
    const kursDate = parseISO(nextKurs.fields.kurs_zeitplan);
    return formatDistance(kursDate, now, { locale: de, addSuffix: true });
  }, [nextKurs, now]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchData} />;

  const maxCapacity = 10; // Default capacity per class

  return (
    <div className="min-h-screen bg-background">
      {/* Add Course Dialog */}
      <AddCourseDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={fetchData} />

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-medium">Yoga Studio</h1>
          <Button
            size="icon"
            className="rounded-full h-11 w-11 shadow-md"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </header>

        <main className="p-4 pb-24 space-y-6">
          {kurse.length === 0 ? (
            <EmptyState onAddCourse={() => setDialogOpen(true)} />
          ) : (
            <>
              {/* Hero: Next Course Card */}
              {nextKurs ? (
                <Card className="animate-fade-in shadow-[0_2px_8px_hsl(160_20%_20%/0.06)]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Nächster Kurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col items-center text-center">
                      {/* Countdown Ring with Time */}
                      <div className="relative mb-4">
                        <CountdownRing hoursUntil={hoursUntilNext} size={100} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">
                            {nextKurs.fields.kurs_zeitplan
                              ? format(parseISO(nextKurs.fields.kurs_zeitplan), 'HH:mm')
                              : '--:--'}
                          </span>
                        </div>
                      </div>

                      {/* Course Name */}
                      <h2 className="text-2xl font-semibold mb-1">
                        {nextKurs.fields.kurs_name || 'Unbenannter Kurs'}
                      </h2>

                      {/* Time Until */}
                      <p className="text-sm text-muted-foreground mb-3">{timeUntilNext}</p>

                      {/* Location */}
                      {nextKurs.fields.kurs_ort && (
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{nextKurs.fields.kurs_ort}</span>
                        </div>
                      )}

                      {/* Enrollment */}
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Teilnehmer</span>
                          <span className="font-medium">
                            {getParticipantCount(nextKurs.record_id)}/{maxCapacity}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (getParticipantCount(nextKurs.record_id) / maxCapacity) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="animate-fade-in">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Keine kommenden Kurse</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats Row */}
              <div className="animate-fade-in-delay-1 flex items-center justify-around py-4 bg-card rounded-xl border border-border">
                <div className="text-center px-4">
                  <div className="text-2xl font-semibold">{stats.activeKurse}</div>
                  <div className="text-xs text-muted-foreground">Kurse</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center px-4">
                  <div className="text-2xl font-semibold">{stats.totalTeilnehmer}</div>
                  <div className="text-xs text-muted-foreground">Teilnehmer</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center px-4">
                  <div className="text-2xl font-semibold">{stats.totalKursleiter}</div>
                  <div className="text-xs text-muted-foreground">Kursleiter</div>
                </div>
              </div>

              {/* Upcoming Courses List */}
              <section className="animate-fade-in-delay-2">
                <h2 className="text-base font-semibold mb-3">Kommende Kurse</h2>
                <div className="space-y-2">
                  {upcomingKurse.slice(0, 5).map((kurs) => (
                    <div
                      key={kurs.record_id}
                      className="bg-card rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {kurs.fields.kurs_name || 'Unbenannter Kurs'}
                          </h3>
                          {kurs.fields.kurs_ort && (
                            <p className="text-sm text-muted-foreground truncate">
                              {kurs.fields.kurs_ort}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-3">
                          <div className="text-sm font-medium">
                            {kurs.fields.kurs_zeitplan
                              ? format(parseISO(kurs.fields.kurs_zeitplan), 'HH:mm')
                              : '--:--'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatKursDate(kurs.fields.kurs_zeitplan)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingKurse.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Keine kommenden Kurse
                    </p>
                  )}
                </div>
              </section>

              {/* Instructors List */}
              <section className="animate-fade-in-delay-3">
                <h2 className="text-base font-semibold mb-3">Kursleiter</h2>
                <div className="space-y-2">
                  {kursleiter.map((kl) => {
                    const kursId = extractRecordId(kl.fields.zugewiesener_kurs);
                    const assignedKurs = kursId ? kurse.find((k) => k.record_id === kursId) : null;
                    return (
                      <div
                        key={kl.record_id}
                        className="bg-card rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {`${kl.fields.kursleiter_vorname || ''} ${kl.fields.kursleiter_nachname || ''}`.trim() ||
                                'Unbekannt'}
                            </h3>
                            {assignedKurs && (
                              <p className="text-sm text-muted-foreground truncate">
                                {assignedKurs.fields.kurs_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {kursleiter.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Keine Kursleiter vorhanden
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </main>

        {/* Mobile FAB */}
        {kurse.length > 0 && (
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-[0_4px_12px_hsl(160_20%_20%/0.15)] z-20"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Desktop Header */}
        <header className="border-b border-border px-8 py-4 flex items-center justify-between bg-background">
          <h1 className="text-2xl font-medium">Yoga Kurs Management</h1>
          <Button className="gap-2 rounded-lg" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Neuen Kurs anlegen
          </Button>
        </header>

        <main className="p-8">
          {kurse.length === 0 ? (
            <EmptyState onAddCourse={() => setDialogOpen(true)} />
          ) : (
            <div className="grid grid-cols-[65%_35%] gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Hero Card: Next Course */}
                {nextKurs ? (
                  <Card className="animate-fade-in shadow-[0_2px_8px_hsl(160_20%_20%/0.06)] hover:shadow-[0_4px_16px_hsl(160_20%_20%/0.1)] transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-8">
                        {/* Countdown Ring */}
                        <div className="relative flex-shrink-0">
                          <CountdownRing hoursUntil={hoursUntilNext} size={120} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">
                              {nextKurs.fields.kurs_zeitplan
                                ? format(parseISO(nextKurs.fields.kurs_zeitplan), 'HH:mm')
                                : '--:--'}
                            </span>
                            <span className="text-xs text-muted-foreground">Uhr</span>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">Nächster Kurs</p>
                          <h2 className="text-2xl font-semibold mb-2">
                            {nextKurs.fields.kurs_name || 'Unbenannter Kurs'}
                          </h2>

                          <div className="flex items-center gap-4 text-muted-foreground mb-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{timeUntilNext}</span>
                            </div>
                            {nextKurs.fields.kurs_ort && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm">{nextKurs.fields.kurs_ort}</span>
                              </div>
                            )}
                          </div>

                          {/* Enrollment Bar */}
                          <div className="max-w-sm">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Teilnehmer</span>
                              <span className="font-medium">
                                {getParticipantCount(nextKurs.record_id)}/{maxCapacity}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{
                                  width: `${Math.min(100, (getParticipantCount(nextKurs.record_id) / maxCapacity) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="animate-fade-in">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">Keine kommenden Kurse</p>
                    </CardContent>
                  </Card>
                )}

                {/* Upcoming Courses Table */}
                <Card className="animate-fade-in-delay-1">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Kommende Kurse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingKurse.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Kursname</TableHead>
                            <TableHead>Zeit</TableHead>
                            <TableHead>Ort</TableHead>
                            <TableHead>Kursleiter</TableHead>
                            <TableHead className="text-right">Teilnehmer</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingKurse.slice(0, 10).map((kurs) => {
                            const instructorName = getInstructorName(kurs.record_id);
                            const participantCount = getParticipantCount(kurs.record_id);
                            return (
                              <TableRow
                                key={kurs.record_id}
                                className="hover:bg-accent/50 cursor-pointer transition-colors"
                              >
                                <TableCell className="font-medium">
                                  {kurs.fields.kurs_name || 'Unbenannt'}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    {kurs.fields.kurs_zeitplan
                                      ? format(parseISO(kurs.fields.kurs_zeitplan), 'EEE, HH:mm', {
                                          locale: de,
                                        })
                                      : '-'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatKursDate(kurs.fields.kurs_zeitplan)}
                                  </div>
                                </TableCell>
                                <TableCell>{kurs.fields.kurs_ort || '-'}</TableCell>
                                <TableCell>{instructorName || '-'}</TableCell>
                                <TableCell className="text-right">
                                  {participantCount}/{maxCapacity}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Keine kommenden Kurse vorhanden
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Stat Cards */}
                <Card className="animate-fade-in-delay-1 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.activeKurse}</div>
                      <div className="text-sm text-muted-foreground">Aktive Kurse</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in-delay-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.totalTeilnehmer}</div>
                      <div className="text-sm text-muted-foreground">Angemeldete Teilnehmer</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in-delay-3 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.totalKursleiter}</div>
                      <div className="text-sm text-muted-foreground">Kursleiter</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Instructors List */}
                <Card className="animate-fade-in-delay-4">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Kursleiter Übersicht</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {kursleiter.map((kl) => {
                        const kursId = extractRecordId(kl.fields.zugewiesener_kurs);
                        const assignedKurs = kursId
                          ? kurse.find((k) => k.record_id === kursId)
                          : null;
                        return (
                          <div
                            key={kl.record_id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                          >
                            <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {`${kl.fields.kursleiter_vorname || ''} ${kl.fields.kursleiter_nachname || ''}`.trim() ||
                                  'Unbekannt'}
                              </h4>
                              {assignedKurs && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {assignedKurs.fields.kurs_name}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {kursleiter.length === 0 && (
                        <p className="text-center text-muted-foreground py-4 text-sm">
                          Keine Kursleiter vorhanden
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
