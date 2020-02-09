import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

const TextLayer = {
	setup: function() {
		this.map = vdp.readMap('text2', vdp.CopySource.blank);
	},
	getCharTile: function(c) {
		if (c >= 32 && c < 128) return c - 32;
		return 31; // ?
	},
	drawText: function (x, y, text) {
		for (let i = 0; i < text.length; i++) {
			this.map.setElement(x + i, y, this.getCharTile(text.charCodeAt(i)));
		}
	},
	drawLayer: function() {
		vdp.writeMap('text2', this.map);
		vdp.drawBackgroundTilemap('text2');
	}
};

export function *main() {
	TextLayer.setup();
	TextLayer.drawText(11, 14, 'Window demo');

	while (true) {
		TextLayer.drawText(11, 16, ' from top  ');
		for (let loop = 0; loop < vdp.screenHeight; loop++) {
			// Even though we call this twice, it only counts as one layer, since they each take only a part of the screen
			vdp.drawBackgroundTilemap('level2', {winY: loop});
			vdp.drawBackgroundTilemap('level1', {winH: loop});
			TextLayer.drawLayer();
			yield;
		}

		TextLayer.drawText(11, 16, 'from bottom');
		for (let loop = 0; loop < vdp.screenHeight; loop++) {
			vdp.drawBackgroundTilemap('level1', {winH: 255 - loop});
			vdp.drawBackgroundTilemap('level2', {winY: 255 - loop});
			TextLayer.drawLayer();
			yield;
		}

		TextLayer.drawText(11, 16, ' from left ');
		for (let loop = 0; loop < vdp.screenWidth; loop++) {
			vdp.drawBackgroundTilemap('level2', {winX: loop});
			vdp.drawBackgroundTilemap('level1', {winW: loop});
			TextLayer.drawLayer();
			yield;
		}

		TextLayer.drawText(11, 16, 'from right ');
		for (let loop = 0; loop < vdp.screenWidth; loop++) {
			vdp.drawBackgroundTilemap('level1', {winW: 255 - loop});
			vdp.drawBackgroundTilemap('level2', {winX: 255 - loop});
			TextLayer.drawLayer();
			yield;
		}
	}
}
