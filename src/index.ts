import { KittoForm } from "./form.js";
import { Variable } from "./variable.js";

// Observable Variables
const children = new Variable<number>(
	'[name="children_count"]',
	(value) => Number(value) || 0,
);
const is_register_for_parent = new Variable<boolean>(
	'[name="register-for"]',
	(value) => value.startsWith("Myself"),
);

// Event Listeners
children.onChange((value) => {
	renderForm(is_register_for_parent.get(), value);
});
is_register_for_parent.onChange((value) => {
	renderForm(value, children.get());
});

// Form:
const form = new KittoForm("#reg-form");
function renderForm(is_register_for_parent: boolean, children: number) {
	const elements = [];

	// Always include the basic details
	elements.push(".basic-details");

	// If the parent is selected, include the parent details
	if (is_register_for_parent) {
		elements.push({ "kitto-id": "parent-details", replacer: "parent" });
		elements.push({ "kitto-id": "preferred-details", replacer: "parent" });
	}

	// If the children are selected, include the children details
	for (let index = 1; index <= children; index++) {
		elements.push({ "kitto-id": "child-details", replacer: index });
		elements.push({
			"kitto-id": "preferred-details",
			replacer: "child-" + index,
		});
	}

	// Push the recaptcha and submission buttons
	elements.push(".reg-form_recaptcha", ".form_submission");

	form.render(elements);
}

// Defaults:
renderForm(is_register_for_parent.get(), children.get());
