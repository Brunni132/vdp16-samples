// This line is for auto-completion support in some IDEs (VS Code notably)
import {vdp, input, color, vec2, mat3} from "../lib/vdp-lib";

export function *main() {
	let yPos = 0;

	while (true) {
		vdp.drawObject(vdp.sprite('mario').tile(0), 0, yPos);
		yPos = yPos + 1;
		yield;
	}
}
