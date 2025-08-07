type Modifier<T> = (value: string) => T;
type Callback<T> = (value: T) => void;

export class Variable<T> {
	element: Element;
	modifier: Modifier<T>;

	constructor(selector: string | Element, modifier?: Modifier<T>) {
		if (!selector) throw new Error("Selector is required");
		if (typeof selector === "string") {
			const element = document.querySelector(selector);
			if (!element) throw new Error("Element not found");
			this.element = element;
		} else {
			this.element = selector;
		}
		this.modifier = modifier || ((value) => value as T);
	}

	get() {
		const value = (this.element as HTMLInputElement).value;
		return this.modifier(value);
	}

	set(value: T) {
		// @ts-expect-error
		this.element.value = value;
	}

	computed(modifier: Modifier<T>) {
		return new Variable<T>(this.element, modifier);
	}

	onChange(callback: Callback<T>) {
		const value = this.get();
		this.element.addEventListener("change", () => callback(value));
	}
}
