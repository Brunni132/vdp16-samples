// These lines are for auto-completion support in some IDEs (VS Code notably)
import {VDP} from './lib/vdp-lib';
/** @type {VDP} */
var vdp = vdp;

function *main() {
	let loop = 0;

	vdp.configBackdropColor('#000');

    const pal = vdp.palette('level2');
    pal.y = 0;

    const palData = vdp.readPalette(pal);
	palData.array[1] = vdp.color.make('#f00');
	palData.array[2] = vdp.color.make('#fd0');
	palData.array[3] = vdp.color.make('#0f0');
	palData.array[4] = vdp.color.make('#088');
	palData.array[5] = vdp.color.make('#8ff');
	palData.array[6] = vdp.color.make('#00f');
	vdp.writePalette(pal, palData);

	const spr = vdp.sprite('level1');
	spr.x = 0;
	spr.y = 0;
	spr.w = 32;
    spr.h = 32;
	const til = vdp.readSprite(spr);
	for (let i = 0; i < til.array.length; i++)
		til.array[i] = 0x11;
	vdp.writeSprite(spr, til);

	while (true) {
		vdp.drawObject(spr, 0, 0, { palette: pal });

		loop = loop + 1;
		yield;
	}
}
