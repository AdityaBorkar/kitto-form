import { expect, test } from "bun:test";
import "./setup.js";

import { Variable } from "../src/variable.js";

test("Variable get/set", () => {
	document.body.innerHTML = '<input id="test" value="hello">';
	const v = new Variable("#test");
	expect(v.get()).toBe("hello");
	v.set("world");
	expect(v.get()).toBe("world");
});

test("Variable with modifier", () => {
	document.body.innerHTML = '<input id="num" value="42">';
	const v = new Variable("#num", (val) => Number(val));
	expect(v.get()).toBe(42);
});

test("Variable onChange", () => {
	document.body.innerHTML = '<input id="test" value="">';
	const v = new Variable("#test");
	let called = false;
	v.onChange(() => {
		called = true;
	});
	v.element.dispatchEvent(new Event("change"));
	expect(called).toBe(true);
});

test("Variable constructor with Element", () => {
	document.body.innerHTML = '<input id="test" value="direct">';
	const element = document.getElementById("test")!;
	const v = new Variable(element);
	expect(v.get()).toBe("direct");
	expect(v.element).toBe(element);
});

test("Variable constructor error cases", () => {
	expect(() => new Variable("")).toThrow("Selector is required");
	expect(() => new Variable("#nonexistent")).toThrow("Element not found");
});

test("Variable with boolean modifier", () => {
	document.body.innerHTML = '<input id="bool" value="true">';
	const v = new Variable("#bool", (val) => val === "true");
	expect(v.get()).toBe(true);
	v.set(false);
	expect(v.get()).toBe(false);
});

test("Variable with custom object modifier", () => {
	document.body.innerHTML = '<input id="json" value=\'{"name":"test"}\'>';
	const v = new Variable("#json", (val) => JSON.parse(val));
	expect(v.get()).toEqual({ name: "test" });
	v.set(JSON.stringify({ name: "updated" }));
	expect(v.get()).toEqual({ name: "updated" });
});

test("Variable onChange with value callback", () => {
	document.body.innerHTML = '<input id="test" value="initial">';
	const v = new Variable<string>("#test");
	let receivedValue: string | undefined;
	v.onChange((value) => {
		receivedValue = value;
	});

	(v.element as HTMLInputElement).value = "changed";
	v.element.dispatchEvent(new Event("change"));
	expect(receivedValue).toBe("changed");
});

test("Variable onChange with modifier", () => {
	document.body.innerHTML = '<input id="num" value="10">';
	const v = new Variable("#num", (val) => Number(val));
	let receivedValue: number | undefined;
	v.onChange((value) => {
		receivedValue = value;
	});

	(v.element as HTMLInputElement).value = "25";
	v.element.dispatchEvent(new Event("change"));
	expect(receivedValue).toBe(25);
});

test("Variable multiple onChange listeners", () => {
	document.body.innerHTML = '<input id="test" value="">';
	const v = new Variable("#test");
	let counter1 = 0;
	let counter2 = 0;

	v.onChange(() => counter1++);
	v.onChange(() => counter2++);

	v.element.dispatchEvent(new Event("change"));
	expect(counter1).toBe(1);
	expect(counter2).toBe(1);
});

test("Variable set with different input types", () => {
	document.body.innerHTML = `
		<select id="select"><option value="a">A</option><option value="b">B</option></select>
		<textarea id="textarea"></textarea>
		<input type="checkbox" id="checkbox">
	`;

	const select = new Variable("#select");
	select.set("b");
	expect(select.get()).toBe("b");

	const textarea = new Variable("#textarea");
	textarea.set("text content");
	expect(textarea.get()).toBe("text content");

	const checkbox = new Variable("#checkbox");
	checkbox.set(true);
	expect((checkbox.element as HTMLInputElement).value).toBe("true");
});

test("Variable computed functionality", () => {
	document.body.innerHTML = `
		<input id="a" value="5">
		<input id="b" value="3">
	`;

	const varA = new Variable("#a", (val) => Number(val));
	const varB = new Variable("#b", (val) => Number(val));

	const computed = Variable.computed(
		() => varA.get() + varB.get(),
		[varA, varB],
	);
	expect(computed.get()).toBe(8);

	varA.set(10);
	expect(computed.compute()).toBe(13);
});

test("Variable computed with no dependencies", () => {
	const computed = Variable.computed(() => 42, []);
	expect(computed.get()).toBe(42);
	expect(computed.dependencies).toEqual([]);
});
