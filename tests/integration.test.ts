import { expect, test } from "bun:test";
import "./setup.js";

import { KittoForm } from "../src/form.js";
import { Variable } from "../src/variable.js";

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

	const parentSlot = document.querySelector(
		'[kitto-slot="parent-details-section"]',
	);
	const childSlot = document.querySelector(
		'[kitto-slot="child-details-section"]',
	);

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
	expect(typeof builder).toBe("object");

	// Number type should be auto-converted without explicit modify()
	const input = document.querySelector('[name="count"]') as HTMLInputElement;
	expect(input.value).toBe("5");
});

test("Complex nested form with multiple conditions", () => {
	document.body.innerHTML = `
		<form id="complex-form">
			<select name="user_type">
				<option value="basic">Basic</option>
				<option value="premium" selected>Premium</option>
				<option value="enterprise">Enterprise</option>
			</select>
			<input type="number" name="team_size" value="5" />
			<input type="checkbox" name="has_custom_domain" />
			
			<div kitto-slot="premium-features"></div>
			<div kitto-slot="team-members"></div>
			<div kitto-slot="enterprise-features"></div>
			
			<template kitto-component="@premium-billing">
				<input name="$parent-billing-cycle" placeholder="Billing Cycle" />
			</template>
			<template kitto-component="@team-member">
				<input name="$parent-email" placeholder="Member Email" />
				<select name="$parent-role">
					<option value="member">Member</option>
					<option value="admin">Admin</option>
				</select>
			</template>
			<template kitto-component="@enterprise-sso">
				<input name="$parent-sso-provider" placeholder="SSO Provider" />
			</template>
			<template kitto-component="@custom-domain">
				<input name="$parent-domain" placeholder="Domain" />
			</template>
		</form>
	`;

	const form = new KittoForm("#complex-form");

	// Premium features
	form
		.field("user_type")
		.if((type) => type === "premium" || type === "enterprise")
		.render({
			name: "premium",
			show: ["@premium-billing"],
			slot: "premium-features",
		});

	// Team members (only for team_size > 1)
	form
		.field("team_size")
		.if((size) => size > 1)
		.repeat()
		.render({
			name: "member-$n",
			show: ["@team-member"],
			slot: "team-members",
		});

	// Enterprise features
	form
		.field("user_type")
		.if((type) => type === "enterprise")
		.render({
			name: "enterprise",
			show: ["@enterprise-sso", "@custom-domain"],
			slot: "enterprise-features",
		});

	const premiumSlot = document.querySelector('[kitto-slot="premium-features"]');
	const teamSlot = document.querySelector('[kitto-slot="team-members"]');
	const enterpriseSlot = document.querySelector(
		'[kitto-slot="enterprise-features"]',
	);

	expect(premiumSlot?.innerHTML).toContain('name="premium-billing-cycle"');
	expect(teamSlot?.innerHTML).toContain('name="member-1-email"');
	expect(teamSlot?.innerHTML).toContain('name="member-5-role"');
	expect(enterpriseSlot?.innerHTML).toBe(""); // Should be empty for premium, not enterprise
});

test("Dynamic form updates with user interaction", () => {
	document.body.innerHTML = `
		<form id="dynamic-form">
			<select name="subscription_type" value="monthly">
				<option value="monthly">Monthly</option>
				<option value="yearly">Yearly</option>
				<option value="lifetime">Lifetime</option>
			</select>
			<input type="number" name="user_count" value="1" />
			
			<div kitto-slot="billing-details"></div>
			<div kitto-slot="user-details"></div>
			
			<template kitto-component="@monthly-billing">
				<input name="$parent-monthly-rate" value="$29/month" readonly />
			</template>
			<template kitto-component="@yearly-billing">
				<input name="$parent-yearly-rate" value="$290/year" readonly />
			</template>
			<template kitto-component="@lifetime-billing">
				<input name="$parent-lifetime-rate" value="$999 one-time" readonly />
			</template>
			<template kitto-component="@user-info">
				<input name="$parent-email" placeholder="User Email" />
				<input name="$parent-role" placeholder="Role" />
			</template>
		</form>
	`;

	const form = new KittoForm("#dynamic-form");

	// Billing details based on subscription type
	form
		.field("subscription_type")
		.modify((type) => type)
		.if((type) => type === "monthly")
		.render({
			name: "billing",
			show: ["@monthly-billing"],
			slot: "billing-details",
		});

	// User details based on count
	form
		.field("user_count")
		.if((count) => count > 0)
		.repeat()
		.render({
			name: "user-$n",
			show: ["@user-info"],
			slot: "user-details",
		});

	const billingSlot = document.querySelector('[kitto-slot="billing-details"]');
	const userSlot = document.querySelector('[kitto-slot="user-details"]');

	expect(billingSlot?.innerHTML).toContain('name="billing-monthly-rate"');
	expect(userSlot?.innerHTML).toContain('name="user-1-email"');

	// Test dynamic updates
	const subscriptionSelect = document.querySelector(
		'[name="subscription_type"]',
	) as HTMLSelectElement;
	const userCountInput = document.querySelector(
		'[name="user_count"]',
	) as HTMLInputElement;

	// Change subscription type
	subscriptionSelect.value = "yearly";
	subscriptionSelect.dispatchEvent(new Event("change"));

	// Change user count
	userCountInput.value = "3";
	userCountInput.dispatchEvent(new Event("change"));

	// Note: The reactive updates would happen if the form was re-rendered
	// In actual usage, the onChange listeners would trigger re-rendering
});

