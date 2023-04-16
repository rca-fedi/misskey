import { apiUrl } from '@/config';
import { defaultStore } from '@/store';
import { reactive, ref } from 'vue';
import * as Misskey from '@r-ca/yoiyami-js';

type PostWaiting = {
	id: string;
	// progressMax: number | undefined; //いつかつくるかも
	// progressValue: number | undefined;
};

export const postQueue = ref<PostWaiting[]>([]);

export function addPostQueue(postData: any, token: any) { //は？
	const id = Math.random().toString();

	const queue = reactive<PostWaiting>({
		id: id,
		// progressMax: undefined,
		// progressValue: undefined,
	});

	postQueue.value.push(queue);

	console.log('QUEUE Created!: ' + id);

	return id;
}
