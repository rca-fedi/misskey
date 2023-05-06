import config from '@/config/index.js';
import { User } from '@/models/entities/user.js';
import { MessagingMessage } from '@/models/entities/messaging-message.js';

export const renderReadActivity = (user: { id: User['id'] }, message: MessagingMessage) => ({
	type: 'Read',
	actor: `${config.main.url}/users/${user.id}`,
	object: message.uri,
});
