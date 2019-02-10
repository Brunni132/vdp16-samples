function *main() {
	let loop = 0, crossFadeFactor = 0;
	let direction = +1, wait = 10;

	while (true) {
		// Every 4 frame, increment the cross fade factor. Note that the minimum resolution is 16 (less will have no effect)
		if (loop % 4 === 0) {
			if (wait > 0) {
				wait -= 1;
			} else {
				crossFadeFactor += direction * 16;

				// Fade finished, go back
				if (crossFadeFactor >= 256) {
					wait = 10;
					direction = -1;
				}
				if (crossFadeFactor <= 0) {
					wait = 10;
					direction = +1;
				}
			}
		}

		const blendSrc = vdp.color.make(crossFadeFactor, crossFadeFactor, crossFadeFactor);
		const blendDst = vdp.color.make(255 - crossFadeFactor, 255 - crossFadeFactor, 255 - crossFadeFactor);
		vdp.configBackgroundTransparency({ op: 'add', blendSrc, blendDst });

		vdp.drawBackgroundTilemap('level1', { scrollX: loop * 0.25 });
		vdp.drawBackgroundTilemap('tmx', { scrollX: loop * 0.5, transparent: true });

		loop += 1;
		yield;
	}
}
