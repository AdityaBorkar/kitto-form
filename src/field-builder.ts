import type { Variable } from "./variable.js";

type TransformerFunction<I, O> = (value: I) => O;

export class FieldBuilder<T> {
	readonly variable: Variable<unknown>;
	private transformers: TransformerFunction<unknown, unknown>[] = [];

	constructor(variable: Variable<unknown>) {
		this.variable = variable;
	}

	set(value: T | string | number | boolean): this {
		this.variable.set(value as unknown as string);
		return this;
	}

	transform<U>(fn: TransformerFunction<T, U>): this {
		this.transformers.push(
			fn as unknown as TransformerFunction<unknown, unknown>,
		);
		return this;
	}

	watch(callback: (value: T) => void): this {
		const logic = () => {
			const raw = this.variable.get() as unknown as T;
			const value = this.transformers.reduce(
				(value, transformer) => transformer(value) as unknown as T,
				raw,
			);
			callback(value);
		};
		this.variable.onChange(logic);
		logic();
		return this;
	}
}
