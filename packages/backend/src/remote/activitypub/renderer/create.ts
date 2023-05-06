import config from '@/config/index.js';
import { Note } from '@/models/entities/note.js';

export default (object: any, note: Note) => {
	const activity = {
		id: `${config.main.url}/notes/${note.id}/activity`,
		actor: `${config.main.url}/users/${note.userId}`,
		type: 'Create',
		published: note.createdAt.toISOString(),
		object,
	} as any;

	if (object.to) activity.to = object.to;
	if (object.cc) activity.cc = object.cc;

	return activity;
};
