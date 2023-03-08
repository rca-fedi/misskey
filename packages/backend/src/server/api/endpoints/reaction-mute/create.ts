import define from '../../define.js';
import { ApiError } from '../../error.js';
import { getUser } from '../../common/getters.js';
import { genId } from '@/misc/gen-id.js';
import { MutingsReaction, NoteWatchings } from '@/models/index.js';
import { Muting } from '@/models/entities/muting.js';
import { publishUserEvent } from '@/services/stream.js';

export const meta = {
	tags: ['account'],

	requireCredential: true,

	kind: 'write:mutes',

	errors: {
		noSuchUser: {
			message: 'No such user.',
			code: 'NO_SUCH_USER',
			id: 'a0d20de1-5d32-41af-b7f4-3665fffc7d57',
		},

		muteeIsYourself: {
			message: 'Mutee is yourself.',
			code: 'MUTEE_IS_YOURSELF',
			id: 'a4619cb2-5f23-484b-9301-94c903074e10',
		},

		alreadyMuting: {
			message: 'You are already muting that user.',
			code: 'ALREADY_MUTING',
			id: 'f2648c0e-b9c8-46ca-ac3b-6f83bc060f1c',
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		userId: { type: 'string', format: 'misskey:id' },
		expiresAt: {
			type: 'integer',
			nullable: true,
			description: 'A Unix Epoch timestamp that must lie in the future. `null` means an indefinite mute.',
		},
	},
	required: ['userId'],
} as const;

// eslint-disable-next-line import/no-default-export
export default define(meta, paramDef, async (ps, user) => {
	const muter = user;

	// 自分自身
	if (user.id === ps.userId) {
		throw new ApiError(meta.errors.muteeIsYourself);
	}

	// Get mutee
	const mutee = await getUser(ps.userId).catch(e => {
		if (e.id === '15348ddd-432d-49c2-8a5a-8069753becff') throw new ApiError(meta.errors.noSuchUser);
		throw e;
	});

	// Check if already muting
	const exist = await MutingsReaction.findOneBy({
		muterId: muter.id,
		muteeId: mutee.id,
	});

	if (exist != null) {
		throw new ApiError(meta.errors.alreadyMuting);
	}

	if (ps.expiresAt && ps.expiresAt <= Date.now()) {
		return;
	}

	// Create mute
	await MutingsReaction.insert({
		id: genId(),
		createdAt: new Date(),
		expiresAt: ps.expiresAt ? new Date(ps.expiresAt) : null,
		muterId: muter.id,
		muteeId: mutee.id,
	} as Muting);

	publishUserEvent(user.id, 'mute', mutee);

	NoteWatchings.delete({
		userId: muter.id,
		noteUserId: mutee.id,
	});
});
