# HEBRA MASTER PRODUCTION BIBLE

## PART 10

# PRODUCTION PIPELINE • ENGINEERING PIPELINE • ASSET PIPELINE

====================================================

IMPORTANT

This document defines HOW HEBRA is built.

Not what it looks like.

Not how it feels.

Every production decision must maximize:

Quality.

Scalability.

Maintainability.

Performance.

Consistency.

Future expansion.

Never optimize for speed.

Optimize for longevity.

====================================================

MASTER PIPELINE

Idea

↓

Research

↓

Figma

↓

Creative Review

↓

Technical Review

↓

Prototype

↓

Art Review

↓

Implementation

↓

Performance Review

↓

QA

↓

Deployment

↓

Post Launch Improvements

Never skip a stage.

====================================================

FIGMA

Figma is the source of truth.

Never code first.

Every scene begins inside Figma.

Figma owns:

Design Tokens

Typography

Spacing

Layout

Motion Boards

Glyph Library

Interaction Maps

Component Specs

Storyboards

Camera Paths

Everything coded must be approved in Figma first.

====================================================

BLENDER

Every production asset originates from Blender.

No downloaded models are accepted without redesign.

Every imported model must become HEBRA.

Blender Responsibilities:

Modeling

UV Mapping

Normals

Material Preparation

Animation

Optimization

Naming

====================================================

EXPORT PIPELINE

Blender

↓

glTF 2.0

↓

Meshopt Optimization

↓

Draco Compression

↓

KTX2 Texture Compression

↓

Production Validation

↓

Repository

No exceptions.

====================================================

TEXTURES

Use physically based materials.

Prefer:

4K Hero Assets

2K Standard Assets

1K Background Assets

Compress with KTX2 whenever supported.

Avoid PNG in production unless justified.

====================================================

MATERIALS

Never duplicate materials unnecessarily.

Use reusable physically based materials.

Create one master material system.

Parameter driven.

====================================================

HDRI

Use HDR environments only when they improve realism.

Generate PMREM once.

Reuse efficiently.

Never waste GPU memory.

====================================================

SHADERS

Shaders are premium features.

Not decoration.

Every shader should solve a visual problem.

Examples:

Atmospheric depth

Energy flow

Living reflections

Impossible materials

Micro distortion

Subsurface energy

Never use shaders just because they look cool.

====================================================

THEATRE.JS

Theatre owns:

Camera choreography

Scene timing

Narrative progression

Environmental movement

Architectural animation

Never UI.

Never application logic.

====================================================

GSAP

GSAP owns:

Typography

Panels

Interface

Micro transitions

Buttons

Forms

Navigation

Never cinematic direction.

====================================================

LENIS

Lenis owns physical navigation.

It controls momentum.

Travel.

Weight.

Never ordinary smooth scrolling.

Never fake momentum.

====================================================

REACT BITS

React Bits is inspiration only.

Study:

Engineering ideas

Interaction concepts

Component architecture

Animation patterns

Never import visual identity.

Every borrowed idea must evolve into HEBRA.

====================================================

THREE.JS

Owns rendering.

GPU communication.

Geometry.

Lighting.

Materials.

Rendering pipeline.

Nothing else.

====================================================

R3F

Owns declarative scene management.

Scene composition.

Three integration.

Reusable components.

====================================================

DREI

Use only when it reduces boilerplate without reducing quality.

Never depend on helpers that reduce artistic control.

====================================================

THREE-MESH-BVH

Required for:

Accurate raycasting.

Complex interactions.

Large geometry.

Efficient collision.

====================================================

TONE.JS

Owns procedural sound.

Ambient generation.

Spatial interaction.

Dynamic sound evolution.

====================================================

REACT FLOW

Internal development tool.

Visualize:

World graph.

Chapter graph.

Dependencies.

Implementation flow.

Never expose to visitors.

====================================================

GITHUB

Protected main branch.

Feature branches only.

Every feature reviewed before merge.

No direct commits to production.

====================================================

PULL REQUESTS

Every PR answers:

Why?

Performance impact?

Visual impact?

Architecture impact?

Future maintenance?

====================================================

NAMING

Explicit names.

Readable names.

Meaningful names.

Avoid abbreviations.

Avoid "temp".

Avoid "new".

Avoid version numbers.

====================================================

FOLDER STRUCTURE

Folders represent responsibilities.

Never technologies.

Never temporary grouping.

One responsibility per folder.

====================================================

COMPONENTS

Atomic.

Reusable.

Composable.

Independent.

Never giant components.

====================================================

STATE

Local when possible.

Global only when necessary.

Avoid unnecessary synchronization.

====================================================

PERFORMANCE BUDGET

Every frame matters.

Every draw call matters.

Every texture matters.

Every shader matters.

Every particle matters.

Every kilobyte matters.

====================================================

QUALITY GATES

Before deployment verify:

Visual Quality

Performance

Accessibility

Responsiveness

Audio

Lighting

Story Continuity

Interaction

Memory Usage

GPU Usage

Bundle Size

====================================================

DEPLOYMENT

Never deploy unfinished work.

Every deployment should feel like a finished experience.

Small.

Stable.

Predictable.

====================================================

FUTURE EXPANSION

Architecture should survive years.

Adding a new chapter should require almost no architectural changes.

The world grows.

It never resets.

====================================================

FINAL RULE

Never ask:

"Does it work?"

Ask:

"Would this pipeline still be the correct choice if HEBRA became one of the world's most respected interactive experiences?"

If not...

Improve the pipeline.

====================================================

DO NOT IMPLEMENT.

Internalize the production pipeline.

Wait for Part 11.
