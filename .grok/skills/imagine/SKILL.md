---
name: imagine
description: >
  How to use the Imagine tools in Grok Build: imagine_image,
  imagine_video, and the asset helpers (imagine_view_media, imagine_create_asset,
  render_imagine_media). When to build a visual with code instead of generating
  it, prompt-craft, reference-first handling of real people, factual grounding,
  and asset-consistency. Load this whenever generating or editing an image or
  video is on the table. Tool-usage-driven, not triggered by a user merely
  mentioning images.
metadata:
  short-description: "Prompting and workflow guidance for Imagine image/video tools"
user-invocable: false
---

# Imagine

Grok Build exposes a **consolidated Imagine stack**. Media is keyed by **`asset_id`**
(UUID), not by inventing filesystem paths in tool args.

| Tool | Role |
|------|------|
| `imagine_image` | Generate **or** edit images. Modality = number of `asset_ids`. |
| `imagine_video` | Generate video. Modality = number of `asset_ids`. |
| `imagine_view_media` | Inspect an asset; downloads bytes into the sandbox and returns a path. |
| `imagine_create_asset` | Register a **sandbox file** (e.g. chroma-cleaned PNG) as a new `asset_id`. |
| `render_imagine_media` | Show an Imagine asset to the user by `asset_id`. |
| `imagine_upscale_video` | Super-res an existing video asset (never FFmpeg for HD). |
| `imagine_extract_subject` / `imagine_region_edit` / `imagine_video_extension` | Advanced edit/extend helpers when present. |

**Go by your own tool list.** Some environments expose an older split media
set instead (`generate_image` / `edit_image` / `generate_video`). Those take
**filesystem paths** where this skill says `asset_ids`, so the
`imagine_create_asset` / `imagine_view_media` steps simply don't apply.
Everything else here holds either way — match the workflow to the capability,
and call the names you actually have.

Apply this whenever you're considering or about to call any of these tools.

## Asset-id flow (mandatory mental model)

```text
generate → asset_id → render_imagine_media (show user) / imagine_view_media (sandbox path)
postprocess on disk → imagine_create_asset → new asset_id → next Imagine call
```

- **Generation returns an `asset_id`**, not a path you invent.
- **Sandbox scripts need a path** → call `imagine_view_media` first.
- **Postprocessed files need another Imagine call** → `imagine_create_asset` first,
  then pass the new `asset_id` into `imagine_image` / `imagine_video`.
- **Show the user media** with `render_imagine_media`, not ad-hoc markdown image links.

## Build accurate visuals with code, not the image tools

1. **Image models are unreliable at exact text, numbers, and structure.** They can handle short text or a simple layout, but they often garble words, invent numbers, draw chart bars that match no data, or point diagram arrows nowhere, and the more that has to be exact, the worse they do. A detailed prompt doesn't make it dependable, and another `imagine_image` edit usually won't fix it. So when a result needs specific text, data, or structure to be correct (charts from real numbers, labeled or technical diagrams, math explainers, tables, screens with real copy), construct the asset with code, where you control the exact content. Prefer HTML and CSS, which give much better layout, typography, and polish than Python plotting. When only the look matters (photos, illustrations, characters, scenes, decorative art), the image tools are the right choice. Which one fits depends on what the output needs to get right, not on how the request is worded.

## Verifying discrete accuracy (loop)

When the output must get specific text, numbers, data, or structure right, don't trust the first result - verify it in a loop:

1. Produce the result (generate, or per *Build accurate visuals with code*, construct it in code).
2. Inspect the actual output - use `imagine_view_media` / `read_file` (image understanding) on the result - and confirm every word, number, label, and structural detail matches the requirement, and that nothing overlaps, clips, or runs off-canvas.
3. If anything is wrong, fix and re-verify:
   - Garbled text, invented numbers, or broken layout from an image model? Don't just re-prompt - it will likely garble it again. Rebuild it with code.
   - Overlapping or clipped elements in code-built output? Re-lay-out with auto-layout (HTML/CSS) rather than nudging coordinates by hand.
   - Otherwise make one targeted edit via `imagine_image` with the prior `asset_id`.
4. Only finish when the discrete content is exactly correct. If it can't be made accurate, tell the user instead of shipping something wrong.

## Core Principles

1. **You own the prompt.** If the user gives a detailed prompt or asks you to use theirs, use it verbatim. Otherwise craft the final prompt: front-load the subject, give strong high-level direction for mood, composition, lighting, and style without over-specifying every detail, write natural prose rather than keyword tags, and describe positively instead of using negative prompts. For edits, describe only what changes. Target 2-5 sentences.
2. **Reference-first for real people.** Never use pure text-to-image for a named real person or group, including face swaps, posters, cartoons, and cinematic or editorial depictions. Use `imagine_image` **with a real reference `asset_id`** instead, and never produce non-consensual, sexualized, or minor-involving likenesses. See Real People and References for the procedure.
3. **Ground facts with search first.** If any part of the request depends on a real-world fact, identity, brand or product, place, event, or top/latest/current result, search the web before generating and put the actual verified details into the prompt. Don't rely on memory, and don't write vague placeholders like "the current president"; write the verified name.
4. **Reuse a base asset for consistency.** When the same character, object, or setting must appear across multiple images, generate one base with `imagine_image`, keep its `asset_id`, then pass that id in `asset_ids` for every variation. Don't re-run text-to-image from scratch for a recurring subject.
5. **Handle failures gracefully.** On a moderation or safety block, stop; don't retry and don't paraphrase the prompt to evade the filter. Tell the user it was blocked and offer a different direction. If a reference is weak or a result looks off-target, say so and ask for an upload or redirect rather than silently iterating.
6. **Plan multi-step workflows.** Sequence the steps; only parallelize generations that belong to the same step.
7. **Review at the end.** Confirm the generations you intended actually executed and match what was asked. Render final assets with `render_imagine_media`.
8. **Don't assume tool behavior.** Don't invent tool parameters, return values, or environment capabilities that aren't actually provided; verify rather than guess.

