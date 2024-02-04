

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/transactions/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.2t_zH4mS.js","_app/immutable/chunks/scheduler.IP-y6FnN.js","_app/immutable/chunks/index.I_hJpbHB.js","_app/immutable/chunks/skeleton.WLwp3bVx.js","_app/immutable/chunks/index.hGLtufto.js"];
export const stylesheets = [];
export const fonts = [];
