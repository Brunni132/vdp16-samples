function *main() {
	let loop = 0;

	// Black has been made transparent to spare one color
	vdp.configBackdropColor('#20a');

	while (true) {
		const lineTransform = new vdp.LineTransformationArray();
		for (let i = 0; i < lineTransform.length; i++) {
			let scrollFactor = 1;
			if (i < 32) scrollFactor = 0.7;
			else if (i < 48) scrollFactor = 0.5;
			else if (i < 64) scrollFactor = 0.3;
			else if (i < 112) scrollFactor = 0.2;
			else if (i < 152) scrollFactor = 0.4;
			else scrollFactor = 0.45 + (i - 152) * 0.01;

			lineTransform.translateLine(i, [loop * scrollFactor, 0]);
		}

		// Rotate waterfall colors (1-5)
		// We have created another palette in the packer for the waterfall, named sonic1-bg-rotating
		if (loop % 4 === 0) {
			const pal = vdp.readPalette('sonic1-bg-rotating');
			[pal.array[1], pal.array[2], pal.array[3], pal.array[4]] = [pal.array[4], pal.array[1], pal.array[2], pal.array[3]];
			vdp.writePalette('sonic1-bg-rotating', pal);
		}

		vdp.drawBackgroundTilemap('sonic1-bg', { lineTransform });
		loop += 1;
		yield;
	}
}