## Choosing modality (`imagine_image`)

| Situation | Call |
|-----------|------|
| New image, no source | `imagine_image` with `prompt` only (omit `asset_ids` or pass `[]`) |
| Edit / restyle / recolor one existing image | `imagine_image` with `prompt` + `asset_ids: [id]` |
| Combine 2–5 reference images into one | `imagine_image` with `prompt` + `asset_ids: [id1, id2, …]` |
| Iterate on a previous result | same as edit — pass prior `asset_id` |
| Named real person or group | `imagine_image` with a real reference `asset_id` after web search |
| Generic / invented subject from scratch | `imagine_image` with prompt only |

Rule of thumb: **no refs → omit `asset_ids`; one ref → edit; 2–5 refs → multi-ref compose.**

## `imagine_image`

Generate or edit an image.

Inputs:

- `prompt` (required) - full description of the desired image or edit.
- `asset_ids` (optional) - 0 = text-to-image; 1 = edit; 2–5 = multi-reference compose.
- `aspect_ratio` - one of `1:1`, `3:4`, `4:3`, `2:3`, `3:2`, `9:16`, `16:9`, `21:9`, or `unknown`. Use `16:9` for OG share cards; for a true 2:1 canvas, call the xAI Images API. When editing a single image, only set this if the user explicitly wants a ratio change.

To produce multiple variations, make multiple `imagine_image` calls with distinct prompts. The tool does not expose `n` or `count` parameters.

## `imagine_video`

Generate a video.

Inputs:

- `prompt` - required unless exactly one `asset_id` (image-to-video can animate naturally).
- `asset_ids` - omit/empty = text-to-video; 1 = image-to-video; 2+ = multi-ref video.
- `duration` - `6` (default), `10`, or `15` (15 not with 2+ refs).
- `resolution_name` - default `720p`; `480p` only if asked; `1080p` only SuperGrok Pro when explicitly requested.
- `aspect_ratio` - optional; when animating one image, omit to keep the source ratio.

**Prefer short shots.** Build video as a planned sequence of short clips, not one long take:

1. Plan the story as shots - one beat each.
2. Prefer more 6s shots over fewer long ones.
3. Create each shot's source still with `imagine_image` (keep character `asset_ids` consistent).
4. Animate with `imagine_video` + that still's `asset_id`.

Key behaviors:

- **Prompt-craft:** one short, vivid moment in present tense with a clear camera movement, in 1-2 sentences.
- **Minimal but interesting:** one clear subject and a single simple motion or camera move.
- **Complex source?** Keep the subject fixed and move only the camera, or break into simpler shots.
- **Real people:** reference-first - drive from a verified reference asset; never animate a named person without one.
- Don't loop the same clip unless asked.
- Assemble multi-shot timelines with FFmpeg stream copy after downloading via `imagine_view_media`.

## Writing Strong Prompts

Describe, roughly in this order: **subject -> action/pose -> setting -> style -> composition -> lighting/mood -> key details.**

- Be specific and concrete; lead with the most important elements.
- State what to include rather than what to exclude.
- Use one coherent scene per prompt.
- Match `aspect_ratio` to the use case: `9:16` for phone/story, `16:9` for banner/video frame or OG share cards, `1:1` for avatar/icon.

## Real People and References

1. Search the web first to confirm identity, role, relationship, or event, even when it seems obvious.
2. Obtain a strong reference image, register it if needed (`imagine_create_asset` for sandbox files / uploads), then call `imagine_image` with that `asset_id`. A user-uploaded photo is best.
3. If no suitable reference exists, ask the user to upload one rather than generating from a weak base.

## Showing results

- Call `render_imagine_media` with the `asset_id` so the user sees the image/video in chat.
- For your own QC and scripts, use `imagine_view_media` then `read_file` on the sandbox path.

## Support tools (when present)

| Tool | Use |
|------|-----|
| `imagine_upscale_video` | HD / sharper version of an existing video asset — never FFmpeg for this |
| `imagine_video_extension` | Continue an existing video asset |
| `imagine_extract_subject` | Transparent cutout: matte from a chroma re-render, **original subject pixels kept** — stickers, photo subjects, remove-BG when you must preserve the source. Not the first choice for magenta-plate game sprites (use flood-fill chroma scripts instead) |
| `imagine_region_edit` | Edit **only** selected regions (`selection_regions` as normalized 0–1 polygons). Locality composite keeps unmarked pixels from the original. Use for localized recolor, prop swaps, or small touch-ups |

Game sprites and maps have their own pipelines — follow `generate2dsprite`,
`video2dsprite`, and `generate2dmap` for those, not the support tools above.

## Failure modes to avoid

- Passing filesystem paths into `imagine_image` / `imagine_video` instead of `asset_ids`.
- Running chroma/ffmpeg scripts on a path you invented without `imagine_view_media`.
- Editing a postprocessed PNG with Imagine without `imagine_create_asset` first.
