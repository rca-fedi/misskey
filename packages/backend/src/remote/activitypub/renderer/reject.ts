import config from '@/config/index.js';
import { User } from '@/models/entities/user.js';

export default (object: any, user: { id: User['id'] }) => ({
	type: 'Reject',
	actor: `${config.main.url}/users/${user.id}`,
	object,
});
