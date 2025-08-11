import { DomElement } from "./dom";

const KITTO_MEMOIZE = "kitto-memoize";

export class SlotElement extends DomElement {
	newSlot: HTMLElement;

	constructor(root: Element, name: string) {
		super(root, `[kitto-slot="${name}"]`);
		this.newSlot = this.element;
	}

	append(node: Node | HTMLElement) {
		// @ts-expect-error `setAttribute` is not typed.
		const key = node?.getAttribute("kitto-key");
		const elements = this.newSlot.querySelectorAll(`[kitto-key="${key}"]`);
		if (elements.length > 1) {
			throw new Error("Found multiple elements with the same keys.");
		}
		if (elements.length === 0) {
			// @ts-expect-error `setAttribute` is not typed.
			node?.setAttribute(KITTO_MEMOIZE, "true");
			this.newSlot.append(node);
		}
		if (elements.length === 1) {
			elements[0].setAttribute(KITTO_MEMOIZE, "true");
			// TODO: REPLACE
		}
	}

	render() {
		for (const element of Array.from(this.newSlot.children)) {
			if (element.getAttribute(KITTO_MEMOIZE)) {
				element.removeAttribute(KITTO_MEMOIZE);
			} else {
				element.remove();
			}
		}
	}

	clear() {
		this.element.innerHTML = "";
	}
}
