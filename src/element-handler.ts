export class DomElementHandle {
	protected element: HTMLElement;

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
		if (!this.element.getAttribute("data-display")) {
			this.element.setAttribute(
				"data-display",
				this.element.style.display ?? "",
			);
		}
		this.element.style.display = "none";
	}

	show(): this {
		this.element.style.display =
			this.element.getAttribute("data-display") ?? "";
		return this;
	}

	hide(): this {
		this.element.style.display = "none";
		return this;
	}
}

export class SlotHandle extends DomElementHandle {
	constructor(root: Element, name: string) {
		super(root, `[kitto-slot="${name}"]`);
	}

	append(node: Node): this {
		this.element.appendChild(node);
		return this;
	}

	clear(): this {
		this.element.innerHTML = "";
		return this;
	}
}
