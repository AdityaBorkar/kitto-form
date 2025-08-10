import { KittoForm } from "./index.js";

const form = new KittoForm("#signup-form");

form.field("register_for_text").watch((value) => {
	console.log({
		value,
		variable: form.field("children_count").variable.get(),
	});
	const slot = form.slot("parent-details-section");
	if (value.startsWith("Myself")) {
		form.field("children_count").set(0);
		slot.append(form.element("@parent-details").params());
		slot.append(form.element("@preferred-details").params("parent"));
	} else {
		slot.hide();
	}
	if (value.includes("Child")) {
		// TODO: IF EXISTS, DO NOT SET
		form.field("children_count").set(1);
		form.element("#quantity-selector").show();
	} else {
		form.element("#quantity-selector").hide();
		form.field("children_count").set(0);
	}
});

form
	.field("children_count")
	.transform((value) => Number(value))
	.watch((value) => {
		const slot = form.slot("parent-details-section");
		if (value <= 0) {
			slot.hide();
			return;
		}
		slot.clear(); // TODO: IF EXISTS, DO NOT CLEAR
		for (let index = 1; index <= value; index++) {
			console.log({ index });
			slot.append(form.element("@parent-details").params(index));
			slot.append(form.element("@preferred-details").params(index));
		}
		slot.show();
	});

for (const input of document.querySelectorAll('[name="register-for"]')) {
	input.addEventListener("change", (e) => {
		const value = e.target?.value;
		if (value) {
			form.field("register_for_text").set(value);
		}
	});
}
