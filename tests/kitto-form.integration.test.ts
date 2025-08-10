import { expect, test } from "bun:test";
import "./setup.js";

import { KittoForm } from "../src/index.js";

test("KittoForm integration: field-watch, slot append/clear, element show/hide, component params", () => {
	document.body.innerHTML = `
    <form id="signup-form">
      <input name="register_for_text" value="Myself and Child" />
      <input name="children_count" value="0" />

      <div id="quantity-selector" style="display:none"></div>

      <div kitto-slot="parent-details-section"></div>

      <template kitto-component="@parent-details">
        <div>
          <input name="children[$n].first_name" />
        </div>
      </template>
      <template kitto-component="@preferred-details">
        <div>
          <input name="$parent.preferred" />
        </div>
      </template>
    </form>
  `;

	const form = new KittoForm("#signup-form");

	form.field<string>("register_for_text").watch((value) => {
		const slot = form.slot("parent-details-section");
		if (value.startsWith("Myself")) {
			form.field("children_count").set(0);
			slot.append(form.element("@parent-details").params());
			slot.append(form.element("@preferred-details").params("parent"));
		} else {
			slot.hide();
		}
		if (value.includes("Child")) {
			form.field("children_count").set(1);
			form.element("#quantity-selector").show();
		} else {
			form.field("children_count").set(0);
			form.element("#quantity-selector").hide();
		}
	});

	// Assert effects from initial fire
	const slotEl = document.querySelector(
		'[kitto-slot="parent-details-section"]',
	) as HTMLElement;
	const quantitySelector = document.querySelector(
		"#quantity-selector",
	) as HTMLElement;

	expect(slotEl.querySelectorAll('input[name^="children["]').length).toBe(1);
	expect(slotEl.querySelector('input[name="parent.preferred"]')).not.toBeNull();
	expect(quantitySelector.style.display).toBe("");

	// Change value to hide behaviors
	const reg = document.querySelector(
		'input[name="register_for_text"]',
	) as HTMLInputElement;
	reg.value = "Someone Else";
	reg.dispatchEvent(new Event("change"));

	// After change, slot should be hidden and quantity selector hidden
	expect((slotEl as HTMLElement).style.display).toBe("none");
	expect(quantitySelector.style.display).toBe("none");
});
