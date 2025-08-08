import { KittoForm } from "./form.js";

const form = new KittoForm("#reg-form");

form
	.field("register_for")
	.if((value) => value.startsWith("Myself"))
	.render({
		name: "parent",
		show: ["@parent-details", "@preferred-details"],
		slot: "parent-details-section",
	});

form
	.field("children_count")
	.modify((value) => Number(value))
	.if((value) => value > 0)
	.repeat()
	.render({
		name: "child-$n",
		show: ["@child-details", "@preferred-details"],
		slot: "child-details-section",
	});

// 	### 🎯 Minimal Builder API

// data-kitto="@parent-details"

// ```typescript
// const form = new KittoForm('#reg-form')

// form
//   .field('register_for')
//   .if(value => value.startsWith('Myself'))
//   .render({
//     slot: "parent-details-section",
//     show: ['@parent-details', '@preferred-details'],
//     name: 'parent',
//   })

// form
//   .field('children_count')
//   .modify(value => Number(value))
//   .if(value => value > 0)
//   .repeat()
//   .render({
//     slot: "child-details-section",
//     show: ['@child-details', '@preferred-details'],
//     name: "child-$n",
//   })
// ```

// <!-- TODO: Div: <div kitto-slot="parent-details-section"> -->
// <!-- TODO: Wrap in <template kitto-component="@parent-details"> -->

// Compile Time Validation:
// 1. Kitto Component must start with `@`
// 2. Kitto Component must be a <template> element
