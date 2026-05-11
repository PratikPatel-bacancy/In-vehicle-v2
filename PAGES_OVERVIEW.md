# Veriflow SeeControl — Pages Overview
### Client Presentation Document

---

## What is this product?

**Veriflow SeeControl** is an in-vehicle tablet dashboard built for law enforcement patrol officers.
It is mounted inside a police vehicle and used while driving or at a stop.

The system automatically reads license plates through cameras attached to the vehicle, checks them against criminal databases in real time, and alerts the officer instantly when a match is found.

---

## How the screen is laid out

Every screen shares the same structure:

```
┌──────────────────────────────────────────────────┐
│  TOP BAR  — Brand, shift stats, live clock       │
├──────────────────────────────────────────────────┤
│  STATUS RAIL  — Camera, GPS, network health      │
├──────────────────────────────────────────────────┤
│                                                  │
│           MAIN CONTENT AREA                      │
│         (changes per active tab)                 │
│                                                  │
├──────────────────────────────────────────────────┤
│  BOTTOM NAV  — 5 tabs the officer switches       │
└──────────────────────────────────────────────────┘
```

---

## Top Bar

**Always visible. Never changes.**

Shows the officer at a glance:

| Item | What it shows |
|------|--------------|
| Reads · Shift | Total plates scanned this shift (live counter) |
| Hits | How many hotlist matches found |
| Hit Rate | % of scanned plates that were a match |
| Confirmed | How many hits the officer confirmed |
| Unit | Officer's unit number with a green live dot |
| Clock | Live time updated every second |

---

## Status Rail

**A thin strip below the top bar showing system health.**

Officers need to know at a glance if their equipment is working:

- Front camera — live / frame rate
- Rear camera — live / frame rate
- GPS accuracy (RTK lock, precision in meters)
- Mobile network signal strength
- CAD (dispatch system) connection status
- NCIC database last sync time
- Total plates loaded in the hotlist
- A mute button to silence alerts during sensitive situations

If anything goes red, the officer knows immediately without opening any menu.

---

## Page 1 — PATROL *(default home screen)*

**What the officer sees while driving.**

This is the main screen, split into two sections:

### Left side — Dual Camera View
- Two large camera tiles side by side — **Front camera** and **Rear camera**
- Each tile shows the live feed with the detected license plate highlighted in a glowing box
- When a plate matches the hotlist, the box turns **red** and pulses
- Every read shows the plate number directly on the tile

### Right side — Map + Activity
**Map (top half of right side):**
- Shows the officer's current location on a dark tactical map
- Displays nearby patrol units (e.g. Unit-04, Unit-07)
- A Watch pin (amber/orange) marks the last known location of a flagged vehicle
- GPS coordinates and lock accuracy shown on the map

**Recent Activity list (bottom half of right side):**
- A scrollable list of every plate scanned this shift
- Each row shows: time, plate number, vehicle description, and which camera read it
- Hotlist hits appear at the top in **red** with a "HOTLIST" tag
- Clicking a hit row opens the full Hit Response screen

### Bottom strip — Live Read Ticker
- A horizontal scrolling strip showing plates as they are scanned in real time
- New plates slide in from the left with a brief cyan flash
- Shows read rate (e.g. "47 plates per minute")

---

## Page 2 — HITS

**A full list of every hotlist match from this shift.**

When the system detects a stolen vehicle, wanted plate, or any hotlist match, it shows up here.

### What each record shows:
- Time of detection
- Plate number + priority level (HIGH / MED / LOW)
- Current status: Pending, Confirmed, Dismissed, or Wrong State
- Vehicle description and which camera caught it

### Expanding a record shows:
- **Side-by-side plate comparison** — the captured photo vs. the original NCIC archive image
  *(This is a key differentiator — most competitors only show one image)*
- An auto-verification banner: "Plate & State Verified · Vehicle Visually Consistent"
- **Officer safety flags** — e.g. Armed & Dangerous, Prior Resisting Arrest
- Action buttons:
  - **Confirm Hit** — notifies dispatch immediately
  - **Wrong State** — if the plate matched but the state didn't
  - **Dismiss** — not a threat

### Sorting options:
- By Time, Priority, or Disposition

---

## Page 3 — LOOKUP

**Manual plate search — when the officer wants to check a plate themselves.**

### Plate Query section:
- Type in a full plate number (e.g. JLW8931) and hit Search
- Toggle "Partial match" to search with wildcards (e.g. JLW* or *8931)
- Results show every time that plate was seen this shift — time and camera

