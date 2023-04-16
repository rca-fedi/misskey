import { apiUrl } from '@/config';
import { defaultStore } from '@/store';
import { reactive, ref } from 'vue';
import * as Misskey from '@r-ca/yoiyami-js';
import * as os from '@/os';

type PostWaiting = {
	id: string;
	postData: any;
	token: any;
};

export const postQueues = ref<PostWaiting[]>([]);

export function addPostQueue(postData: any, token: any): void {
	const id = Math.random().toString();

	const queue = reactive<PostWaiting>({
		id: id,
		postData: postData,
		token: token,
	});

	postQueues.value.push(queue);

	console.log('QUEUE Created!: ' + id);
}

export function checkQueue(id: string, driveFileId: string): void { //upload.tsで投稿完了するたびに呼んでもらう(あんまり効率よくない気がするけど、そんな頻繁にアップロードされるわけでもないはずなので)
	console.log('Uploaded(QueueID): ' + id);
	console.log('Uploaded(FileID): ' + driveFileId);
	for ( const i in postQueues.value ) {
		console.log('Checking: ' + postQueues.value[i].id);

		const postData = postQueues.value[i].postData;
		console.log("POSTDATA:" + postData.text);
		console.log("POSTDATA:" + postData.fileIds);
		
		for ( const j in postData.fileIds ) { //みつけたら置き換える(もっと効率的に探すべきかも？)
			if (postData.fileIds[j] === id) {
				console.log('Found: ' + id);
				postQueues.value[i].postData.fileIds[j] = driveFileId;
			}
		}
		if (!postData.fileIds.some((fileId: string) => fileId.startsWith("0."))) { 
			console.log('All files uploaded. Posting...');
			post(postQueues.value[i].id, postQueues.value[i].postData, postQueues.value[i].token);
		}
	}
}

async function post(id, postData, token): Promise<void> {
	console.log('POSTING...');
	os.api('notes/create', postData, token).then((res) => {
		console.log('POSTED!');
	}).catch((err) => {
		console.log('POST FAILED!');
		console.log(err);
	});

	postQueues.value = postQueues.value.filter(x => x.id !== id);
}
