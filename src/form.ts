import { ComponentBuilder } from "./component-builder.js";
import { DomElementHandle, SlotHandle } from "./element-handler.js";
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

		// Identity transformer: leave value as string, special case for checkboxes handled in Variable.get
		const identity = (v: string) => v;
		const variable = new Variable(element, identity);
		return new FieldBuilder<T>(variable);
	}

	slot(name: string): SlotHandle {
		return new SlotHandle(this.form, name);
	}

	element(component: `@${string}`): ComponentBuilder;
	element(selector: string): DomElementHandle;
	element(selectorOrToken: string): ComponentBuilder | DomElementHandle {
		if (selectorOrToken.startsWith("@")) {
			return new ComponentBuilder(this.form, selectorOrToken as `@${string}`);
		}
		return new DomElementHandle(this.form, selectorOrToken);
	}
}
