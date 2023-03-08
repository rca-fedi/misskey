import define from '../../define.js';
import { ApiError } from '../../error.js';
import { getUser } from '../../common/getters.js';
import { MutingsReaction } from '@/models/index.js';
import { publishUserEvent } from '@/services/stream.js';

export const meta = {
	tags: ['account'],

	requireCredential: true,

	kind: 'write:mutes',

	errors: {
		noSuchUser: {
			message: 'No such user.',
			code: 'NO_SUCH_USER',
			id: 'ebf411f9-1e8d-41d9-8478-c63879e5660a',
		},

		muteeIsYourself: {
			message: 'Mutee is yourself.',
			code: 'MUTEE_IS_YOURSELF',
			id: '2441309e-25cc-4899-ad2d-ab9d4dd92c94',
		},

		notMuting: {
			message: 'You are not muting that user.',
			code: 'NOT_MUTING',
			id: '4c0db20d-d5df-457a-bcad-a34ac1d7adb4',
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		userId: { type: 'string', format: 'misskey:id' },
	},
	required: ['userId'],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async (ps, user) => {
	const muter = user;

	// Check if the mutee is yourself
	if (user.id === ps.userId) {
		throw new ApiError(meta.errors.muteeIsYourself);
	}

	// Get mutee
	const mutee = await getUser(ps.userId).catch(e => {
		if (e.id === '15348ddd-432d-49c2-8a5a-8069753becff') throw new ApiError(meta.errors.noSuchUser);
		throw e;
	});

	// Check not muting
	const exist = await MutingsReaction.findOneBy({
		muterId: muter.id,
		muteeId: mutee.id,
	});

	if (exist == null) {
		throw new ApiError(meta.errors.notMuting);
	}

	// Delete mute
	await MutingsReaction.delete({
		id: exist.id,
	});

	publishUserEvent(user.id, 'unmute', mutee);
});
