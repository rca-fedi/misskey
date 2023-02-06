<template>
<XModalWindow
	ref="dialogEl"
	:width="800"
	:height="500"
	:scroll="false"
	:with-ok-button="true">
	<template #header>testCropImage</template>
	<tui-image-editor ref="tuiImageEditor" :include-ui="useDefaultUI" :options="options"></tui-image-editor>
</XModalWindow>
</template>

<script lang="ts">
import { ImageEditor } from '@toast-ui/vue-image-editor';
import icon_a from 'tui-image-editor/dist/svg/icon-a.svg';
import icon_b from 'tui-image-editor/dist/svg/icon-b.svg';
import icon_c from 'tui-image-editor/dist/svg/icon-c.svg';
import icon_d from 'tui-image-editor/dist/svg/icon-d.svg';
import XModalWindow from '@/components/MkModalWindow.vue';
import 'tui-image-editor/dist/tui-image-editor.css';

const locale_ja = {
	Load: 'ファイル選択',
	Download: 'ダウンロード',
	Apply: '適用',
	Arrow: '矢印',
	'Arrow-2': '矢印2',
	'Arrow-3': '矢印3',
	// Blend
	Blur: 'ぼかし',
	Bold: '太字',
	Brightness: '明るさ',
	Bubble: '吹き出し',
	Cancel: 'キャンセル',
	Center: '中央寄せ',
	Circle: '円',
	// Color
	'Color Filter': '色抜き',
	Crop: '切り取り',
	Custom: 'カスタム',
	'Custom icon': 'カスタムアイコン',
	Distance: '長さ',
	Draw: '描画',
	Emboss: 'エンボス加工',
	// Fill
	Filter: 'フィルタ',
	Flip: '反転',
	'Flip X': '横反転',
	'Flip Y': '縦反転',
	Free: 'フリーハンド',
	Grayscale: '白黒',
	Heart: 'ハート',
	Icon: 'アイコン',
	Invert: 'ネガポジ',
	Italic: '斜体',
	Left: '左寄せ',
	// Load
	// Load Mask Image
	Location: '場所',
	// Mask
	// Multiply
	Noise: 'ノイズ',
	Pixelate: 'モザイク',
	Polygon: '六角形',
	Range: '幅',
	Rectangle: '四角形',
	// Redo
	'Remove White': '白抜き',
	Reset: 'リセット',
	Right: '右寄せ',
	Rotate: '回転',
	Sepia: 'セピア',
	Sepia2: 'セピア2',
	// Shape
	Sharpen: 'シャープ',
	Square: 'スクエア',
	'Star-1': '星',
	'Star-2': '星2',
	Straight: '直線',
	Stroke: '線の幅',
	Text: 'テキスト',
	'Text size': '文字の大きさ',
	Threshold: '値',
	// Tint
	Triangle: '三角形',
	Underline: '下線',
	Undo: '元に戻す',
	Value: '影の濃さ'
};
const theme = {
	//common
	'common.bi.image': '',
	'common.bisize.width': '0px',
	'common.bisize.height': '0px',
	'common.backgroundImage': 'none',
	'common.backgroundColor': '#FFFFFF',
	'common.border': '0px',
	// header
	'header.backgroundImage': 'none',
	'header.backgroundColor': 'transparent',
	'header.border': '0px',
	// load button
	'loadButton.backgroundColor': '#fff',
	'loadButton.border': '1px solid #ddd',
	'loadButton.color': '#222',
	'loadButton.fontFamily': 'NotoSans, sans-serif',
	'loadButton.fontSize': '12px',
	// download button
	'downloadButton.backgroundColor': '#fdba3b',
	'downloadButton.border': '1px solid #fdba3b',
	'downloadButton.color': '#fff',
	'downloadButton.fontFamily': 'NotoSans, sans-serif',
	'downloadButton.fontSize': '12px',
	// メインアイコン
	'menu.normalIcon.path': icon_d,
	'menu.activeIcon.path': icon_b,
	'menu.disabledIcon.path': icon_a,
	'menu.hoverIcon.path': icon_c,
	// サブメニューアイコン
	'submenu.normalIcon.path': icon_d,
	'submenu.activeIcon.path': icon_c,
	// submenu primary color
	'submenu.backgroundColor': '#ffffff',
	'submenu.partition.color': '#858585',
	// submenu labels
	'submenu.normalLabel.color': '#858585',
	'submenu.normalLabel.fontWeight': 'lighter',
	'submenu.activeLabel.color': '#000',
	'submenu.activeLabel.fontWeight': 'lighter',
	// checkbox style!
	'checkbox.border': '1px solid #ccc',
	'checkbox.backgroundColor': '#fff',
	// range style
	'range.pointer.color': '#000',
	'range.bar.color': '#666',
	'range.subbar.color': '#d1d1d1',
	'range.value.color': '#000',
	'range.value.fontWeight': 'lighter',
	'range.value.fontSize': '11px',
	'range.value.border': '1px solid #353535',
	'range.value.backgroundColor': '#151515',
	'range.title.color': '#000',
	'range.title.fontWeight': 'lighter',
	// colorpicker style
	'colorpicker.button.border': '1px solid #1e1e1e',
	'colorpicker.title.color': '#fff'
};
export default {
	name: 'ImageEditor',
	components: {
		'tui-image-editor': ImageEditor
	},
	props: {},
	data() {
		return {
			useDefaultUI: true,
			options: {
				// for tui-image-editor component's "options" prop
				cssMaxWidth: document.documentElement.clientWidth,
				cssMaxHeight: document.documentElement.clientHeight,
				includeUI: {
					//表示メニューの設定。デフォルトでは全て表示される
					// menu: ["flip", "crop", "rotate", "filter"],
					//コンポーネント生成時に選択されるメニューの指定
					initMenu: 'filter',
					//メニューバーの位置の指定
					menuBarPosition: 'buttom',
					uiSize: {
						width: '100%',
						height: '650px',
					},
					theme: theme,
					locale: locale_ja,
				},
			},
		};
	},
};

</script>
