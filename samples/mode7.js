import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

// You can play with that for the perspective
function scaleAtLine(line) { return 100 / (line + 50); }

function drawSprite(vdp, transformations, x, z, obj) {
	// I'll leave the computation to someone better at math than me ;) it's super inefficient but does the trick.
	// Here I just try to find the screen-space line on which the sprite is the most fitted (if any) by doing the inverse
	// transformation on each line; if it's right, the 'y' component of the transformed vector should be mostly equal to
	// the line number itself.
	const mat = mat3.create();
	const untransformed = vec2.fromValues(x, z);
	const result = vec2.create();
	let line, scale;
	for (line = transformations.length - 1; line >= 0; line--) {
		scale = scaleAtLine(line);
		mat3.invert(mat, transformations[line]);
		vec2.transformMat3(result, untransformed, mat);
		if (Math.abs(result[1] - line) < scale * 2) {
			break;
		}
	}
	if (line <= 0) return;

	// Once found, we transform the object using the scale level at that line.
	// The current (result[0], result[1]) are the positions of the (center, bottom) anchor of the sprite
	scale = 1 / scale;
	vdp.drawObject(obj, result[0] - scale * obj.w / 2, line - scale * obj.h, { width: obj.w * scale, height: obj.h * scale, prio: 2 });
}

// Just a quick attempt. Use reference instead: https://www.coranac.com/tonc/text/mode7.htm
export function *main() {
	const lineTransform = new vdp.LineTransformationArray();
	let loop = 0;

	while (true) {
		const viewerPos = [512, 372];
		const viewerAngle = loop * 0.01;

		const transformations = [];
		for (let line = 0; line < vdp.screenHeight + 64; line++) {
			const scale = scaleAtLine(line);
			const mat = mat3.create();
			mat3.translate(mat, mat, viewerPos);
			mat3.rotate(mat, mat, viewerAngle);
			mat3.scale(mat, mat, [scale, scale]);
			mat3.translate(mat, mat, [-128, -256]);
			transformations.push(mat);
		}

		for (let i = 0; i < lineTransform.length; i++) {
			lineTransform.setLine(i, transformations[i]);
		}

		vdp.drawBackgroundTilemap('road', { lineTransform, winY: 0, wrap: true});
		drawSprite(vdp, transformations, 512, 351, vdp.sprite('mario').tile(6));
		drawSprite(vdp, transformations, 550, 400, vdp.sprite('level1').tile(11));

		loop += 1;
		yield;
	}
}