### Vehicle Fingerprint Search:
- Search by vehicle description instead of a plate number
- Filter by: Make, Color, Body Type (Pickup, SUV, Sedan, etc.)
- Set a time range: Last 30 min / 1 hour / 4 hours / Full shift
- Set a radius from the officer's current location (0.5 to 10 miles)
- Useful when the plate is unknown but the officer remembers "a black SUV"

---

## Page 4 — WATCH

**Incoming notices from dispatch that aren't yet in the NCIC database.**

When a dispatcher sends a "watch for this vehicle" message — for example, a vehicle seen leaving a crime scene before the report is filed — it appears here in real time.

### Each notice shows:  
- **Priority chip** — HIGH (red), MED (amber), LOW (gray)
- Plate number and state (if known) — or "PLATE UNKNOWN" if only a description is available
- Vehicle description (e.g. "2019 Black Chevrolet Tahoe · Tinted windows")
- **Reason** — e.g. "Armed Robbery Suspect — Approach with extreme caution"
- **Area of interest** — e.g. "N. Main & I-35 corridor · Within 2mi"
- **Expiry time** — when the notice expires (e.g. 16:00 or "Until Notice")
- **Source** — who issued it (e.g. Dispatch · Unit 07, or CAD case number)

### Current active notices (sample data):
1. **HIGH** — RTX5521 TX · Black Chevrolet Tahoe · Armed Robbery Suspect
2. **MED** — Unknown plate · Silver SUV · Hit & Run near school zone
3. **MED** — MXP3389 NM · White Toyota Highlander · Missing juvenile
4. **LOW** — BXC8801 TX · Blue Ford Explorer · Parole violation curfew check

A pulsing green **CAD LIVE** indicator shows the feed is connected to dispatch in real time.

---

## Page 5 — STAKEOUT

**Fixed camera mode — when the officer parks and monitors an area.**

Normally the cameras are scanning plates as the vehicle moves. Stakeout mode is for when the officer parks in a location and wants to run both cameras as a stationary monitoring point.

### How it works:
1. Officer taps **"I'm Parked · Activate"**
2. Both cameras switch to fixed ALPR mode
3. A **geofence radius** can be set (0.1 to 2 miles) — alerts only fire for plates inside that area
4. All reads are GPS-tagged and logged to the shift record

### While active, shows:
- Live elapsed time
- Total plates read since activation
- Which cameras are running
- GPS position
- A live scrolling table of every plate read — plate, state, camera, timestamp
- Each new plate flashes cyan as it comes in

### To stop:
Tap **"Stop Stakeout"** — clears the session and returns to normal patrol mode.

---

## Special Screen — Hit Response Mode

**This takes over the entire screen when a stolen or wanted vehicle is detected.**

This is the most important moment in the product. The full screen goes into alert mode:

- A **red pulsing border** surrounds the entire screen
- An alarm sound plays (3-tone sequence)

### The screen is split into 3 columns:

**Column 1 — Captured Live**
- The actual photo taken by the camera showing the vehicle
- The license plate is highlighted with a red box
- A zoomed-in plate callout shows the exact characters read
- Shows: time and which camera detected it

**Column 2 — NCIC Archive Photo**
- The original photo on file from when the vehicle was reported stolen
- Same plate callout for direct comparison
- Auto-verification banner: "Plate & State Verified · Vehicle Visually Consistent"
- Shows: report date, state match, plate match

**Column 3 — Officer Briefing**
- **Officer Safety flags** — Armed & Dangerous, Prior Resisting, etc.
- **Legal notice** — reminder that ALPR alone is not basis for stop; confirm via dispatch
- Vehicle details: Make, model, year, color, speed, direction of travel
- Hotlist source: NCIC database, priority, originating agency, case number
- Location: GPS coordinates and street intersection

### Action buttons (bottom of column 3):
- **Confirm Hit · Notify Dispatch** (red) — one tap sends everything to CAD
- **Wrong State** — if state doesn't match
- **Wrong Plate** — if plate is misread
- **Acknowledge · Don't Intercept** — officer is aware but not pursuing

### After confirming:
A green confirmation overlay appears showing all auto-actions completed:
- CAD entry created with case number
- Body-worn camera marked
- Unit status changed to "Investigating"
- Plate copied to clipboard
- Nearby units (within 2 miles) alerted automatically

One tap. Everything done.
