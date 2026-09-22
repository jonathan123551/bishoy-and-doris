# Reception Transition & Mobile Scroll Architecture Analysis

> **Status**: Investigation & Root-Cause Diagnosis Complete. **No code has been modified or pushed.**

---

## A. The Diagnosis: Root Causes

After analyzing the document flow, ScrollTrigger lifecycle, and CSS stacking contexts across `CeremonyScene.jsx`, `ReceptionScene.jsx`, `globals.css`, and `useLenis.js`, there are **three distinct root causes** responsible for the issues reported by the user:

### 1. The "Blue Empty Frame" Between Ceremony and Reception
The blue frame is **not** an empty gap between sections. It is **the opaque CSS background color of `.ceremony-cinematic` itself (`background: #03152c;`) plus `.ceremony-blue-glow`**.
- In `CeremonyScene.jsx`, the exit timeline (progress `0.88` to `1.0`) fades out:
  1. `.ceremony-content` (`autoAlpha: 0`)
  2. `.ceremony-bg` (the church image, `autoAlpha: 0`)
  3. `.ceremony-overlay` (`opacity: 0`)
- **Neither `.ceremony-cinematic` nor `.ceremony-blue-glow` is ever faded out.**
- `.ceremony-cinematic` has `z-index: 20; background: #03152c; isolation: isolate;`.
- Because `.ceremony-cinematic` sits at `z-index: 20` directly on top of Reception (`z-index: 10`), fading the church photo out merely unmasks Ceremony's own solid navy blue container.
- Reception's twilight image is already physically situated at `top: 0` underneath Ceremony, but it is **100% occluded by the opaque navy background of `.ceremony-cinematic`**.
- When Ceremony reaches progress `1.0` (1400px of scroll), ScrollTrigger unpins Ceremony, snapping it 1400px off-screen. Only at that instant does the navy box vanish, causing the Reception image to suddenly pop into view.

### 2. The "Background Content Moving Underneath" on Mobile
The user observed that on mobile, lower content appears to slide underneath the pinned scene during scroll. This is caused by:
- **`100svh` vs Dynamic Mobile Viewport (`100dvh`)**: All cinematic sections (`.ceremony-cinematic`, `.ns-cinematic`, `.rec-cinematic`) use `height: 100svh; min-height: 680px;`. On mobile browsers (Safari / Chrome iOS), `100svh` corresponds to the *Small Viewport Height* (when the URL bar is fully expanded, ~740px on iPhone 14/15/16). As soon as the user scrolls, the URL bar retracts, expanding the viewport to `100lvh` (~844px). Because the pinned section remains fixed at `100svh` (740px), **an 80px–104px gap opens at the bottom of the screen**.
- **`pinSpacing: false` on Ceremony**: Because Ceremony has no spacer, `ReceptionScene` (`.rec-scroll`) is physically moving up from the bottom of the document during the first `H` pixels of Ceremony's scroll. Through the `100svh` gap at the bottom of the mobile viewport, the user visibly watches the lower section scrolling upwards underneath.
- **Lenis is disabled on mobile**: In `src/hooks/useLenis.js`, touch devices bypass Lenis (`isTouchDevice ? return : ...`). On desktop, Lenis damps velocity and hides micro-seams; on mobile, raw touch swipes expose the bottom gap immediately.
- **Premature element transparency in Names**: In `NamesScene.jsx`, line 240 sets `tl.set(section, { autoAlpha: 0 }, 0.96)`. This abruptly turns the entire Names scene transparent at 96% progress while Ceremony is still scrolling up towards it.

