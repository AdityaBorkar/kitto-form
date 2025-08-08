import { expect, test } from "bun:test";
import "./setup.js";

import { KittoForm } from "../src/form.js";
import { Variable } from "../src/variable.js";

test("Component validation - must start with @", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show" />
			<div kitto-slot="test-slot"></div>
			<template kitto-component="invalid-comp">Content</template>
		</form>
	`;

	const form = new KittoForm("#test");
	form.field("field").render({
		name: "test",
		show: ["invalid-comp"],
		slot: "test-slot",
	});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toBe("");
});

test("Component validation - must be template element", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show" />
			<div kitto-slot="test-slot"></div>
			<div kitto-component="@invalid-comp">Content</div>
		</form>
	`;

	const form = new KittoForm("#test");
	form.field("field").render({
		name: "test",
		show: ["@invalid-comp"],
		slot: "test-slot",
	});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toBe("");
});

test("Error scenarios", () => {
	document.body.innerHTML = "<div></div>";

	expect(() => new KittoForm("#nonexistent")).toThrow("Form element not found");

	document.body.innerHTML = '<form id="test"></form>';
	const form = new KittoForm("#test");
	expect(() => form.field("nonexistent")).toThrow("Field element not found");
});

test("Variable validation - empty selector", () => {
	expect(() => new Variable("")).toThrow("Selector is required");
});

test("Variable validation - null selector", () => {
	expect(() => new Variable(null as any)).toThrow("Selector is required");
});

test("Variable validation - undefined selector", () => {
	expect(() => new Variable(undefined as any)).toThrow("Selector is required");
});

test("Component validation - mixed valid and invalid components", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show" />
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@valid-comp">Valid Content</template>
			<template kitto-component="invalid-comp">Invalid Content</template>
			<div kitto-component="@invalid-element">Not Template</div>
		</form>
	`;

	const form = new KittoForm("#test");
	form.field("field").render({
		name: "test",
		show: ["@valid-comp", "invalid-comp", "@invalid-element"],
		slot: "test-slot",
	});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain("Valid Content");
	expect(slot?.innerHTML).not.toContain("Invalid Content");
	expect(slot?.innerHTML).not.toContain("Not Template");
});

test("Form validation - invalid form selector", () => {
	document.body.innerHTML = '<div id="not-form"></div>';
	expect(() => new KittoForm("#not-form")).not.toThrow();
});

test("Render validation - missing slot", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show" />
			<template kitto-component="@test-comp">Content</template>
		</form>
	`;

	const form = new KittoForm("#test");
	expect(() => {
		form.field("field").render({
			name: "test",
			show: ["@test-comp"],
			slot: "missing-slot",
		});
	}).not.toThrow();
});

test("Field type validation - number conversion", () => {
	document.body.innerHTML =
		'<form id="test"><input type="number" name="num" value="not-a-number"></form>';
	const form = new KittoForm("#test");
	const builder = form.field("num");
	expect(builder).toBeDefined();
});

test("Field type validation - boolean conversion", () => {
	document.body.innerHTML =
		'<form id="test"><input type="boolean" name="bool" value="maybe"></form>';
	const form = new KittoForm("#test");
	const builder = form.field("bool");
	expect(builder).toBeDefined();
});

test("Modifier validation - exception handling", () => {
	document.body.innerHTML = '<input id="test" value="invalid-json">';
	const v = new Variable("#test", (val) => {
		try {
			return JSON.parse(val);
		} catch {
			return null;
		}
	});
	expect(v.get()).toBe(null);
});

test("Component name attribute validation - no name attribute", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show" />
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@test-comp">
				<div>Content without name</div>
				<input value="no-name">
			</template>
		</form>
	`;

	const form = new KittoForm("#test");
	form.field("field").render({
		name: "test",
		show: ["@test-comp"],
		slot: "test-slot",
	});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain("Content without name");
});

test("Repeat validation - non-numeric count", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="count" value="invalid">
			<div kitto-slot="repeat-slot"></div>
			<template kitto-component="@item">
				<div>Item: $parent</div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("count")
		.repeat()
		.render({
			name: "item-$n",
			show: ["@item"],
			slot: "repeat-slot",
		});

	const slot = document.querySelector('[kitto-slot="repeat-slot"]');
	expect(slot?.innerHTML).toBe("");
});

test("Repeat validation - negative count", () => {
	document.body.innerHTML = `
		<form id="test">
			<input type="number" name="count" value="-5">
			<div kitto-slot="repeat-slot"></div>
			<template kitto-component="@item">
				<div>Item: $parent</div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("count")
		.repeat()
		.render({
			name: "item-$n",
			show: ["@item"],
			slot: "repeat-slot",
		});

	const slot = document.querySelector('[kitto-slot="repeat-slot"]');
	expect(slot?.innerHTML).toBe("");
});

test("Edge case - empty component show array", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show" />
			<div kitto-slot="test-slot"></div>
		</form>
	`;

	const form = new KittoForm("#test");
	form.field("field").render({
		name: "test",
		show: [],
		slot: "test-slot",
	});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toBe("");
});

test("Edge case - whitespace in component names", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show" />
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@valid-comp">Content</template>
		</form>
	`;

	const form = new KittoForm("#test");
	form.field("field").render({
		name: "test",
		show: [" @valid-comp ", "@valid-comp"],
		slot: "test-slot",
	});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain("Content");
});
