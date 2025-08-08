import { Variable } from "./variable.js";

interface RenderOptions {
	slot: string;
	show: string[];
	name: string;
}

class FormBuilder {
	private formElement: Element;
	private variable: Variable<any> | undefined;
	private condition?: (value: any) => boolean;
	private transformer?: (value: any) => any;

	constructor(formElement: Element, variable: Variable<any> | undefined = undefined) {
		this.formElement = formElement;
		this.variable = variable;
	}

	modify<T>(modifier: (value: any) => T): FormBuilder {
		this.transformer = modifier;
		return this;
	}

	if(predicate: (value: any) => boolean): FormBuilder {
		this.condition = predicate;
		return this;
	}

	render(options: RenderOptions): void {
		if (!this.variable) return;

		const updateUI = () => {
			const value = this.variable!.get();
			const transformedValue = this.transformer ? this.transformer(value) : value;
			const shouldShow = !this.condition || this.condition(transformedValue);

			const slot = this.formElement.querySelector(`[kitto-slot="${options.slot}"]`);
			if (!slot) return;

			if (shouldShow) {
				slot.innerHTML = '';
				options.show.forEach(componentId => {
					const template = this.formElement.querySelector(`[kitto-component="${componentId}"]`) as HTMLTemplateElement;
					if (template) {
						const clone = template.content.cloneNode(true) as DocumentFragment;
						clone.querySelectorAll('[name]').forEach(el => {
							const nameAttr = (el as HTMLElement).getAttribute('name');
							if (nameAttr) {
								(el as HTMLElement).setAttribute('name', nameAttr.replace('$parent', options.name));
							}
						});
						slot.appendChild(clone);
					}
				});
			} else {
				slot.innerHTML = '';
			}
		};

		this.variable.onChange(updateUI);
		updateUI();
	}

	repeat(): FormBuilder {
		if (!this.variable) return this;

		this.render = (options: RenderOptions) => {
			const updateUI = () => {
				const value = this.variable!.get();
				const count = this.transformer ? this.transformer(value) : value;
				const shouldShow = !this.condition || this.condition(count);

				const slot = this.formElement.querySelector(`[kitto-slot="${options.slot}"]`);
				if (!slot) return;

				if (shouldShow && typeof count === 'number' && count > 0) {
					slot.innerHTML = '';
					for (let i = 0; i < count; i++) {
						options.show.forEach(componentId => {
							const template = this.formElement.querySelector(`[kitto-component="${componentId}"]`) as HTMLTemplateElement;
							if (template) {
								const clone = template.content.cloneNode(true) as DocumentFragment;
								const dynamicName = options.name.replace('$n', String(i + 1));
								clone.querySelectorAll('[name]').forEach(el => {
									const nameAttr = (el as HTMLElement).getAttribute('name');
									if (nameAttr) {
										(el as HTMLElement).setAttribute('name', nameAttr.replace('$parent', dynamicName));
									}
								});
								slot.appendChild(clone);
							}
						});
					}
				} else {
					slot.innerHTML = '';
				}
			};

			this.variable!.onChange(updateUI);
			updateUI();
		};
		return this;
	}
}

export class KittoForm {
	private formElement: Element;

	constructor(selector: string) {
		const element = document.querySelector(selector);
		if (!element) throw new Error(`Form element not found: ${selector}`);
		this.formElement = element;
	}

	field(selector: string): FormBuilder {
		const variable = new Variable(selector);
		return new FormBuilder(this.formElement, variable);
	}
}