### 3. The "Dead Blue Gap / Empty Space" Before DateSequence
The gap before DateSequence is caused by a **mathematical mismatch between `.rec-scroll`'s CSS height and Reception's ScrollTrigger timeline**:
- Ceremony has `end: '+=1400'` and `pinSpacing: false`.
- On an iPhone (viewport height $H \approx 800\text{px}$), Reception reaches `top: 0` after $H$ pixels of scroll, while Ceremony is still pinned for another $1400 - H = 600\text{px}$.
- In `globals.css`, `.rec-scroll` was given `height: calc(100svh + 1100px)` ($\approx 1900\text{px}$).
- In `ReceptionScene.jsx`, ScrollTrigger was set to `end: '+=1100'`.
- This caused Reception's text animation to finish at $1100\text{px}$ from `.rec-scroll`'s top.
- But `.rec-scroll` continues for another $800\text{px}$ before its bottom clears the viewport and hands off to `DateSequence`.
- For those $800\text{px}$ of scrolling (a full screen height), Reception's animation is frozen. Then, as `DateSequence` scrolls up, all of its elements (`.ds-kicker`, `.ds-glyph`, `.ds-details`) start with `autoAlpha: 0` against `var(--color-bg)` (solid navy). The user scrolls through nearly $800\text{px}$ of empty blue void before Date's clock/glyphs start appearing.

---

## B. Direct Evidence from Codebase

| File | Line / Selector | Setting / Code | Evidence of Problem |
|---|---|---|---|
| `src/styles/globals.css` | Line 2185 (`.ceremony-cinematic`) | `background: #03152c; isolation: isolate;` | Creates an opaque navy block that hides any element stacked underneath it (`z-index: 10`). |
| `src/styles/globals.css` | Line 2239 (`.ceremony-blue-glow`) | `background: radial-gradient(...); opacity: 0.65;` | An active blue glow overlay that remains fully visible even when church photo fades out. |
| `src/components/CeremonyScene.jsx` | Lines 270–301 (`CEREMONY EXIT`) | Fades `content`, `bg`, and `overlay`, but **not** `sectionRef.current` or `.ceremony-blue-glow` | Fading the photo reveals Ceremony's own `#03152c` navy background, creating the "blue empty frame." |
| `src/styles/globals.css` | Line 2179, 2893, 3327 | `height: 100svh; min-height: 680px;` | On iOS, when browser chrome collapses, the viewport is `844px`, but `100svh` stays at `~740px`, leaving a moving gap at the bottom where lower sections show. |
| `src/components/CeremonyScene.jsx` | Line 53 | `pinSpacing: false` | Normal DOM flow moves Reception upwards under Ceremony during scroll. Combined with `100svh`, Reception's upward slide is visible through the bottom gap. |
| `src/styles/globals.css` | Line 3314 (`.rec-scroll`) | `height: calc(100svh + 1100px);` | Together with `ReceptionScene`'s `end: '+=1100'`, leaves $\approx 800\text{px}$ of dead scroll space before `DateSequence` arrives. |
| `src/components/DateSequence.jsx` | Lines 15–20 | `gsap.set('.ds-kicker', { autoAlpha: 0 })`, etc. | DateSequence starts with 100% invisible text over `var(--color-bg)`, making the post-Reception scroll dead zone look like a blank screen. |
| `src/components/NamesScene.jsx` | Line 240 | `tl.set(section, { autoAlpha: 0 }, 0.96);` | Prematurely hides Names container before Ceremony arrives at the top. |
| `src/hooks/useLenis.js` | Lines 13–16 | `if (isTouchDevice) return;` | Disables Lenis on touch devices, meaning mobile has zero scroll interpolation to mask geometry mismatches. |

---

## C. Why Previous Attempts Failed

1. **Attempt A (Nested ScrollTrigger pin on Reception)**:
   - *Why it failed*: Ceremony had `pinSpacing: false`, so Reception reached `top: 0` while Ceremony was still pinned at `position: fixed`. When two independent ScrollTrigger pins overlap without spacing, GSAP's pin-spacer calculations corrupt the scroll trigger start/end offsets of all downstream sections (`DateSequence`, `PhotoStory`, etc.), causing elements to trigger prematurely or freeze.
