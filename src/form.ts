import { Variable } from "./variable.js";

/** Options for rendering form components */
interface RenderOptions {
	slot: string;
	show: string[];
	name: string;
}

/** Builder for form field rendering with fluent API */
class FormBuilder<T> {
	private formElement: Element;
	private variable: Variable<T> | undefined;
	private condition?: (value: T) => boolean;
	private transformer?: (value: T) => T;

	/** Creates a FormBuilder for a specific form element */
	constructor(
		formElement: Element,
		variable: Variable<T> | undefined = undefined,
	) {
		this.formElement = formElement;
		this.variable = variable;
	}

	/** Applies a transformation to the field value */
	modify(modifier: (value: T) => T): FormBuilder<T> {
		this.transformer = modifier;
		return this;
	}

	/** Sets a condition for when the field should be shown */
	if(predicate: (value: T) => boolean): FormBuilder<T> {
		this.condition = predicate;
		return this;
	}

	/** Renders form components based on field value */
	render(options: RenderOptions): void {
		if (!this.variable) {
			return;
		}

		const updateUi = () => {
			const value = this.variable!.get();
			const transformedValue = this.transformer
				? this.transformer(value)
				: value;
			const shouldShow = !this.condition || this.condition(transformedValue);

			const slot = this.formElement.querySelector(
				`[kitto-slot="${options.slot}"]`,
			);
			if (!slot) {
				return;
			}

			if (shouldShow) {
				slot.innerHTML = "";
				options.show.forEach((componentId) => {
					if (!componentId.startsWith("@")) {
						return;
					}
					const template = this.formElement.querySelector(
						`[kitto-component="${componentId}"]`,
					) as HTMLTemplateElement;
					if (template && template.tagName === "TEMPLATE") {
						const clone = template.content.cloneNode(true) as DocumentFragment;
						clone.querySelectorAll("[name]").forEach((el) => {
							const nameAttr = (el as HTMLElement).getAttribute("name");
							if (nameAttr) {
								(el as HTMLElement).setAttribute(
									"name",
									nameAttr.replace("$parent", options.name),
								);
							}
						});
						slot.appendChild(clone);
					}
				});
			} else {
				slot.innerHTML = "";
			}
		};

		this.variable.onChange(updateUi);
		updateUi();
	}

	/** Enables repeating form sections based on field value */
	repeat(): FormBuilder<T> {
		if (!this.variable) {
			return this;
		}

		this.render = (options: RenderOptions) => {
			if (!this.variable) {
				return;
			}

			const updateUi = () => {
				if (!this.variable) {
					return;
				}
				const value = this.variable.get();
				const count = this.transformer ? this.transformer(value) : value;
				const shouldShow = !this.condition || this.condition(count);

				const slot = this.formElement.querySelector(
					`[kitto-slot="${options.slot}"]`,
				);
				if (!slot) {
					return;
				}

				if (!(shouldShow && typeof count === "number" && count > 0)) {
					return;
				}
				slot.innerHTML = "";
				for (let n = 1; n <= count; n++) {
					for (const show of options.show) {
						const isTemplate = show.startsWith("@");
						const selector = isTemplate ? `[kitto-component="${show}"]` : show;
						const element = this.formElement.querySelector(selector);
						if (!element) {
							throw new Error(`Selector not found: ${selector}`);
						}
						if (element.tagName !== "TEMPLATE") {
							slot.appendChild(element);
							continue;
						}

						// @ts-expect-error
						const clone = element.content.cloneNode(true);
						const nameSuffix = options.name.replace("$n", String(n));
						const inputs = clone.querySelectorAll("[name]");
						for (const element of inputs) {
							const nameAttr = element.getAttribute("name");
							if (nameAttr) {
								element.setAttribute("name", nameAttr.replace("x", nameSuffix));
							}
						}
						slot.appendChild(clone);
					}
				}
			};

			this.variable.onChange(updateUi);
			updateUi();
		};
		return this;
	}
}

/** Dynamic form rendering system with reactive field binding */
export class KittoForm {
	private form: Element;

	/** Creates a KittoForm bound to a DOM element */
	constructor(selector: string) {
		const element = document.querySelector(selector);
		if (!element) {
			throw new Error(`Form element not found: "${selector}"`);
		}
		this.form = element;
	}

	/** Creates a FormBuilder for a field with the given name */
	field<T = any>(name: string): FormBuilder<T> {
		const selector = `[name="${name}"]`;
		const elements = Array.from(
			this.form.querySelectorAll(selector),
		) as HTMLInputElement[];
		if (elements.length === 0) {
			throw new Error(`Field element not found: ${selector}`);
		}
		if (elements.length > 1) {
			throw new Error(`Multiple field elements found: ${selector}`);
		}
		const element = elements[0];

		const type = element.getAttribute("type");
		let modifier: (value: string) => any = (value) => value;
		if (type === "number") {
			modifier = (value) => Number(value);
		} else if (type === "boolean") {
			modifier = (value: string) => value === "true";
		}

		const variable = new Variable(element, modifier);
		return new FormBuilder<T>(this.form, variable);
	}
}
