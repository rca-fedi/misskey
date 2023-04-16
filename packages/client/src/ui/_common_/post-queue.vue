<template>
<div class="yy-post-queue _acrylic" :style="{ zIndex }">
	<ol v-if="postQueues.length > 0">
		<li v-for="ctx in postQueues" :key="ctx.id">
			<!-- <div class="img" :style="{ backgroundImage: `url(${ ctx.img })` }"></div> -->
			<div class="top">
				<p class="name"><i class="fas fa-spinner fa-pulse"></i>Waiting for upload</p>
				<!-- <p class="status"> -->
					<!-- <span v-if="ctx.progressValue === undefined" class="initing">{{ i18n.ts.waiting }}<MkEllipsis/></span>
					<span v-if="ctx.progressValue !== undefined" class="kb">{{ String(Math.floor(ctx.progressValue / 1024)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') }}<i>KB</i> / {{ String(Math.floor(ctx.progressMax / 1024)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') }}<i>KB</i></span>
					<span v-if="ctx.progressValue !== undefined" class="percentage">{{ Math.floor((ctx.progressValue / ctx.progressMax) * 100) }}</span> -->
				<!-- </p> -->
			</div>
			<!-- <progress :value="ctx.progressValue || 0" :max="ctx.progressMax || 0" :class="{ initing: ctx.progressValue === undefined, waiting: ctx.progressValue !== undefined && ctx.progressValue === ctx.progressMax }"></progress> -->
		</li>
	</ol>
</div>
</template>

<script lang="ts" setup>
import { } from 'vue';
import * as os from '@/os';
import { postQueues } from '@/scripts/post-queue';
import { i18n } from '@/i18n';

const zIndex = os.claimZIndex('high');
</script>

<style lang="scss" scoped>
.yy-post-queue {
	// position: fixed;
	// right: 16px;
	// width: 260px;
	// top: 32px;
	// padding: 16px 20px;
	// pointer-events: none;
	// box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	// border-radius: 8px;
	position: static;
}
.yy-post-queue:empty {
  display: none;
}
.yy-post-queue > ol {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
}
.yy-post-queue > ol > li {
  display: grid;
  margin: 8px 0 0 0;
  padding: 0;
  height: 36px;
  width: 100%;
  border-top: solid 8px transparent;
  grid-template-columns: 36px calc(100% - 44px);
  grid-template-rows: 1fr 8px;
  column-gap: 8px;
  box-sizing: content-box;
}
.yy-post-queue > ol > li:first-child {
  margin: 0;
  box-shadow: none;
  border-top: none;
}
// .yy-post-queue > ol > li > .img {
//   display: block;
//   background-size: cover;
//   background-position: center center;
//   grid-column: 1/2;
//   grid-row: 1/3;
// }
.yy-post-queue > ol > li > .top {
  display: flex;
  grid-column: 2/3;
  grid-row: 1/2;
}
.yy-post-queue > ol > li > .top > .name {
  display: block;
  padding: 0 8px 0 0;
  margin: 0;
  font-size: 0.8em;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-shrink: 1;
}
.yy-post-queue > ol > li > .top > .name > i {
  margin-right: 4px;
}
.yy-post-queue > ol > li > .top > .status {
  display: block;
  margin: 0 0 0 auto;
  padding: 0;
  font-size: 0.8em;
  flex-shrink: 0;
}
// .yy-post-queue > ol > li > .top > .status > .initing {
// }
// .yy-post-queue > ol > li > .top > .status > .kb {
// }
.yy-post-queue > ol > li > .top > .status > .percentage {
  display: inline-block;
  width: 48px;
  text-align: right;
}
.yy-post-queue > ol > li > .top > .status > .percentage:after {
  content: '%';
}
.yy-post-queue > ol > li > progress {
  display: block;
  background: transparent;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  grid-column: 2/3;
  grid-row: 2/3;
  z-index: 2;
	width: 100%;
	height: 8px;
}
.yy-post-queue > ol > li > progress::-webkit-progress-value {
  background: var(--accent);
}
.yy-post-queue > ol > li > progress::-webkit-progress-bar {
  //background: var(--accentAlpha01);
	background: transparent;
}
</style>
