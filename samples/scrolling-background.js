function *main() {
	let loop = 0;

	// Black has been made transparent to spare one color
	vdp.configBackdropColor('#20a');

	while (true) {
		vdp.drawBackgroundTilemap('sonic1-bg', { scrollX: loop });
		loop += 0.5;
		yield;
	}
}
