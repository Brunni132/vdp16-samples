const mat3 = vdp.mat3;

function *main() {
	let loop = 0;
	const lineTransform = new vdp.LineTransformationArray();

	// Black has been made transparent to spare one color
	vdp.configBackdropColor('#20a');

	while (true) {
		for (let i = 0; i < lineTransform.length; i++) {
			let scrollFactor = 1;
			if (i < 32) scrollFactor = 0.7;
			else if (i < 48) scrollFactor = 0.5;
			else if (i < 64) scrollFactor = 0.3;
			else if (i < 112) scrollFactor = 0.2;
			else if (i < 152) scrollFactor = 0.4;
			else scrollFactor = 0.45 + (i - 152) * 0.01;

			const transform = mat3.create();
			console.log(loop);
			mat3.translate(transform, transform, [loop * scrollFactor, i]);
			lineTransform.setLine(i, transform);
		}

		// Rotate waterfall colors (1-5)
		// We have created another palette in the packer for the waterfall, named sonic1-bg-rotating
		if (loop % 4 === 0) {
			const pal = vdp.readPalette('sonic1-bg-rotating');
			const lastCol = pal.getElement(4, 0);
			pal.setElement(4, 0, pal.getElement(3, 0));
			pal.setElement(3, 0, pal.getElement(2, 0));
			pal.setElement(2, 0, pal.getElement(1, 0));
			pal.setElement(1, 0, lastCol);
			vdp.writePalette('sonic1-bg-rotating', pal);
		}

		vdp.drawBackgroundTilemap('sonic1-bg', { lineTransform });
		loop += 1;
		yield;
	}
}
