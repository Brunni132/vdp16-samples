function *main() {
	let loop = 0;

	// The color at (x, y) = (1, <position of palette level1>) in build/palettes.png is the one we want to modify
	const swaps = new vdp.LineColorArray(1, vdp.palette('level1').y);

	// Black to blue
	for (let i = 0; i < 256; i++) {
		swaps.setLine(i, vdp.color.make(i, 124 + i / 2, 255));
	}

	vdp.configColorSwap([swaps]);

	while (true) {
		vdp.drawBackgroundTilemap('level1', { scrollX: loop, scrollY: loop / 4 });
		loop += 1;
		yield;
	}
}
