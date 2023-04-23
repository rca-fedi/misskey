import { Entrances } from '@/models/index.js';
import define from '../../../define.js';
import { ApiError } from '../../../error.js';
import { Entrance } from '@/models/entities/entrance.js';

// TODO: 他のエンドポイントに習ってshowとかにするべきかも

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
	properties: {},
	required: [],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async (ps) => {
	const list = Entrances.createQueryBuilder('entrance')
		.select('entrance.id, entrance.name')
		.getRawMany();

	return await list;
});
