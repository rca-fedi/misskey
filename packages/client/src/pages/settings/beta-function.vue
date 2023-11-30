<template>
<div class="_formRoot">
	<FormInfo class="_formBlock">以下の機能はすべてベータ版です。</FormInfo>

	<FormSwitch v-model="navBarChatIcon" class="_formBlock">チャットを表示する</FormSwitch>
	<FormSwitch v-model="navBarReloadIcon" class="_formBlock">リロードを表示する</FormSwitch>
	<FormSwitch v-model="navBarWidgetIcon" class="_formBlock">ウィジェットを表示する</FormSwitch>
	<FormSwitch v-model="newVideoPlayerEnabled" class="_formBlock">新しいビデオプレイヤー(vue-plyr)を使用する</FormSwitch>
	<FormSwitch v-model="postFormEmojiPickerNewStyleEnabled" class="_formBlock">投稿画面で新しい絵文字ピッカーを使用する</FormSwitch>
	<FormSwitch v-model="postFormFooterEmojiIconEnabled" class="_formBlock">投稿画面のフッターに絵文字ボタンを表示する</FormSwitch>
	<FormSwitch v-model="hideReaction" class="_formBlock">リアクションを非表示にする</FormSwitch>
	<FormSwitch v-model="showReactionsCount" class="_formBlock">リアクションの数を表示する<template #caption>現時点ではリアルタイムに変更されません</template></FormSwitch>
	<FormSwitch v-model="hideInstanceTickerShadow" class="_formBlock">InstanceTickerのシャドウを非表示にする</FormSwitch>
	<FormSwitch v-model="postFormFooterPostButtonEnabled" class="_formBlock">投稿画面のフッターに投稿ボタンを表示する</FormSwitch>
	<FormSwitch v-model="postFormHeaderPostButtonEnabled" class="_formBlock">投稿画面のヘッダーに投稿ボタンを表示する</FormSwitch>
	<FormSwitch v-model="debugMode" class="_formBlock">デバッグモードを有効にする</FormSwitch>
	<FormRadios v-model="navBarStyle">
		<template #label>ナビゲーションバーのスタイル</template>
		<option value="style1">スタイル1(yoiyamiオリジナル)</option>
		<option value="style2">スタイル2(Misskey-v12 Vanilla)</option>
	</FormRadios>
	<FormRadios v-model="visibilityWarning">
		<template #label>投稿画面での公開範囲の警告</template>
		<option value="public">警告しない(public)</option>
		<option value="home">home</option>
		<option value="followers">followers</option>
		<option value="specified">specified(ダイレクト)</option>
	</FormRadios>

	<FormSection>
		<template #label>UI Customizations</template>
		<FormSwitch v-model="userDetail_hideActivityGraph" class="_formBlock">ユーザーページ: アクティビティグラフを隠す(ローカル)</FormSwitch>
		<FormSwitch v-model="userDetail_hideActivityGraph_remote" class="_formBlock">ユーザーページ: アクティビティグラフを隠す(リモート)</FormSwitch>
		<FormSwitch v-model="userDetail_hideFollowers" class="_formBlock">ユーザーページ: フォロワーを隠す(ローカル)</FormSwitch>
		<FormSwitch v-model="userDetail_hideFollowers_remote" class="_formBlock">ユーザーページ: フォロー中を隠す(リモート)</FormSwitch>
		<FormSwitch v-model="userDetail_hideFollowing" class="_formBlock">ユーザーページ: フォロー中を隠す(ローカル)</FormSwitch>
		<FormSwitch v-model="userDetail_hideFollowing_remote" class="_formBlock">ユーザーページ: フォロー中を隠す(リモート)</FormSwitch>
		<FormSwitch v-model="userDetail_hideNoteCount" class="_formBlock">ユーザーページ: 投稿数を隠す(ローカル)</FormSwitch>
		<FormSwitch v-model="userDetail_hideNoteCount_remote" class="_formBlock">ユーザーページ: 投稿数を隠す(リモート)</FormSwitch>
		<FormSwitch v-model="userDetail_hideGallery" class="_formBlock">ユーザーページ: ギャラリーを隠す</FormSwitch>
	</FormSection>

</div>
</template>
	
<script lang="ts" setup>
import { computed } from 'vue';
import { defaultStore } from '@/store';
import FormInfo from '@/components/MkInfo.vue';
import FormSwitch from '@/components/form/switch.vue';
import FormRadios from '@/components/form/radios.vue';
import FormSection from '@/components/form/section.vue';

const navBarChatIcon = computed(defaultStore.makeGetterSetter('navBarChatIcon'));
const navBarReloadIcon = computed(defaultStore.makeGetterSetter('navBarReloadIcon'));
const navBarWidgetIcon = computed(defaultStore.makeGetterSetter('navBarWidgetIcon'));
const newVideoPlayerEnabled = computed(defaultStore.makeGetterSetter('newVideoPlayerEnabled'));
const postFormEmojiPickerNewStyleEnabled = computed(defaultStore.makeGetterSetter('postFormEmojiPickerNewStyleEnabled'));
const postFormFooterEmojiIconEnabled = computed(defaultStore.makeGetterSetter('postFormFooterEmojiIconEnabled'));
const hideReaction = computed(defaultStore.makeGetterSetter('hideReactions'));
const showReactionsCount = computed(defaultStore.makeGetterSetter('showReactionsCount'));
const hideInstanceTickerShadow = computed(defaultStore.makeGetterSetter('hideInstanceTickerShadow'));
const postFormFooterPostButtonEnabled = computed(defaultStore.makeGetterSetter('postFormFooterPostButtonEnabled'));
const postFormHeaderPostButtonEnabled = computed(defaultStore.makeGetterSetter('postFormHeaderPostButtonEnabled'));
const navBarStyle = computed(defaultStore.makeGetterSetter('navBarStyle'));
const debugMode = computed(defaultStore.makeGetterSetter('debugMode'));
const visibilityWarning = computed(defaultStore.makeGetterSetter('visibilityWarning'));

const userDetail_hideActivityGraph = computed(defaultStore.makeGetterSetter('userDetail_hideActivityGraph'));
const userDetail_hideActivityGraph_remote = computed(defaultStore.makeGetterSetter('userDetail_hideActivityGraph_remote'));
const userDetail_hideFollowers = computed(defaultStore.makeGetterSetter('userDetail_hideFollowers'));
const userDetail_hideFollowers_remote = computed(defaultStore.makeGetterSetter('userDetail_hideFollowers_remote'));
const userDetail_hideFollowing = computed(defaultStore.makeGetterSetter('userDetail_hideFollowing'));
const userDetail_hideFollowing_remote = computed(defaultStore.makeGetterSetter('userDetail_hideFollowing_remote'));
const userDetail_hideNoteCount = computed(defaultStore.makeGetterSetter('userDetail_hideNoteCount'));
const userDetail_hideNoteCount_remote = computed(defaultStore.makeGetterSetter('userDetail_hideNoteCount_remote'));
const userDetail_hideGallery = computed(defaultStore.makeGetterSetter('userDetail_hideGallery'));

</script>
