import { expect, test } from "bun:test";
import "./setup.js";

import { KittoForm } from "../src/form.js";
import { Variable } from "../src/variable.js";

test("Variable creation performance", () => {
	const startTime = performance.now();
	const variables: Variable<string>[] = [];

	// Create multiple input elements
	const inputs = [];
	for (let i = 0; i < 1000; i++) {
		const input = document.createElement("input");
		input.id = `perf-input-${i}`;
		input.value = `value-${i}`;
		document.body.appendChild(input);
		inputs.push(input);
	}

	// Create variables for each input
	for (let i = 0; i < 1000; i++) {
		variables.push(new Variable(`#perf-input-${i}`));
	}

	const endTime = performance.now();
	const duration = endTime - startTime;

	expect(variables.length).toBe(1000);
	expect(duration).toBeLessThan(2000); // Should complete within 2 seconds

	// Cleanup
	inputs.forEach((input) => document.body.removeChild(input));
});

test("Variable get/set operations performance", () => {
	document.body.innerHTML = '<input id="perf-test" value="initial">';
	const variable = new Variable("#perf-test");

	const iterations = 10000;

	// Test get operations
	const getStartTime = performance.now();
	for (let i = 0; i < iterations; i++) {
		variable.get();
	}
	const getEndTime = performance.now();
	const getDuration = getEndTime - getStartTime;

	// Test set operations
	const setStartTime = performance.now();
	for (let i = 0; i < iterations; i++) {
		variable.set(`value-${i}`);
	}
	const setEndTime = performance.now();
	const setDuration = setEndTime - setStartTime;

	expect(getDuration).toBeLessThan(50); // Get operations should be fast
	expect(setDuration).toBeLessThan(100); // Set operations should be reasonable
	expect(variable.get()).toBe("value-9999"); // Final value should be correct
});

test("onChange listener performance", () => {
	document.body.innerHTML = '<input id="perf-change" value="initial">';
	const variable = new Variable("#perf-change");

	let callCount = 0;
	const callback = () => callCount++;

	// Add multiple listeners
	const listenerCount = 100;
	const addListenersStart = performance.now();
	for (let i = 0; i < listenerCount; i++) {
		variable.onChange(callback);
	}
	const addListenersEnd = performance.now();
	const addDuration = addListenersEnd - addListenersStart;

	// Trigger change event
	const triggerStart = performance.now();
	variable.element.dispatchEvent(new Event("change"));
	const triggerEnd = performance.now();
	const triggerDuration = triggerEnd - triggerStart;

	expect(addDuration).toBeLessThan(50); // Adding listeners should be fast
	expect(triggerDuration).toBeLessThan(50); // Triggering should be fast
	expect(callCount).toBe(listenerCount); // All listeners should be called
});

test("KittoForm rendering performance", () => {
	const formHtml = `
		<form id="perf-form">
			<input name="trigger" value="show">
			<div kitto-slot="perf-slot"></div>
			${Array.from(
				{ length: 50 },
				(_, i) =>
					`<template kitto-component="@comp-${i}">
					<div>Component ${i}: <input name="$parent-field-${i}" /></div>
				</template>`,
			).join("")}
		</form>
	`;

	document.body.innerHTML = formHtml;
	const form = new KittoForm("#perf-form");

	// Measure rendering performance
	const renderStart = performance.now();
	form.field("trigger").render({
		name: "perf",
		show: Array.from({ length: 50 }, (_, i) => `@comp-${i}`),
		slot: "perf-slot",
	});
	const renderEnd = performance.now();
	const renderDuration = renderEnd - renderStart;

	expect(renderDuration).toBeLessThan(200); // Rendering should be reasonable

	const slot = document.querySelector('[kitto-slot="perf-slot"]');
	expect(slot?.children.length).toBe(50); // All components should be rendered
});

test("Repeat rendering performance", () => {
	document.body.innerHTML = `
		<form id="repeat-perf">
			<input type="number" name="count" value="100">
			<div kitto-slot="repeat-slot"></div>
			<template kitto-component="@item">
				<div>Item: <input name="$parent-input" /></div>
			</template>
		</form>
	`;

	const form = new KittoForm("#repeat-perf");

	const repeatStart = performance.now();
	form
		.field("count")
		.repeat()
		.render({
			name: "item-$n",
			show: ["@item"],
			slot: "repeat-slot",
		});
	const repeatEnd = performance.now();
	const repeatDuration = repeatEnd - repeatStart;

	expect(repeatDuration).toBeLessThan(300); // Repeat rendering should be reasonable

	const slot = document.querySelector('[kitto-slot="repeat-slot"]');
	expect(slot?.children.length).toBe(100); // All repeated items should be rendered
});

test("Large form with many fields performance", () => {
	const fieldCount = 500;
	const formHtml = `
		<form id="large-form">
			${Array.from(
				{ length: fieldCount },
				(_, i) =>
					`<input name="field-${i}" value="value-${i}" type="${i % 3 === 0 ? "number" : "text"}">`,
			).join("")}
			<div kitto-slot="output-slot"></div>
			<template kitto-component="@output">
				<div>Output: $parent</div>
			</template>
		</form>
	`;

	document.body.innerHTML = formHtml;
	const form = new KittoForm("#large-form");

	// Measure field creation performance
	const fieldStart = performance.now();
	const builders = [];
	for (let i = 0; i < fieldCount; i++) {
		builders.push(form.field(`field-${i}`));
	}
	const fieldEnd = performance.now();
	const fieldDuration = fieldEnd - fieldStart;

	expect(fieldDuration).toBeLessThan(1000); // Field creation should be reasonable
	expect(builders.length).toBe(fieldCount);
});

