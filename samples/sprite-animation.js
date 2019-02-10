function *main() {
	let loop = 0;
	let characterAnimation = 0;

	while (true) {
		vdp.configBackgroundTransparency({ op: 'add', blendSrc: '#444', blendDst: '#000' });
		vdp.drawBackgroundTilemap('level1', { transparent: true });

		const marioSprite = vdp.sprite('mario');
		if (loop % 10 === 0) {
			characterAnimation = (characterAnimation + 1) % marioSprite.tiles;
		}
		vdp.drawObject(marioSprite.tile(characterAnimation), 100, 120, { width: 64, height: 64 });

		loop += 1;
		yield;
	}
}
