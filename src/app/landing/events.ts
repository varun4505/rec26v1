export const OPEN_TERMINAL_EVENT = "viit:open-terminal";
export const OPEN_PALETTE_EVENT = "viit:open-palette";

export function openTerminal() {
	window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT));
}

export function openPalette() {
	window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

export function scrollToSection(id: string) {
	if (id === "top") {
		window.scrollTo({ top: 0, behavior: "smooth" });
		return;
	}
	document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