test("Memory usage with many variables", () => {
	const variableCount = 1000;
	const variables: Variable<string>[] = [];

	// Create many input elements and variables
	for (let i = 0; i < variableCount; i++) {
		const input = document.createElement("input");
		input.id = `mem-test-${i}`;
		input.value = `value-${i}`;
		document.body.appendChild(input);

		const variable = new Variable(`#mem-test-${i}`, (val) => val.toUpperCase());
		variables.push(variable);
	}

	// Test that all variables work correctly
	const testStart = performance.now();
	for (let i = 0; i < variableCount; i++) {
		const value = variables[i].get();
		expect(value).toBe(`VALUE-${i}`);
	}
	const testEnd = performance.now();
	const testDuration = testEnd - testStart;

	expect(testDuration).toBeLessThan(200); // Reading all values should be fast
	expect(variables.length).toBe(variableCount);

	// Cleanup
	for (let i = 0; i < variableCount; i++) {
		const element = document.getElementById(`mem-test-${i}`);
		if (element) {
			document.body.removeChild(element);
		}
	}
});

test("Complex computed variable performance", () => {
	// Create a complex computation chain
	document.body.innerHTML = `
		<input id="base1" value="10" />
		<input id="base2" value="20" />
		<input id="base3" value="30" />
		<input id="multiplier" value="2" />
	`;

	const base1 = new Variable("#base1", (val) => Number(val));
	const base2 = new Variable("#base2", (val) => Number(val));
	const base3 = new Variable("#base3", (val) => Number(val));
	const multiplier = new Variable("#multiplier", (val) => Number(val));

	const computeStart = performance.now();

	// Create a chain of computed variables
	const sum = Variable.computed(
		() => base1.get() + base2.get() + base3.get(),
		[base1, base2, base3],
	);
	const product = Variable.computed(
		() => sum.get() * multiplier.get(),
		[multiplier],
	);
	const squared = Variable.computed(() => product.get() ** 2, []);
	const root = Variable.computed(() => Math.sqrt(squared.get()), []);

	// Execute computations multiple times
	const iterations = 1000;
	for (let i = 0; i < iterations; i++) {
		root.get();
	}

	const computeEnd = performance.now();
	const computeDuration = computeEnd - computeStart;

	expect(computeDuration).toBeLessThan(100); // Complex computations should be reasonable
	expect(root.get()).toBe(120); // (10+20+30) * 2 = 120
});

test("DOM manipulation performance in rendering", () => {
	const componentCount = 200;

	document.body.innerHTML = `
		<form id="dom-perf">
			<input name="show" value="true">
			<div kitto-slot="dom-slot"></div>
			${Array.from(
				{ length: componentCount },
				(_, i) =>
					`<template kitto-component="@dom-comp-${i}">
					<div class="component-${i}">
						<input name="$parent-input-${i}" placeholder="Field ${i}" />
						<select name="$parent-select-${i}">
							<option value="a">Option A</option>
							<option value="b">Option B</option>
						</select>
					</div>
				</template>`,
			).join("")}
		</form>
	`;

	const form = new KittoForm("#dom-perf");

	// Measure DOM manipulation performance
	const domStart = performance.now();
	form
		.field("show")
		.if((val) => val === "true")
		.render({
			name: "dom-test",
			show: Array.from({ length: componentCount }, (_, i) => `@dom-comp-${i}`),
			slot: "dom-slot",
		});
	const domEnd = performance.now();
	const domDuration = domEnd - domStart;

	expect(domDuration).toBeLessThan(1000); // DOM manipulation should be reasonable

	const slot = document.querySelector('[kitto-slot="dom-slot"]');
	const inputs = slot?.querySelectorAll("input");
	const selects = slot?.querySelectorAll("select");

	expect(inputs?.length).toBe(componentCount);
	expect(selects?.length).toBe(componentCount);
});

test("Event listener cleanup performance", () => {
	const listenerCount = 500;
	const variables: Variable<string>[] = [];

	// Create variables with many listeners each
	for (let i = 0; i < listenerCount; i++) {
		const input = document.createElement("input");
		input.id = `cleanup-${i}`;
		document.body.appendChild(input);

		const variable = new Variable<string>(`#cleanup-${i}`);

		// Add multiple listeners to each variable
		for (let j = 0; j < 5; j++) {
			variable.onChange(() => {
				// Simple callback
			});
		}

		variables.push(variable);
	}

	// Measure cleanup performance
	const cleanupStart = performance.now();

	// Simulate cleanup by removing elements from DOM
	for (let i = 0; i < listenerCount; i++) {
		const element = document.getElementById(`cleanup-${i}`);
		if (element) {
			document.body.removeChild(element);
		}
	}

	const cleanupEnd = performance.now();
	const cleanupDuration = cleanupEnd - cleanupStart;

	expect(cleanupDuration).toBeLessThan(200); // Cleanup should be fast
	expect(variables.length).toBe(listenerCount);
});
