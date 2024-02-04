

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.KYir9Sj3.js","_app/immutable/chunks/3.4EukQCGG.js","_app/immutable/chunks/scheduler.IP-y6FnN.js","_app/immutable/chunks/index.I_hJpbHB.js","_app/immutable/chunks/skeleton.WLwp3bVx.js","_app/immutable/chunks/index.hGLtufto.js"];
export const stylesheets = ["_app/immutable/assets/3.vvwwyxeb.css"];
export const fonts = ["_app/immutable/assets/permanent-marker-latin-400-normal.Rdt3Ywsk.woff2","_app/immutable/assets/permanent-marker-latin-400-normal.Z2Y-XONe.woff"];
