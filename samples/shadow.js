import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

export function *main() {
	const mario = {
		x: 100, y: 142, w: 48, h: 48, vx: 0.5, vy: 0
	};

	// Take the background color (1) and make it 0 (transparent). Hack to be able to reuse the map.
	const bgTileset = vdp.readSprite('level1');
	bgTileset.array.forEach((pixel, index) => {
		// Pixels are 4 bit per pixel, packed in a 8 bit integer. Therefore there are two inside; we need to extract them the old way
		let pix1 = pixel & 0xf, pix2 = pixel >> 4;
		if (pix1 === 1) pix1 = 0;
		if (pix2 === 1) pix2 = 0;

		// Make the final pixel
		bgTileset.array[index] = pix1 | pix2 << 4;
	});
	vdp.writeSprite('level1', bgTileset);

	vdp.configBackdropColor('#000');

	while (true) {
		mario.x += mario.vx;
		mario.y += mario.vy;

		// Camera is 96 pixels behind Mario, but doesn't go beyond 0 (beginning of the map)
		const cameraX = Math.max(0, mario.x - 96);

		// Configure OBJ transparency as shadow
		vdp.configObjectTransparency({ op: 'add', blendDst: '#888', blendSrc: '#000' });
		vdp.drawBackgroundTilemap('tmx', { scrollX: cameraX / 2, scrollY: -24, prio: 0, winY: 24, winH: 200 });
		vdp.drawBackgroundTilemap('level1', { scrollX: cameraX, prio: 1, winY: 24, winH: 200 });

		// Draw sprite with two shadow sprites, a small one with high prio (for planes with prio=0 and 1), a large one with low prio (for plane with prio=0)
		const marioTile = vdp.sprite('mario').tile(2);
		vdp.drawObject(marioTile, mario.x - cameraX, mario.y, { prio: 2, width: mario.w, height: mario.h });
		vdp.drawObject(marioTile, mario.x - cameraX + 2, mario.y + 2, { prio: 2, width: mario.w, height: mario.h, transparent: true });
		vdp.drawObject(marioTile, mario.x - cameraX + 5, mario.y + 5, { prio: 1, width: mario.w, height: mario.h, transparent: true });

		yield;
	}
}
