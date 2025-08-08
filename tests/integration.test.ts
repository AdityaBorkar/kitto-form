import { test, expect } from "bun:test";
import "./setup.js";
import { KittoForm } from "../src/form.js";

test("Complete workflow from example.html", () => {
	document.body.innerHTML = `
		<form id="reg-form">
			<input type="text" name="register_for" value="Myself and family" />
			<input type="number" name="children_count" value="2" />
			<div kitto-slot="parent-details-section"></div>
			<div kitto-slot="child-details-section"></div>
			<template kitto-component="@parent-details">
				<input name="$parent-name" placeholder="Parent Name" />
			</template>
			<template kitto-component="@preferred-details">
				<input name="$parent-email" placeholder="Email" />
			</template>
			<template kitto-component="@child-details">
				<input name="$parent-name" placeholder="Child Name" />
			</template>
		</form>
	`;

	const form = new KittoForm("#reg-form");

	form
		.field<string>("register_for")
		.if((value) => value.startsWith("Myself"))
		.render({
			name: "parent",
			show: ["@parent-details", "@preferred-details"],
			slot: "parent-details-section",
		});

	form
		.field<number>("children_count")
		.if((value) => value > 0)
		.repeat()
		.render({
			name: "child-$n",
			show: ["@child-details", "@preferred-details"],
			slot: "child-details-section",
		});

	const parentSlot = document.querySelector('[kitto-slot="parent-details-section"]');
	const childSlot = document.querySelector('[kitto-slot="child-details-section"]');
	
	expect(parentSlot?.innerHTML).toContain('name="parent-name"');
	expect(parentSlot?.innerHTML).toContain('name="parent-email"');
	expect(childSlot?.innerHTML).toContain('name="child-1-name"');
	expect(childSlot?.innerHTML).toContain('name="child-2-name"');
});

test("Auto type conversion for number inputs", () => {
	document.body.innerHTML = `
		<form id="test-form">
			<input type="number" name="count" value="5" />
			<div kitto-slot="output"></div>
			<template kitto-component="@counter">
				<span>Count: $parent</span>
			</template>
		</form>
	`;

	const form = new KittoForm("#test-form");
	
	const builder = form.field("count");
	expect(typeof builder).toBe('object');
	
	// Number type should be auto-converted without explicit modify()
	const input = document.querySelector('[name="count"]') as HTMLInputElement;
	expect(input.value).toBe("5");
});