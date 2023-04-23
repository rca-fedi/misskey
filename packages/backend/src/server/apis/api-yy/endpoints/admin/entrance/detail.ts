import { Entrances } from '@/models/index.js';
import define from '../../../define.js';
import { ApiError } from '../../../error.js';
import { Entrance } from '@/models/entities/entrance.js';

export const meta = {
	tags: ['admin'],

	requireCredential: true,
	requireAdmin: true,

	errors: {
		themeNotFound: {
			message: 'Theme not found.',
			code: 'THEME_NOT_FOUND',
			id: '2116a3c0-ae41-44c5-9904-425cedbd7c2a', //TODO: UUID流用してるので変える
		},
	},
} as const;
export const paramDef = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
		},
	},
	required: ['id'],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async (ps) => {
	const theme = await Entrances.createQueryBuilder('entrance')
		.select('*')
		.getRawOne();

	return await theme;
});
