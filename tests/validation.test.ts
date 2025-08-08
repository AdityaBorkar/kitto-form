import { test, expect } from "bun:test";
import "./setup.js";
import { KittoForm } from "../src/form.js";

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
		slot: "test-slot",
		show: ["invalid-comp"],
		name: "test"
	});
	
	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toBe('');
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
		slot: "test-slot",
		show: ["@invalid-comp"],
		name: "test"
	});
	
	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toBe('');
});

test("Error scenarios", () => {
	document.body.innerHTML = '<div></div>';
	
	expect(() => new KittoForm("#nonexistent")).toThrow("Form element not found");
	
	document.body.innerHTML = '<form id="test"></form>';
	const form = new KittoForm("#test");
	expect(() => form.field("nonexistent")).toThrow("Field element not found");
});