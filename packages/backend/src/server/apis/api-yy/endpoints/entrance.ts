import { Entrances } from '@/models/index.js';
import define from '../define.js';
import { ApiError } from '../error.js';
import { Entrance } from './entities/entrance.js';

export const meta = { // TODO: デバイス情報受け取って適切なテーマを返せるようにする
	requireCredential: false,

	tags: ['entrance'],

	errors: {
		themeNotFound: {
			message: 'Theme not found.',
			code: 'THEME_NOT_FOUND',
			id: '2116a3c0-ae41-44c5-9904-425cedbd7c2a',
		},
	},

	res: {
		type: 'object',
		optional: false, nullable: false,
		properties: {
			name: {
				type: 'string',
				optional: false, nullable: false,
				example: 'xxxxxxxxxx',
			},
			backgroundUrl: {
				type: 'string',
				optional: false, nullable: false,
				example: 'xxxxxxxxxx',
			},
			registerWindowMarginRight: {
				type: 'string',
				optional: false, nullable: false,
				example: 'xxxxxxxxxx',
			},
			registerWindowMarginBottom: {
				type: 'string',
				optional: false, nullable: false,
				example: 'xxxxxxxxxx',
			},
			registerWindowMarginLeft: {
				type: 'string',
				optional: false, nullable: false,
				example: 'xxxxxxxxxx',
			},
			registerWindowMarginTop: {
				type: 'string',
				optional: false, nullable: false,
				example: 'xxxxxxxxxx',
			},
			registerWindowType: {
				type: 'integer',
				optional: false, nullable: false,
				example: 'xxxxxxxxxx',
			},
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {},
	required: [],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async () => {
	const theme = Entrances.createQueryBuilder('entrance') //ランダムに1行抽出してくれてる...はず...
		.select('*')
		.orderBy('RANDOM()')
		.getRawOne();

	return await theme;
});
