const mat3 = vdp.mat3, input = vdp.input;

// You can play with that for the perspective. Basically the highest the line number, the lower on the screen, and the
// highest the scaling, to give the impression that it's closer to the viewer.
function scaleAtLine(line) { return 100 / (line + 50); }

// Just a quick attempt. Use reference instead: https://www.coranac.com/tonc/text/mode7.htm
function *main() {
	const lineTransform = new vdp.LineTransformationArray();
	const viewerPos = { x: 512, y: 0 };
	let viewerAngle = 0;

	while (true) {
		for (let line = 0; line < vdp.screenHeight; line++) {
			const scale = scaleAtLine(line);
			const mat = mat3.create();
			// The order of operations here is important. First we center around the viewer by translating.
			mat3.translate(mat, mat, [viewerPos.x, viewerPos.y]);
			// Then we can rotate (rotation is done around the origin, which is now the viewer's position).
			mat3.rotate(mat, mat, viewerAngle);
			// Scale at the factor computed for this line
			mat3.scale(mat, mat, [scale, scale]);
			// Then move back around the final rotation center in screen space (middle-bottom of the screen)
			mat3.translate(mat, mat, [-vdp.screenWidth / 2, -vdp.screenHeight + line]);
			lineTransform.setLine(line, mat);
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
