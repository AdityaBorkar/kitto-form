/** Function that transforms a string value to type T */
type Modifier<T> = (value: string) => T;
/** Callback function triggered when a variable changes */
type Callback<T> = (value: T) => void;
/** Computed variable that derives its value from dependencies */
type ComputedVariable<T> = {
	get: () => T;
	dependencies: Variable<any>[];
	compute: () => T;
};

/** Reactive variable that binds to DOM elements with type-safe transformations */
export class Variable<T> {
	element: Element;
	modifier: Modifier<T>;
	private listeners: Set<() => void> = new Set();

	/** Creates a Variable bound to a DOM element */
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

	/** Gets the current value from the bound element */
	get() {
		const value = (this.element as HTMLInputElement).value;
		return this.modifier(value);
	}

	/** Sets the value of the bound element */
	set(value: T) {
		if ("value" in this.element) {
			(this.element as HTMLInputElement).value = String(value);
		}
	}

	/** Creates a computed variable that derives its value from dependencies */
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

	/** Registers a callback to be called when the variable value changes */
	onChange(callback: Callback<T>) {
		const handler = () => callback(this.get());
		this.element.addEventListener("change", handler);
		this.listeners.add(handler);
	}
}
