import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

const TextLayer = {
	setup: function() {
		this.tileset = vdp.sprite('text');
		this.mapWidth = vdp.map('text').w;
		this.map = vdp.readMap('text', vdp.CopySource.blank);
	},
	clear: function() {
		this.map.array.fill(0);
		vdp.writeMap('text', this.map);
	},
	getCharTile: function(c) {
		if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) return 1 + c - '0'.charCodeAt(0);
		if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) return 17 + c - 'a'.charCodeAt(0);
		if (c >= 'A'.charCodeAt(0) && c <= 'Z'.charCodeAt(0)) return 17 + c - 'A'.charCodeAt(0);
		if (c === ':'.charCodeAt(0)) return 11;
		if (c === '-'.charCodeAt(0)) return 14;
		if (c === ' '.charCodeAt(0)) return 0;
		if (c === '©'.charCodeAt(0)) return 16;
		if (c === '®'.charCodeAt(0)) return 46;
		// ? for all other chars
		return 15;
	},
	drawText: function (x, y, text) {
		for (let i = 0; i < text.length; i++) {
			this.map.setElement(x + i, y, this.getCharTile(text.charCodeAt(i)));
		}
	},
	drawLayer: function() {
		const array = new vdp.LineTransformationArray();
		for (let i = 0; i < array.length; i++) {
			const mat = mat3.create();
			// Like this, it will scale and then move, meaning that the screen is double-sized and one tile (8 pixels) is scrolled left (16 pixels with double size). The 'translate x' parameter of the matrix is 8.
			// If we reversed those 2 lines, only half a tile would be scrolled, because we'd scroll 8 pixels and then scale, but 8 pixels is only half a 16x16 double-sized tile. The 'translate x' parameter of the matrix would be 4.
			mat3.translate(mat, mat, [8, 0]);
			mat3.scale(mat, mat, [0.5, 0.5]);
			// This scrolls an additional tile left (16/2=8), then scales the whole render x1.5, giving a x3 render centered around the 3rd tile
			mat3.translate(mat, mat, [16, 0]);
			mat3.scale(mat, mat, [0.75, 0.75]);

			// Another sample
			//// The order is as is: advance so that the origin is at the texture center (128, 128)
			//mat3.translate(mat, mat, [128, 128]);
			//// Then rotate around the center
			//mat3.rotate(mat, mat, loop / 800);
			//// Now we're into a rotated world. Scaling doesn't affect this (it touches 2 independent matrix entries).
			//mat3.scale(mat, mat, [3, 3]);
			//// Then we translate back, in the rotated space. We'll only go partially back to the original place because of the transformation, which is what gives the impression of scaling/rotating around the center.
			//mat3.translate(mat, mat, [-128, -128]);

			//// The order is as is: advance so that the origin is at the texture center (128, 128)
			//mat3.translate(mat, mat, [8, 0]);
			//// Then rotate around the center
			////mat3.rotate(mat, mat, loop / 800);
			//// Now we're into a rotated world. Scaling doesn't affect this (it touches 2 independent matrix entries).
			//mat3.scale(mat, mat, [0.5, 0.5]);
			//// Then we translate back, in the rotated space.
			//mat3.translate(mat, mat, [-8, -0]);

			array.setLine(i, mat);
		}

		// Update and draw
		vdp.writeMap('text', this.map);
		vdp.drawBackgroundTilemap('text', { lineTransform: array });
	}
};

export function *main() {
	TextLayer.setup();
	TextLayer.clear();
	TextLayer.drawText(0, 0, `Hello world`);

	while (true) {
		TextLayer.drawLayer();
		yield;
	}
}
