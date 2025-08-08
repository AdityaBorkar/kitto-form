import { expect, test } from "bun:test";
import "./setup.js";

import { KittoForm } from "../src/form.js";

test("KittoForm constructor", () => {
	document.body.innerHTML = '<form id="test"></form>';
	const form = new KittoForm("#test");
	expect(form).toBeDefined();
});

test("KittoForm field method", () => {
	document.body.innerHTML =
		'<form id="test"><input name="field" value="test"></form>';
	const form = new KittoForm("#test");
	const builder = form.field("field");
	expect(builder).toBeDefined();
});

test("KittoForm render with condition", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show">
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@test-comp">
				<div>Content</div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("field")
		.if((val) => val === "show")
		.render({
			name: "test",
			show: ["@test-comp"],
			slot: "test-slot",
		});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain("Content");
});

test("KittoForm field with type conversion", () => {
	document.body.innerHTML =
		'<form id="test"><input type="number" name="num" value="42"></form>';
	const form = new KittoForm("#test");
	const builder = form.field("num");
	expect(builder).toBeDefined();
});

test("KittoForm field boolean type", () => {
	document.body.innerHTML =
		'<form id="test"><input type="boolean" name="bool" value="true"></form>';
	const form = new KittoForm("#test");
	const builder = form.field("bool");
	expect(builder).toBeDefined();
});

test("KittoForm modify method", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="test">
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@test-comp">
				<div>Modified: <input name="$parent-input" /></div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("field")
		.modify((val) => val.toUpperCase())
		.render({
			name: "modified",
			show: ["@test-comp"],
			slot: "test-slot",
		});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain('name="modified-input"');
});

test("KittoForm condition false hides content", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="hide">
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@test-comp">
				<div>Content</div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("field")
		.if((val) => val === "show")
		.render({
			name: "test",
			show: ["@test-comp"],
			slot: "test-slot",
		});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toBe("");
});

test("KittoForm multiple components rendering", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show">
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@comp1">
				<div>Component 1</div>
			</template>
			<template kitto-component="@comp2">
				<div>Component 2</div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("field")
		.if((val) => val === "show")
		.render({
			name: "test",
			show: ["@comp1", "@comp2"],
			slot: "test-slot",
		});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain("Component 1");
	expect(slot?.innerHTML).toContain("Component 2");
});

test("KittoForm name replacement in templates", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show">
			<div kitto-slot="test-slot"></div>
			<template kitto-component="@test-comp">
				<input name="$parent-input" value="test">
				<select name="$parent-select"></select>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form.field("field").render({
		name: "dynamic",
		show: ["@test-comp"],
		slot: "test-slot",
	});

	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain('name="dynamic-input"');
	expect(slot?.innerHTML).toContain('name="dynamic-select"');
});

test("KittoForm repeat functionality", () => {
	document.body.innerHTML = `
		<form id="test">
			<input type="number" name="count" value="3">
			<div kitto-slot="repeat-slot"></div>
			<template kitto-component="@item">
				<div>Item: <input name="$parent-input" /></div>
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
	expect(slot?.innerHTML).toContain('name="item-1-input"');
	expect(slot?.innerHTML).toContain('name="item-2-input"');
	expect(slot?.innerHTML).toContain('name="item-3-input"');
});

test("KittoForm repeat with zero count", () => {
	document.body.innerHTML = `
		<form id="test">
			<input type="number" name="count" value="0">
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

test("KittoForm repeat with condition", () => {
	document.body.innerHTML = `
		<form id="test">
			<input type="number" name="count" value="2">
			<div kitto-slot="repeat-slot"></div>
			<template kitto-component="@item">
				<div>Item: <input name="$parent-input" /></div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("count")
		.if((val) => val > 0)
		.repeat()
		.render({
			name: "item-$n",
			show: ["@item"],
			slot: "repeat-slot",
		});

	const slot = document.querySelector('[kitto-slot="repeat-slot"]');
	expect(slot?.innerHTML).toContain('name="item-1-input"');
	expect(slot?.innerHTML).toContain('name="item-2-input"');
});

test("KittoForm reactive updates on field change", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="toggle" value="hide">
			<div kitto-slot="dynamic-slot"></div>
			<template kitto-component="@content">
				<div>Dynamic Content</div>
			</template>
		</form>
	`;
	const form = new KittoForm("#test");
	form
		.field("toggle")
		.if((val) => val === "show")
		.render({
			name: "test",
			show: ["@content"],
			slot: "dynamic-slot",
		});

	const slot = document.querySelector('[kitto-slot="dynamic-slot"]');
	const input = document.querySelector('[name="toggle"]') as HTMLInputElement;

	expect(slot?.innerHTML).toBe("");

	input.value = "show";
	input.dispatchEvent(new Event("change"));

	expect(slot?.innerHTML).toContain("Dynamic Content");
});

test("KittoForm missing slot gracefully handled", () => {
	document.body.innerHTML = `
		<form id="test">
			<input name="field" value="show">
			<template kitto-component="@test-comp">
				<div>Content</div>
			</template>
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
