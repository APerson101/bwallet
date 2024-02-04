

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/savings/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.VcUcrqQ5.js","_app/immutable/chunks/scheduler.IP-y6FnN.js","_app/immutable/chunks/index.I_hJpbHB.js"];
export const stylesheets = [];
export const fonts = [];
