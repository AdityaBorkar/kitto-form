export class KittoForm {
	element: Element;
	components: Map<string, Element> = new Map();
	formElement: Element;

	constructor(selector: string) {
		const element = document.querySelector(selector);
		if (!element) throw new Error("Element not found");
		this.element = element;
		this.formElement = element;

		const children = Array.from(this.element.childNodes);
		for (const child of children) {
			const element = child as HTMLElement;
			const kittoId = element.getAttribute("kitto-id");
			if (kittoId) {
				this.components.set(kittoId, element);
			}
		}
	}

	render(children: (string | { "kitto-id": string; replacer: string })[]) {
		const formElement = this.formElement;
		// TODO: Clone Form Element without Children

		for (const child of children) {
			if (typeof child === "string") {
				const element = this.formElement.querySelector(child);
				if (element) {
					formElement.appendChild(element.cloneNode(true));
					element.innerHTML = child;
				} else {
					console.error(`[Kitto Forms] Element not found: ${child}`);
				}
				continue;
			}

			const kittoId = child["kitto-id"];
			const replacer = child.replacer;
			const component = this.components.get(kittoId)?.cloneNode(true);

			if (component) {
				const inputs = component.querySelectorAll("[name]");
				for (const input of Array.from(inputs)) {
					input.setAttribute("name", replacer);
					formElement.appendChild(input);
				}
				formElement.appendChild(component);
			}
		}
	}
}
