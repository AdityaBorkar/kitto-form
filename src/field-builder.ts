import type { Variable } from "./variable.js";

type TransformFunction<I, O> = (value: I) => O;
type UnknownTransformFunction = TransformFunction<unknown, unknown>;

export class FieldBuilder<T> {
	readonly variable: Variable<unknown>;
	private readonly transforms: UnknownTransformFunction[];

	constructor(
		variable: Variable<unknown>,
		transforms: UnknownTransformFunction[] = [],
	) {
		this.variable = variable;
		this.transforms = transforms;
	}

	set(value: T | string | number | boolean): this {
		this.variable.set(value as unknown as string);
		return this;
	}

	transform<U>(fn: TransformFunction<T, U>): FieldBuilder<U> {
		return new FieldBuilder<U>(this.variable, [
			...this.transforms,
			fn as unknown as UnknownTransformFunction,
		]);
	}

	watch(callback: (value: T) => void): this {
		const run = () => {
			const raw = this.variable.get() as unknown as T;
			const value = this.applyTransforms(raw);
			callback(value);
		};
		this.variable.onChange(run);
		run();
		return this;
	}

	private applyTransforms(input: unknown): T {
		let current: unknown = input;
		for (const fn of this.transforms) {
			current = (fn as (v: unknown) => unknown)(current);
		}
		return current as T;
	}
}
