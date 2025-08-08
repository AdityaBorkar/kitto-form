import { test, expect } from "bun:test";
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
	v.onChange(() => called = true);
	v.element.dispatchEvent(new Event("change"));
	expect(called).toBe(true);
});