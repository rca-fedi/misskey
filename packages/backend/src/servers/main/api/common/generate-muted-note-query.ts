import { SelectQueryBuilder } from 'typeorm';
import { User } from '@/models/entities/user.js';
import { MutedNotes } from '@/models/index.js';

export function generateMutedNoteQuery(q: SelectQueryBuilder<any>, me: { id: User['id'] }): void {
	const mutedQuery = MutedNotes.createQueryBuilder('muted')
		.select('muted.noteId')
		.where('muted.userId = :userId', { userId: me.id });

	q.andWhere(`note.id NOT IN (${ mutedQuery.getQuery() })`);

	q.setParameters(mutedQuery.getParameters());
}
