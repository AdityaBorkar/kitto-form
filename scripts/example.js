import { KittoForm } from "../src/index.js";

// Form
const form = new KittoForm("#signup-form");
const childrenCount = form.field("children_count");
const registerForText = form.field("register_for_text");

// Field = "Register For Text"
for (const input of document.querySelectorAll('[name="register-for"]')) {
	input.addEventListener("change", (e) => {
		const value = e.target?.value;
		registerForText.set(value);
	});
}

registerForText.watch((value) => {
	// Render "parent-details-section"
	const slot = form.slot("parent-details-section");
	if (value.startsWith("Myself")) {
		const key = "parent";
		slot.append(form.element("@parent-details").params({ key }));
		slot.append(form.element("@preferred-details").params({ key }));
	}
	slot.render();

	// Reset the children count
	if (value === "Myself") {
		childrenCount.set(0);
	} else {
		childrenCount.set(1);
	}

	// Show / Hide - Quantity Selector
	if (value.includes("Child")) {
		form.element("#quantity-selector").show();
	} else {
		form.element("#quantity-selector").hide();
	}

	// Update Total
	updateTotal();
});

childrenCount
	.transform((value) => Number(value))
	.watch((value) => {
		// Render "child-details-section"
		const slot = form.slot("child-details-section");
		for (let key = 1; key <= value; key++) {
			slot.append(form.element("@child-details").params({ key }));
			slot.append(form.element("@preferred-details").params({ key }));
		}
		slot.render();

		// Update Total
		updateTotal();
	});

function updateTotal() {
	const children = childrenCount.variable.get();
	const isParent = registerForText.variable.get()?.startsWith("Myself");
	const total = children + isParent ? 1 : 0;
	form.element("[data-variable='count']").element.textContent = total;
}
