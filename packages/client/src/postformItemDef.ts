import { computed, ref, reactive } from 'vue';
import { $i } from './account';
import { search } from '@/scripts/search';
import * as os from '@/os';
import { i18n } from '@/i18n';
import { ui } from '@/config';
import { unisonReload } from '@/scripts/unison-reload';


export const postFormItemDef = reactive({
	uploadFile: {
		tooltip: i18n.ts.attachFile,
		icon: 'fas fa-photo-video',
		click: 'chooseFileFrom',
		class: ''
	},
	poll: {
		tooltip: i18n.ts.poll,
		icon: 'fas fa-poll-h',
		click: 'togglePoll',
		class: '{ active: poll }'
	},
	contentWarning: {
		tooltip: i18n.ts.useCw,
		icon: 'fas fa-eye-slash',
		click: "toggleCw",
		class: '{ active: useCw }',
	},
	insertMention: {
		tooltip: i18n.ts.mention,
		icon: 'fas fa-at',
		click: 'insertMention',
		class: ''
	},
	withHashtags: {
		tooltip: i18n.ts.hashtags,
		icon: 'fas fa-hashtag',
		click: 'toggleHashtags',
		class: '{ active: withHashtags }'
	},
	previewNote: {
		tooltip: i18n.ts.previewNoteText,
		icon: 'fas fa-file-code',
		click: 'toggleShowPreview',
		class: '{ active: showPreview }'
	},
});

