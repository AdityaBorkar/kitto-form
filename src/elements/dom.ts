export class DomElement {
	element: HTMLElement;

	constructor(root: Element, selector: string) {
		if (typeof selector === "string") {
			const found = root.querySelector(selector) as HTMLElement | null;
			if (!found) {
				throw new Error(`element not found: ${selector}`);
			}
			this.element = found;
		} else {
			this.element = selector;
		}
		if (!this.element.getAttribute("default-display")) {
			this.element.setAttribute(
				"default-display",
				this.element.style.display || "block",
			);
		}
	}

	show(): this {
		this.element.style.display =
			this.element.getAttribute("default-display") || "";
		return this;
	}

	hide(): this {
		this.element.style.display = "none";
		return this;
	}
}