2. **Attempt B (Sticky wrapper `.rec-scroll` + `.rec-cinematic`)**:
   - *Why it failed on its own*: The sticky architecture is technically sound, but it did nothing to address `.ceremony-cinematic`'s opaque `#03152c` background. Reception was physically sticky underneath Ceremony, but the user was looking at an opaque navy wall. Furthermore, `.rec-scroll`'s height was miscalculated, creating the dead gap before DateSequence.
3. **Attempt C (Reception image opacity $0 \to 1$)**:
   - *Why it failed*: Fading in Reception's image after Ceremony unpinned meant that during the handoff, the image wasn't visible yet. The user saw Ceremony disappear into a void, then waited for Reception to fade in.
4. **Attempt D (Reception image opacity $1$ from start)**:
   - *Why it failed*: Even though the image had `opacity: 1`, it was positioned behind Ceremony (`z-index: 10` vs `z-index: 20`). Because Ceremony's container was an opaque navy box `#03152c`, Reception's image could not be seen until Ceremony was completely unpinned.
5. **Attempt E (`START_DELAY = overlapPixels / 1100`)**:
   - *Why it failed*: In a timeline with `end: '+=1100'`, delaying the text by `overlapPixels / 1100` compressed the entire text reveal into the remaining $1100 - 600 = 500\text{px}$ of scroll. It rushed the text while doing nothing to solve Ceremony's opaque background or the dead gap at the end.
6. **Attempt F (Negative margin overlap: `margin-top: calc(100svh - 1400px)`)**:
   - *Why it failed*: Negative margins pull the element up in normal document flow, which causes ScrollTrigger's offset caching (`getBoundingClientRect()`) to misalign with native scroll. It pulled `DateSequence` and `PhotoStory` up by 600px, triggering their animations before the user even scrolled to them.
7. **Attempt G (Hiding Reception image at the end)**:
   - *Why it failed*: Fading Reception to `opacity: 0` at 0.94 created another black/navy void before DateSequence reached the top.

---

## D. The Proposed Architecture

To achieve a seamless cinematic cross-fade:

$$\text{Ceremony} \xrightarrow{\text{smooth cross-dissolve}} \text{Reception Image (already full-screen)} \xrightarrow{\text{progressive text reveal}} \text{Date Sequence}$$

without any blue frames, moving background seams, or dead scroll gaps:

```
[Document Flow Timeline]
Scroll: 0px ────────────── 100vh ────────────── 100vh+1100px ───────────── 100vh+2500px ───────────────────── 100vh+3600px
Scene:  [ OpeningScene ]   [  NamesScene  ]     [     CeremonyScene     ]  [      ReceptionScene (Text)     ]  [ DateSequence ]
State:  pinSpacing:false   pinSpacing:true      pin:true, pinSpacing:false  position:sticky in .rec-scroll     pin:true
                                                (1400px duration)           (active text scrub: 1100px)
                                                                            
                                                ├─── H pixels ──┤
                                                Reception slides
                                                up to top: 0
                                                                ├─── 600px ──┤ (Overlap)
                                                                Ceremony & Reception both at top: 0
                                                                At 1232px: Church photo & overlay dissolve
                                                                Ceremony container background is TRANSPARENT
                                                                -> Directly reveals Reception twilight image!
                                                                At 1400px: Ceremony cleanly unpins.
                                                                                Reception text begins!
                                                                                Reception text completes at 2500px.
                                                                                DateSequence arrives at 2500px (NO GAP).
```

### Key Architectural Fixes:

1. **Make `.ceremony-cinematic` Container Transparent During Exit (or entirely transparent with background on overlay)**:
   - Move `background: #03152c;` off `.ceremony-cinematic` and place it on `.ceremony-overlay`.
   - In `CeremonyScene.jsx`, during exit (progress `0.88` to `1.0`), fade `.ceremony-overlay` to `opacity: 0` and `.ceremony-blue-glow` to `opacity: 0`.
   - **Result**: As the church photo, overlay, and glow fade out, there is NO opaque navy wall. The user sees directly through to `reception-twilight.jpg` sitting at `top: 0` underneath.

