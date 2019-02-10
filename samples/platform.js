const color = vdp.color;
const GRAVITY = 0.4;
const TILE_SIZE = 16;
const SHINING_BLOCK_COLORS = [color.make('#f93'), color.make('#f93'), color.make('#c50'), color.make('#810'), color.make('#810'), color.make('#c50')];

class Camera {
	constructor() {
		this.x = 0;
	}

	update(mario) {
		if (mario.left - this.x >= 108) {
			// The camera better had no floating part, as this could introduce "shaking" when computing the sprite positions
			this.x = Math.floor(mario.left - 108);
		}
	}
}

class Mario {
	constructor() {
		this.left = 64;
		this.top = 160;
		this.width = 16;
		this.height = 15;
		this.velocityX = 0;
		this.velocityY = 0;
		this.direction = 'right';
		// tileNo refer to the tile number in the image of the tileset Mario (image number from the left), see packer-main.js
		this.animations = {
			'standing': [{tileNo: 6, untilFrame: Infinity}],
			'walking': [{tileNo: 0, untilFrame: 8}, {tileNo: 1, untilFrame: 16}, {tileNo: 2, untilFrame: 24}],
			'running': [{tileNo: 0, untilFrame: 4}, {tileNo: 1, untilFrame: 8}, {tileNo: 2, untilFrame: 12}],
			'turning': [{tileNo: 3, untilFrame: Infinity}],
			'jumping': [{tileNo: 4, untilFrame: Infinity}],
		};
		this.currentAnimation = this.animations['standing'];
		this.currentAnimationDuration = 0;
		// Constants
		this.accelerationX = 0.2;
		this.decelerationX = 0.95;
		this.maxVelocityX = 2;
		this.maxVelocityWhenRunningX = 3;
		this.jumpImpulse = -4;
	}

	// Draw the Mario sprite as an object for one frame
	draw(vdp) {
		const tileNo = this._getMarioTileFromAnimation();
		const sprite = vdp.sprite('mario').tile(tileNo);
		const needsFlip = this.direction === 'left';
		vdp.drawObject(sprite, Math.floor(this.left - camera.x), this.top, { flipH: needsFlip });
	}

	get right() { return this.left + this.width; }

	get bottom() { return this.top + this.height; }

	// Integrate the physics for one frame and handle controls
	update(input) {
		// Gravity is constantly affecting the vertical velocity (acceleration)
		this.velocityY += GRAVITY;

		// Pressing A accelerates the character
		const maxVelocity = input.isDown(input.Key.A) ? this.maxVelocityWhenRunningX : this.maxVelocityX;
		let padDirection = 0;

		// Pressing the key affects the lateral (X) velocity
		if (input.isDown(input.Key.Right)) padDirection = 1;
		else if (input.isDown(input.Key.Left)) padDirection = -1;
		else {
			// If nothing is pressed, brake
			this.velocityX *= this.decelerationX;
			if (Math.abs(this.velocityX) < 0.8) this.velocityX = 0;
		}

		// padDirection is 1 for right, -1 for left, or 0 if nothing is pressed. Use as a multiplier for direction.
		this.velocityX += this.accelerationX * padDirection;
		// Make sure these stay in range
		if (this.velocityX >= maxVelocity) this.velocityX = maxVelocity;
		if (this.velocityX <= -maxVelocity) this.velocityX = -maxVelocity;
		// Keep track of the direction for flipping the sprite
		if (this.velocityX > this.accelerationX && this._isGrounded()) this.direction = 'right';
		if (this.velocityX < -this.accelerationX && this._isGrounded()) this.direction = 'left';

		// Determine the animation step (these are overriden in special cases below)
		if (this._isGrounded()) {
			if (padDirection !== 0 && padDirection !== Math.sign(this.velocityX)) {
				this._setAnimation('turning');
			} else if (Math.abs(this.velocityX) > this.maxVelocityX) {
				this._setAnimation('running');
			} else if (Math.abs(this.velocityX) >= 1) {
				this._setAnimation('walking');
			} else {
				this._setAnimation('standing');
			}
		}

		// Jump: just give an inpulse (can only be done if we're resting on the ground)
		if (input.hasToggledDown(input.Key.B) && this._isGrounded()) {
			this.velocityY = this.jumpImpulse - Math.abs(this.velocityX / 4);
			this._setAnimation('jumping');
		}
		else if (input.isDown(input.Key.B) && this.velocityY < 0) {
			// Can extend the jump by leaving the button pressed
			this.velocityY -= GRAVITY * 0.6;
		}

		// Integrate the velocity to the position
		let moveH = this.velocityX, moveV = this.velocityY;
		while (Math.abs(moveH) >= 0.001 || Math.abs(moveV) >= 0.001) {
			// Move a max of one unit horizontally and vertically each time.
			// Original games didn't do that because it's inefficient, but it saves a lot of headache.
			const unitH = Math.min(1, Math.abs(moveH)) * Math.sign(moveH);
			const unitV = Math.min(1, Math.abs(moveV)) * Math.sign(moveV);
			moveH -= unitH;
			moveV -= unitV;
			this.top += unitV;
			this._checkCollisionsVertical();
			this.left += unitH;
			this._checkCollisionsLateral();
		}

		// Do not allow going off the camera
		this.left = Math.max(this.left, camera.x);

		// For animations
		this.currentAnimationDuration += 1;
	}

