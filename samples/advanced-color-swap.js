import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

export function *main() {
	let loop = 0;

	// The colors at (x, y) in build/palettes.png that we want to modify.
	// First is the background of the first section of the 'tmx' map. Second is the red of the 'mario' sprite.
	const marioPaletteNo = vdp.palette('mario').y;
	const tmxPaletteNo = vdp.palette('tmx').y;
	const swaps = [new vdp.LineColorArray(10, tmxPaletteNo), new vdp.LineColorArray(1, marioPaletteNo)];

	// Set up another gradient for Mario's costume. Note that here the color 0 is not transparent, because it
	// originates from a non-zero pixel.
	for (let i = 0; i < swaps[1].length; i++) {
		// * 2 so it goes between -256 to +256
		const intensity = Math.abs(i - swaps[1].length / 2) * 2;
		swaps[1].setLine(i, color.make(intensity, intensity, intensity));
	}

	while (true) {
		// Make a color gradient setting colors from top to bottom. Use the frame number to create an alternating
		// horizontal mesh, creating the illusion of additional colors.
		for (let i = 0; i < swaps[0].length; i++) {
			const intensity = 16 * i / swaps[0].length;
			const floatingPart = intensity - Math.floor(intensity);
			const blinkActive = loop % 2 ? 1 : 0, blinkInactive = 1 - blinkActive;
			const mesh = i % 2 ? blinkActive : blinkInactive;
			let targetColorIndex;
			if (floatingPart <= 0.5) targetColorIndex = Math.max(0, intensity - mesh);
			else targetColorIndex = intensity;
			swaps[0].setLine(i, color.make(targetColorIndex * 16, 0, 128));
		}

		vdp.drawBackgroundTilemap('tmx', { scrollX: 32, scrollY: 0 });
		vdp.drawObject(vdp.sprite('mario').tile(0), 96, 96 + Math.sin(loop / 90) * 96, { width: 64, height: 64 });

		vdp.configColorSwap(swaps);
		loop += 1;
		yield;
	}
}
