import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

export function *main() {
	let loop = 0;

	// Brings the limit to 256 sprites instead of 512 for easier demo
	vdp.configDisplay({ extraSprites: false });
	// Darken BG
	vdp.configObjectTransparency({ op: 'add', blendDst: '#000', blendSrc: '#444' });
	vdp.configBackdropColor('#000');

	while (true) {
		const bgTile = vdp.sprite('level2').tile(46);
		// This will cover 224x256 pixels = 14x16 cells (1 cell = 16x16), using 224 out of the 256 sprites
		vdp.drawObject(bgTile, 0, 0, { width: 224, height: 256, transparent: true });

		// This sprite is 128x128, which would require 64 cells, but we only have 32 remaining, so only half of it will be drawn (cut horizontally)
		// However when the sprite gets half off-screen we have less pixels to draw vertically so we might fit more cells horizontally
		const marioTile = vdp.sprite('mario').tile(6);
		const verticalPos = 64 + Math.sin(loop / 100) * 160;
		vdp.drawObject(marioTile, 64, verticalPos, { width: 128, height: 128, prio: 2 });

		loop++;
		yield;
	}
}
