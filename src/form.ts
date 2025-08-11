import { ComponentElement } from "./elements/component.js";
import { DomElement } from "./elements/dom.js";
import { SlotElement } from "./elements/slot.js";
import { FieldBuilder } from "./field-builder.js";
import { Variable } from "./variable.js";

export class KittoForm {
	private readonly form: Element;

	constructor(selector: string) {
		const element = document.querySelector(selector);
		if (!element) {
			throw new Error(`form not found: ${selector}`);
		}
		this.form = element;
		const components = this.form.querySelectorAll("[kitto-component]");
		for (const component of components) {
			// @ts-expect-error `style` is not typed.
			component.setAttribute("default-display", component.style.display);
			// @ts-expect-error `style` is not typed.
			component.style.display = "none";
		}
	}

	field<T = string>(name: string): FieldBuilder<T> {
		const selector = `[name="${name}"]`;
		const matches = Array.from(this.form.querySelectorAll(selector));
		if (matches.length === 0) {
			throw new Error(`field not found: ${selector}`);
		}
		if (matches.length > 1) {
			throw new Error(`multiple fields: ${selector}`);
		}
		const element = matches[0] as
			| HTMLInputElement
			| HTMLSelectElement
			| HTMLTextAreaElement;

		const transformer = (v: string) => v;
		const variable = new Variable(element, transformer);
		return new FieldBuilder<T>(variable);
	}

	slot(name: string): SlotElement {
		return new SlotElement(this.form, name);
	}

	element(component: `@${string}`): ComponentElement;
	element(selector: string): DomElement;
	element(selectorOrToken: string): ComponentElement | DomElement {
		if (selectorOrToken.startsWith("@")) {
			return new ComponentElement(this.form, selectorOrToken as `@${string}`);
		}
		return new DomElement(this.form, selectorOrToken);
	}
}
