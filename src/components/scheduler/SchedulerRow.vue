<template>
	<div class="day-row" :class="{ 'is-first': first }" :style="style" />
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'

const SchedulerRow = createComponent({
	props: {
		id: {
			type: Number,
			default: 0,
		},
		start: {
			type: Number,
			default: 0,
		},
		end: {
			type: Number,
			default: 25,
		},
		first: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const style = computed(() => {
			return props.first
				? false
				: {
						'grid-row-start': props.id + 1,
						'grid-row-end': props.id + 2,
						'grid-column': `h${props.start}-0 / h${props.end}-0`,
				  }
		})

		return {
			style,
		}
	},
})
export default SchedulerRow
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variables';
@import '@/assets/css/components/scheduler';

.day-row {
	height: 100%;
	width: 100%;
	border-bottom: $border-line;
	border-right: $border-line;

	&.is-first {
		background: $white;
		grid-row-start: 1;
		grid-row-end: 2;
		grid-column: days / actions;
	}
}
</style>
