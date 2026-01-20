# Design Brief: Yoga Kurs Management Dashboard

## 1. App Analysis

### What This App Does
This is a yoga studio management system that tracks courses (Kursverwaltung), assigns instructors to courses (Kursleiterzuordnung), and manages participant registrations (Teilnehmeranmeldung). It allows studio owners to see their class schedule, know which instructor teaches which class, and track how many students are enrolled.

### Who Uses This
A yoga studio owner or manager who needs a quick overview of their classes, instructors, and participants. They're busy people who want to see at a glance: "What's happening today? How many students are signed up? Which instructors are teaching?"

### The ONE Thing Users Care About Most
**Upcoming classes and their enrollment.** The user wants to immediately see what's happening next and whether people are signed up. This is the pulse of their business.

### Primary Actions (IMPORTANT!)
1. **Neuen Kurs anlegen** → Primary Action Button - Adding a new yoga class is the most frequent action
2. View participant list for a class
3. Check instructor assignments

---

## 2. What Makes This Design Distinctive

### Visual Identity
The design evokes calm, balance, and mindfulness - core yoga values. A warm sand-toned background with a deep sage green accent creates an earthy, grounded aesthetic. The visual language feels like stepping into a high-end yoga studio: serene, intentional, and welcoming. This is NOT a generic business dashboard but a purpose-built tool for wellness professionals.

### Layout Strategy
- **Asymmetric hero layout**: The hero is a large "Nächster Kurs" (next class) card that dominates the top portion, showing the immediate upcoming class with countdown and enrollment. This answers "What's happening next?" instantly.
- **Size variation creates hierarchy**: The hero card is 2x the height of secondary KPIs, making it impossible to miss.
- **Secondary KPIs flow horizontally**: Three compact stat cards (Total Kurse, Teilnehmer, Kursleiter) sit below in a row, providing context without competing.
- **Visual grouping**: The upcoming classes list and instructor overview are grouped in a lower section with clear separation.

### Unique Element
The hero "Nächster Kurs" card features a **circular countdown ring** around the time display. The ring fills based on how soon the class is (full = starting now, half = hours away). This creates a visual urgency indicator that yoga instructors can glance at from across the room. The ring uses a subtle gradient from sage to a lighter mint tone.

---

## 3. Theme & Colors

### Font
- **Family:** Outfit
- **URL:** `https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap`
- **Why this font:** Outfit has soft, rounded terminals that feel approachable and calming - perfect for a wellness app. It's modern without being cold, readable at all sizes, and has excellent weight variety for creating hierarchy.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(35 30% 96%)` | `--background` |
| Main text | `hsl(160 25% 15%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(160 25% 15%)` | `--card-foreground` |
| Borders | `hsl(35 20% 88%)` | `--border` |
| Primary action | `hsl(160 35% 35%)` | `--primary` |
| Text on primary | `hsl(0 0% 100%)` | `--primary-foreground` |
| Accent highlight | `hsl(160 30% 90%)` | `--accent` |
| Muted background | `hsl(35 20% 93%)` | `--muted` |
| Muted text | `hsl(160 10% 45%)` | `--muted-foreground` |
| Success/positive | `hsl(145 45% 40%)` | (component use) |
| Error/negative | `hsl(0 65% 50%)` | `--destructive` |

### Why These Colors
The warm sand background (subtle yellow undertone) paired with sage green accents creates an earthy, natural palette that resonates with yoga's connection to nature and balance. The sage green is sophisticated and calming, unlike generic blues. The warm neutrals feel like natural linen, creating a spa-like digital environment.

### Background Treatment
The page background is a warm off-white (`hsl(35 30% 96%)`) - not pure white, which would feel clinical. Cards sit on pure white to create subtle lift. This layered approach gives depth without heavy shadows.

---

## 4. Mobile Layout (Phone)

Design mobile as a COMPLETELY SEPARATE experience, not squeezed desktop.

### Layout Approach
The hero card dominates the first viewport (60% of screen height), ensuring users immediately see their next class. Below, secondary KPIs are displayed as a compact horizontal scroll row, not cards. This preserves vertical space while still providing key stats. The design uses size and weight variation - the hero number is 48px, secondary stats are 24px.

### What Users See (Top to Bottom)

**Header:**
- Simple title "Yoga Studio" (left-aligned, 20px, font-weight 500)
- Primary action button "+" icon (right side, circular, 44px tap target)

