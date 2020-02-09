import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

// You can play with that for the perspective. Basically the highest the line number, the lower on the screen, and the
// highest the scaling, to give the impression that it's closer to the viewer.
function scaleAtLine(line) { return 100 / (line + 50); }

// Just a quick attempt. Use reference instead: https://www.coranac.com/tonc/text/mode7.htm
export function *main() {
	const lineTransform = new vdp.LineTransformationArray();
	const viewerPos = { x: 512, y: 0 };
	let viewerAngle = 0;

	while (true) {
		for (let line = 0; line < vdp.screenHeight; line++) {
			const scale = scaleAtLine(line);
			// The order of operations here is important. First we center around the viewer by translating.
			lineTransform.resetLine(line);
			lineTransform.translateLine(line, [viewerPos.x, viewerPos.y]);
			// Then we can rotate (rotation is done around the origin, which is now the viewer's position).
			lineTransform.rotateLine(line, viewerAngle);
			// Scale at the factor computed for this line
			lineTransform.scaleLine(line, [scale, scale]);
			// Then move back around the final rotation center in screen space (middle-bottom of the screen)
			lineTransform.translateLine(line, [-vdp.screenWidth / 2, -vdp.screenHeight]);
		}

		// Change just the angle using the keys
		if (input.isDown(input.Key.Left)) viewerAngle -= 0.01;
		if (input.isDown(input.Key.Right)) viewerAngle += 0.01;
		// Then up/down move the viewer at the specified angle (trigonometry)
		if (input.isDown(input.Key.Up)) {
			viewerPos.x += Math.cos(viewerAngle - Math.PI / 2);
			viewerPos.y += Math.sin(viewerAngle - Math.PI / 2);
		}
		if (input.isDown(input.Key.Down)) {
			viewerPos.x += Math.cos(viewerAngle + Math.PI / 2);
			viewerPos.y += Math.sin(viewerAngle + Math.PI / 2);
		}

		vdp.drawBackgroundTilemap('tmx', { lineTransform, wrap: true});
		yield;
	}
}
