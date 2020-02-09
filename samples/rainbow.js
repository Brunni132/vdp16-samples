import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

export function *main() {
	let loop = 0;

	vdp.configBackdropColor('#000');

	while (true) {
		const pal = vdp.readPalette('level2', vdp.CopySource.rom);
		pal.array.forEach((col, i) => {
			const hsl = color.toHsl(col);
			hsl.h += loop * 0.01;
			pal.array[i] = color.makeFromHsl(hsl);
		});
		vdp.writePalette('level2', pal);

		vdp.drawBackgroundTilemap('level2', { scrollX: loop, scrollY: -32, winY: 32, winH: 192 });
		loop += 1;
		yield;
	}
}
