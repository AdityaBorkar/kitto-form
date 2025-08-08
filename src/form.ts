import { Variable } from "./variable.js";

interface RenderOptions {
	slot: string;
	show: string[];
	name: string;
}

class FormBuilder<T> {
	private formElement: Element;
	private variable: Variable<T> | undefined;
	private condition?: (value: T) => boolean;
	private transformer?: (value: T) => T;

	constructor(
		formElement: Element,
		variable: Variable<T> | undefined = undefined,
	) {
		this.formElement = formElement;
		this.variable = variable;
	}

	modify(modifier: (value: T) => T): FormBuilder<T> {
		this.transformer = modifier;
		return this;
	}

	if(predicate: (value: T) => boolean): FormBuilder<T> {
		this.condition = predicate;
		return this;
	}

	render(options: RenderOptions): void {
		if (!this.variable) return;

		const updateUi = () => {
			const value = this.variable!.get();
			const transformedValue = this.transformer
				? this.transformer(value)
				: value;
			const shouldShow = !this.condition || this.condition(transformedValue);

			const slot = this.formElement.querySelector(
				`[kitto-slot="${options.slot}"]`,
			);
			if (!slot) return;

			if (shouldShow) {
				slot.innerHTML = "";
				options.show.forEach((componentId) => {
					if (!componentId.startsWith('@')) return;
					const template = this.formElement.querySelector(
						`[kitto-component="${componentId}"]`,
					) as HTMLTemplateElement;
					if (template && template.tagName === 'TEMPLATE') {
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

	repeat(): FormBuilder<T> {
		if (!this.variable) return this;

		this.render = (options: RenderOptions) => {
			const updateUi = () => {
				const value = this.variable!.get();
				const count = this.transformer ? this.transformer(value) : value;
				const shouldShow = !this.condition || this.condition(count);

				const slot = this.formElement.querySelector(
					`[kitto-slot="${options.slot}"]`,
				);
				if (!slot) return;

				if (shouldShow && typeof count === "number" && count > 0) {
					slot.innerHTML = "";
					for (let i = 0; i < count; i++) {
						options.show.forEach((componentId) => {
							if (!componentId.startsWith('@')) return;
							const template = this.formElement.querySelector(
								`[kitto-component="${componentId}"]`,
							) as HTMLTemplateElement;
							if (template && template.tagName === 'TEMPLATE') {
								const clone = template.content.cloneNode(
									true,
								) as DocumentFragment;
								const dynamicName = options.name.replace("$n", String(i + 1));
								clone.querySelectorAll("[name]").forEach((el) => {
									const nameAttr = (el as HTMLElement).getAttribute("name");
									if (nameAttr) {
										(el as HTMLElement).setAttribute(
											"name",
											nameAttr.replace("$parent", dynamicName),
										);
									}
								});
								slot.appendChild(clone);
							}
						});
					}
				} else {
					slot.innerHTML = "";
				}
			};

			this.variable!.onChange(updateUi);
			updateUi();
		};
		return this;
	}
}

export class KittoForm {
	private form: Element;

	constructor(selector: string) {
		const element = document.querySelector(selector);
		if (!element) {
			throw new Error(`Form element not found: "${selector}"`);
		}
		this.form = element;
	}

	field<T = any>(name: string): FormBuilder<T> {
		const selector = `[name="${name}"]`;
		const element = this.form.querySelector(selector);
		if (!element) {
			throw new Error(`Field element not found: ${selector}`);
		}

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
