import { c as create_ssr_component, v as validate_component, b as each, e as escape, r as is_promise, n as noop, a as subscribe } from "../../../chunks/ssr.js";
import "clsx";
import { R as Root, S as Select_trigger, V as Value, G as Select_content, H as Group, J as Select_label, K as Select_item, _ as Card_title, T as Card_description, M as Input, L as Label, U as Skeleton, N as AccountTable, O as allAddresses } from "../../../chunks/skeleton.js";
const Transaction = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let accounts;
  let accountTransaction;
  let $accounts, $$unsubscribe_accounts = noop, $$subscribe_accounts = () => ($$unsubscribe_accounts(), $$unsubscribe_accounts = subscribe(accounts, ($$value) => $accounts = $$value), accounts);
  let selectedAccount = void 0;
  async function getAccountTransaction(selected) {
    if (!selected) {
      return [];
    }
    const response = await fetch(`https://pegasus.lightlink.io/api/v2/addresses/${selectedAccount.value.address}/transactions?filter=to%20%7C%20from`);
    const data = await response.json();
    console.log(data.items);
    const mapped = data.items.map((dt, index) => [index + 1, dt.from.hash, dt.to?.hash ?? "-", dt.value, dt.timestamp]);
    return mapped;
  }
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$subscribe_accounts(accounts = allAddresses);
    accountTransaction = getAccountTransaction(selectedAccount);
    $$rendered = `<div class="m-1 flex flex-col p-2"> ${validate_component(Root, "Select.Root").$$render(
      $$result,
      { portal: null, selected: selectedAccount },
      {
        selected: ($$value) => {
          selectedAccount = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Select_trigger, "Select.Trigger").$$render($$result, { class: "w-[250px]" }, {}, {
            default: () => {
              return `${validate_component(Value, "Select.Value").$$render($$result, { placeholder: "Select Account" }, {}, {})}`;
            }
          })} ${validate_component(Select_content, "Select.Content").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Group, "Select.Group").$$render($$result, {}, {}, {
                default: () => {
                  return `${validate_component(Select_label, "Select.Label").$$render($$result, {}, {}, {
                    default: () => {
                      return `Accounts`;
                    }
                  })} ${each($accounts, (account) => {
                    return `${validate_component(Select_item, "Select.Item").$$render(
                      $$result,
                      {
                        class: "m-2",
                        value: account,
                        label: account.address.substring(0, 5) + "..." + account.address.substring(account.address.length - 5, account.address.length)
                      },
                      {},
                      {
                        default: () => {
                          return `<div>${validate_component(Card_title, "Card.Title").$$render($$result, {}, {}, {
                            default: () => {
                              return `&quot;${escape(account.address.substring(0, 5))}...${escape(account.address.substring(account.address.length - 5, account.address.length))}&quot;`;
                            }
                          })} ${validate_component(Card_description, "Card.Description").$$render($$result, {}, {}, {
                            default: () => {
                              return `${escape(account.value)}`;
                            }
                          })}</div> `;
                        }
                      }
                    )}`;
                  })}`;
                }
              })}`;
            }
          })} ${validate_component(Input, "Select.Input").$$render($$result, { name: "selectedAccount" }, {}, {})}`;
        }
      }
    )} ${validate_component(Label, "Label").$$render($$result, { for: "table" }, {}, {
      default: () => {
        return `Activity Information`;
      }
    })} ${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return ` <div class="flex items-center space-x-4"><div class="space-y-2 rounded border p-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})}</div> <div class="space-y-2 rounded border p-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})}</div> <div class="space-y-2 rounded border p-2">${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-12 w-12 rounded-full" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})} ${validate_component(Skeleton, "Skeleton").$$render($$result, { class: "h-4 w-[150px]" }, {}, {})}</div></div> `;
      }
      return function(data) {
        return ` ${validate_component(AccountTable, "AccountTable").$$render(
          $$result,
          {
            table: {
              headers: ["s/n", "sender", "receiver", "amount", "date"],
              caption: "Transaction information for the selected Account",
              data
            }
          },
          {},
          {}
        )} `;
      }(__value);
    }(accountTransaction)}</div>`;
  } while (!$$settled);
  $$unsubscribe_accounts();
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Transaction, "Transaction").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
