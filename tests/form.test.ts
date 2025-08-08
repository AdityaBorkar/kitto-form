import { test, expect } from "bun:test";
import "./setup.js";
import { KittoForm } from "../src/form.js";

test("KittoForm constructor", () => {
	document.body.innerHTML = '<form id="test"></form>';
	const form = new KittoForm("#test");
	expect(form).toBeDefined();
});

test("KittoForm field method", () => {
	document.body.innerHTML = '<form id="test"><input name="field" value="test"></form>';
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
	form.field("field")
		.if(val => val === "show")
		.render({
			slot: "test-slot",
			show: ["@test-comp"],
			name: "test"
		});
	
	const slot = document.querySelector('[kitto-slot="test-slot"]');
	expect(slot?.innerHTML).toContain("Content");
});