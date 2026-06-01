# Dawdly — Product Document

## What is Dawdly?

Dawdly is a personal calendar app built around one idea: **give people something to look forward to.**

Most calendar apps are productivity tools — they're for managing obligations, meetings, and deadlines. Dawdly is the opposite. It's a place to put the things that make life feel good: a concert next month, a weekend camping trip, a birthday dinner, a spa day. Each event gets a hand-illustrated charm icon that makes it feel like something worth anticipating, not just scheduling.

The name captures the feeling — to dawdle is to linger, to savour time rather than race through it. Dawdly invites you to slow down and notice what you're looking forward to.

---

## Who is it for?

Anyone who wants a warmer, more visual way to see their personal life on a calendar. Dawdly works alongside (not instead of) tools like Google Calendar or Outlook. Those handle your work schedule. Dawdly holds the moments you're excited about.

---

## Views

### Week View (default)
The main view. Shows a full 7-day week on desktop and tablet, and a rolling 3-day window on mobile. It is a proper **24-hour time grid** — scrollable, with hour markers in the left gutter, hour lines, half-hour ticks, and a live current-time indicator (dot + line) for today.

**Personal events** appear as **charm stickers** — floating illustrated icons placed at the correct time position in each day column. Each sticker can be:
- **Dragged** anywhere in the column (click and hold to grab, release to drop)
- **Rotated** via a handle that appears on hover (drag the ↻ handle)
- **Resized** individually via − / + controls that appear on hover
- All customisations (position, rotation, size) are saved to the browser so they persist between sessions

**Work events** appear as duration-based blocks anchored to their start and end times, with lane collision detection so overlapping events sit side-by-side rather than on top of each other. Work events that span midnight display a continuation stripe at the top or bottom of the appropriate column.

At the bottom of the week view is an **"On the horizon"** strip: a horizontal scroll of upcoming personal events beyond the current week, showing each charm and a relative date ("in 3 days", "next month"). On mobile the strip shows compact charm thumbnails; on desktop it shows full cards with the event title.

### Month View
A traditional grid calendar for the full month. On desktop and tablet, days show small charm icon previews for personal events. On mobile, days show colored dots (personal) and text pills (work). Clicking any day in month view opens the **Day View** for that date.

### Day View
A focused single-day view. Shows the date large in the header with a relative countdown for future dates ("in 3 days"). If today, the header says "today ♡".

Personal and work events each appear as full cards:
- **Personal events** get a large charm icon (160px), a colored card background, and the event title and time
- **Work events** get a minimal left-border treatment with a **done toggle** — a checkmark button appears on hover, and marking it done strikes through the title and turns the border accent color

If both personal and work events exist on the same day, they display in side-by-side columns (stacked on mobile).

---

## Events

Every event has:
- **Title** — what you're looking forward to (or what the meeting is)
- **Type** — Personal or Work
- **Start date + start time** (both required)
- **End date + end time** (both required; end date defaults to the same day, or the next day if end time is before start time)
- **Note** (optional free-text)
- **Charm** — the illustrated icon that represents it (personal events only)
- **Done** (work events only) — can be toggled in day view

### Personal vs. Work
Personal events are the heart of Dawdly. They get charms, color, and prominent visual treatment. Work events are deliberately minimal — duration blocks in week view, left-bordered cards in day view — so they don't compete with the things you're actually excited about.

### Multi-day events
Events can span multiple days. If start and end dates differ, work events span across day columns in week view showing a continuation marker at each day boundary.

---

## Charms

Charms are hand-illustrated PNG icons that give each personal event its character. There are **36 charms** available in the picker, organized into 8 categories:

| Category | Examples |
|---|---|
| Food & Drinks | coffee, ramen, wine glass, baking, cupcake, popcorn |
| Travel & Outdoors | plane, road trip van, boat, beach, mountains, camping tent, hiking boots, car |
| Sports & Fitness | gym, yoga, basketball, football, soccer, tennis |
| Celebrations | balloons, birthday cake, gifts, graduation cap, wedding ring |
| Arts & Creativity | easel, camera, book, mic |
| Social & Lifestyle | friends, shopping bags, dress |
| Home & Family | new house, babies, cat and dog |
| Wellness | spa |

**Auto-suggest:** When you type an event title, Dawdly automatically suggests a matching charm based on keywords. Typing "birthday dinner" suggests the birthday cake charm; "hiking trip" suggests hiking boots. You can override the suggestion by picking any charm from the grid.

**Search:** The charm picker has a search field so you can type any keyword (e.g. "coffee", "travel", "party") to filter the grid.

**Charm categories:** When not searching, charms are shown grouped by category so browsing feels intuitive.

There is also a set of 12 **extra charms** (stars, moons, flowers, leaves, hearts, snowflake, sun) used as fallbacks when no keyword match is found — each event gets a consistent fallback derived from its ID, so it never looks blank.

---

## Adding & Editing Events

Tap **+ add** in the header (or tap any day in week/month view) to open the event modal. On mobile it slides up as a bottom sheet; on desktop it appears as a centered dialog.

The modal requires a title, start time, and end time. End date defaults intelligently — same day unless the end time is before the start time, in which case it defaults to the next day.

To edit an existing event, tap it. The same modal opens pre-filled. Changes are saved immediately on confirm.

To delete an event, hover over it in any view — a small `×` appears in the corner.

---

## Google Calendar Import

A **gcal** button in the header lets you connect your Google Calendar and pull in upcoming events. The import flow:

1. Click **gcal** — if not yet connected, a Google OAuth popup opens
2. Once authenticated, a panel shows all events from the next 90 days
3. Events already imported are shown greyed out with an "imported" label
4. Select or deselect events, then tap **import** to add them to Dawdly as work events
5. The button shows **gcal ✓** with an amber highlight when connected; clicking it re-opens the import panel to sync again
6. A **disconnect** option is available inside the panel to revoke the connection

Imported events carry a `googleEventId` so re-importing won't create duplicates.

---

## Navigation

- **Today** — jumps the calendar back to the current date in any view
- **‹ / ›** — moves backward or forward (by 3 days / 7 days on week, month, or single day depending on current view and breakpoint)
- **Day / Week / Month toggle** — switches between the three views; on desktop and tablet this sits right next to the Dawdly logo in the header; on mobile it lives in the bottom navigation bar

---

## Data & Privacy

All events are stored locally in the browser via `localStorage`. Nothing is sent to a server (except the Google Calendar OAuth flow if you choose to connect). There are no accounts, no sync, and no tracking beyond that. Your data lives on your device.

---

## Responsive Design

Dawdly adapts across three breakpoints:

| Breakpoint | Min width | Differences |
|---|---|---|
| Mobile | 320px | 3-day week view, bottom nav bar, compact horizon charm dots, bottom-sheet modal |
| Tablet | 600px | 7-day week, header nav, full horizon strip with event cards |
| Desktop | 900px | Same as tablet |

---

## Purpose

Dawdly exists because most people's calendars are full of things they have to do and empty of things they want to do. The act of adding something to Dawdly — a trip, a dinner, a show — is itself a small ritual of anticipation. Arranging your charms on the scrapbook-style time grid, tilting them, sizing them just right: it makes your calendar feel like something personal, not a task list.

The goal isn't to replace your existing calendar. It's to sit beside it as the version that makes you smile.