	_checkCollisionsLateral() {
		// Left (check at bottom and top)
		if (this._collidesAt(this.left, this.top) || this._collidesAt(this.left, this.bottom)) {
			this.left += 1;
			this.velocityX = 0;
		}

		if (this._collidesAt(this.right, this.top) || this._collidesAt(this.right, this.bottom)) {
			this.left -= 1;
			this.velocityX = 0;
		}
	}

	_checkCollisionsVertical() {
		if (this._collidesAt(this.left, this.top) || this._collidesAt(this.right, this.top)) {
			this.top += 1;
			this.velocityY = 0;
		}

		if (this._collidesAt(this.left, this.bottom) || this._collidesAt(this.right, this.bottom)) {
			this.top -= 1;
			this.velocityY = 0;
		}
	}

	_collidesAt(x, y) {
		return this._isSolidBlock(this._mapBlockAtPosition(x, y));
	}

	_getMarioTileFromAnimation() {
		const animTotalDuration = this.currentAnimation[this.currentAnimation.length - 1].untilFrame;
		const currentMarioFrameInLoop = this.currentAnimationDuration % animTotalDuration;
		const animStep = this.currentAnimation.find(animStep => currentMarioFrameInLoop < animStep.untilFrame);
		return animStep.tileNo;
	}

	_isGrounded() {
		// We're on the ground if there's something one pixel below us
		return this._collidesAt(this.left, this.bottom + 2) || this._collidesAt(this.right, this.bottom + 2);
	}

	_isSolidBlock(block) {
		return [38, 11, 12, 18, 19, 24, 25, 16, 13].indexOf(block) >= 0;
	}

	_mapBlockAtPosition(x, y) {
		return mapData.getElement(x / TILE_SIZE, y / TILE_SIZE);
	}

	_setAnimation(animationName) {
		if (this.currentAnimation === this.animations[animationName]) return;
		// Reset the animation counters when the animation changes
		this.currentAnimation = this.animations[animationName];
		this.currentAnimationDuration = 0;
	}
}

class TextLayer {
	constructor() {
		// Make it smaller, we don't need the full screen since it's only for the small window at the bottom
		this.mapDef = vdp.map('text2').offsetted(0, 0, 43, 12);
		this.map = vdp.readMap(this.mapDef, vdp.CopySource.blank);
	}
	drawText(x, y, text) {
		for (let i = 0; i < text.length; i++) this.map.setElement(x + i, y, text.charCodeAt(i) - 32);
		vdp.writeMap(this.mapDef, this.map);
	}
	draw(verticalOffset) {
		// The map is 32x12 and is scrolled vertically, automatically wrapped, repeating the text pattern
		vdp.drawBackgroundTilemap(this.mapDef, { scrollY: verticalOffset, winY: 224, wrap: true });
	}
}

function animateLevel1(vdp) {
	// Rotate the shining block color from the choices above, every 12 frames
	const colorIndex = Math.floor(frameNo / 12) % SHINING_BLOCK_COLORS.length;
	const pal = vdp.readPalette('level1');
	pal.array[8] = SHINING_BLOCK_COLORS[colorIndex];
	vdp.writePalette('level1', pal);
}

let camera = new Camera();
let mapData;
let frameNo = 0;

function *main() {
	const textLayer = new TextLayer();
	const mario = new Mario();

	vdp.configBackdropColor('#59f');
	mapData = vdp.readMap('level1');
	textLayer.drawText(6, 8, 'BASIC PLATFORMER DEMO');
	textLayer.drawText(0, 10, 'Use arrow keys (or WASD) to move and C to  run, V to jump (or J/K).');

	while (true) {
		mario.update(vdp.input);
		camera.update(mario);

		vdp.drawBackgroundTilemap('level1', { scrollX: camera.x, wrap: false, winH: 224 });
		textLayer.draw(frameNo / 10);
		mario.draw(vdp);

		animateLevel1(vdp);
		frameNo += 1;
		yield;
	}
}
