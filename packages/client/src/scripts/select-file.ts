import { ref } from 'vue';
import { DriveFile } from '@r-ca/yoiyami-js/built/entities';
import * as os from '@/os';
import { stream } from '@/stream';
import { i18n } from '@/i18n';
import { defaultStore } from '@/store';
import { uploadFile } from '@/scripts/upload';

function select(src: any, label: string | null, multiple: boolean, files?: any): Promise<DriveFile | DriveFile[]> {
	return new Promise((res, rej) => {
		const keepOriginal = ref(defaultStore.state.keepOriginalUploading);

		const chooseFileFromPc = () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.multiple = multiple;
			input.onchange = () => {
				let promises;
				if (files !== undefined) { // filesがundefinedなときはPostFormから呼び出されてないのでPlaceHolderを作る必要もIDを事前指定する必要もない
					promises = Array.from(input.files).map(file => uploadFile(file, defaultStore.state.uploadFolder, undefined, keepOriginal.value, createPlaceHolder(files)));
				}
				else {
					promises = Array.from(input.files).map(file => uploadFile(file, defaultStore.state.uploadFolder, undefined, keepOriginal.value));
				}
				
				Promise.all(promises).then(driveFiles => {
					res(multiple ? driveFiles : driveFiles[0]);
				}).catch(err => {
					// アップロードのエラーは uploadFile 内でハンドリングされているためアラートダイアログを出したりはしてはいけない
				});

				// 一応廃棄
				(window as any).__misskey_input_ref__ = null;
			};

			// https://qiita.com/fukasawah/items/b9dc732d95d99551013d
			// iOS Safari で正常に動かす為のおまじない
			(window as any).__misskey_input_ref__ = input;

			input.click();
		};

		const chooseFileFromDrive = () => {
			os.selectDriveFile(multiple).then(files => {
				res(files);
			});
		};

		const chooseFileFromUrl = () => {
			os.inputText({
				title: i18n.ts.uploadFromUrl,
				type: 'url',
				placeholder: i18n.ts.uploadFromUrlDescription,
			}).then(({ canceled, result: url }) => {
				if (canceled) return;

				const marker = Math.random().toString(); // TODO: UUIDとか使う

				const connection = stream.useChannel('main');
				connection.on('urlUploadFinished', urlResponse => {
					if (urlResponse.marker === marker) {
						res(multiple ? [urlResponse.file] : urlResponse.file);
						connection.dispose();
					}
				});

				os.api('drive/files/upload-from-url', {
					url: url,
					folderId: defaultStore.state.uploadFolder,
					marker,
				});

				os.alert({
					title: i18n.ts.uploadFromUrlRequested,
					text: i18n.ts.uploadFromUrlMayTakeTime,
				});
			});
		};

		os.popupMenu([label ? {
			text: label,
			type: 'label',
		} : undefined, {
			type: 'switch',
			text: i18n.ts.keepOriginalUploading,
			ref: keepOriginal,
		}, {
			text: i18n.ts.upload,
			icon: 'fas fa-upload',
			action: chooseFileFromPc,
		}, {
			text: i18n.ts.fromDrive,
			icon: 'fas fa-cloud',
			action: chooseFileFromDrive,
		}, {
			text: i18n.ts.fromUrl,
			icon: 'fas fa-link',
			action: chooseFileFromUrl,
		}], src);
	});
}

export function selectFile(src: any, label: string | null = null, files?: any): Promise<DriveFile> {
	return select(src, label, false, files) as Promise<DriveFile>;
}

export function selectFiles(src: any, label: string | null = null, files?: any): Promise<DriveFile[]> {
	return select(src, label, true, files) as Promise<DriveFile[]>;
}

// UploadId生成して、それをファイルIDとして持ったPlaceHolderつくってからそのUploadIdを返すやつ
function createPlaceHolder(files): string {
	const uploadId = Math.random().toString();
	files.push({
		id: uploadId,
		name: 'Uploading...',
		type: 'placeholder',
		isSensitive: false,
		createdAt: '',
		thumbnailUrl: '',
		url: '',
		size: 0,
		md5: '',
		blurhash: '',
		properties: {},
	});

	return uploadId;
}