**Hero Section (The FIRST thing users see):**
- **What:** Large card showing "Nächster Kurs" with class name, time, location, and enrollment count
- **How big:** Takes 55% of viewport height (below header)
- **Styling:**
  - Card has subtle shadow (`0 2px 8px hsl(160 20% 20% / 0.06)`)
  - Class name in 24px font-weight 600
  - Time displayed large (36px) with circular countdown ring around it (100px diameter)
  - Location in muted text below
  - Enrollment shown as "X/Y Teilnehmer" with subtle progress bar
- **Why hero:** Users open the app to see "what's next" - this answers that instantly

**Section 2: Quick Stats Row**
- Horizontal row with 3 inline stats (NOT cards):
  - "X Kurse" | "Y Teilnehmer" | "Z Kursleiter"
- Each stat: number in 24px font-weight 600, label in 12px muted
- Separated by subtle vertical dividers
- Padding: 16px vertical, scrollable if needed

**Section 3: Kommende Kurse**
- Section title "Kommende Kurse" (16px font-weight 600)
- List of next 5 classes as compact rows:
  - Class name (left), time (right)
  - Location in muted text below name
  - Subtle bottom border between items
- Tap to expand for details (instructor, full enrollment)

**Section 4: Kursleiter**
- Section title "Kursleiter" (16px font-weight 600)
- Compact list showing instructor names with their assigned course count
- Simple rows, no cards

**Bottom Navigation / Action:**
- Fixed floating action button (FAB) in bottom-right
- Sage green, 56px diameter, "+" icon
- Shadow for elevation
- This is the primary "Neuen Kurs anlegen" action

### Mobile-Specific Adaptations
- Hero card is vertically oriented (time/ring stacked above details)
- Stats become horizontal scroll row instead of grid
- Lists use full-width rows instead of cards
- All touch targets minimum 44px

### Touch Targets
- FAB: 56px
- List items: 48px minimum height
- Header action: 44px

### Interactive Elements
- Hero card tappable to see full class details
- "Kommende Kurse" items expandable on tap to show instructor + full enrollment

---

## 5. Desktop Layout

### Overall Structure
Two-column asymmetric layout (65% / 35%):
- **Left column (65%):** Hero card + Upcoming classes list
- **Right column (35%):** Stats cards + Instructors list
- Eye flow: Hero (top-left) → Stats (top-right) → Lists (bottom)

The hero card spans the full width of the left column at ~200px height, creating strong visual anchor. Below it, the upcoming classes table uses the remaining space.

### Section Layout

**Top Area (Full Width):**
- Header bar with "Yoga Kurs Management" title (left) and "Neuen Kurs anlegen" button (right)
- Button: sage green, rounded, with "+" icon and text

**Left Column:**
1. Hero "Nächster Kurs" card (200px height)
   - Horizontal layout: Left side has countdown ring (120px) + time
   - Right side has class name (large), location, enrollment bar
2. "Kommende Kurse" section
   - Table view with columns: Kursname | Zeit | Ort | Kursleiter | Teilnehmer
   - Alternating row backgrounds for readability
   - Hover highlights row

**Right Column:**
1. Three stat cards stacked vertically:
   - "Aktive Kurse" - count
   - "Angemeldete Teilnehmer" - total count
   - "Kursleiter" - count
   - Each card: white bg, subtle border, 80px height
2. "Kursleiter Übersicht" section
   - List showing each instructor with assigned courses
   - Compact rows with hover effect

### What Appears on Hover
- Table rows highlight with accent background
- Instructor rows show "Details anzeigen" link
- Hero card shows subtle glow effect
- Primary button shows slight scale (1.02)

### Clickable/Interactive Areas
- Hero card: Click opens course detail modal
- Table rows: Click opens course detail
- Instructor names: Click shows instructor's courses

---

## 6. Components

### Hero KPI
The MOST important metric that users see first.

- **Title:** Nächster Kurs
- **Data source:** Kursverwaltung (filtered to future dates, sorted by kurs_zeitplan ascending, take first)
- **Calculation:** Find the course with the nearest future `kurs_zeitplan` datetime
- **Display:**
  - Large card with countdown ring visualization
  - Shows: Course name (24px bold), Time with countdown ring, Location (muted), Enrollment fraction with progress bar
  - The countdown ring: SVG circle stroke, fills based on time until class (100% = within 1 hour, 50% = 6 hours, etc.)
- **Context shown:** Time until class starts, enrollment vs capacity (assume 10 per class as default)
- **Why this is the hero:** Yoga instructors need to know "what's next" - this answers their immediate question

### Secondary KPIs

