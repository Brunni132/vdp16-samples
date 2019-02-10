const color = vdp.color;

function *main() {
	let loop = 0;

	// The colors at (x, y) in build/palettes.png that we want to modify.
	// First is the background of the first section of the 'tmx' map. Second is the red of the 'mario' sprite.
	const marioPaletteNo = vdp.palette('mario').y;
	const tmxPaletteNo = vdp.palette('tmx').y;
	const swaps = [new vdp.LineColorArray(10, tmxPaletteNo), new vdp.LineColorArray(1, marioPaletteNo)];

	// Set up the 2 palettes with a gradient (32 and 33, make them far enough so that they're not used)
	const gradientPalette = vdp.readPaletteMemory(0, 32, 16, 2, vdp.CopySource.blank);
	for (let i = 0; i < 16; i++) gradientPalette.setElement(i, 0, color.make(i * 16, 0, 128));
	for (let i = 0; i < 16; i++) gradientPalette.setElement(i, 1, color.make(i * 16, i * 16, i * 16));
	vdp.writePaletteMemory(0, 32, 16, 2, gradientPalette);

	// Note that the color (0, 32) is not used, it's transparent so it will let the backdrop appear
	vdp.configBackdropColor(gradientPalette.getElement(0, 0));

	// Set up another gradient for Mario's costume. Note that here the color 0 is not transparent, because it
	// originates from a non-zero pixel.
	for (let i = 0; i < swaps[1].length; i++) {
		swaps[1].setLine(i, Math.abs(i - swaps[1].length / 2) / 8, 33);
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
			swaps[0].setLine(i, targetColorIndex, 32);
		}

		vdp.drawBackgroundTilemap('tmx', { scrollX: 32, scrollY: 0 });
		vdp.drawObject(vdp.sprite('mario').tile(0), 96, 96 + Math.sin(loop / 90) * 96, { width: 64, height: 64 });

		vdp.configColorSwap(swaps);
		loop += 1;
		yield;
	}
}
