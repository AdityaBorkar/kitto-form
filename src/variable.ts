type Modifier<T> = (value: string) => T;
type Callback<T> = (value: T) => void;
type ComputedVariable<T> = {
	get: () => T;
	dependencies: Variable<any>[];
	compute: () => T;
};

export class Variable<T> {
	element: Element;
	modifier: Modifier<T>;
	private listeners: Set<() => void> = new Set();

	constructor(selector: string | Element, modifier?: Modifier<T>) {
		if (!selector) {
			throw new Error("Selector is required");
		}
		if (typeof selector === "string") {
			const element = document.querySelector(selector);
			if (!element) {
				throw new Error("Element not found");
			}
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
		if ("value" in this.element) {
			(this.element as HTMLInputElement).value = String(value);
		}
	}

	static computed<T>(
		computeFn: () => T,
		dependencies: Variable<any>[] = [],
	): ComputedVariable<T> {
		const computed = {
			compute: computeFn,
			dependencies,
			get: computeFn,
		};
		for (const dep of dependencies) {
			dep.onChange(() => computed.compute());
		}
		return computed;
	}

	onChange(callback: Callback<T>) {
		const handler = () => callback(this.get());
		this.element.addEventListener("change", handler);
		this.listeners.add(handler);
	}
}
