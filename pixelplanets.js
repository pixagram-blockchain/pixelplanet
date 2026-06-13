/*!
 * pixelplanets.js — a faithful WebGL port of Deep-Fold's PixelPlanets
 * (https://github.com/Deep-Fold/PixelPlanets, MIT © 2020 Deep-Fold)
 *
 * All 17 Godot shaders transpiled to GLSL ES 1.00; scene composition,
 * per-layer time multipliers, seeding, color schema and the seamless
 * loop math reproduced from the original GDScript.
 *
 * Port © 2026, MIT. No external dependencies. WebGL1.
 *
 * Quick start:
 *   const p = new PixelPlanets({ canvas, type: 'terranWet', seed: 1234, pixels: 100 });
 *   p.start();                       // animate
 *   p.setLight(0.3, 0.3);            // move the light source
 *   p.setColors(['#aabbcc', ...]);   // recolor (see getColors() for slot count)
 *   p.exportSpritesheet({ frames: 30 }); // seamless loop -> canvas
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) { module.exports = factory(); }
  else { root.PixelPlanets = factory(); }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ================= generated: transpiled shaders ================= */
  /* generated: transpiled Godot shaders */
  var GDSHADERS = {
"Asteroids_Asteroids": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform vec4 colors[3];\nuniform float size;\n\nuniform float seed;\nuniform bool should_dither;\n\nfloat rand(vec2 coord) {\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < octaves ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\n// by Leukbaars from https://www.shadertoy.com/view/4tK3zR\nfloat circleNoise(vec2 uv) {\n    float uv_y = floor(uv.y);\n    uv.x += uv_y*.31;\n    vec2 f = fract(uv);\n\tfloat h = rand(vec2(floor(uv.x),floor(uv_y)));\n    float m = (length(f-0.25-(h*0.5)));\n    float r = h*0.25;\n    return m = smoothstep(r-.10*r,r,m);\n}\n\nfloat crater(vec2 uv) {\n\tfloat c = 1.0;\n\tfor (int i = 0; i < 2; i++) {\n\t\tc *= circleNoise((uv * size) + (float(i+1)+10.));\n\t}\n\treturn 1.0 - c;\n}\n\nvoid main() {\n\t//pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\t// we use this val later to interpolate between shades\n\tbool dith = dither(uv, v_uv);\n\t\n\t// distance from center\n\tfloat d = distance(uv, vec2(0.5));\n\t\n\t// optional rotation, do this after the dither or the dither will look very messed up\n\tuv = rotate(uv, rotation);\n\t\n\t// two noise values with one slightly offset according to light source, to create shadows later\n\tfloat n = fbm(uv * size);\n\tfloat n2 = fbm(uv * size + (rotate(light_origin, rotation)-0.5) * 0.5);\n\t\n\t// step noise values to determine where the edge of the asteroid is\n\t// step cutoff value depends on distance from center\n\tfloat n_step = step(0.2, n - d);\n\tfloat n2_step = step(0.2, n2 - d);\n\t\n\t// with this val we can determine where the shadows should be\n\tfloat noise_rel = (n2_step + n2) - (n_step + n);\n\t\n\t// two crater values, again one extra for the shadows\n\tfloat c1 = crater(uv );\n\tfloat c2 = crater(uv + (light_origin-0.5)*0.03);\n\n\t// now we just assign colors depending on noise values and crater values\n\t// base\n\tvec4 col = colors[1];\n\t\n\t// noise\n\tif (noise_rel < -0.06 || (noise_rel < -0.04 && (dith || !should_dither))) {\n\t\tcol = colors[0];\n\t}\n\tif (noise_rel > 0.05 || (noise_rel > 0.03 && (dith || !should_dither))) {\n\t\tcol = colors[2];\n\t}\n\t\n\t// crater\n\tif (c1 > 0.4)  {\n\t\tcol = colors[1];\n\t}\n\tif (c2<c1) {\n\t\tcol = colors[2];\n\t}\n\t\n\tgl_FragColor = vec4(col.rgb, n_step * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
}
},
"defines": [
"octaves"
],
"intDefaults": {}
},
"BlackHole_BlackHole": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\n\nuniform vec4 colors[3];\n\nuniform float radius;\nuniform float light_width;\n\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\t// distance from center\n\tfloat d_to_center = distance(uv, vec2(0.5));\n\t\n\tvec4 col = colors[0];\t\n\tif (d_to_center > radius - light_width) {\n\t\tcol = colors[1];\n\t}\t\n\tif (d_to_center > radius - light_width * 0.5) {\n\t\tcol = colors[2];\n\t}\n\t\n\tfloat a = step(d_to_center, radius);\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"radius": {
"type": "float",
"size": 1,
"array": false
},
"light_width": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [],
"intDefaults": {}
},
"BlackHole_BlackHoleRing": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float disk_width;\nuniform float ring_perspective;\nuniform bool should_dither;\nuniform vec4 colors[5];\n\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\n// by Leukbaars from https://www.shadertoy.com/view/4tK3zR\nfloat circleNoise(vec2 uv) {\n    float uv_y = floor(uv.y);\n    uv.x += uv_y*.31;\n    vec2 f = fract(uv);\n\tfloat h = rand(vec2(floor(uv.x),floor(uv_y)));\n    float m = (length(f-0.25-(h*0.5)));\n    float r = h*0.25;\n    return smoothstep(0.0, r, m*0.75);\n}\n\nbool dither(vec2 uv_pixel, vec2 uv_real) {\n\treturn mod(uv_pixel.x+uv_real.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvec4 IDX_colors(int i) {\n\tif (i <= 0) { return colors[0]; }\n\tfor (int k = 0; k < 5; k++) { if (k == i) { return colors[k]; } }\n\treturn colors[4];\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\t// we use this value later to dither between colors\n\tbool dith = dither(v_uv, uv);\n\t\n\tuv = rotate(uv, rotation);\n\t\n\t// keep an undistored version of the current uvs\n\tvec2 uv2 = uv;\n\t\n\t// compress uv along the x axis, or the accretion disk will look to stretched out\n\tuv.x -= 0.5;\n\tuv.x *= 1.3;\n\tuv.x += 0.5;\n\t\n\t// add a bit of movement to the accretion disk by wobbling it, completely optional and can be disabled.\n\tuv = rotate(uv, sin(time * time_speed * 2.0) * 0.01);\n\t\n\t// l_origin will be used to determine how to color the pixels\n\tvec2 l_origin = vec2(0.5);\n\t// d_width will be the final width of the accretion disk\n\tfloat d_width = disk_width;\n\t\n\t// here we distort the uvs to achieve the shape of the accretion disk\n\tif (uv.y < 0.5) { \n\t\t// if we are in the top half of the image, then add to the uv.y based on how close we are to the center\n\t\tuv.y += smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n\t\t// and also the ring width has to be adjusted or it will look to stretched out\n\t\td_width += smoothstep(distance(vec2(0.5), uv), 0.5, 0.3);\n\t\t\n\t\t// another optional thing that changes the color distribution, I like it, but can be disabled.\n\t\tl_origin.y -= smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n\t} \n\t// we don't check for exactly uv.y > 0.5 because we want a small area where the ring\n\t// is unaffected by stretching, the middle part that goes over the black hole.\n\telse if (uv.y > 0.53) {\n\n\t\t// same steps as before, but uv.y and light is stretched the other way, the disk width is slightly smaller here for visual effect.\n\t\tuv.y -= smoothstep(distance(vec2(0.5), uv), 0.4, 0.17);\n\t\td_width += smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n\t\tl_origin.y += smoothstep(distance(vec2(0.5), uv), 0.5, 0.2);\n\t}\n\t\n\t// get distance to light origin based on unaltered uv's we saved earlier, some math to account for perspective\n\tfloat light_d = distance(uv2 * vec2(1.0, ring_perspective), l_origin * vec2(1.0, ring_perspective)) * 0.3;\n\n\t// center is used to determine ring position\n\tvec2 uv_center = uv - vec2(0.0, 0.5);\n\n\t// tilt ring\n\tuv_center *= vec2(1.0, ring_perspective);\n\tfloat center_d = distance(uv_center,vec2(0.5, 0.0));\n\t\n\t// cut out 2 circles of different sizes and only intersection of the 2.\n\t// this actually makes the disk\n\tfloat disk = smoothstep(0.1-d_width*2.0, 0.5-d_width, center_d);\n\tdisk *= smoothstep(center_d-d_width, center_d, 0.4);\n\t\n\t// rotate noise in the disk\n\tuv_center = rotate(uv_center+vec2(0, 0.5), time*time_speed*3.0);\n\t\n\t// some noise\n\tdisk *= pow(fbm(uv_center*size), 0.5);\n\t\n\t// apply dithering\n\tif (dith || !should_dither) {\n\t\tdisk *= 1.2;\n\t}\n\t\n\t// apply some colors based on final value\n\tfloat n_posterized = float(n_colors - 1);\n\tfloat posterized = floor((disk+light_d)*n_posterized);\n\tposterized = min(posterized, n_posterized);\n\tvec4 col = IDX_colors(int(posterized));\n\t\n\t// this can be toggled on to achieve a more \"realistic\" black hole, with red and blue shifting. This was just me messing around so can probably be more optimized and done cleaner\n\t//col.rgb *= 1.0 - pow(uv.x, 1.0);\n\t//col.gb *= 1.0 - pow(uv.x, 2.0);\n\t//col.b *= 3.0 - pow(uv.x, 4.0);\n\t//col.gb *= 2.0 - pow(uv.x, 2.0);\n\t//col.rgb *= pow(uv.x, 0.15);\n\t\n\tfloat disk_a = step(0.15, disk);\n\tgl_FragColor = vec4(col.rgb, disk_a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"disk_width": {
"type": "float",
"size": 1,
"array": false
},
"ring_perspective": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 5,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"n_colors",
"OCTAVES"
],
"intDefaults": {
"n_colors": 5
}
},
"Galaxy_Galaxy": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform float time_speed;\nuniform float dither_size;\nuniform bool should_dither;\nuniform vec4 colors[7];\n\n\nuniform float size;\n\nuniform float seed;\n\nuniform float time;\nuniform float tilt;\nuniform float n_layers;\nuniform float layer_height;\nuniform float zoom;\nuniform float swirl;\n\nfloat rand(vec2 coord) {\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec4 IDX_colors(int i) {\n\tif (i <= 0) { return colors[0]; }\n\tfor (int k = 0; k < 7; k++) { if (k == i) { return colors[k]; } }\n\treturn colors[6];\n}\n\nvoid main() {\n\tvec2 uv = v_uv;\n\tuv = floor(uv * pixels) / pixels;\n\tbool dith = dither(uv, v_uv);\n\t\n\t// I added a little zooming functionality so I dont have to mess with other values to get correct sizing.\n\tuv *= zoom;\n\tuv -= (zoom - 1.0) / 2.0;\n\t\n\t// overall rotation of galaxy\n\tuv = rotate(uv, rotation);\n\tvec2 uv2 = uv; // save a copy of untranslated uv for later\n\n\t// this uv is used to determine where the \"layers\" will be\n\tuv.y *= tilt;\n\tuv.y -= (tilt - 1.0) / 2.0;\n\n\tfloat d_to_center = distance(uv, vec2(0.5, 0.5));\n\t// swirl uv around the center, the further from the center the more rotated.\n\tfloat rot = swirl * pow(d_to_center, 0.4);\n\tvec2 rotated_uv = rotate(uv, rot + time * time_speed);\n\n\t// fbm will decide where the layers are\n\tfloat f1 = fbm(rotated_uv * size);\n\t// quantize to a few different values, so layers don't blur through each other\n\tf1 = floor(f1 * n_layers) / n_layers;\n\n\t// use the unaltered second uv for the actual galaxy\n\t// tilt so it looks like it's an angle.\n\tuv2.y *= tilt;\n\tuv2.y -= (tilt - 1.0) / 2.0 + f1 * layer_height;\n\n\t// now do the same stuff as before, but for the actual galaxy image, not the layers\n\tfloat d_to_center2 = distance(uv2, vec2(0.5, 0.5));\n    float rot2 = swirl * pow(d_to_center2, 0.4);\n\tvec2 rotated_uv2 = rotate(uv2, rot2 + time * time_speed);\n\t// I offset the second fbm by some amount so the don't all use the same noise, try it wihout and the layers are very obvious\n\tfloat f2 = fbm(rotated_uv2 * size + vec2(f1) * 10.0);\n\n\t// alpha\n\tfloat a = step(f2 + d_to_center2, 0.7);\n\t\n\t// some final steps to choose a nice color\n\tf2 *= 2.3;\n\tif(should_dither && dith) { // dithering\n\t\tf2 *= 0.94;\n\t}\n\n\tf2 = floor(f2 * (float(n_colors)));\n\tf2 = min(f2, float(n_colors));\n\tvec4 col = IDX_colors(int(f2));\n\t\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"dither_size": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 7,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
},
"tilt": {
"type": "float",
"size": 1,
"array": false
},
"n_layers": {
"type": "float",
"size": 1,
"array": false
},
"layer_height": {
"type": "float",
"size": 1,
"array": false
},
"zoom": {
"type": "float",
"size": 1,
"array": false
},
"swirl": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"n_colors",
"OCTAVES"
],
"intDefaults": {
"n_colors": 6
}
},
"GasPlanetLayers_GasLayers": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform float cloud_cover;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float stretch;\nuniform float cloud_curve;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float bands;\nuniform bool should_dither;\n\n\nuniform vec4 colors[3];\nuniform vec4 dark_colors[3];\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\n// by Leukbaars from https://www.shadertoy.com/view/4tK3zR\nfloat circleNoise(vec2 uv) {\n    float uv_y = floor(uv.y);\n    uv.x += uv_y*.31;\n    vec2 f = fract(uv);\n\tfloat h = rand(vec2(floor(uv.x),floor(uv_y)));\n    float m = (length(f-0.25-(h*0.5)));\n    float r = h*0.25;\n    return smoothstep(0.0, r, m*0.75);\n}\n\nfloat turbulence(vec2 uv) {\n\tfloat c_noise = 0.0;\n\t\n\t\n\t// more iterations for more turbulence\n\tfor (int i = 0; i < 10; i++) {\n\t\tc_noise += circleNoise((uv * size *0.3) + (float(i+1)+10.) + (vec2(time * time_speed, 0.0)));\n\t}\n\treturn c_noise;\n}\n\nbool dither(vec2 uv_pixel, vec2 uv_real) {\n\treturn mod(uv_pixel.x+uv_real.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvec4 IDX_colors(int i) {\n\tif (i <= 0) { return colors[0]; }\n\tfor (int k = 0; k < 3; k++) { if (k == i) { return colors[k]; } }\n\treturn colors[2];\n}\n\nvec4 IDX_dark_colors(int i) {\n\tif (i <= 0) { return dark_colors[0]; }\n\tfor (int k = 0; k < 3; k++) { if (k == i) { return dark_colors[k]; } }\n\treturn dark_colors[2];\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\tfloat light_d = distance(uv, light_origin);\n\t\n\t// we use this value later to dither between colors\n\tbool dith = dither(uv, v_uv);\n\t\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(length(uv-vec2(0.5)), 0.49999);\n\t\n\t// rotate planet\n\tuv = rotate(uv, rotation);\n\t\n\t// map to sphere\n\tuv = spherify(uv);\n\n\t// a band is just one dimensional noise\n\tfloat band = fbm(vec2(0.0, uv.y*size*bands));\n\t\n\t// turbulence value is circles on top of each other\n\tfloat turb = turbulence(uv);\n\n\t// by layering multiple noise values & combining with turbulence and bands\n\t// we get some dynamic looking shape\t\n\tfloat fbm1 = fbm(uv*size);\n\tfloat fbm2 = fbm(uv*vec2(1.0, 2.0)*size+fbm1+vec2(-time*time_speed,0.0)+turb);\n\t\n\t// all of this is just increasing some contrast & applying light\n\tfbm2 *= pow(band,2.0)*7.0;\n\tfloat light = fbm2 + light_d*1.8;\n\tfbm2 += pow(light_d, 1.0)-0.3;\n\tfbm2 = smoothstep(-0.2, 4.0-fbm2, light);\n\t\n\t// apply the dither value\n\tif (dith && should_dither) {\n\t\tfbm2 *= 1.1;\n\t}\n\t\n\t// finally add colors\n\tfloat posterized = floor(fbm2*4.0)/2.0;\n\tvec4 col = vec4(vec3(0.0), 1.0);\n\tif (fbm2 < 0.625) {\n\t\tcol = IDX_colors(int(posterized * float(n_colors - 1)));\n\t} else {\n\t\tcol = IDX_dark_colors(int((posterized-1.0) * float(n_colors - 1)));\n\t}\n\t\t\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"cloud_cover": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"stretch": {
"type": "float",
"size": 1,
"array": false
},
"cloud_curve": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"bands": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"dark_colors": {
"type": "vec4",
"size": 3,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"n_colors",
"OCTAVES"
],
"intDefaults": {
"n_colors": 3
}
},
"GasPlanetLayers_Ring": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float ring_width;\nuniform float ring_perspective;\nuniform float scale_rel_to_planet;\n\n\nuniform vec4 colors[3];\nuniform vec4 dark_colors[3];\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\n// by Leukbaars from https://www.shadertoy.com/view/4tK3zR\nfloat circleNoise(vec2 uv) {\n    float uv_y = floor(uv.y);\n    uv.x += uv_y*.31;\n    vec2 f = fract(uv);\n\tfloat h = rand(vec2(floor(uv.x),floor(uv_y)));\n    float m = (length(f-0.25-(h*0.5)));\n    float r = h*0.25;\n    return smoothstep(0.0, r, m*0.75);\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvec4 IDX_colors(int i) {\n\tif (i <= 0) { return colors[0]; }\n\tfor (int k = 0; k < 3; k++) { if (k == i) { return colors[k]; } }\n\treturn colors[2];\n}\n\nvec4 IDX_dark_colors(int i) {\n\tif (i <= 0) { return dark_colors[0]; }\n\tfor (int k = 0; k < 3; k++) { if (k == i) { return dark_colors[k]; } }\n\treturn dark_colors[2];\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\tfloat light_d = distance(uv, light_origin);\n\tuv = rotate(uv, rotation);\n\t\n\t// center is used to determine ring position\n\tvec2 uv_center = uv - vec2(0.0, 0.5);\n\t\n\t// tilt ring\n\tuv_center *= vec2(1.0, ring_perspective);\n\tfloat center_d = distance(uv_center,vec2(0.5, 0.0));\n\t\n\t\n\t// cut out 2 circles of different sizes and only intersection of the 2.\n\tfloat ring = smoothstep(0.5-ring_width*2.0, 0.5-ring_width, center_d);\n\tring *= smoothstep(center_d-ring_width, center_d, 0.4);\n\t\n\t// pretend like the ring goes behind the planet by removing it if it's in the upper half.\n\tif (uv.y < 0.5) {\n\t\tring *= step(1.0/scale_rel_to_planet, distance(uv,vec2(0.5)));\n\t}\n\t\n\t// rotate material in the ring\n\tuv_center = rotate(uv_center+vec2(0, 0.5), time*time_speed);\n\t// some noise\n\tring *= fbm(uv_center*size);\n\t\n\t// apply some colors based on final value\n\tfloat posterized = floor((ring+pow(light_d, 2.0)*2.0)*4.0)/4.0;\n\tposterized = min(posterized, 2.0);\n\tvec4 col;\n\tif (posterized <= 1.0) {\n\t\tcol = IDX_colors(int(posterized * float(n_colors - 1)));\n\t} else {\n\t\tcol = IDX_dark_colors(int((posterized-1.0) * float(n_colors - 1)));\n\t}\n\t\n\tfloat ring_a = step(0.28, ring);\n\tgl_FragColor = vec4(col.rgb, ring_a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"ring_width": {
"type": "float",
"size": 1,
"array": false
},
"ring_perspective": {
"type": "float",
"size": 1,
"array": false
},
"scale_rel_to_planet": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"dark_colors": {
"type": "vec4",
"size": 3,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"n_colors",
"OCTAVES"
],
"intDefaults": {
"n_colors": 3
}
},
"GasPlanet_GasPlanet": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float cloud_cover;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float stretch;\nuniform float cloud_curve;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float rotation;\n\nuniform vec4 colors[4];\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(1.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\n// by Leukbaars from https://www.shadertoy.com/view/4tK3zR\nfloat circleNoise(vec2 uv) {\n    float uv_y = floor(uv.y);\n    uv.x += uv_y*.31;\n    vec2 f = fract(uv);\n\tfloat h = rand(vec2(floor(uv.x),floor(uv_y)));\n    float m = (length(f-0.25-(h*0.5)));\n    float r = h*0.25;\n    return smoothstep(0.0, r, m*0.75);\n}\n\nfloat cloud_alpha(vec2 uv) {\n\tfloat c_noise = 0.0;\n\t\n\t// more iterations for more turbulence\n\tfor (int i = 0; i < 9; i++) {\n\t\tc_noise += circleNoise((uv * size * 0.3) + (float(i+1)+10.) + (vec2(time*time_speed, 0.0)));\n\t}\n\tfloat fbm = fbm(uv*size+c_noise + vec2(time*time_speed, 0.0));\n\t\n\treturn fbm;//step(a_cutoff, fbm);\n}\n\nbool dither(vec2 uv_pixel, vec2 uv_real) {\n\treturn mod(uv_pixel.x+uv_real.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\t// distance to light source\n\tfloat d_light = distance(uv , light_origin);\n\t\n\t// cut out a circle\n\tfloat d_circle = distance(uv, vec2(0.5));\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(d_circle, 0.49999);\n\t\n\tuv = rotate(uv, rotation);\n\t\n\t// map to sphere\n\tuv = spherify(uv);\n\t\n\t// slightly make uv go down on the right, and up in the left\n\tuv.y += smoothstep(0.0, cloud_curve, abs(uv.x-0.4));\n\t\n\tfloat c = cloud_alpha(uv*vec2(1.0, stretch));\n\t\n\t// assign some colors based on cloud depth & distance from light\n\tvec4 col = colors[0];\n\tif (c < cloud_cover + 0.03) {\n\t\tcol = colors[1];\n\t}\n\tif (d_light + c*0.2 > light_border_1) {\n\t\tcol = colors[2];\n\t}\n\tif (d_light + c*0.2 > light_border_2) {\n\t\tcol = colors[3];\n\t}\n\t\n\tgl_FragColor = vec4(col.rgb, step(cloud_cover, c) * a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"cloud_cover": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"stretch": {
"type": "float",
"size": 1,
"array": false
},
"cloud_curve": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 4,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"LandMasses_Clouds": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform float cloud_cover;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float stretch;\nuniform float cloud_curve;\nuniform float light_border_1;\nuniform float light_border_2;\n\nuniform vec4 colors[4];\n\nuniform float size;\n\nuniform float seed;\n\nuniform float time;\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(1.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\n\n// by Leukbaars from https://www.shadertoy.com/view/4tK3zR\nfloat circleNoise(vec2 uv) {\n    float uv_y = floor(uv.y);\n    uv.x += uv_y*.31;\n    vec2 f = fract(uv);\n\tfloat h = rand(vec2(floor(uv.x),floor(uv_y)));\n    float m = (length(f-0.25-(h*0.5)));\n    float r = h*0.25;\n    return smoothstep(0.0, r, m*0.75);\n}\n\nfloat cloud_alpha(vec2 uv) {\n\tfloat c_noise = 0.0;\n\t\n\t// more iterations for more turbulence\n\tfor (int i = 0; i < 9; i++) {\n\t\tc_noise += circleNoise((uv * size * 0.3) + (float(i+1)+10.) + (vec2(time*time_speed, 0.0)));\n\t}\n\tfloat fbm = fbm(uv*size+c_noise + vec2(time*time_speed, 0.0));\n\t\n\treturn fbm;//step(a_cutoff, fbm);\n}\n\nbool dither(vec2 uv_pixel, vec2 uv_real) {\n\treturn mod(uv_pixel.x+uv_real.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\t// distance to light source\n\tfloat d_light = distance(uv , light_origin);\n\t\n\t\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(length(uv-vec2(0.5)), 0.49999);\n\t// cut out a circle\n\tfloat d_to_center = distance(uv, vec2(0.5));\n\t\n\tuv = rotate(uv, rotation);\n\t\n\t// map to sphere\n\tuv = spherify(uv);\n\t// slightly make uv go down on the right, and up in the left\n\tuv.y += smoothstep(0.0, cloud_curve, abs(uv.x-0.4));\n\t\n\t\n\tfloat c = cloud_alpha(uv*vec2(1.0, stretch));\n\t\n\t// assign some colors based on cloud depth & distance from light\n\tvec4 col = colors[0];\n\tif (c < cloud_cover + 0.03) {\n\t\tcol = colors[1];\n\t}\n\tif (d_light + c*0.2 > light_border_1) {\n\t\tcol = colors[2];\n\n\t}\n\tif (d_light + c*0.2 > light_border_2) {\n\t\tcol = colors[3];\n\t}\n\t\n\tc *= step(d_to_center, 0.5);\n\tgl_FragColor = vec4(col.rgb, step(cloud_cover, c) * a * col.a);\n}",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"cloud_cover": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"stretch": {
"type": "float",
"size": 1,
"array": false
},
"cloud_curve": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 4,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"LandMasses_PlanetLandmass": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float dither_size;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float land_cutoff;\n\nuniform vec4 colors[4];\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\n\n\nfloat rand(vec2 coord) {\n\t// land has to be tiled (or the contintents on this planet have to be changing very fast)\n\t// tiling only works for integer values, thus the rounding\n\t// it would probably be better to only allow integer sizes\n\t// multiply by vec2(2,1) to simulate planet having another side\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\tfloat d_light = distance(uv , light_origin);\n\t// cut out a circle\n\tfloat d_circle = distance(uv, vec2(0.5));\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(d_circle, 0.49999);\n\t\n\t// give planet a tilt\n\tuv = rotate(uv, rotation);\n\t\n\t// map to sphere\n\tuv = spherify(uv);\n\t\n\t// some scrolling noise for landmasses\n\tvec2 base_fbm_uv = (uv)*size+vec2(time*time_speed,0.0);\n\t\n\t// use multiple fbm's at different places so we can determine what color land gets\n\tfloat fbm1 = fbm(base_fbm_uv);\n\tfloat fbm2 = fbm(base_fbm_uv - light_origin*fbm1);\n\tfloat fbm3 = fbm(base_fbm_uv - light_origin*1.5*fbm1);\n\tfloat fbm4 = fbm(base_fbm_uv - light_origin*2.0*fbm1);\n\t\n\t// lots of magic numbers here\n\t// you can mess with them, it changes the color distribution\n\tif (d_light < light_border_1) {\n\t\tfbm4 *= 0.9;\n\t}\n\tif (d_light > light_border_1) {\n\t\tfbm2 *= 1.05;\n\t\tfbm3 *= 1.05;\n\t\tfbm4 *= 1.05;\n\t} \n\tif (d_light > light_border_2) {\n\t\tfbm2 *= 1.3;\n\t\tfbm3 *= 1.4;\n\t\tfbm4 *= 1.8;\n\t} \n\t\n\t// increase contrast on d_light\n\td_light = pow(d_light, 2.0)*0.1;\n\tvec4 col = colors[3];\n\t// assign colors based on if there is noise to the top-left of noise\n\t// and also based on how far noise is from light\n\tif (fbm4 + d_light < fbm1) {\n\t\tcol = colors[2];\n\t}\n\tif (fbm3 + d_light < fbm1) {\n\t\tcol = colors[1];\n\t}\n\tif (fbm2 + d_light < fbm1) {\n\t\tcol = colors[0];\n\t}\n\t\n\tgl_FragColor = vec4(col.rgb, step(land_cutoff, fbm1) * a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"dither_size": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"land_cutoff": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 4,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"LandMasses_PlanetUnder": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float dither_size;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform vec4 colors[3];\nuniform float size;\n\nuniform float seed;\nuniform float time;\nuniform bool should_dither;\n\nfloat rand(vec2 coord) {\n\t// land has to be tiled\n\t// tiling only works for integer values, thus the rounding\n\t// it would probably be better to only allow integer sizes\n\t// multiply by vec2(2,1) to simulate planet having another side\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\n\nvoid main() {\n\t//pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\tbool dith = dither(uv, v_uv);\n\t\n\t// check distance distance to light\n\tfloat d_light = distance(uv , vec2(light_origin));\n\t\n\t// cut out a circle\n\tfloat d_circle = distance(uv, vec2(0.5));\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(d_circle, 0.49999);\n\t\n\tuv = spherify(uv);\n\tuv = rotate(uv, rotation);\n\t\n\t// get a noise value with light distance added\n\td_light += fbm(uv*size+vec2(time*time_speed, 0.0))*0.3; // change the magic 0.3 here for different light strengths\n\t\n\t// size of edge in which colors should be dithered\n\tfloat dither_border = (1.0/pixels)*dither_size;\n\n\t// now we can assign colors based on distance to light origin\n\tvec4 col = colors[0];\n\tif (d_light > light_border_1) {\n\t\tcol = colors[1];\n\t\tif (d_light < light_border_1 + dither_border && (dith || !should_dither)) {\n\t\t\tcol = colors[0];\n\t\t}\n\t}\n\tif (d_light > light_border_2) {\n\t\tcol = colors[2];\n\t\tif (d_light < light_border_2 + dither_border && (dith || !should_dither)) {\n\t\t\tcol = colors[1];\n\t\t}\n\t}\n\t\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"dither_size": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"LavaWorld_Rivers": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float river_cutoff;\n\nuniform vec4 colors[3];\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\n\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\tfloat d_light = distance(uv , light_origin);\n\t\n\t// cut out a circle\n\tfloat d_circle = distance(uv, vec2(0.5));\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(d_circle, 0.49999);\n\t\n\t// give planet a tilt\n\tuv = rotate(uv, rotation);\n\t\n\t// map to sphere\n\tuv = spherify(uv);\n\t\n\t// some scrolling noise for landmasses\n\tfloat fbm1 = fbm(uv*size+vec2(time*time_speed,0.0));\n\tfloat river_fbm = fbm(uv + fbm1*2.5);\n\t\n\t// increase contrast on d_light\n\td_light = pow(d_light, 2.0)*0.4;\n\td_light -= d_light * river_fbm;\n\t\n\triver_fbm = step(river_cutoff, river_fbm);\n\t\n\t// apply colors\n\tvec4 col = colors[0];\n\tif (d_light > light_border_1) {\n\t\tcol = colors[1];\n\t}\n\tif (d_light > light_border_2) {\n\t\tcol = colors[2];\n\t}\n\t\n\ta *= step(river_cutoff, river_fbm);\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"river_cutoff": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"NoAtmosphere_Craters": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float light_border;\nuniform vec4 colors[2];\nuniform float size;\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(1.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\n// by Leukbaars from https://www.shadertoy.com/view/4tK3zR\nfloat circleNoise(vec2 uv) {\n    float uv_y = floor(uv.y);\n    uv.x += uv_y*.31;\n    vec2 f = fract(uv);\n\tfloat h = rand(vec2(floor(uv.x),floor(uv_y)));\n    float m = (length(f-0.25-(h*0.5)));\n    float r = h*0.25;\n    return m = smoothstep(r-.10*r,r,m);\n}\n\nfloat crater(vec2 uv) {\n\tfloat c = 1.0;\n\tfor (int i = 0; i < 2; i++) {\n\t\tc *= circleNoise((uv * size) + (float(i+1)+10.) + vec2(time*time_speed,0.0));\n\t}\n\treturn 1.0 - c;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvoid main() {\n\t//pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\t// check distance from center & distance to light\n\tfloat d_circle = distance(uv, vec2(0.5));\n\tfloat d_light = distance(uv , vec2(light_origin));\n\t// cut out a circle\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(d_circle, 0.49999);\n\t\n\tuv = rotate(uv, rotation);\n\tuv = spherify(uv);\n\t\t\n\tfloat c1 = crater(uv );\n\tfloat c2 = crater(uv +(light_origin-0.5)*0.03);\n\tvec4 col = colors[0];\n\t\n\ta *= step(0.5, c1);\n\tif (c2<c1-(0.5-d_light)*2.0) {\n\t\tcol = colors[1];\n\t}\n\tif (d_light > light_border) {\n\t\tcol = colors[1];\n\t} \n\n\t// cut out a circle\n\ta*= step(d_circle, 0.5);\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"light_border": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 2,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [],
"intDefaults": {}
},
"NoAtmosphere_NoAtmosphere": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float dither_size;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform vec4 colors[3];\nuniform float size;\n\nuniform float seed;\nuniform float time;\nuniform bool should_dither;\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(1.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvoid main() {\n\t//pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\t// check distance from center & distance to light\n\tfloat d_circle = distance(uv, vec2(0.5));\n\tfloat d_light = distance(uv , vec2(light_origin));\n\t// cut out a circle\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(d_circle, 0.49999);\n\t\n\tbool dith = dither(uv ,v_uv);\n\tuv = rotate(uv, rotation);\n\n\t// get a noise value with light distance added\n\t// this creates a moving dynamic shape\n\tfloat fbm1 = fbm(uv);\n\td_light += fbm(uv*size+fbm1+vec2(time*time_speed, 0.0))*0.3; // change the magic 0.3 here for different light strengths\n\t\n\t// size of edge in which colors should be dithered\n\tfloat dither_border = (1.0/pixels)*dither_size;\n\n\t// now we can assign colors based on distance to light origin\n\tvec4 col = colors[0];\n\tif (d_light > light_border_1) {\n\t\tcol = colors[1];\n\t\tif (d_light < light_border_1 + dither_border && (dith || !should_dither)) {\n\t\t\tcol = colors[0];\n\t\t}\n\t}\n\tif (d_light > light_border_2) {\n\t\tcol = colors[2];\n\t\tif (d_light < light_border_2 + dither_border && (dith || !should_dither)) {\n\t\t\tcol = colors[1];\n\t\t}\n\t}\n\t\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"dither_size": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"Rivers_LandRivers": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float dither_size;\nuniform bool should_dither;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float river_cutoff;\n\nuniform vec4 colors[6];\n\nuniform float size;\n\nuniform float seed;\n\nuniform float time;\n\n\nfloat rand(vec2 coord) {\n\t// land has to be tiled (or the contintents on this planet have to be changing very fast)\n\t// tiling only works for integer values, thus the rounding\n\t// it would probably be better to only allow integer sizes\n\t// multiply by vec2(2,1) to simulate planet having another side\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered = uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n//\tfloat z = pow(1.0 - dot(centered.xy, centered.xy), 0.5);\n\tvec2 sphere = centered/(z + 1.0);\n\t\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\tbool dith = dither(uv, v_uv);\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(length(uv-vec2(0.5)), 0.49999);\n\t\n\t// map to sphere\n\tuv = spherify(uv);\n\tfloat d_light = distance(uv , light_origin);\n\t\n\t// give planet a tilt\n\tuv = rotate(uv, rotation);\n\t\n\t// some scrolling noise for landmasses\n\tvec2 base_fbm_uv = (uv)*size+vec2(time*time_speed,0.0);\n\t\n\t// use multiple fbm's at different places so we can determine what color land gets\n\tfloat fbm1 = fbm(base_fbm_uv);\n\tfloat fbm2 = fbm(base_fbm_uv - light_origin*fbm1);\n\tfloat fbm3 = fbm(base_fbm_uv - light_origin*1.5*fbm1);\n\tfloat fbm4 = fbm(base_fbm_uv - light_origin*2.0*fbm1);\n\t\n\tfloat river_fbm = fbm(base_fbm_uv+fbm1*6.0);\n\triver_fbm = step(river_cutoff, river_fbm);\n\t\n\t// size of edge in which colors should be dithered\n\tfloat dither_border = (1.0/pixels)*dither_size;\n\t// lots of magic numbers here\n\t// you can mess with them, it changes the color distribution\n\tif (d_light < light_border_1) {\n\t\tfbm4 *= 0.9;\n\t}\n\tif (d_light > light_border_1) {\n\t\tfbm2 *= 1.05;\n\t\tfbm3 *= 1.05;\n\t\tfbm4 *= 1.05;\n\t} \n\tif (d_light > light_border_2) {\n\t\tfbm2 *= 1.3;\n\t\tfbm3 *= 1.4;\n\t\tfbm4 *= 1.8;\n\t\t\n\t\tif (d_light < light_border_2 + dither_border) {\n\t\t\tif (dith || !should_dither) {\n\t\t\t\tfbm4 *= 0.5;\n\t\t\t}\n\t\t}\n\t\t\n\t} \n\t\n\t// increase contrast on d_light\n\td_light = pow(d_light, 2.0)*0.4;\n\tvec4 col = colors[3];\n\tif (fbm4 + d_light < fbm1*1.5) {\n\t\tcol = colors[2];\n\t}\n\tif (fbm3 + d_light < fbm1*1.0) {\n\t\tcol = colors[1];\n\t}\n\tif (fbm2 + d_light < fbm1) {\n\t\tcol = colors[0];\n\t}\n\tif (river_fbm < fbm1*0.5) {\n\t\tcol = colors[5];\n\t\tif (fbm4 + d_light < fbm1*1.5) {\n\t\t\tcol = colors[4];\n\t\t}\n\t}\n\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"dither_size": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"river_cutoff": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 6,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"Star_Star": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float time_speed;\nuniform float time;\nuniform float rotation;\nuniform vec4 colors[4];\n\nuniform bool should_dither;\n\nuniform float seed;\nuniform float size;\n\nuniform float TILES;\n\n\nfloat rand(vec2 co) {\n\tco = mod(co, vec2(1.0,1.0)*round_(size));\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\nvec2 rotate(vec2 vec, float angle) {\n\tvec -=vec2(0.5);\n\tvec *= mat2(vec2(cos(angle),-sin(angle)), vec2(sin(angle),cos(angle)));\n\tvec += vec2(0.5);\n\treturn vec;\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nvec2 Hash2(vec2 p) {\n\tfloat r = 523.0*sin(dot(p, vec2(53.3158, 43.6143)));\n\treturn vec2(fract(15.32354 * r), fract(17.25865 * r));\n\t\n}\n\n// Tileable cell noise by Dave_Hoskins from shadertoy: https://www.shadertoy.com/view/4djGRh\nfloat Cells(in vec2 p, in float numCells) {\n\tp *= numCells;\n\tfloat d = 1.0e10;\n\tfor (int xo = -1; xo <= 1; xo++)\n\t{\n\t\tfor (int yo = -1; yo <= 1; yo++)\n\t\t{\n\t\t\tvec2 tp = floor(p) + vec2(float(xo), float(yo));\n\t\t\ttp = p - tp - Hash2(mod(tp, numCells / TILES));\n\t\t\td = min(d, dot(tp, tp));\n\t\t}\n\t}\n\treturn sqrt(d);\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec4 IDX_colors(int i) {\n\tif (i <= 0) { return colors[0]; }\n\tfor (int k = 0; k < 4; k++) { if (k == i) { return colors[k]; } }\n\treturn colors[3];\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 pixelized = floor(v_uv*pixels)/pixels;\n\t\n\t// cut out a circle\n\t// stepping over 0.5 instead of 0.49999 makes some pixels a little buggy\n\tfloat a = step(distance(pixelized, vec2(0.5)), .49999);\n\t\n\t// use dither val later to mix between colors\n\tbool dith = dither(v_uv, pixelized);\n\t\n\tpixelized = rotate(pixelized, rotation);\n\t\n\t// spherify has to go after dither\n\tpixelized = spherify(pixelized);\n\t\n\t// use two different sized cells for some variation\n\tfloat n = Cells(pixelized - vec2(time * time_speed * 2.0, 0), 10.0);\n\tn *= Cells(pixelized - vec2(time * time_speed * 1.0, 0), 20.0);\n\n\t\n\t// adjust cell value to get better looking stuff\n\tn*= 2.;\n\tn = clamp(n, 0.0, 1.0);\n\tif (dith || !should_dither) { // here we dither\n\t\tn *= 1.3;\n\t}\n\t\n\t// constrain values 4 possibilities and then choose color based on those\n\tfloat interpolate = floor(n * float(n_colors - 1)) / float(n_colors - 1);\n\tvec4 col = IDX_colors(int(interpolate * float(n_colors-1)));\n\t\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 4,
"array": true
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"TILES": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"n_colors",
"OCTAVES"
],
"intDefaults": {
"n_colors": 4
}
},
"Star_StarBlobs": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform vec4 colors[1];\nuniform float time_speed;\nuniform float time;\nuniform float rotation;\n\n\nuniform float seed;\nuniform float circle_amount;\nuniform float circle_size;\n\nuniform float size;\n\n\n\nfloat rand(vec2 co){\n\tco = mod(co, vec2(1.0,1.0)*round_(size));\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\n\nvec2 rotate(vec2 vec, float angle) {\n\tvec -=vec2(0.5);\n\tvec *= mat2(vec2(cos(angle),-sin(angle)), vec2(sin(angle),cos(angle)));\n\tvec += vec2(0.5);\n\treturn vec;\n}\n\nfloat circle(vec2 uv) {\n\tfloat invert = 1.0 / circle_amount;\n\t\n\tif (mod(uv.y, invert*2.0) < invert) {\n\t\tuv.x += invert*0.5;\n\t}\n\tvec2 rand_co = floor(uv*circle_amount)/circle_amount;\n\tuv = mod(uv, invert)*circle_amount;\n\t\n\tfloat r = rand(rand_co);\n\tr = clamp(r, invert, 1.0 - invert);\n\tfloat circle = distance(uv, vec2(r));\n\treturn smoothstep(circle, circle+0.5, invert * circle_size * rand(rand_co*1.5));\n}\n\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scl = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scl;\n\t\tcoord *= 2.0;\n\t\tscl *= 0.5;\n\t}\n\treturn value;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvoid main() {\n\tvec2 pixelized = floor(v_uv*pixels)/pixels;\n\n\tvec2 uv = rotate(pixelized, rotation);\n\n\t// angle from centered uv's\n\tfloat angle = atan(uv.x - 0.5, uv.y - 0.5);\n\tfloat d = distance(pixelized, vec2(0.5));\n\t\n\t\n\tfloat c = 0.0;\n\tfor(int i = 0; i < 15; i++) {\n\t\tfloat r = rand(vec2(float(i)));\n\t\tvec2 circleUV = vec2(d, angle);\n\t\tc += circle(circleUV*size -time * time_speed - (1.0/d) * 0.1 + r);\n\t}\n\t\n\tc *= 0.37 - d;\n\tc = step(0.07, c - d);\n\t\n\tgl_FragColor = vec4(colors[0].rgb, c * colors[0].a);\n}",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 1,
"array": true
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"circle_amount": {
"type": "float",
"size": 1,
"array": false
},
"circle_size": {
"type": "float",
"size": 1,
"array": false
},
"size": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"Star_StarFlares": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform vec4 colors[2];\nuniform float time_speed;\nuniform float time;\nuniform float rotation;\nuniform bool should_dither;\n\nuniform float storm_width;\nuniform float storm_dither_width;\n\nuniform float scale;\nuniform float seed;\nuniform float circle_amount;\nuniform float circle_scale;\n\nuniform float size;\n\n\n\nfloat rand(vec2 co){\n\tco = mod(co, vec2(1.0,1.0)*round_(size));\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 15.5453 * seed);\n}\n\n\nvec2 rotate(vec2 vec, float angle) {\n\tvec -=vec2(0.5);\n\tvec *= mat2(vec2(cos(angle),-sin(angle)), vec2(sin(angle),cos(angle)));\n\tvec += vec2(0.5);\n\treturn vec;\n}\n\nfloat circle(vec2 uv) {\n\tfloat invert = 1.0 / circle_amount;\n\t\n\tif (mod(uv.y, invert*2.0) < invert) {\n\t\tuv.x += invert*0.5;\n\t}\n\tvec2 rand_co = floor(uv*circle_amount)/circle_amount;\n\tuv = mod(uv, invert)*circle_amount;\n\t\n\tfloat r = rand(rand_co);\n\tr = clamp(r, invert, 1.0 - invert);\n\tfloat circle = distance(uv, vec2(r));\n\treturn smoothstep(circle, circle+0.5, invert * circle_scale * rand(rand_co*1.5));\n}\n\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scl = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scl;\n\t\tcoord *= 2.0;\n\t\tscl *= 0.5;\n\t}\n\treturn value;\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\n\nvec4 IDX_colors(int i) {\n\tif (i <= 0) { return colors[0]; }\n\tfor (int k = 0; k < 2; k++) { if (k == i) { return colors[k]; } }\n\treturn colors[1];\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 pixelized = floor(v_uv*pixels)/pixels;\n\t\n\t// use dither val later to interpolate between alpha\n\tbool dith = dither(v_uv, pixelized);\n\t\n\tpixelized = rotate(pixelized, rotation);\n\t\n\t// counter rotation against rotation caused by the way uv's are made later\n\tvec2 uv = pixelized;//rotate(pixelized, -time  * time_speed);\n\t\n\t// angle from centered uv's\n\tfloat angle = atan(uv.x - 0.5, uv.y - 0.5) * 0.4;\n\t// distance from center\n\tfloat d = distance(pixelized, vec2(0.5));\n\t\n\t// we make uv circular here to have eternally outward moving stuff\n\tvec2 circleUV = vec2(d, angle);\n\t\n\t// two types of noise values\n\tfloat n = fbm(circleUV*size -time * time_speed);\n\tfloat nc = circle(circleUV*scale -time * time_speed + n);\n\t\n\tnc *= 1.5;\n\tfloat n2 = fbm(circleUV*size -time + vec2(100, 100));\n\tnc -= n2 * 0.1;\n\t\n\t// our alpha, default 0\n\tfloat a = 0.0;\n\tif (1.0 - d > nc) {\n\t\t// now we generate very thin strips of positive alpha if our noise has certain values and is close enough to center\n\t\tif (nc > storm_width - storm_dither_width + d && (dith || !should_dither)) {\n\t\t\ta = 1.0;\n\t\t} else if (nc > storm_width + d) { // could use an or statement instead, but this looks more clear to me\n\t\t\ta = 1.0;\n\t\t}\n\t}\n\t\n\t// use our two noise values to assign colors\n\tfloat interpolate = floor(n2 + nc);\n\tvec4 col = IDX_colors(int(interpolate));\n\t\n\t// final step to not have everything appear from the center\n\ta *= step(n2 * 0.25, d);\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 2,
"array": true
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
},
"storm_width": {
"type": "float",
"size": 1,
"array": false
},
"storm_dither_width": {
"type": "float",
"size": 1,
"array": false
},
"scale": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"circle_amount": {
"type": "float",
"size": 1,
"array": false
},
"circle_scale": {
"type": "float",
"size": 1,
"array": false
},
"size": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"iceWorld_inline_2": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float time_speed;\nuniform float light_border_1;\nuniform float light_border_2;\nuniform float lake_cutoff;\n\nuniform vec4 colors[3];\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\n\n\nfloat rand(vec2 coord) {\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 43758.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvoid main() {\n\t// pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\t\n\tfloat d_light = distance(uv , light_origin);\n\t\n\t// give planet a tilt\n\tuv = rotate(uv, rotation);\n\tfloat d_circle = distance(uv, vec2(0.5));\n//\t// map to sphere\n\tuv = spherify(uv);\n\t\n\t// some scrolling noise for landmasses\n\tfloat fbm1 = fbm(uv*size+vec2(time*time_speed,0.0));\n\tfloat lake = fbm(uv*size+vec2(time*time_speed,0.0));\n\t\n\t// increase contrast on d_light\n\td_light = pow(d_light, 2.0)*0.4;\n\td_light -= d_light * lake;\n\n\t\n\tvec4 col = colors[0];\n\tif (d_light > light_border_1) {\n\t\tcol = colors[1];\n\t}\n\tif (d_light > light_border_2) {\n\t\tcol = colors[2];\n\t}\n\t\n\tfloat a = step(lake_cutoff, lake);\n\ta *= step(d_circle, 0.5);\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"light_border_1": {
"type": "float",
"size": 1,
"array": false
},
"light_border_2": {
"type": "float",
"size": 1,
"array": false
},
"lake_cutoff": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 3,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
}
},
"defines": [
"OCTAVES"
],
"intDefaults": {}
},
"terranDry_inline_1": {
"src": "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\nvarying vec2 v_uv;\n//__DEFINES__\nfloat round_(float x) { return floor(x + 0.5); }\n\nuniform float pixels;\nuniform float rotation;\nuniform vec2 light_origin;\nuniform float light_distance1;\nuniform float light_distance2;\nuniform float time_speed;\nuniform float dither_size;\nuniform vec4 colors[5];\n\nuniform float size;\n\nuniform float seed;\nuniform float time;\nuniform bool should_dither;\n\nfloat rand(vec2 coord) {\n\t// land has to be tiled\n\t// tiling only works for integer values, thus the rounding\n\t// it would probably be better to only allow integer sizes\n\t// multiply by vec2(2,1) to simulate planet having another side\n\tcoord = mod(coord, vec2(2.0,1.0)*round_(size));\n\treturn fract(sin(dot(coord.xy ,vec2(12.9898,78.233))) * 43758.5453 * seed);\n}\n\nfloat noise(vec2 coord){\n\tvec2 i = floor(coord);\n\tvec2 f = fract(coord);\n\t\n\tfloat a = rand(i);\n\tfloat b = rand(i + vec2(1.0, 0.0));\n\tfloat c = rand(i + vec2(0.0, 1.0));\n\tfloat d = rand(i + vec2(1.0, 1.0));\n\n\tvec2 cubic = f * f * (3.0 - 2.0 * f);\n\n\treturn mix(a, b, cubic.x) + (c - a) * cubic.y * (1.0 - cubic.x) + (d - b) * cubic.x * cubic.y;\n}\n\nfloat fbm(vec2 coord){\n\tfloat value = 0.0;\n\tfloat scale = 0.5;\n\n\tfor(int i = 0; i < OCTAVES ; i++){\n\t\tvalue += noise(coord) * scale;\n\t\tcoord *= 2.0;\n\t\tscale *= 0.5;\n\t}\n\treturn value;\n}\n\nbool dither(vec2 uv1, vec2 uv2) {\n\treturn mod(uv1.x+uv2.y,2.0/pixels) <= 1.0 / pixels;\n}\n\nvec2 rotate(vec2 coord, float angle){\n\tcoord -= 0.5;\n\tcoord *= mat2(vec2(cos(angle),-sin(angle)),vec2(sin(angle),cos(angle)));\n\treturn coord + 0.5;\n}\n\nvec2 spherify(vec2 uv) {\n\tvec2 centered= uv *2.0-1.0;\n\tfloat z = sqrt(max(0.0, 1.0 - dot(centered.xy, centered.xy)));\n\tvec2 sphere = centered/(z + 1.0);\n\treturn sphere * 0.5+0.5;\n}\n\n\nvec4 IDX_colors(int i) {\n\tif (i <= 0) { return colors[0]; }\n\tfor (int k = 0; k < 5; k++) { if (k == i) { return colors[k]; } }\n\treturn colors[4];\n}\n\nvoid main() {\n\t//pixelize uv\n\tvec2 uv = floor(v_uv*pixels)/pixels;\n\tbool dith = dither(uv, v_uv);\n\t\n\t// cut out a circle\n\tfloat d_circle = distance(uv, vec2(0.5));\n\tfloat a = step(d_circle, 0.49999);\n\t\n\tuv = spherify(uv);\n\t\n\t// check distance distance to light\n\tfloat d_light = distance(uv , vec2(light_origin));\n\t\n\tuv = rotate(uv, rotation);\n\t\n\t// noise\n\tfloat f = fbm(uv*size+vec2(time*time_speed, 0.0));\n\t\n\t// remap light\n\td_light = smoothstep(-0.3, 1.2, d_light);\n\t\n\tif (d_light < light_distance1) {\n\t\td_light *= 0.9;\n\t}\n\tif (d_light < light_distance2) {\n\t\td_light *= 0.9;\n\t}\n\t\n\t\n\tfloat c = d_light*pow(f,0.8)*3.5; // change the magic nums here for different light strengths\n\t\n\t// apply dithering\n\tif (dith || !should_dither) {\n\t\tc += 0.02;\n\t\tc *= 1.05;\n\t}\n\t\n\t// now we can assign colors based on distance to light origin\n\tfloat posterize = floor(c*4.0)/4.0;\n\tposterize = min(posterize, 1.0);\n\tvec4 col = IDX_colors(int(posterize * float(n_colors-1)));\n\t\n\tgl_FragColor = vec4(col.rgb, a * col.a);\n}\n",
"uniforms": {
"pixels": {
"type": "float",
"size": 1,
"array": false
},
"rotation": {
"type": "float",
"size": 1,
"array": false
},
"light_origin": {
"type": "vec2",
"size": 1,
"array": false
},
"light_distance1": {
"type": "float",
"size": 1,
"array": false
},
"light_distance2": {
"type": "float",
"size": 1,
"array": false
},
"time_speed": {
"type": "float",
"size": 1,
"array": false
},
"dither_size": {
"type": "float",
"size": 1,
"array": false
},
"colors": {
"type": "vec4",
"size": 5,
"array": true
},
"size": {
"type": "float",
"size": 1,
"array": false
},
"seed": {
"type": "float",
"size": 1,
"array": false
},
"time": {
"type": "float",
"size": 1,
"array": false
},
"should_dither": {
"type": "bool",
"size": 1,
"array": false
}
},
"defines": [
"n_colors",
"OCTAVES"
],
"intDefaults": {
"n_colors": 5
}
}
};

  /* ================= generated: per-layer uniform defaults ========= */
  /* generated by build.py from planets.json — do not edit */
  var LAYER_DEFAULTS = {
"terranWet": {
"Land": {
"pixels": 100.0,
"rotation": 0.2,
"light_origin": [
0.39,
0.39
],
"time_speed": 0.1,
"dither_size": 3.951,
"should_dither": true,
"light_border_1": 0.287,
"light_border_2": 0.476,
"river_cutoff": 0.368,
"colors": [
[
0.388235,
0.670588,
0.247059,
1.0
],
[
0.231373,
0.490196,
0.309804,
1.0
],
[
0.184314,
0.341176,
0.32549,
1.0
],
[
0.156863,
0.207843,
0.25098,
1.0
],
[
0.309804,
0.643137,
0.721569,
1.0
],
[
0.25098,
0.286275,
0.45098,
1.0
]
],
"size": 4.6,
"OCTAVES": 6.0,
"seed": 8.98,
"time": 0.0
},
"Cloud": {
"pixels": 100.0,
"rotation": 0.0,
"cloud_cover": 0.47,
"light_origin": [
0.39,
0.39
],
"time_speed": 0.1,
"stretch": 2.0,
"cloud_curve": 1.3,
"light_border_1": 0.52,
"light_border_2": 0.62,
"colors": [
[
0.960784,
1.0,
0.909804,
1.0
],
[
0.87451,
0.878431,
0.909804,
1.0
],
[
0.407843,
0.435294,
0.6,
1.0
],
[
0.25098,
0.286275,
0.45098,
1.0
]
],
"size": 7.315,
"OCTAVES": 2.0,
"seed": 5.939,
"time": 0.0
}
},
"terranDry": {
"Land": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.4,
0.3
],
"light_distance1": 0.362,
"light_distance2": 0.525,
"time_speed": 0.1,
"dither_size": 2.0,
"colors": [
[
1.0,
0.537255,
0.2,
1.0
],
[
0.901961,
0.270588,
0.223529,
1.0
],
[
0.678431,
0.184314,
0.270588,
1.0
],
[
0.321569,
0.2,
0.247059,
1.0
],
[
0.239216,
0.160784,
0.211765,
1.0
]
],
"n_colors": 5.0,
"size": 8.0,
"OCTAVES": 3.0,
"seed": 1.175,
"time": 0.0,
"should_dither": true
}
},
"islands": {
"Water": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.39,
0.39
],
"time_speed": 0.1,
"dither_size": 2.0,
"light_border_1": 0.4,
"light_border_2": 0.6,
"colors": [
[
0.572549,
0.909804,
0.752941,
1.0
],
[
0.309804,
0.643137,
0.721569,
1.0
],
[
0.172549,
0.207843,
0.301961,
1.0
]
],
"size": 5.228,
"OCTAVES": 3.0,
"seed": 10.0,
"time": 0.0,
"should_dither": true
},
"Land": {
"pixels": 100.0,
"rotation": 0.2,
"light_origin": [
0.39,
0.39
],
"time_speed": 0.2,
"dither_size": 2.0,
"light_border_1": 0.32,
"light_border_2": 0.534,
"land_cutoff": 0.633,
"colors": [
[
0.784314,
0.831373,
0.364706,
1.0
],
[
0.388235,
0.670588,
0.247059,
1.0
],
[
0.184314,
0.341176,
0.32549,
1.0
],
[
0.156863,
0.207843,
0.25098,
1.0
]
],
"size": 4.292,
"OCTAVES": 6.0,
"seed": 7.947,
"time": 0.0
},
"Cloud": {
"pixels": 100.0,
"rotation": 0.0,
"cloud_cover": 0.415,
"light_origin": [
0.39,
0.39
],
"time_speed": 0.47,
"stretch": 2.0,
"cloud_curve": 1.3,
"light_border_1": 0.52,
"light_border_2": 0.62,
"colors": [
[
0.87451,
0.878431,
0.909804,
1.0
],
[
0.639216,
0.654902,
0.760784,
1.0
],
[
0.407843,
0.435294,
0.6,
1.0
],
[
0.25098,
0.286275,
0.45098,
1.0
]
],
"size": 7.745,
"OCTAVES": 2.0,
"seed": 5.939,
"time": 0.0
}
},
"noAtmosphere": {
"Ground": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.25,
0.25
],
"time_speed": 0.4,
"dither_size": 2.0,
"light_border_1": 0.615,
"light_border_2": 0.729,
"colors": [
[
0.639216,
0.654902,
0.760784,
1.0
],
[
0.298039,
0.407843,
0.521569,
1.0
],
[
0.227451,
0.247059,
0.368627,
1.0
]
],
"size": 8.0,
"OCTAVES": 4.0,
"seed": 1.012,
"time": 0.0,
"should_dither": true
},
"Craters": {
"pixels": 87.419,
"rotation": 0.0,
"light_origin": [
0.25,
0.25
],
"time_speed": 0.001,
"light_border": 0.465,
"colors": [
[
0.298039,
0.407843,
0.521569,
1.0
],
[
0.227451,
0.247059,
0.368627,
1.0
]
],
"size": 5.0,
"seed": 4.517,
"time": 0.0
}
},
"gasGiant1": {
"Cloud": {
"pixels": 100.0,
"cloud_cover": 0.0,
"light_origin": [
0.25,
0.25
],
"time_speed": 0.7,
"stretch": 1.0,
"cloud_curve": 1.3,
"light_border_1": 0.692,
"light_border_2": 0.666,
"rotation": 0.0,
"colors": [
[
0.231373,
0.12549,
0.152941,
1.0
],
[
0.231373,
0.12549,
0.152941,
1.0
],
[
0.0,
0.0,
0.0,
1.0
],
[
0.129412,
0.0941176,
0.105882,
1.0
]
],
"size": 9.0,
"OCTAVES": 5.0,
"seed": 5.939,
"time": 0.0
},
"Cloud2": {
"pixels": 100.0,
"cloud_cover": 0.538,
"light_origin": [
0.25,
0.25
],
"time_speed": 0.47,
"stretch": 1.0,
"cloud_curve": 1.3,
"light_border_1": 0.439,
"light_border_2": 0.746,
"rotation": 0.0,
"colors": [
[
0.941176,
0.709804,
0.254902,
1.0
],
[
0.811765,
0.458824,
0.168627,
1.0
],
[
0.670588,
0.317647,
0.188235,
1.0
],
[
0.490196,
0.219608,
0.2,
1.0
]
],
"size": 9.0,
"OCTAVES": 5.0,
"seed": 5.939,
"time": 0.0
}
},
"gasGiant2": {
"GasLayers": {
"pixels": 100.0,
"rotation": 0.0,
"cloud_cover": 0.61,
"light_origin": [
-0.1,
0.3
],
"time_speed": 0.05,
"stretch": 2.204,
"cloud_curve": 1.376,
"light_border_1": 0.52,
"light_border_2": 0.62,
"bands": 0.892,
"should_dither": true,
"n_colors": 3.0,
"colors": [
[
0.933333,
0.764706,
0.603922,
1.0
],
[
0.85098,
0.627451,
0.4,
1.0
],
[
0.560784,
0.337255,
0.231373,
1.0
]
],
"dark_colors": [
[
0.4,
0.223529,
0.192157,
1.0
],
[
0.270588,
0.156863,
0.235294,
1.0
],
[
0.133333,
0.12549,
0.203922,
1.0
]
],
"size": 10.107,
"OCTAVES": 3.0,
"seed": 6.314,
"time": 0.0
},
"Ring": {
"pixels": 300.0,
"rotation": 0.7,
"light_origin": [
-0.1,
0.3
],
"time_speed": 0.2,
"light_border_1": 0.52,
"light_border_2": 0.62,
"ring_width": 0.127,
"ring_perspective": 6.0,
"scale_rel_to_planet": 6.0,
"n_colors": 3.0,
"colors": [
[
0.933333,
0.764706,
0.603922,
1.0
],
[
0.701961,
0.478431,
0.313726,
1.0
],
[
0.560784,
0.337255,
0.231373,
1.0
]
],
"dark_colors": [
[
0.333333,
0.188235,
0.211765,
1.0
],
[
0.196078,
0.137255,
0.215686,
1.0
],
[
0.133333,
0.12549,
0.203922,
1.0
]
],
"size": 15.0,
"OCTAVES": 4.0,
"seed": 8.461,
"time": 0.0
}
},
"iceWorld": {
"Land": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.3,
0.3
],
"time_speed": 0.25,
"dither_size": 2.0,
"light_border_1": 0.48,
"light_border_2": 0.632,
"colors": [
[
0.980392,
1.0,
1.0,
1.0
],
[
0.780392,
0.831373,
0.882353,
1.0
],
[
0.572549,
0.560784,
0.721569,
1.0
]
],
"size": 8.0,
"OCTAVES": 2.0,
"seed": 1.036,
"time": 0.0,
"should_dither": true
},
"Lakes": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.3,
0.3
],
"time_speed": 0.2,
"light_border_1": 0.024,
"light_border_2": 0.047,
"lake_cutoff": 0.55,
"colors": [
[
0.309804,
0.643137,
0.721569,
1.0
],
[
0.298039,
0.407843,
0.521569,
1.0
],
[
0.227451,
0.247059,
0.368627,
1.0
]
],
"size": 10.0,
"OCTAVES": 3.0,
"seed": 1.14,
"time": 0.0
},
"Clouds": {
"pixels": 100.0,
"rotation": 0.0,
"cloud_cover": 0.546,
"light_origin": [
0.3,
0.3
],
"time_speed": 0.1,
"stretch": 2.5,
"cloud_curve": 1.3,
"light_border_1": 0.566,
"light_border_2": 0.781,
"colors": [
[
0.882353,
0.94902,
1.0,
1.0
],
[
0.752941,
0.890196,
1.0,
1.0
],
[
0.368627,
0.439216,
0.647059,
1.0
],
[
0.25098,
0.286275,
0.45098,
1.0
]
],
"size": 4.0,
"OCTAVES": 4.0,
"seed": 1.14,
"time": 0.0
}
},
"lavaWorld": {
"Land": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.3,
0.3
],
"time_speed": 0.2,
"dither_size": 2.0,
"light_border_1": 0.4,
"light_border_2": 0.6,
"colors": [
[
0.560784,
0.301961,
0.341176,
1.0
],
[
0.321569,
0.2,
0.247059,
1.0
],
[
0.239216,
0.160784,
0.211765,
1.0
]
],
"size": 10.0,
"OCTAVES": 3.0,
"seed": 1.551,
"time": 0.0,
"should_dither": true
},
"Craters": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.3,
0.3
],
"time_speed": 0.2,
"light_border": 0.4,
"colors": [
[
0.321569,
0.2,
0.247059,
1.0
],
[
0.239216,
0.160784,
0.211765,
1.0
]
],
"size": 3.5,
"seed": 1.561,
"time": 0.0
},
"LavaRivers": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.3,
0.3
],
"time_speed": 0.2,
"light_border_1": 0.019,
"light_border_2": 0.036,
"river_cutoff": 0.579,
"colors": [
[
1.0,
0.537255,
0.2,
1.0
],
[
0.901961,
0.270588,
0.223529,
1.0
],
[
0.678431,
0.184314,
0.270588,
1.0
]
],
"size": 10.0,
"OCTAVES": 4.0,
"seed": 2.527,
"time": 0.0
}
},
"asteroid": {
"Asteroid": {
"pixels": 100.0,
"rotation": 0.0,
"light_origin": [
0.0,
0.0
],
"time_speed": 0.4,
"colors": [
[
0.639216,
0.654902,
0.760784,
1.0
],
[
0.298039,
0.407843,
0.521569,
1.0
],
[
0.227451,
0.247059,
0.368627,
1.0
]
],
"size": 5.294,
"octaves": 2.0,
"seed": 1.567,
"should_dither": true
}
},
"blackHole": {
"BlackHole": {
"pixels": 100.0,
"colors": [
[
0.152941,
0.152941,
0.211765,
1.0
],
[
1.0,
1.0,
0.921569,
1.0
],
[
0.929412,
0.482353,
0.223529,
1.0
]
],
"radius": 0.247,
"light_width": 0.028
},
"Disk": {
"pixels": 300.0,
"rotation": 0.766,
"light_origin": [
0.607,
0.444
],
"time_speed": 0.2,
"disk_width": 0.065,
"ring_perspective": 14.0,
"should_dither": true,
"colors": [
[
1.0,
1.0,
0.921569,
1.0
],
[
1.0,
0.960784,
0.25098,
1.0
],
[
1.0,
0.721569,
0.290196,
1.0
],
[
0.929412,
0.482353,
0.223529,
1.0
],
[
0.741176,
0.25098,
0.207843,
1.0
]
],
"n_colors": 5.0,
"size": 6.598,
"OCTAVES": 3.0,
"seed": 8.175,
"time": 0.0
}
},
"galaxy": {
"Galaxy": {
"pixels": 200.0,
"rotation": 0.674,
"time_speed": 1.0,
"dither_size": 2.0,
"should_dither": true,
"colors": [
[
1.0,
1.0,
0.921569,
1.0
],
[
1.0,
0.913725,
0.552941,
1.0
],
[
0.709804,
0.878431,
0.4,
1.0
],
[
0.396078,
0.647059,
0.4,
1.0
],
[
0.223529,
0.364706,
0.392157,
1.0
],
[
0.196078,
0.223529,
0.301961,
1.0
],
[
0.196078,
0.160784,
0.278431,
1.0
]
],
"n_colors": 6.0,
"size": 7.0,
"OCTAVES": 1.0,
"seed": 5.881,
"time": 0.0,
"tilt": 3.0,
"n_layers": 4.0,
"layer_height": 0.4,
"zoom": 1.375,
"swirl": -9.0
}
},
"star": {
"Blobs": {
"pixels": 200.0,
"colors": [
[
1.0,
1.0,
0.894118,
1.0
]
],
"time_speed": 0.05,
"time": 0.0,
"rotation": 0.0,
"seed": 3.078,
"circle_amount": 2.0,
"circle_size": 1.0,
"size": 4.93,
"OCTAVES": 4.0
},
"Star": {
"pixels": 100.0,
"time_speed": 0.05,
"time": 51.877,
"rotation": 0.0,
"colors": [
[
0.960784,
1.0,
0.909804,
1.0
],
[
0.466667,
0.839216,
0.756863,
1.0
],
[
0.109804,
0.572549,
0.654902,
1.0
],
[
0.0117647,
0.243137,
0.368627,
1.0
]
],
"n_colors": 4.0,
"should_dither": true,
"seed": 4.837,
"size": 4.463,
"OCTAVES": 4.0,
"TILES": 1.0
},
"StarFlares": {
"pixels": 200.0,
"colors": [
[
0.466667,
0.839216,
0.756863,
1.0
],
[
1.0,
1.0,
0.894118,
1.0
]
],
"time_speed": 0.05,
"time": 0.0,
"rotation": 0.0,
"should_dither": true,
"storm_width": 0.3,
"storm_dither_width": 0.0,
"scale": 1.0,
"seed": 3.078,
"circle_amount": 2.0,
"circle_scale": 1.0,
"size": 1.6,
"OCTAVES": 4.0
}
}
};

  /* ================= rng & seed ==================================== */

  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashSeed(s) {
    if (typeof s === 'number' && isFinite(s)) { return s >>> 0; }
    s = String(s);
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }
  function rr(rng, a, b) { return a + rng() * (b - a); }

  /* ================= color utilities =============================== */

  function parseColor(c) {
    if (Array.isArray(c)) { return [c[0], c[1], c[2], c.length > 3 ? c[3] : 1]; }
    var s = String(c).trim().replace(/^#/, '');
    if (s.length === 3) { s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]; }
    if (s.length === 6) { s += 'ff'; }
    var n = parseInt(s, 16);
    return [((n >>> 24) & 255) / 255, ((n >>> 16) & 255) / 255, ((n >>> 8) & 255) / 255, (n & 255) / 255];
  }
  function toHex(c) {
    function h(v) { return ('0' + Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16)).slice(-2); }
    return '#' + h(c[0]) + h(c[1]) + h(c[2]);
  }
  // Godot Color helpers
  function darkened(c, f) { return [c[0] * (1 - f), c[1] * (1 - f), c[2] * (1 - f), c[3]]; }
  function lightened(c, f) {
    return [c[0] + (1 - c[0]) * f, c[1] + (1 - c[1]) * f, c[2] + (1 - c[2]) * f, c[3]];
  }
  function rgb2hsv(c) {
    var r = c[0], g = c[1], b = c[2];
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, h = 0;
    if (d > 0) {
      if (mx === r) { h = ((g - b) / d) % 6; }
      else if (mx === g) { h = (b - r) / d + 2; }
      else { h = (r - g) / d + 4; }
      h /= 6; if (h < 0) { h += 1; }
    }
    return [h, mx === 0 ? 0 : d / mx, mx];
  }
  function hsv2rgb(h, s, v, a) {
    h = h - Math.floor(h);
    var i = Math.floor(h * 6), f = h * 6 - i;
    var p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
    var r, g, b;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      default: r = v; g = p; b = q;
    }
    return [r, g, b, a === undefined ? 1 : a];
  }
  function hueShift(c, dh) {
    var hsv = rgb2hsv(c);
    return hsv2rgb(hsv[0] + dh, hsv[1], hsv[2], c[3]);
  }

  // iq-style palette (Planet.gd _generate_new_colorscheme)
  function genColorscheme(rng, nColors, hueDiff, saturation) {
    if (hueDiff === undefined) { hueDiff = 0.9; }
    if (saturation === undefined) { saturation = 0.5; }
    var a = [0.5, 0.5, 0.5];
    var b = [0.5 * saturation, 0.5 * saturation, 0.5 * saturation];
    var c = [rr(rng, 0.5, 1.5) * hueDiff, rr(rng, 0.5, 1.5) * hueDiff, rr(rng, 0.5, 1.5) * hueDiff];
    var dm = rr(rng, 1.0, 3.0);
    // GDScript evaluates the three components before the shared multiplier draw
    var d = [rng(), rng(), rng()];
    // NOTE: in the original, d = Vector3(randf,randf,randf) * randf_range(1,3) —
    // the range draw happens after the three components.
    d = [d[0] * dm, d[1] * dm, d[2] * dm];
    var cols = [];
    var n = Math.max(1, nColors - 1);
    for (var i = 0; i < nColors; i++) {
      var t = i / n;
      cols.push([
        a[0] + b[0] * Math.cos(6.28318 * (c[0] * t + d[0])),
        a[1] + b[1] * Math.cos(6.28318 * (c[1] * t + d[1])),
        a[2] + b[2] * Math.cos(6.28318 * (c[2] * t + d[2])),
        1
      ]);
    }
    return cols;
  }

  /* ================= planet type table ============================== */
  /* Geometry + behavior straight from each <Type>.gd. M(L) is Planet.gd's
   * get_multiplier: round(size)*2 / time_speed — the seamless-loop period. */

  function M(L) { return (Math.round(L.size) * 2.0) / L.time_speed; }

  var TYPES = {
    terranWet: {
      label: 'Terran Wet', relativeScale: 1,
      layers: [
        { name: 'Land',  shader: 'Rivers_LandRivers' },
        { name: 'Cloud', shader: 'LandMasses_Clouds' }
      ],
      colorMap: [['Land', 6], ['Cloud', 4]],
      seedExtras: function (rng, L) { L.Cloud.cloud_cover = rr(rng, 0.35, 0.6); },
      updateTime: function (t, L) {
        L.Land.time = t * M(L.Land) * 0.02;
        L.Cloud.time = t * M(L.Cloud) * 0.01;
      },
      customTime: function (t, L) {
        L.Land.time = t * M(L.Land);
        L.Cloud.time = t * M(L.Cloud) * 0.5;
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, (rng() * 2 | 0) + 3, rr(rng, 0.7, 1.0), rr(rng, 0.45, 0.55));
        var land = [], river = [], cloud = [], i, c;
        for (i = 0; i < 4; i++) { c = darkened(sc[0], i / 4); land.push(hueShift(c, 0.2 * (i / 4))); }
        for (i = 0; i < 2; i++) { c = darkened(sc[1], i / 2); river.push(hueShift(c, 0.2 * (i / 2))); }
        for (i = 0; i < 4; i++) { c = lightened(sc[2], (1 - i / 4) * 0.8); cloud.push(hueShift(c, 0.2 * (i / 4))); }
        return land.concat(river, cloud);
      }
    },

    terranDry: {
      label: 'Terran Dry', relativeScale: 1,
      layers: [{ name: 'Land', shader: 'terranDry_inline_1' }],
      colorMap: [['Land', 5]],
      updateTime: function (t, L) { L.Land.time = t * M(L.Land) * 0.02; },
      customTime: function (t, L) { L.Land.time = t * M(L.Land); },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, 5 + (rng() * 3 | 0), rr(rng, 0.3, 0.65), 1.0);
        var cols = [];
        for (var i = 0; i < 5; i++) {
          cols.push(lightened(darkened(sc[i], i / 5), (1 - i / 5) * 0.2));
        }
        return cols;
      }
    },

    islands: {
      label: 'Islands', relativeScale: 1,
      layers: [
        { name: 'Water', shader: 'LandMasses_PlanetUnder' },
        { name: 'Land',  shader: 'LandMasses_PlanetLandmass' },
        { name: 'Cloud', shader: 'LandMasses_Clouds' }
      ],
      colorMap: [['Water', 3], ['Land', 4], ['Cloud', 4]],
      seedExtras: function (rng, L) { L.Cloud.cloud_cover = rr(rng, 0.35, 0.6); },
      updateTime: function (t, L) {
        L.Cloud.time = t * M(L.Cloud) * 0.01;
        L.Water.time = t * M(L.Water) * 0.02;
        L.Land.time = t * M(L.Land) * 0.02;
      },
      customTime: function (t, L) {
        L.Cloud.time = t * M(L.Cloud);
        L.Water.time = t * M(L.Water);
        L.Land.time = t * M(L.Land);
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, (rng() * 2 | 0) + 3, rr(rng, 0.7, 1.0), rr(rng, 0.45, 0.55));
        var land = [], water = [], cloud = [], i, c;
        for (i = 0; i < 4; i++) { c = darkened(sc[0], i / 4); land.push(hueShift(c, 0.2 * (i / 4))); }
        for (i = 0; i < 3; i++) { c = darkened(sc[1], i / 5); water.push(hueShift(c, 0.1 * (i / 2))); }
        for (i = 0; i < 4; i++) { c = lightened(sc[2], (1 - i / 4) * 0.8); cloud.push(hueShift(c, 0.2 * (i / 4))); }
        return water.concat(land, cloud);
      }
    },

    noAtmosphere: {
      label: 'No Atmosphere', relativeScale: 1,
      layers: [
        { name: 'Ground',  shader: 'NoAtmosphere_NoAtmosphere' },
        { name: 'Craters', shader: 'NoAtmosphere_Craters' }
      ],
      colorMap: [['Ground', 3], ['Craters', 2]],
      updateTime: function (t, L) {
        L.Ground.time = t * M(L.Ground) * 0.02;
        L.Craters.time = t * M(L.Craters) * 0.02;
      },
      customTime: function (t, L) {
        L.Ground.time = t * M(L.Ground);
        L.Craters.time = t * M(L.Craters);
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, 3 + (rng() * 2 | 0), rr(rng, 0.3, 0.6), 0.7);
        var cols = [];
        for (var i = 0; i < 3; i++) {
          cols.push(lightened(darkened(sc[i], i / 3), (1 - i / 3) * 0.2));
        }
        return cols.concat([cols[1], cols[2]]);
      }
    },

    gasGiant1: {
      label: 'Gas Giant 1', relativeScale: 1,
      layers: [
        { name: 'Cloud',  shader: 'GasPlanet_GasPlanet' },
        { name: 'Cloud2', shader: 'GasPlanet_GasPlanet' }
      ],
      colorMap: [['Cloud', 4], ['Cloud2', 4]],
      seedExtras: function (rng, L) { L.Cloud2.cloud_cover = rr(rng, 0.28, 0.5); },
      updateTime: function (t, L) {
        L.Cloud.time = t * M(L.Cloud) * 0.005;
        L.Cloud2.time = t * M(L.Cloud2) * 0.005;
      },
      customTime: function (t, L) {
        L.Cloud.time = t * M(L.Cloud);
        L.Cloud2.time = t * M(L.Cloud2);
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, 8 + (rng() * 4 | 0), rr(rng, 0.3, 0.8), 1.0);
        var c1 = [], c2 = [], i;
        for (i = 0; i < 4; i++) { c1.push(darkened(darkened(sc[i], i / 6), 0.7)); }
        for (i = 0; i < 4; i++) { c2.push(lightened(darkened(sc[i + 4], i / 4), (1 - i / 4) * 0.5)); }
        return c1.concat(c2);
      }
    },

    gasGiant2: {
      label: 'Gas Giant 2', relativeScale: 3,
      layers: [
        { name: 'GasLayers', shader: 'GasPlanetLayers_GasLayers' },
        { name: 'Ring', shader: 'GasPlanetLayers_Ring',
          pos: [-1, -1], sizeF: 3, pixelsF: 3, rotOffset: 0.7 }
      ],
      // colors[0..3) -> both layers' `colors`; [3..6) -> both layers' `dark_colors`
      colorMap: [['GasLayers', 3], ['GasLayers', 3, 'dark_colors']],
      sharedColors: [['Ring', 'colors'], ['Ring', 'dark_colors']],
      updateTime: function (t, L) {
        L.GasLayers.time = t * M(L.GasLayers) * 0.004;
        L.Ring.time = t * 314.15 * 0.004;
      },
      customTime: function (t, L) {
        L.GasLayers.time = t * M(L.GasLayers);
        L.Ring.time = t * 314.15 * L.Ring.time_speed * 0.5;
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, 6 + (rng() * 4 | 0), rr(rng, 0.3, 0.55), 1.4);
        var cols = [];
        for (var i = 0; i < 6; i++) {
          cols.push(lightened(darkened(sc[i], i / 7), (1 - i / 6) * 0.3));
        }
        return cols;
      }
    },

    iceWorld: {
      label: 'Ice World', relativeScale: 1,
      layers: [
        { name: 'Land',   shader: 'LandMasses_PlanetUnder' },
        { name: 'Lakes',  shader: 'iceWorld_inline_2' },
        { name: 'Clouds', shader: 'LandMasses_Clouds' }
      ],
      colorMap: [['Land', 3], ['Lakes', 3], ['Clouds', 4]],
      updateTime: function (t, L) {
        L.Land.time = t * M(L.Land) * 0.02;
        L.Lakes.time = t * M(L.Lakes) * 0.02;
        L.Clouds.time = t * M(L.Clouds) * 0.01;
      },
      customTime: function (t, L) {
        L.Land.time = t * M(L.Land);
        L.Lakes.time = t * M(L.Lakes);
        L.Clouds.time = t * M(L.Clouds);
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, (rng() * 2 | 0) + 3, rr(rng, 0.7, 1.0), rr(rng, 0.45, 0.55));
        var land = [], lake = [], cloud = [], i, c;
        for (i = 0; i < 3; i++) { c = darkened(sc[0], i / 3); land.push(hueShift(c, 0.2 * (i / 4))); }
        for (i = 0; i < 3; i++) { c = darkened(sc[1], i / 3); lake.push(hueShift(c, 0.2 * (i / 3))); }
        for (i = 0; i < 4; i++) { c = lightened(sc[2], (1 - i / 4) * 0.8); cloud.push(hueShift(c, 0.2 * (i / 4))); }
        return land.concat(lake, cloud);
      }
    },

    lavaWorld: {
      label: 'Lava World', relativeScale: 1,
      layers: [
        { name: 'Land',       shader: 'NoAtmosphere_NoAtmosphere' },
        { name: 'Craters',    shader: 'NoAtmosphere_Craters' },
        { name: 'LavaRivers', shader: 'LavaWorld_Rivers' }
      ],
      colorMap: [['Land', 3], ['Craters', 2], ['LavaRivers', 3]],
      updateTime: function (t, L) {
        L.Land.time = t * M(L.Land) * 0.02;
        L.Craters.time = t * M(L.Craters) * 0.02;
        L.LavaRivers.time = t * M(L.LavaRivers) * 0.02;
      },
      customTime: function (t, L) {
        L.Land.time = t * M(L.Land);
        L.Craters.time = t * M(L.Craters);
        L.LavaRivers.time = t * M(L.LavaRivers);
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, (rng() * 3 | 0) + 2, rr(rng, 0.6, 1.0), rr(rng, 0.7, 0.8));
        var land = [], lava = [], i, c;
        for (i = 0; i < 3; i++) { c = darkened(sc[0], i / 3); land.push(hueShift(c, 0.2 * (i / 4))); }
        for (i = 0; i < 3; i++) { c = darkened(sc[1], i / 3); lava.push(hueShift(c, 0.2 * (i / 3))); }
        return land.concat([land[1], land[2]], lava);
      }
    },

    asteroid: {
      label: 'Asteroid', relativeScale: 1,
      layers: [{ name: 'Asteroid', shader: 'Asteroids_Asteroids' }],
      colorMap: [['Asteroid', 3]],
      updateTime: function () { /* static, like the original */ },
      customTime: function (t, L) { L.Asteroid.rotation = t * Math.PI * 2; },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, 3 + (rng() * 2 | 0), rr(rng, 0.3, 0.6), 0.7);
        var cols = [];
        for (var i = 0; i < 3; i++) {
          cols.push(lightened(darkened(sc[i], i / 3), (1 - i / 3) * 0.2));
        }
        return cols;
      }
    },

    blackHole: {
      label: 'Black Hole', relativeScale: 2, noLight: true,
      layers: [
        { name: 'BlackHole', shader: 'BlackHole_BlackHole', noSeed: true, noRotation: true },
        { name: 'Disk', shader: 'BlackHole_BlackHoleRing',
          pos: [-1, -1], sizeF: 3, pixelsF: 3, rotOffset: 0.7 }
      ],
      colorMap: [['BlackHole', 3], ['Disk', 5]],
      updateTime: function (t, L) { L.Disk.time = t * 314.15 * 0.004; },
      customTime: function (t, L) { L.Disk.time = t * 314.15 * L.Disk.time_speed * 0.5; },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, 5 + (rng() * 2 | 0), rr(rng, 0.3, 0.5), 2.0);
        var cols = [];
        for (var i = 0; i < 5; i++) {
          cols.push(lightened(darkened(sc[i], (i / 5) * 0.7), (1 - i / 5) * 0.9));
        }
        return [parseColor('#272736'), cols[0], cols[3]].concat(cols);
      }
    },

    galaxy: {
      label: 'Galaxy', relativeScale: 1, noLight: true,
      layers: [{ name: 'Galaxy', shader: 'Galaxy_Galaxy' }],
      colorMap: [['Galaxy', 7]],
      updateTime: function (t, L) { L.Galaxy.time = t * M(L.Galaxy) * 0.04; },
      customTime: function (t, L) { L.Galaxy.time = t * Math.PI * 2 * L.Galaxy.time_speed; },
      randomizeColors: function (rng, current) {
        var sc = genColorscheme(rng, 6, rr(rng, 0.5, 0.8), 1.4);
        var cols = [];
        for (var i = 0; i < 6; i++) {
          cols.push(lightened(darkened(sc[i], i / 7), (1 - i / 6) * 0.6));
        }
        // the original sets only 6 of the 7 declared colors; keep the last as-is
        return cols.concat([current[6]]);
      }
    },

    star: {
      label: 'Star', relativeScale: 2, noLight: true,
      layers: [
        { name: 'Blobs', shader: 'Star_StarBlobs', pos: [-0.5, -0.5], sizeF: 2, pixelsF: 2 },
        { name: 'Star', shader: 'Star_Star' },
        { name: 'StarFlares', shader: 'Star_StarFlares', pos: [-0.5, -0.5], sizeF: 2, pixelsF: 2 }
      ],
      colorMap: [['Blobs', 1], ['Star', 4], ['StarFlares', 2]],
      updateTime: function (t, L) {
        L.Blobs.time = t * M(L.Blobs) * 0.01;
        L.Star.time = t * M(L.Star) * 0.005;
        L.StarFlares.time = t * M(L.StarFlares) * 0.015;
      },
      customTime: function (t, L) {
        L.Blobs.time = t * M(L.Blobs);
        L.Star.time = t * (1.0 / L.Star.time_speed);
        L.StarFlares.time = t * M(L.StarFlares);
      },
      randomizeColors: function (rng) {
        var sc = genColorscheme(rng, 4, rr(rng, 0.2, 0.4), 2.0);
        var cols = [];
        for (var i = 0; i < 4; i++) {
          cols.push(lightened(darkened(sc[i], (i / 4) * 0.9), (1 - i / 4) * 0.8));
        }
        cols[0] = lightened(cols[0], 0.8);
        return [cols[0]].concat(cols, [cols[1], cols[0]]);
      }
    }
  };

  /* ================= GL plumbing ==================================== */

  var VERTEX_SRC = [
    'attribute vec2 a_pos;',
    'uniform vec4 u_rect;',      // x, y, w, h in viewport pixels (top-left origin)
    'uniform vec2 u_vp;',        // viewport size in pixels
    'varying vec2 v_uv;',
    'void main() {',
    '  v_uv = a_pos;',
    '  vec2 px = u_rect.xy + a_pos * u_rect.zw;',
    '  vec2 clip = vec2(px.x / u_vp.x * 2.0 - 1.0, 1.0 - px.y / u_vp.y * 2.0);',
    '  gl_Position = vec4(clip, 0.0, 1.0);',
    '}'
  ].join('\n');

  function compileShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('PixelPlanets shader compile failed: ' + log);
    }
    return s;
  }

  /* ================= the planet ===================================== */

  var DEFAULTS = {
    type: 'terranWet',
    seed: null,            // null -> random
    pixels: 100,           // 12..4096
    dither: true,
    rotation: 0,
    light: null,           // [x, y] in 0..1; null keeps each shader's default
    timeScale: 1,
    colors: null,          // array of hex/[r,g,b,a]; null keeps scene defaults
    background: null       // css color or null for transparent
  };

  function PixelPlanets(opts) {
    opts = opts || {};
    this.options = {};
    for (var k in DEFAULTS) {
      this.options[k] = opts[k] !== undefined ? opts[k] : DEFAULTS[k];
    }
    this.options.pixels = Math.max(12, Math.min(4096, Math.round(this.options.pixels)));

    // context
    if (opts.gl) {
      this.gl = opts.gl;
      this.canvas = opts.gl.canvas || null;
    } else {
      this.canvas = opts.canvas || (typeof document !== 'undefined' ? document.createElement('canvas') : null);
      if (!this.canvas) { throw new Error('PixelPlanets needs a canvas or a gl context.'); }
      this.gl = this.canvas.getContext('webgl', {
        alpha: true, premultipliedAlpha: false,
        preserveDrawingBuffer: true, antialias: false, depth: false, stencil: false
      }) || this.canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
      if (!this.gl) { throw new Error('WebGL is not available.'); }
    }

    var gl = this.gl;
    this._quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    this._programs = {};
    this._raf = null;
    this._running = false;
    this.time = 1000.0;          // Godot's Planet.gd starts at 1000
    this.overrideTime = false;

    this.setType(this.options.type, true);

    if (this.options.colors) { this.setColors(this.options.colors); }
    this.render();
  }

  PixelPlanets.TYPES = Object.keys(TYPES).map(function (id) {
    return { id: id, label: TYPES[id].label,
             noLight: !!TYPES[id].noLight, relativeScale: TYPES[id].relativeScale };
  });
  PixelPlanets.version = '1.0.0';

  var P = PixelPlanets.prototype;

  /* ---------- scene state ---------- */

  P._def = function () { return TYPES[this.type]; };

  P.setType = function (type, skipRender) {
    if (!TYPES[type]) { throw new Error('Unknown planet type: ' + type + ' (see PixelPlanets.TYPES)'); }
    this.type = type;
    var def = TYPES[type];
    var defaults = LAYER_DEFAULTS[type];

    this.layers = def.layers.map(function (ld) {
      var state = {};
      var src = defaults[ld.name];
      for (var k in src) {
        var v = src[k];
        state[k] = Array.isArray(v) ? JSON.parse(JSON.stringify(v)) : v;
      }
      return {
        name: ld.name, shader: ld.shader, state: state, visible: true,
        pos: ld.pos || [0, 0], sizeF: ld.sizeF || 1, pixelsF: ld.pixelsF || 1,
        rotOffset: ld.rotOffset || 0, noSeed: !!ld.noSeed, noRotation: !!ld.noRotation
      };
    });
    this.L = {};
    for (var i = 0; i < this.layers.length; i++) { this.L[this.layers[i].name] = this.layers[i].state; }
    this.originalColors = this.getColors();

    this.setPixels(this.options.pixels, true);
    this.setRotation(this.options.rotation, true);
    if (this.options.light) { this.setLight(this.options.light[0], this.options.light[1], true); }
    this.setDither(this.options.dither, true);
    this.setSeed(this.options.seed === null || this.options.seed === undefined
      ? ((Math.random() * 0xffffffff) >>> 0) : this.options.seed, true);
    if (!skipRender) { this.render(); }
    return this;
  };

  P.setSeed = function (sd, skipRender) {
    this.seed = sd;
    var n = hashSeed(sd);
    var converted = (n % 1000) / 100.0;          // <Type>.gd: sd % 1000 / 100.0
    var rng = mulberry32(n);
    for (var i = 0; i < this.layers.length; i++) {
      var l = this.layers[i];
      if (!l.noSeed && l.state.seed !== undefined) { l.state.seed = converted; }
    }
    if (this._def().seedExtras) { this._def().seedExtras(rng, this.L); }
    this._applyTime();
    if (!skipRender) { this.render(); }
    return this;
  };

  P.randomize = function () {
    return this.setSeed((Math.random() * 0xffffffff) >>> 0);
  };

  P.setPixels = function (px, skipRender) {
    px = Math.max(12, Math.min(4096, Math.round(px)));
    this.options.pixels = px;
    var rs = this._def().relativeScale;
    var buf = Math.round(px * rs);
    if (this.canvas) {
      if (this.canvas.width !== buf) { this.canvas.width = buf; }
      if (this.canvas.height !== buf) { this.canvas.height = buf; }
    } else {
      var ext = this.gl.getExtension('STACKGL_resize_drawingbuffer');
      if (ext) { ext.resize(buf, buf); }
    }
    for (var i = 0; i < this.layers.length; i++) {
      var l = this.layers[i];
      if (l.state.pixels !== undefined) { l.state.pixels = px * l.pixelsF; }
    }
    if (!skipRender) { this.render(); }
    return this;
  };

  P.setLight = function (x, y, skipRender) {
    this.options.light = [x, y];
    for (var i = 0; i < this.layers.length; i++) {
      var st = this.layers[i].state;
      if (st.light_origin !== undefined) { st.light_origin = [x, y]; }
    }
    if (!skipRender) { this.render(); }
    return this;
  };

  P.setRotation = function (r, skipRender) {
    this.options.rotation = r;
    for (var i = 0; i < this.layers.length; i++) {
      var l = this.layers[i];
      if (!l.noRotation && l.state.rotation !== undefined) { l.state.rotation = r + l.rotOffset; }
    }
    if (!skipRender) { this.render(); }
    return this;
  };

  P.setDither = function (d, skipRender) {
    this.options.dither = !!d;
    for (var i = 0; i < this.layers.length; i++) {
      var st = this.layers[i].state;
      if (st.should_dither !== undefined) { st.should_dither = !!d; }
    }
    if (!skipRender) { this.render(); }
    return this;
  };

  P.setTimeScale = function (k) { this.options.timeScale = k; return this; };

  /* ---------- colors ---------- */

  P.getColors = function () {
    var def = this._def(), out = [];
    for (var i = 0; i < def.colorMap.length; i++) {
      var m = def.colorMap[i];
      var arr = this.L[m[0]][m[2] || 'colors'];
      for (var j = 0; j < m[1]; j++) { out.push(arr[j].slice()); }
    }
    return out;
  };

  P.getColorsHex = function () { return this.getColors().map(toHex); };

  P.setColors = function (colors, skipRender) {
    var def = this._def(), idx = 0;
    var parsed = colors.map(parseColor);
    for (var i = 0; i < def.colorMap.length; i++) {
      var m = def.colorMap[i];
      var key = m[2] || 'colors';
      var arr = this.L[m[0]][key];
      for (var j = 0; j < m[1] && idx < parsed.length; j++, idx++) { arr[j] = parsed[idx].slice(); }
      if (def.sharedColors) {                       // gasGiant2: ring mirrors the planet
        for (var s = 0; s < def.sharedColors.length; s++) {
          if (def.sharedColors[s][1] === key) {
            this.L[def.sharedColors[s][0]][key] = arr.map(function (c) { return c.slice(); });
          }
        }
      }
    }
    if (!skipRender) { this.render(); }
    return this;
  };

  P.resetColors = function () { return this.setColors(this.originalColors); };

  P.randomizeColors = function (seed) {
    var rng = mulberry32(seed === undefined ? ((Math.random() * 0xffffffff) >>> 0) : hashSeed(seed));
    var cols = this._def().randomizeColors(rng, this.getColors());
    return this.setColors(cols);
  };

  /* ---------- layers ---------- */

  P.getLayers = function () {
    return this.layers.map(function (l) { return { name: l.name, visible: l.visible }; });
  };
  P.setLayerVisible = function (i, v) {
    if (this.layers[i]) { this.layers[i].visible = !!v; this.render(); }
    return this;
  };

  /* ---------- time & animation ---------- */

  P._applyTime = function () {
    if (this.overrideTime) { return; }
    this._def().updateTime(this.time, this.L);
  };

  P.setTime = function (t) { this.time = t; this._applyTime(); return this.render(); };

  P.tick = function (dt) {
    this.time += dt * this.options.timeScale;
    this._applyTime();
    return this.render();
  };

  /** t in 0..1 samples one seamless loop (GUI.gd spritesheet/GIF export math). */
  P.setCustomTime = function (t) {
    this.overrideTime = true;
    this._def().customTime(t, this.L);
    return this.render();
  };

  P.clearCustomTime = function () { this.overrideTime = false; this._applyTime(); return this.render(); };

  P.start = function () {
    if (this._running || typeof requestAnimationFrame === 'undefined') { return this; }
    this._running = true;
    var self = this, last = null;
    function loop(now) {
      if (!self._running) { return; }
      if (last !== null) { self.tick(Math.min(0.1, (now - last) / 1000)); }
      last = now;
      self._raf = requestAnimationFrame(loop);
    }
    this._raf = requestAnimationFrame(loop);
    return this;
  };

  P.stop = function () {
    this._running = false;
    if (this._raf !== null && typeof cancelAnimationFrame !== 'undefined') { cancelAnimationFrame(this._raf); }
    this._raf = null;
    return this;
  };

  /* ---------- rendering ---------- */

  P._getProgram = function (layer) {
    var meta = GDSHADERS[layer.shader];
    var defs = '';
    for (var i = 0; i < meta.defines.length; i++) {
      var name = meta.defines[i];
      var v = layer.state[name];
      if (v === undefined) { v = meta.intDefaults[name]; }
      if (v === undefined) { v = name === 'n_colors' ? (meta.uniforms.colors ? meta.uniforms.colors.size : 4) : 4; }
      defs += '#define ' + name + ' ' + Math.round(v) + '\n';
    }
    var key = layer.shader + '|' + defs;
    if (this._programs[key]) { return this._programs[key]; }

    var gl = this.gl;
    var vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, meta.src.replace('//__DEFINES__', defs));
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error('PixelPlanets link failed: ' + gl.getProgramInfoLog(prog));
    }
    var entry = { prog: prog, loc: {}, aPos: gl.getAttribLocation(prog, 'a_pos') };
    entry.loc.u_rect = gl.getUniformLocation(prog, 'u_rect');
    entry.loc.u_vp = gl.getUniformLocation(prog, 'u_vp');
    for (var u in meta.uniforms) {
      entry.loc[u] = gl.getUniformLocation(prog, u) || gl.getUniformLocation(prog, u + '[0]');
    }
    this._programs[key] = entry;
    return entry;
  };

  P._uploadUniforms = function (entry, layer) {
    var gl = this.gl;
    var meta = GDSHADERS[layer.shader];
    for (var name in meta.uniforms) {
      var loc = entry.loc[name];
      if (!loc) { continue; }
      var u = meta.uniforms[name];
      var v = layer.state[name];
      if (v === undefined) { continue; }
      if (u.type === 'float') { gl.uniform1f(loc, v); }
      else if (u.type === 'bool') { gl.uniform1i(loc, v ? 1 : 0); }
      else if (u.type === 'vec2') { gl.uniform2f(loc, v[0], v[1]); }
      else if (u.type === 'vec4') {
        var flat;
        if (u.array) {
          flat = new Float32Array(u.size * 4);
          for (var i = 0; i < u.size; i++) {
            var c = v[i] || v[v.length - 1];
            flat[i * 4] = c[0]; flat[i * 4 + 1] = c[1]; flat[i * 4 + 2] = c[2]; flat[i * 4 + 3] = c[3];
          }
        } else {
          flat = new Float32Array(v);
        }
        gl.uniform4fv(loc, flat);
      }
    }
  };

  P.render = function () {
    var gl = this.gl;
    var px = this.options.pixels;
    var rs = this._def().relativeScale;
    var W = Math.round(px * rs);
    var origin = px * 0.5 * (rs - 1);            // GUI.gd planet placement

    gl.viewport(0, 0, W, W);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    if (this.options.background) {
      var bg = parseColor(this.options.background);
      gl.clearColor(bg[0], bg[1], bg[2], bg[3]);
    } else {
      gl.clearColor(0, 0, 0, 0);
    }
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._quad);
    for (var i = 0; i < this.layers.length; i++) {
      var l = this.layers[i];
      if (!l.visible) { continue; }
      var entry = this._getProgram(l);
      gl.useProgram(entry.prog);
      gl.enableVertexAttribArray(entry.aPos);
      gl.vertexAttribPointer(entry.aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform4f(entry.loc.u_rect,
        origin + l.pos[0] * px, origin + l.pos[1] * px,
        l.sizeF * px, l.sizeF * px);
      gl.uniform2f(entry.loc.u_vp, W, W);
      this._uploadUniforms(entry, l);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    return this;
  };

  /* ---------- output ---------- */

  P.size = function () { return Math.round(this.options.pixels * this._def().relativeScale); };

  /** Raw RGBA pixels (top-left origin). Works headless. */
  P.getPixels = function () {
    var gl = this.gl, W = this.size();
    var buf = new Uint8Array(W * W * 4);
    gl.readPixels(0, 0, W, W, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    // GL reads bottom-up; flip to top-left order
    var flipped = new Uint8ClampedArray(W * W * 4);
    var row = W * 4;
    for (var y = 0; y < W; y++) {
      flipped.set(buf.subarray((W - 1 - y) * row, (W - y) * row), y * row);
    }
    return { width: W, height: W, data: flipped };
  };

  P.drawTo = function (target, opts) {
    opts = opts || {};
    var scale = Math.max(1, Math.round(opts.scale || 1));
    var canvas = target.getContext ? target : null;
    var ctx = canvas ? canvas.getContext('2d') : target;
    var W = this.size();
    if (canvas && opts.resize !== false) { canvas.width = W * scale; canvas.height = W * scale; }
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W * scale, W * scale);
    ctx.drawImage(this.canvas, 0, 0, W * scale, W * scale);
    return this;
  };

  P.toCanvas = function (scale) {
    var c = document.createElement('canvas');
    this.drawTo(c, { scale: scale || 1 });
    return c;
  };

  P.toDataURL = function (scale, type) {
    return this.toCanvas(scale || 1).toDataURL(type || 'image/png');
  };

  /**
   * Render one seamless animation loop into a spritesheet canvas.
   * opts: { frames: 25, cols: auto, scale: 1, margin: 0 }
   */
  P.exportSpritesheet = function (opts) {
    opts = opts || {};
    var frames = Math.max(1, Math.round(opts.frames || 25));
    var cols = Math.max(1, Math.round(opts.cols || Math.ceil(Math.sqrt(frames))));
    var rows = Math.ceil(frames / cols);
    var scale = Math.max(1, Math.round(opts.scale || 1));
    var margin = Math.max(0, Math.round(opts.margin || 0));
    var W = this.size() * scale;

    var sheet = document.createElement('canvas');
    sheet.width = cols * W + (cols + 1) * margin;
    sheet.height = rows * W + (rows + 1) * margin;
    var ctx = sheet.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    var wasRunning = this._running;
    this.stop();
    for (var k = 0; k < frames; k++) {
      this.setCustomTime(k / frames);
      ctx.drawImage(this.canvas,
        margin + (k % cols) * (W + margin),
        margin + Math.floor(k / cols) * (W + margin), W, W);
    }
    this.clearCustomTime();
    this.render();
    if (wasRunning) { this.start(); }
    return sheet;
  };

  P.dispose = function () {
    this.stop();
    var gl = this.gl;
    for (var k in this._programs) { gl.deleteProgram(this._programs[k].prog); }
    this._programs = {};
    gl.deleteBuffer(this._quad);
    return this;
  };

  return PixelPlanets;
}));
