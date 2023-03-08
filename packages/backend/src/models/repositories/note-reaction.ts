import { db } from '@/db/postgre.js';
import { NoteReaction } from '@/models/entities/note-reaction.js';
import { Notes, Users, MutingsReaction } from '../index.js';
import { Packed } from '@/misc/schema.js';
import { awaitAll } from '@/prelude/await-all.js';
import { convertLegacyReaction } from '@/misc/reaction-lib.js';
import { User } from '@/models/entities/user.js';
import { MutingReaction } from '../entities/muting-reaction.js';
import Logger from '@/services/logger.js';

const logger = new Logger('core', 'cyan');

async function hideReaction(packedReaction: Packed<'NoteReaction'>, meId: User['id'] | null) {
	let hide = false;

	// if (packedReaction.user.id === meId) { // 自分のリアクション（そもそもミュート対象になることないはずだけど）
	// 	hide = false;
	// }

	const mutings = await MutingsReaction.findBy({
		muterId: meId,
	});
	
	if (mutings.map(m => m.muteeId).includes(packedReaction.user.id)) { // ミュートリストを確認してる気がする
		hide = true;
	}

	if (hide) {
		logger.debug('hide is true!');
	}
	else {
		logger.debug('hide is false!');
	}
}


export const NoteReactionRepository = db.getRepository(NoteReaction).extend({

	async pack(
		src: NoteReaction['id'] | NoteReaction,
		me?: { id: User['id'] } | null | undefined,
		options?: {
			withNote: boolean;
		},
	): Promise<Packed<'NoteReaction'>> {
		const opts = Object.assign({
			withNote: false,
		}, options);

		const meId = me ? me.id : null;

		const reaction = typeof src === 'object' ? src : await this.findOneByOrFail({ id: src });

		const packed = await awaitAll({
			id: reaction.id,
			createdAt: reaction.createdAt.toISOString(),
			user: await Users.pack(reaction.user ?? reaction.userId, me),
			type: convertLegacyReaction(reaction.reaction),
			...(opts.withNote ? {
				note: await Notes.pack(reaction.note ?? reaction.noteId, me),
			} : {}),
		});

		await hideReaction(packed, meId);

		return packed;
	},
});