**Aktive Kurse**
- Source: Kursverwaltung
- Calculation: Count of all courses with `kurs_zeitplan` in the future
- Format: number
- Display: Stat card with large number, label below

**Angemeldete Teilnehmer**
- Source: Teilnehmeranmeldung
- Calculation: Count of all participant records
- Format: number
- Display: Stat card with large number, label below

**Kursleiter**
- Source: Kursleiterzuordnung
- Calculation: Count of all instructor records
- Format: number
- Display: Stat card with large number, label below

### Chart
No chart needed - the data is better represented as lists and the hero countdown visualization. Charts would add complexity without value for this use case.

### Lists/Tables

**Kommende Kurse**
- Purpose: See all upcoming classes at a glance
- Source: Kursverwaltung (filtered to future, sorted by kurs_zeitplan)
- Fields shown: kurs_name, kurs_zeitplan (formatted as "Mo, 14:00"), kurs_ort
- Mobile style: Simple list with expandable rows
- Desktop style: Table with columns
- Sort: By kurs_zeitplan ascending
- Limit: 10 items
- Enhancement: Join with Kursleiterzuordnung to show instructor name, join with Teilnehmeranmeldung to show enrollment count

**Kursleiter Liste**
- Purpose: Quick reference of instructors and their workload
- Source: Kursleiterzuordnung
- Fields shown: Full name (vorname + nachname), assigned course name (via lookup)
- Mobile style: Simple list
- Desktop style: Compact cards/rows
- Sort: By nachname
- Limit: All

### Primary Action Button (REQUIRED!)

- **Label:** "Neuen Kurs anlegen" (desktop), "+" icon only (mobile FAB)
- **Action:** add_record
- **Target app:** Kursverwaltung
- **What data:** Form with fields:
  - kurs_name (text input, required)
  - kurs_beschreibung (textarea)
  - kurs_zeitplan (datetime picker, required)
  - kurs_ort (text input)
- **Mobile position:** bottom_fixed (FAB style, bottom-right, 56px)
- **Desktop position:** header (right side, full button with text + icon)
- **Why this action:** Adding new yoga classes is the core workflow. The studio owner creates classes, then instructors and participants are assigned.

---

## 7. Visual Details

### Border Radius
rounded (12px for cards, 8px for buttons, 24px for FAB)

### Shadows
subtle - Cards: `0 1px 3px hsl(160 20% 20% / 0.04), 0 2px 8px hsl(160 20% 20% / 0.06)`
FAB: `0 4px 12px hsl(160 20% 20% / 0.15)`

### Spacing
spacious - 24px padding in cards, 16px gaps between elements, 32px section margins

### Animations
- **Page load:** Stagger fade-in (cards appear sequentially, 100ms delay each)
- **Hover effects:** Cards lift slightly (translateY -2px), buttons scale 1.02
- **Tap feedback:** Quick scale down (0.98) on press, spring back

---

## 8. CSS Variables (Copy Exactly!)

The implementer MUST copy these values exactly into `src/index.css`:

```css
@import "tailwindcss";

@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --background: hsl(35 30% 96%);
  --foreground: hsl(160 25% 15%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(160 25% 15%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(160 25% 15%);
  --primary: hsl(160 35% 35%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(35 20% 93%);
  --secondary-foreground: hsl(160 25% 15%);
  --muted: hsl(35 20% 93%);
  --muted-foreground: hsl(160 10% 45%);
  --accent: hsl(160 30% 90%);
  --accent-foreground: hsl(160 25% 15%);
  --destructive: hsl(0 65% 50%);
  --border: hsl(35 20% 88%);
  --input: hsl(35 20% 88%);
  --ring: hsl(160 35% 35%);
  --radius: 0.75rem;
  --font-family: 'Outfit', sans-serif;
}

body {
  font-family: var(--font-family);
}
```

---

## 9. Implementation Checklist

The implementer should verify:
- [ ] Font loaded from URL above (Outfit)
- [ ] All CSS variables copied exactly
- [ ] Mobile layout matches Section 4 (FAB, hero card, horizontal stats)
- [ ] Desktop layout matches Section 5 (two-column asymmetric)
- [ ] Hero element is prominent as described (countdown ring, large card)
- [ ] Colors create the mood described in Section 2 (warm sand + sage green)
- [ ] Primary action button present (FAB on mobile, header button on desktop)
- [ ] Upcoming courses list shows joined data (instructor, enrollment)
- [ ] Stagger animation on page load
- [ ] Touch targets meet minimum 44px on mobile
