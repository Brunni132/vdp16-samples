import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

export function *main() {
	while (true) {
		let loop = 0, waveForce = 0, wavePeriod = 14, fadeFactor = 255;

		while (fadeFactor < 256) {
			// Fade out when the force is too big, else fade back in
			if (waveForce >= 10) {
				fadeFactor += 1;
			} else if (fadeFactor > 0) {
				fadeFactor -= 8;
			}
			vdp.configFade({ color:'#000', factor: fadeFactor });

			// Increase the wave force periodically
			waveForce += 0.01;
			wavePeriod -= 0.002;

			const transformationArray = new vdp.LineTransformationArray();
			for (let line = 0; line < vdp.screenHeight; line++) {
				const horizOffset = Math.sin((line + loop) / wavePeriod);
				transformationArray.translateLine(line, [horizOffset * waveForce, 0]);
			}

			vdp.drawBackgroundTilemap('level2', { scrollX: 700, lineTransform: transformationArray });
			loop += 1;
			yield;
		}
	}
}