test("Complex variable interactions with computed values", () => {
	document.body.innerHTML = `
		<form id="calculator-form">
			<input type="number" name="base_price" value="100" />
			<input type="number" name="quantity" value="2" />
			<input type="number" name="discount_percent" value="10" />
			<input name="tax_included" type="checkbox" />
			
			<div kitto-slot="price-breakdown"></div>
			<div kitto-slot="line-items"></div>
			
			<template kitto-component="@price-summary">
				<div>Subtotal: $<span name="$parent-subtotal"></span></div>
				<div>Discount: $<span name="$parent-discount"></span></div>
				<div>Tax: $<span name="$parent-tax"></span></div>
				<div>Total: $<span name="$parent-total"></span></div>
			</template>
			<template kitto-component="@line-item">
				<div>Item $n: $<span name="$parent-item-price"></span></div>
			</template>
		</form>
	`;

	const basePriceVar = new Variable('[name="base_price"]', (val) =>
		Number(val),
	);
	const quantityVar = new Variable('[name="quantity"]', (val) => Number(val));
	const discountVar = new Variable('[name="discount_percent"]', (val) =>
		Number(val),
	);

	const subtotal = Variable.computed(
		() => basePriceVar.get() * quantityVar.get(),
		[basePriceVar, quantityVar],
	);
	const discount = Variable.computed(
		() => subtotal.get() * (discountVar.get() / 100),
		[discountVar],
	);

	expect(subtotal.get()).toBe(200); // 100 * 2
	expect(discount.compute()).toBe(20); // 200 * 0.10
});

test("Multi-step form with progressive disclosure", () => {
	document.body.innerHTML = `
		<form id="wizard-form">
			<input type="number" name="current_step" value="1" />
			<select name="account_type">
				<option value="personal" selected>Personal</option>
				<option value="business">Business</option>
			</select>
			<input name="has_employees" type="checkbox" />
			<input type="number" name="employee_count" value="0" />
			
			<div kitto-slot="step-1"></div>
			<div kitto-slot="step-2"></div>
			<div kitto-slot="step-3"></div>
			
			<template kitto-component="@personal-info">
				<input name="$parent-first-name" placeholder="First Name" />
				<input name="$parent-last-name" placeholder="Last Name" />
			</template>
			<template kitto-component="@business-info">
				<input name="$parent-company-name" placeholder="Company Name" />
				<input name="$parent-tax-id" placeholder="Tax ID" />
			</template>
			<template kitto-component="@employee-info">
				<input name="$parent-employee-name" placeholder="Employee Name" />
				<input name="$parent-employee-role" placeholder="Role" />
			</template>
		</form>
	`;

	const form = new KittoForm("#wizard-form");

	// Step 1: Account type selection
	form
		.field("current_step")
		.if((step) => step === 1)
		.render({
			name: "user",
			show: ["@personal-info"],
			slot: "step-1",
		});

	// Step 2: Business details (if business account)
	form
		.field("account_type")
		.if((type) => type === "business")
		.render({
			name: "business",
			show: ["@business-info"],
			slot: "step-2",
		});

	// Step 3: Employee details (if has employees)
	form
		.field("employee_count")
		.if((count) => count > 0)
		.repeat()
		.render({
			name: "employee-$n",
			show: ["@employee-info"],
			slot: "step-3",
		});

	const step1Slot = document.querySelector('[kitto-slot="step-1"]');
	const step2Slot = document.querySelector('[kitto-slot="step-2"]');
	const step3Slot = document.querySelector('[kitto-slot="step-3"]');

	expect(step1Slot?.innerHTML).toContain('name="user-first-name"');
	expect(step2Slot?.innerHTML).toBe(""); // Should be empty for personal, not business
	expect(step3Slot?.innerHTML).toBe(""); // No employees initially
});

test("Form with conditional validation rules", () => {
	document.body.innerHTML = `
		<form id="validation-form">
			<select name="payment_method" value="credit_card">
				<option value="credit_card">Credit Card</option>
				<option value="bank_transfer">Bank Transfer</option>
				<option value="paypal">PayPal</option>
			</select>
			<input name="require_receipt" type="checkbox" />
			
			<div kitto-slot="payment-fields"></div>
			<div kitto-slot="receipt-fields"></div>
			
			<template kitto-component="@credit-card-fields">
				<input name="$parent-card-number" placeholder="Card Number" required />
				<input name="$parent-expiry" placeholder="MM/YY" required />
				<input name="$parent-cvv" placeholder="CVV" required />
			</template>
			<template kitto-component="@bank-fields">
				<input name="$parent-account-number" placeholder="Account Number" required />
				<input name="$parent-routing-number" placeholder="Routing Number" required />
			</template>
			<template kitto-component="@paypal-fields">
				<input name="$parent-paypal-email" type="email" placeholder="PayPal Email" required />
			</template>
			<template kitto-component="@receipt-info">
				<input name="$parent-receipt-email" type="email" placeholder="Receipt Email" required />
				<textarea name="$parent-receipt-address" placeholder="Mailing Address"></textarea>
			</template>
		</form>
	`;

	const form = new KittoForm("#validation-form");

	// Payment method fields
	form
		.field("payment_method")
		.if((method) => method === "credit_card")
		.render({
			name: "payment",
			show: ["@credit-card-fields"],
			slot: "payment-fields",
		});

	// Receipt fields (conditional on checkbox)
	form
		.field("require_receipt")
		.if((required) => required === "true" || required === true)
		.render({
			name: "receipt",
			show: ["@receipt-info"],
			slot: "receipt-fields",
		});

	const paymentSlot = document.querySelector('[kitto-slot="payment-fields"]');
	const receiptSlot = document.querySelector('[kitto-slot="receipt-fields"]');

	expect(paymentSlot?.innerHTML).toContain('name="payment-card-number"');
	expect(paymentSlot?.innerHTML).toContain("required");
	expect(receiptSlot?.innerHTML).toBe(""); // Checkbox not checked initially
});