2. **Fix Dynamic Viewport Sizing on Mobile (`100dvh` / `100%`)**:
   - Change `height: 100svh;` to `height: 100dvh; min-height: 100dvh;` on `.ceremony-cinematic`, `.ns-cinematic`, and `.rec-scroll .rec-cinematic`.
   - **Result**: When mobile Safari / Chrome collapses the address bar during scroll, the containers dynamically resize to cover the full viewport height. No 80px gap opens at the bottom.

3. **Mathematical Precision for `.rec-scroll` and `DateSequence` Alignment**:
   - Ceremony pins for $1400\text{px}$ without pinSpacing.
   - Reception reaches `top: 0` at $H$ pixels into Ceremony.
   - The overlap where both are at `top: 0` is $1400 - H$ pixels.
   - Reception needs $1100\text{px}$ of active text animation *after* Ceremony unpins.
   - Therefore, the total scroll distance that `.rec-scroll` must provide while sticky is:
     $$\text{Sticky Distance} = (1400 - H) + 1100\text{px}$$
   - Since a sticky child remains sticky for $\text{Height} - H$, `.rec-scroll`'s total CSS height must be:
     $$\text{Height}(\text{.rec-scroll}) = H + (1400 - H) + 1100\text{px} = 1400\text{px} + 1100\text{px} = \mathbf{2500\text{px}}$$
   - In `ReceptionScene.jsx`, ScrollTrigger:
     $$\text{start: 'top top'}, \quad \text{end: '+=2500'}$$
   - Timeline duration = `2.5` (or mapped proportionally):
     - `0.0` to `(1400 - viewport) / 2500`: Hold / wait (Ceremony is visible; Reception image sits silently).
     - At `(1400 - viewport) / 2500`: Ceremony unpins; Reception text sequence begins (`Reception` $\to$ rule $\to$ `LA PENSÉE` $\to$ `Gardenia` $\to$ `AFTER THE CEREMONY` $\to$ `VIEW ON MAPS`).
     - At progress `1.0` (scroll = $2500\text{px}$): Reception finishes.
   - Because `DateSequence.offsetTop = .rec-scroll.offsetTop + 2500px`, **DateSequence arrives at `top: 0` at the EXACT pixel that Reception text finishes**.
   - **Result**: Exactly $0\text{px}$ of dead scroll. Zero empty gap before DateSequence.

4. **Clean up `NamesScene.jsx` Exit**:
   - Remove `tl.set(section, { autoAlpha: 0 }, 0.96)`. Let Names remain visible until Ceremony physically reaches `top: 0`, ensuring no lower section flickers prematurely.

---

## E. Minimal Implementation Plan

### Step 1: `src/styles/globals.css` (Layering & Viewport Heights)
- **Change**:
  1. Remove `background: #03152c;` from `.ceremony-cinematic`. Move the navy base background onto `.ceremony-overlay`.
  2. Change `.ceremony-cinematic`, `.ns-cinematic`, and `.rec-scroll .rec-cinematic` from `height: 100svh; min-height: 680px;` to `height: 100dvh; min-height: 100dvh;`.
  3. Set `.rec-scroll` height to:
     ```css
     .rec-scroll {
       position: relative;
       width: 100%;
       height: 2500px;
       min-height: 2500px;
       z-index: 10;
     }
     ```
- **Why**: Eliminates Ceremony's opaque blocking background; eliminates mobile address-bar collapse gap; sets exact scroll budget so DateSequence arrives immediately when Reception ends.
- **Expected Visual Result**: Church photo dissolves directly into the reception hall photo without any blue frame. Mobile viewport stays 100% filled.

### Step 2: `src/components/CeremonyScene.jsx` (Clean Exit Animation)
- **Change**:
  In the exit timeline (around `0.88` to `1.0`), ensure `.ceremony-blue-glow` fades to `opacity: 0` alongside `.ceremony-overlay` and `.ceremony-bg`.
