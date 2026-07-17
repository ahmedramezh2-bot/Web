# HEBRA MASTER PRODUCTION BIBLE

## APPENDIX F

# AAA PERFORMANCE BUDGET

====================================================

IMPORTANT

Performance is part of the artistic direction.

Dropped frames destroy immersion.

Poor optimization destroys emotion.

Every millisecond matters.

Every draw call matters.

Every shader instruction matters.

Every byte matters.

Visitors should never notice optimization.

They should only notice beauty.

====================================================

TARGET FRAME RATE

Desktop High-End

Target:
120 FPS

Minimum Acceptable:
90 FPS

Emergency Floor:
60 FPS

====================================================

Desktop Mid Range

Target:
90 FPS

Minimum:
60 FPS

====================================================

Modern Mobile

Target:
60 FPS

Minimum:
45 FPS

Short drops to 35–40 FPS are acceptable only during extremely heavy cinematic moments lasting less than 0.5 seconds.

====================================================

FRAME BUDGET

120 FPS

8.3 ms

====================================================

90 FPS

11.1 ms

====================================================

60 FPS

16.6 ms

====================================================

45 FPS

22 ms

====================================================

Never exceed these budgets continuously.

====================================================

DRAW CALL BUDGET

Desktop Tier A

< 250

====================================================

Desktop Tier B

< 180

====================================================

Mobile Tier A

< 140

====================================================

Mobile Tier B

< 100

====================================================

Never add draw calls without measurable visual value.

====================================================

GEOMETRY

Hero Assets

100k–300k triangles

====================================================

Interactive Assets

20k–80k triangles

====================================================

Environment Assets

5k–50k triangles

====================================================

Background Assets

500–5000 triangles

====================================================

Use LOD whenever appropriate.

====================================================

TEXTURE BUDGET

Hero Assets

4096²

====================================================

Standard Assets

2048²

====================================================

Background Assets

1024²

====================================================

Small Props

512²

====================================================

Compress everything using:

KTX2

Basis Universal

====================================================

Never ship unnecessary PNG textures.

====================================================

PARTICLE BUDGET

Desktop Ultra

150k particles

====================================================

Desktop High

80k

====================================================

Desktop Balanced

45k

====================================================

Mobile High

30k

====================================================

Mobile Essential

15k

====================================================

Reduce quantity.

Never reduce quality.

====================================================

POST PROCESSING

Maximum Passes

6

Example

Bloom

DOF

Vignette

Film Grain

Chromatic Aberration (very subtle)

Tone Mapping

====================================================

Avoid stacking effects.

Every pass must justify itself.

====================================================

SHADER BUDGET

No shader exists only because it looks impressive.

Shaders solve problems.

Allowed

Atmospheric depth

Energy flow

Living reflections

Volumetric light

Material uniqueness

Micro distortion

Forbidden

Random RGB effects

Noise for decoration

Heavy raymarching without reason

Infinite procedural complexity

====================================================

LIGHTING

Maximum realtime shadow casters

Desktop

6

Mobile

2

====================================================

Bake whenever possible.

Render dynamically only when emotionally important.

====================================================

REFLECTIONS

Prefer

PMREM

Reflection probes

Hybrid techniques

Avoid

Realtime reflections everywhere.

====================================================

MEMORY

Desktop

VRAM Target

< 2 GB

====================================================

Mobile

VRAM Target

< 800 MB

====================================================

RAM

Desktop

< 1 GB

====================================================

Mobile

< 500 MB

====================================================

BUNDLE SIZE

Initial JavaScript

Target

< 300 KB gzip

====================================================

Heavy systems

Lazy loaded.

====================================================

Theatre Studio

Lazy.

====================================================

React Flow

Lazy.

====================================================

Developer HUD

Development only.

Never production.

====================================================

CODE SPLITTING

Split by:

Chapter

World

System

Feature

Never split randomly.

====================================================

LOADING

Visitors should feel immediate presence.

Not loading.

Always prioritize:

Atmosphere first.

Detail later.

====================================================

QUALITY TIERS

Tier A

Everything enabled.

====================================================

Tier B

Slightly reduced particles.

Reduced shadow resolution.

Reduced reflection samples.

====================================================

Tier C

Reduced shader iterations.

Reduced particle density.

Smaller texture mip levels.

====================================================

NEVER REMOVE

Story.

Lore.

Lighting philosophy.

Interaction philosophy.

Camera choreography.

Material identity.

====================================================

PROFILING

Profile continuously.

Never optimize only at the end.

Measure.

Improve.

Measure again.

====================================================

FINAL TEST

If optimization changes emotion...

Optimization failed.

If beauty destroys performance...

Beauty failed.

Balance is the goal.

====================================================

THIS PERFORMANCE BUDGET IS MANDATORY.
