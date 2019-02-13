const { addColors, blank, config, image,map,multiPalette,palette,sprite,tileset, readTmx,tiledMap, global } = require('../tools/gfxConverter/dsl.js');

const SCREEN_WIDTH = 256, SCREEN_HEIGHT = 256;

// Set debug: true (recommended) to generate a sample.png file that shows the layout of the video memory
config({ compact: true, debug: true }, () => {
	palette('gradient', () => {
		sprite('gradient', image('gradient.png'));
	});

	palette('mario', () => {
		tileset('mario', image('mario-luigi-2.png').rect(80, 32, 224, 16), 16, 16);
	});

	palette('level1', () => {
		tiledMap('level1', 'mario-1-1', { tileWidth: 16, tileHeight: 16, tilesetWidth: 16, tilesetHeight: 16 });
	});

	multiPalette('tmx', image('testTmx-pal.png'), () => {
		tiledMap('tmx', 'testTmx', { tileWidth: 8, tileHeight: 8, tilesetWidth: 160, tilesetHeight: 32 });
	});

	palette('text', () => {
		tileset('text', 'font.png', 8, 8, () => {
			map('text', blank(SCREEN_WIDTH / 8, SCREEN_HEIGHT / 8));
		});
	});

	palette('text2', () => {
		tileset('text2', 'defaultFont.png', 8, 8, () => {
			map('text2', blank(Math.ceil(SCREEN_WIDTH / 8), Math.ceil(SCREEN_HEIGHT / 8)));
		});
	});

	palette('text3', () => {
		tileset('text3', 'defaultFont6x8.png', 6, 8, () => {
			map('text3', blank(Math.ceil(SCREEN_WIDTH / 6), Math.ceil(SCREEN_HEIGHT / 8)));
		});
	});

	palette('road', () => {
		tiledMap('road', 'road', { tolerance: 200, tileWidth: 16, tileHeight: 16, tilesetWidth: 32, tilesetHeight: 32 });
	});

	palette('level2', () => {
		tiledMap('level2', 'level2', { tileWidth: 16, tileHeight: 16, tilesetWidth: 32, tilesetHeight: 32 });
	});

	palette('sonic1-bg', () => {
		tiledMap('sonic1-bg', 'sonic1-bg', { tileWidth: 8, tileHeight: 8, tilesetWidth: 64, tilesetHeight: 32 }, map => {
			// Make the bottom use another palette, which we'll make rotate
			for (let i = 112/8; i < map.height; i++)
				for (let x = 0; x < map.width; x++)
					map.setTile(x, i, map.getTile(x, i) | 1 << 13);
		});
	});

	// Copy of the previous palette
	palette('sonic1-bg-rotating', () => {
		addColors(global.paletteNamed['sonic1-bg'].colorRows[0].slice(1));
	});

	palette('mask-bg', () => {
		tileset('mask-bg', blank(1, 1), 8, 1, () => {
			map('mask-bg', 'mask-bg.png');
		});
	});

	palette('vdp-logo', () => {
		tiledMap('vdp-logo', 'vdp-logo', { tileWidth: 2, tileHeight: 2, tilesetWidth: 8, tilesetHeight: 128 });
		tiledMap('vdp-logo-2', 'vdp-logo-2', { tileWidth: 8, tileHeight: 8, tilesetWidth: 4, tilesetHeight: 32 });
	});
});
