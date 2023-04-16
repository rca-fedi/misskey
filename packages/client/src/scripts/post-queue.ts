import { apiUrl } from '@/config';
import { defaultStore } from '@/store';
import { reactive, ref } from 'vue';
import { uploads } from '@/scripts/upload';
import { alert } from '@/os';
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
}

export function checkQueue(id: string, driveFileId: string): void { //upload.tsで投稿完了するたびに呼んでもらう(あんまり効率よくない気がするけど、そんな頻繁にアップロードされるわけでもないはずなので)
	for ( const i in postQueues.value ) {
		const postData = postQueues.value[i].postData;
		for ( const j in postData.fileIds ) { //みつけたら置き換える(もっと効率的に探すべきかも？)
			if (postData.fileIds[j] === id) {
				postQueues.value[i].postData.fileIds[j] = driveFileId;
			}
		}
		if (!postData.fileIds.some((fileId: string) => fileId.startsWith("0."))) {
			post(postQueues.value[i].id, postQueues.value[i].postData, postQueues.value[i].token);
		}
	}
	//ここで書くべきじゃないかも
	//すべてのアップロードキューが完了しても投稿キューが残っている場合は必要なファイルがアップロードされなかったと判断して投稿キューを削除する
	if (uploads.value.length === 0) {
		postQueues.value.length = 0;
		alert({
			type: 'error',
			title: 'Post failed',
			text: 'All files uploaded, but post queue is not empty. \n Maybe some files are failed to upload.',
		});
	}
}

async function post(id, postData, token): Promise<void> {
	os.api('notes/create', postData, token).then((res) => {
	}).catch((err) => {
	});
	postQueues.value = postQueues.value.filter(x => x.id !== id);
}

export function uploadFailed(uploadId): void {
	for ( const i in postQueues.value ) {
		const postData = postQueues.value[i].postData;
		if (postData.fileIds.some((fileId: string) => fileId.startsWith(uploadId))) { //失敗したUploadIDを含む投稿キューがあれば削除する 
			postQueues.value = postQueues.value.filter(x => x.id !== postQueues.value[i].id);
			alert({
				type: 'error',
				title: 'Post failed',
				text: 'Some files are failed to upload. \n Post queue is deleted.',
			});
		}
	}
}
