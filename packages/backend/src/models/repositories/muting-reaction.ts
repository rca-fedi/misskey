import { db } from '@/db/postgre.js';
import { Users } from '../index.js';
import { MutingReaction } from '@/models/entities/muting-reaction.js';
import { awaitAll } from '@/prelude/await-all.js';
import { Packed } from '@/misc/schema.js';
import { User } from '@/models/entities/user.js';

export const MutingReactionRepository = db.getRepository(MutingReaction).extend({
	async pack(
		src: MutingReaction['id'] | MutingReaction,
		me?: { id: User['id'] } | null | undefined
	): Promise<Packed<'Muting'>> {
		const mutingReaction = typeof src === 'object' ? src : await this.findOneByOrFail({ id: src });

		return await awaitAll({
			id: mutingReaction.id,
			createdAt: mutingReaction.createdAt.toISOString(),
			expiresAt: mutingReaction.expiresAt ? mutingReaction.expiresAt.toISOString() : null,
			muteeId: mutingReaction.muteeId,
			mutee: Users.pack(mutingReaction.muteeId, me, {
				detail: true,
			}),
		});
	},

	packMany(
		mutings: any[],
		me: { id: User['id'] }
	) {
		return Promise.all(mutings.map(x => this.pack(x, me)));
	},
});
