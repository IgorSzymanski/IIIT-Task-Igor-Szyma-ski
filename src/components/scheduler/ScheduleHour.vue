<template>
	<div :style="style" class="hour-row" :class="{ 'is-not-active': !isActive }">
		<span class="hour">{{ hour }}</span>
	</div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'

const SchedulerHour = createComponent({
	props: {
		hour: {
			type: Number,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	setup(props) {
		const style = computed(() => ({
			'grid-column': `h${props.hour}-0 / h${props.hour + 1}-0`,
		}))

		return {
			style,
		}
	},
})
export default SchedulerHour
</script>

<style lang="scss" scoped>
@import '@/assets/css/components/scheduler';

.hour-row {
	grid-row: hours;
	border-bottom: $border-line;
	height: 100%;
	width: 100%;
	line-height: 3em;
	font-weight: bold;
	position: relative;

	.hour {
		margin-left: -10%;
	}

	&.is-not-active {
		color: #ccc;
	}
}
</style>