- **Why**: Leaves `.ceremony-cinematic` 100% transparent at progress 1.0 so Reception is completely unobstructed.
- **Expected Visual Result**: Seamless cross-fade from Church to Reception hall.

### Step 3: `src/components/ReceptionScene.jsx` (Synchronized ScrollTrigger)
- **Change**:
  1. Set ScrollTrigger `end: '+=2500'`.
  2. Calculate `const overlapRatio = Math.max(0, 1400 - window.innerHeight) / 2500;`.
  3. Start Reception text animations at `overlapRatio`.
  4. Distribute the text reveal evenly across the remaining duration ($1.0 - \text{overlapRatio}$).
  5. Keep Reception image visible at all times.
- **Why**: Matches Reception's text animation perfectly to the physical handoff point, and eliminates the dead space before DateSequence.
- **Expected Visual Result**: The moment Church dissolves, Reception text smoothly unfolds at a natural reading cadence, holding briefly on Maps before seamlessly flowing into DateSequence.

### Step 4: `src/components/NamesScene.jsx` (Remove Premature Vanish)
- **Change**:
  Remove `tl.set(section, { autoAlpha: 0 }, 0.96)`.
- **Why**: Prevents Names from abruptly disappearing 4% before Ceremony reaches the top.
- **Expected Visual Result**: Rock-solid transition from Names to Ceremony.

---

## F. Risk Analysis

| Risk | Likelihood | Impact | Mitigation Strategy |
|---|---|---|---|
| Address bar resize during scroll recalculates `window.innerHeight` | Low | Low | ScrollTrigger's `invalidateOnRefresh: true` recalculates start/end values on resize. Using `100dvh` in CSS ensures layout container tracks dynamic viewport natively. |
| Ceremony text still visible when cross-fade starts | Very Low | High | Ceremony text already fades out completely between timeline `0.90` and `0.96`. Church photo dissolves between `0.88` and `1.0`. By the time Reception image is revealed, Ceremony text is already gone. |
| DateSequence overlapping Reception | Very Low | High | We derived `.rec-scroll` height mathematically: $\text{Height} = 1400 + 1100 = 2500\text{px}$. DateSequence starts at `.rec-scroll.offsetTop + 2500px`, which is physically identical to the moment Reception finishes. |
| Desktop regression | None | High | Desktop viewport is fixed (no dynamic URL bar). Math holds identically: for $H = 900\text{px}$, overlap is $500\text{px}$, active duration is $1100\text{px}$, total height is $2500\text{px}$. |

---

## G. Test Matrix

When approved for execution, verification will cover:

1. **iPhone 390 × 844 (Safari & Chrome touch mode)**:
   - Verify Ceremony $\to$ Reception handoff: Church dissolves directly into Reception photo. No blue frame.
   - Verify bottom of viewport during Names and Ceremony: No lower section movement visible through address bar gap.
   - Verify Reception $\to$ Date transition: No 800px dead scroll zone. Date sequence begins right after Reception maps hold.
2. **iPhone 375 × 812 (Safari small viewport)**:
   - Verify typography fit and absence of vertical clipping.
3. **Desktop (1440 × 900 / 1920 × 1080)**:
   - Verify Lenis smooth wheel scrolling remains intact.
   - Verify no regression in Names, Ceremony, Reception, or Date.
4. **Behavioral tests**:
   - **Slow scrub**: Check for flickering or sudden snaps at 1400px.
   - **Fast flick / momentum scroll**: Confirm sticky container releases cleanly to Date.
   - **Reverse scroll**: Scroll backwards from Date $\to$ Reception $\to$ Ceremony to verify reverse cross-dissolve.
   - **Hard reload at Reception / Date**: Confirm ScrollTrigger recalculates scroll offsets correctly on refresh.

---

## H. Next Step

**DO NOT IMPLEMENT YET.**  
Please review this diagnostic document. Once you confirm the architectural diagnosis and the 4-step minimal plan, I will execute the changes cleanly and report back with verification.
