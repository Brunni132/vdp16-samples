import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

export function *main() {
	let loop = 0;
	while (true) {
		const array = new vdp.LineTransformationArray();
		const mat = mat3.create();
		mat3.translate(mat, mat, [loop, 0]);
		mat3.translate(mat, mat, [vdp.screenWidth / 2, vdp.screenHeight / 2]);
		mat3.rotate(mat, mat, loop / 800);
		mat3.translate(mat, mat, [-vdp.screenWidth / 2, -vdp.screenHeight / 2]);
		array.setAll(mat);

		vdp.drawBackgroundTilemap('level1', { scrollX: 0, lineTransform: array });
		loop += 1;
		yield;
	}
}
