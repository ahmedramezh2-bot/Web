IMPORTANT

Do NOT implement yet.

Do NOT modify the repository.

Do NOT write React components.

Do NOT install packages yet.

This document defines the engineering philosophy of HEBRA.

Before writing any code...

Design the entire software architecture mentally.

Everything must have one responsibility.

Nothing should overlap.

====================================================

ENGINEERING PHILOSOPHY

The project should feel like software engineering.

Not web development.

Not frontend design.

Everything should be modular.

Scalable.

Reusable.

Maintainable.

Future-proof.

Readable.

Elegant.

Every decision should improve long-term maintainability.

====================================================

CORE PRINCIPLE

Every library must have one clear responsibility.

Never use two libraries to solve the same problem.

Avoid redundancy.

Avoid conflicts.

Avoid duplicated animation systems.

Avoid duplicated render systems.

====================================================

THREE.JS

Three.js is the rendering engine.

It owns:

Rendering

Materials

Geometry

Lighting

Shaders

Textures

Environment

Camera objects

Nothing else.

====================================================

REACT THREE FIBER

React Three Fiber is the bridge.

It manages:

Scene hierarchy

React integration

Component lifecycle

Asset loading

Object composition

State synchronization

Never bypass React Three Fiber without a strong technical reason.

====================================================

THEATRE.JS

Theatre.js is the Film Director.

It controls:

Story progression

Scene choreography

Camera timelines

Lighting timelines

Environmental transitions

Large cinematic moments

Never use Theatre.js for UI micro interactions.

====================================================

GSAP

GSAP owns:

Micro animations

UI transitions

Typography

Buttons

Panels

Navigation

Loading states

Small interface details

GSAP should never compete with Theatre.

====================================================

LENIS

Lenis owns movement through the world.

Scrolling should feel physical.

Not browser scrolling.

Movement should contain momentum.

Weight.

Inertia.

Smooth acceleration.

Smooth deceleration.

Scrolling should become navigation through space.

====================================================

REACT FLOW

React Flow is NOT decoration.

Use it only if it strengthens storytelling.

Possible uses:

Idea networks

Legacy visualization

Knowledge structures

Interactive philosophy maps

Relationship diagrams

Never use React Flow just because it exists.

====================================================

SHADERS

Shaders should create emotion.

Not visual noise.

Use shaders for:

Reality distortion

Living materials

Energy

Memory effects

Light behavior

Portal transitions

Surface evolution

Never use shaders merely because they look impressive.

====================================================

POST PROCESSING

Every effect must have purpose.

Bloom.

Depth of field.

Ambient occlusion.

Chromatic effects.

Motion blur.

Volumetric lighting.

Screen-space reflections.

Only if they strengthen the scene.

Remove unnecessary effects.

Performance always matters.

====================================================

PERFORMANCE

Target fluid interaction.

Optimize continuously.

Lazy load intelligently.

Unload what is unnecessary.

Compress assets carefully.

Minimize draw calls.

Reuse materials.

Reuse textures where appropriate.

Never sacrifice smoothness for unnecessary spectacle.

====================================================

ASSET PIPELINE

Every imported asset should pass quality review.

Optimize topology.

Optimize textures.

Optimize materials.

Rename consistently.

Organize folders.

Document origin.

Transform it until it belongs to HEBRA.

====================================================

CODE ARCHITECTURE

Every system should be isolated.

Audio.

Camera.

Animation.

Physics.

Interaction.

Lighting.

Shaders.

Story.

Navigation.

Services.

No system should directly depend on unrelated systems.

Favor composition over complexity.

====================================================

SCALABILITY

Assume the project will double in size.

Then double again.

Architecture should survive years of expansion.

Never build temporary solutions.

====================================================

ERROR TOLERANCE

Design every system defensively.

Gracefully handle failures.

Missing assets.

Slow devices.

Interrupted loading.

Network delays.

The experience should degrade elegantly.

Never catastrophically.

====================================================

SELF REVIEW

Before implementing any feature ask:

Is there already a system responsible for this?

Am I introducing unnecessary complexity?

Can this be simplified?

Does this follow the Creative Bible?

Would another engineer immediately understand this?

If not...

Redesign before writing code.

====================================================

FINAL OBJECTIVE

The source code should feel as premium as the experience itself.

A developer opening the repository should immediately understand that this project was engineered with intention.

Wait for the next Creative Bible.

Do NOT implement anything yet.
