export class ComponentElement {
	private readonly root: Element;
	private readonly name: `@${string}`;

	constructor(root: Element, name: `@${string}`) {
		this.root = root;
		this.name = name;
	}

	params(params: Record<string, any> & { key: string }) {
		const { key } = params;

		const selector = `[kitto-component="${this.name}"]`;
		const element = this.root.querySelector(selector) as HTMLElement | null;
		if (!element) {
			throw new Error(`component not found: ${this.name}`);
		}
		let toAppend: DocumentFragment | HTMLElement;
		if (element.tagName === "TEMPLATE") {
			toAppend = (element as HTMLTemplateElement).content.cloneNode(
				true,
			) as DocumentFragment;
		} else {
			const clone = element.cloneNode(true) as HTMLElement;
			clone.removeAttribute("kitto-component");
			const display = element.getAttribute("default-display") || "block";
			clone.style.display = display;
			toAppend = clone;
		}
		if (typeof params !== "undefined") {
			const parent = key;
			const root: ParentNode =
				toAppend instanceof DocumentFragment
					? toAppend
					: (toAppend as ParentNode);
			for (const node of root.querySelectorAll<HTMLElement>("[name]")) {
				const current = node.getAttribute("name");
				if (!current) {
					continue;
				}
				let updated = current.replace("$KEY", String(key));
				updated = updated.replace("$parent", String(parent));
				if (updated !== current) {
					node.setAttribute("name", updated);
				}
			}
		}

		// @ts-expect-error `setAttribute` is not typed.
		toAppend.setAttribute("kitto-key", key);
		// @ts-expect-error `setAttribute` is not typed.
		toAppend.setAttribute("kitto-instance-of", this.name);

		return toAppend;
	}
}
