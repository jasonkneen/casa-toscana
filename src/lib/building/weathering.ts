import * as THREE from "three";

export type WeatherKind = "stucco" | "brick";

/**
 * Procedural facade weathering, injected into the standard material shaders.
 * Works in world space so every wall piece — hero and kin alike — weathers
 * continuously across merged geometry, and each house gets its own pattern
 * from its position in the street.
 */
const NOISE_GLSL = /* glsl */ `
varying vec3 vWeatherPos;
float wHash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}
float wNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(wHash(i), wHash(i + vec3(1, 0, 0)), f.x),
        mix(wHash(i + vec3(0, 1, 0)), wHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(wHash(i + vec3(0, 0, 1)), wHash(i + vec3(1, 0, 1)), f.x),
        mix(wHash(i + vec3(0, 1, 1)), wHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float wFbm(vec3 p) {
  return wNoise(p) * 0.55 + wNoise(p * 2.31) * 0.28 + wNoise(p * 5.07) * 0.17;
}
`;

const STUCCO_FRAG = /* glsl */ `
{
  vec3 wp = vWeatherPos;
  float blotch = wFbm(wp * 0.5);
  // sun-bleached lift on open patches, damp shadows where noise pools
  diffuseColor.rgb *= 1.0 + 0.05 * smoothstep(0.52, 0.24, blotch);
  diffuseColor.rgb *= 1.0 - 0.09 * smoothstep(0.5, 0.82, blotch);
  // faint vertical rain streaking
  float streak = wFbm(wp * vec3(2.4, 0.32, 2.4));
  diffuseColor.rgb *= 1.0 - 0.05 * smoothstep(0.5, 0.85, streak);
  // rising damp and street grime with a ragged noisy edge
  float grimeEdge = 1.35 + 0.85 * wFbm(wp * vec3(1.1, 0.6, 1.1));
  float grime = smoothstep(grimeEdge, 0.05, wp.y) * (0.4 + 0.6 * wFbm(wp * vec3(1.6, 2.8, 1.6)));
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.55, 0.53, 0.5), grime * 0.55);
}
`;

const BRICK_FRAG = /* glsl */ `
{
  vec3 wp = vWeatherPos;
  // pale whitewash / mortar haze surviving in patches. Screen-lighten so the
  // brick coursing stays visible through the wash instead of fogging out.
  float washBase = smoothstep(0.47, 0.6, wFbm(wp * 0.6 + 17.31));
  float washDetail = wFbm(wp * vec3(3.2, 7.5, 3.2));
  float course = 0.72 + 0.28 * wNoise(vec3(0.0, wp.y * 14.0, 0.0));
  float wash = washBase * (0.35 + 0.65 * washDetail) * course;
  vec3 screened = vec3(1.0) - (vec3(1.0) - diffuseColor.rgb) * vec3(0.42, 0.46, 0.52);
  diffuseColor.rgb = mix(diffuseColor.rgb, screened, wash * 0.85);
  // faint all-over mortar dust, also screened
  diffuseColor.rgb = mix(diffuseColor.rgb, screened, washDetail * 0.12);
  // patchy tonal drift so long walls do not read flat
  float drift = wFbm(wp * 0.9 + 4.7);
  diffuseColor.rgb *= 1.0 - 0.08 * smoothstep(0.55, 0.85, drift);
  // base grime, gentler than on stucco
  float grimeEdge = 1.1 + 0.7 * wFbm(wp * vec3(1.1, 0.6, 1.1));
  float grime = smoothstep(grimeEdge, 0.05, wp.y) * (0.4 + 0.6 * wFbm(wp * vec3(1.6, 2.8, 1.6)));
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.58, 0.56, 0.53), grime * 0.4);
}
`;

function makeOnBeforeCompile(kind: WeatherKind) {
  const frag = kind === "stucco" ? STUCCO_FRAG : BRICK_FRAG;
  return (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWeatherPos;")
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvWeatherPos = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\n" + NOISE_GLSL)
      .replace("#include <color_fragment>", "#include <color_fragment>\n" + frag);
  };
}

export function applyWeathering(mat: THREE.Material, kind: WeatherKind) {
  if (mat.userData.weathered === kind) return;
  mat.userData.weathered = kind;
  mat.onBeforeCompile = makeOnBeforeCompile(kind);
  mat.customProgramCacheKey = () => `weathered-${kind}`;
  mat.needsUpdate = true;
}
