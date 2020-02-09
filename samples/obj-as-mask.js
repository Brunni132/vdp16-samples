import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

class TextLayer {
	constructor() {
		this.map = vdp.readMap('text2', vdp.CopySource.blank);
	}
	drawText(x, y, text) {
		for (let i = 0; i < text.length; i++) this.map.setElement(x + i, y, text.charCodeAt(i) - 32);
		vdp.writeMap('text2', this.map);
	}
}

export function *main() {
	const textLayer = new TextLayer(vdp);
	let loop = 0;
	let windowHeight = 0, windowTargetHeight = 0;

	textLayer.drawText(0, 0, 'You can still place a window on top of a darkened BG');
	vdp.configBackdropColor('#888');

	while (true) {
		// Show a window for a short moment
		if (loop >= 120 && loop <= 360) windowTargetHeight = 16;
		else windowTargetHeight = 0;

		// Animate the window
		if (windowHeight < windowTargetHeight) windowHeight += 1;
		if (windowHeight > windowTargetHeight) windowHeight -= 1;

		// Scrolling background
		vdp.drawBackgroundTilemap('tmx', { scrollX: loop, winY: windowHeight, prio: 0 });
		// Window with top priority, for the text to appear even above the transparent layer and mask sprite
		vdp.drawBackgroundTilemap('text2', {prio: 3, winH: windowHeight});
		// We don't care about the contents of this, because we set blendSrc: '#000' (making it essentially black).
		// What matters is the blendDst: '#448' which darkens everything, keeping 0.5x the blue, and 0.25x red and green.
		vdp.configBackgroundTransparency({ op: 'add', blendDst: '#448', blendSrc: '#000' });
		vdp.drawBackgroundTilemap('tmx', { transparent: true, prio: 2 });

		// Draw an object in mask mode (1x destination + 0x source) with a higher priority than the mask BG (prio: 2).
		// Because of that, the object will prevent the transparent BG from drawing in that area, although it doesn't change
		// the colors behind. This works because only the topmost "transparent" pixel is kept.
		const anim = Math.floor(loop / 12) % 3;
		const mario = vdp.sprite('mario').tile(anim);
		vdp.configObjectTransparency({ op: 'add', blendDst: '#fff', blendSrc: '#000' });
		vdp.drawObject(mario, 96, 96, { width: 64, height: 64, transparent: true, prio: 3 });

		loop++;
		yield;
	}
}
