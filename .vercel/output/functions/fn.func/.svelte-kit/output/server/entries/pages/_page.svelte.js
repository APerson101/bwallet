import { c as create_ssr_component, a as subscribe, b as each, e as escape, v as validate_component } from "../../chunks/ssr.js";
import { c as currentScreen } from "../../chunks/skeleton.js";
import { I as Icon, P as Page$1 } from "../../chunks/_page.js";
import Page$3 from "./savings/_page.svelte.js";
import Page$2 from "./transactions/_page.svelte.js";
const Navmenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentScreen, $$unsubscribe_currentScreen;
  $$unsubscribe_currentScreen = subscribe(currentScreen, (value) => $currentScreen = value);
  const dashboard = {
    name: "Dashboard",
    icon: "radix-icons:dashboard"
  };
  const transactions = {
    name: "Transactions",
    icon: "icon-park-outline:transaction-order"
  };
  const savings = {
    name: "Savings",
    icon: "clarity:savings-line"
  };
  const items = [dashboard, transactions, savings];
  let hoverIndex;
  let outerHeight = 0;
  {
    console.log(outerHeight);
  }
  $$unsubscribe_currentScreen();
  return ` <div class="fixed h-dvh"><nav class="m-2 flex h-5/6 max-w-[50px] justify-center rounded-lg bg-gray-600 md:max-w-48"><ul class="flex flex-col">${each(items, (menuItem) => {
    return `   <li class="${"m-3 rounded-lg p-2 " + escape(
      $currentScreen == items.indexOf(menuItem) ? "bg-emerald-100" : menuItem == hoverIndex ? "bg-slate-500" : "bg-transparent",
      true
    )}"><div class="flex flex-row space-x-2">${validate_component(Icon, "IconifyIcon").$$render(
      $$result,
      {
        class: $currentScreen == items.indexOf(menuItem) ? "red-icon" : "blue-icon",
        icon: menuItem.icon,
        width: "24px",
        height: "24px"
      },
      {},
      {}
    )} <p class="${escape(
      $currentScreen == items.indexOf(menuItem) ? "font-bold text-black" : "text-g font-normal",
      true
    ) + " hidden md:block"}">${escape(menuItem.name)} </p></div> </li>`;
  })}</ul></nav></div> `;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $currentScreen, $$unsubscribe_currentScreen;
  $$unsubscribe_currentScreen = subscribe(currentScreen, (value) => $currentScreen = value);
  $$unsubscribe_currentScreen();
  return `${validate_component(Navmenu, "Navmenu").$$render($$result, {}, {}, {})} <div class="mb-3 ml-[65px] mr-3 mt-3 h-[800px] flex-col md:ml-[180px]">${$currentScreen == 0 ? `${validate_component(Page$1, "Dashboard").$$render($$result, {}, {}, {})}` : `${$currentScreen == 1 ? `${validate_component(Page$2, "Transactions").$$render($$result, {}, {}, {})}` : `${$currentScreen == 2 ? `${validate_component(Page$3, "Savings").$$render($$result, {}, {}, {})}` : ``}`}`}</div>`;
});
export {
  Page as default
};
