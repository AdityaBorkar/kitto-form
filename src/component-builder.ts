export class ComponentBuilder {
	private readonly root: Element;
	private readonly name: `@${string}`;

	constructor(root: Element, name: `@${string}`) {
		this.root = root;
		this.name = name;
		const component = this.root.querySelector(
			`[kitto-component="${this.name}"]`,
		) as HTMLElement;
		if (!component) {
			throw new Error(`component not found: ${this.name}`);
		}
		if (!component.getAttribute("data-display")) {
			component.setAttribute("data-display", component.style.display ?? "");
		}
		component.style.display = "none";
		this.root.appendChild(component);
	}

	params(params?: string | number) {
		const selector = `[kitto-component="${this.name}"]`;
		const element = this.root.querySelector(selector);
		if (!element) {
			throw new Error(`component not found: ${this.name}`);
		}
		// if (element.tagName !== "TEMPLATE") {
		// 	throw new Error(`component is not a <template>: ${this.name}`);
		// }
		const fragment = element.cloneNode(true) as HTMLElement;
		fragment.style.display = fragment.getAttribute("data-display") ?? "";
		if (typeof params !== "undefined") {
			const value = String(params);
			for (const node of fragment.querySelectorAll<HTMLElement>("[name]")) {
				const current = node.getAttribute("name");
				if (!current) {
					continue;
				}
				const updated = current.replace("$n", String(value));
				if (updated !== current) {
					node.setAttribute("name", updated);
				}
			}
		}
		return fragment;
	}
}
