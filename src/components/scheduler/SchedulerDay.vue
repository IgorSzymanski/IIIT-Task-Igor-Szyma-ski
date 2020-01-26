<template>
	<div class="schedule-day" :title="tooltipText">
		<span class="day">{{ day | format }}</span
		><span class="month">/{{ month | format }}</span>
		<span class="dayOfTheWeek">{{ dayOfTheWeek }}</span>
	</div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import SchedulerTask from './SchedulerTask.vue'
import { ReversedLogType } from './TaskType'
import { countLogTime, formatMinutes, pad, getHour, getMinute } from './utility'

const format = pad(2)

const SchedulerDay = createComponent({
	filters: {
		formatMinutes,
		format,
	},
	props: {
		day: {
			type: Number,
			required: true,
		},
		month: {
			type: Number,
			required: true,
		},
		year: {
			type: Number,
			required: true,
		},
		dayOfTheWeek: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	setup(props) {
		const tooltipText = computed(
			() =>
				`${format(props.day)}/${format(props.month)}/${
					props.year
				} (${props.dayOfTheWeek.toUpperCase()})`,
		)

		return {
			tooltipText,
		}
	},
})
export default SchedulerDay
</script>

<style lang="scss" scoped>
@import '@/assets/css/_variables';
@import '@/assets/css/components/scheduler';

.schedule-day {
	position: relative;
	height: 3em;
	width: 5em;
	border-right: $border-line;
	border-bottom: $border-line;
	background-color: $white;
	cursor: help;

	.day {
		font-size: 0.9em;
		position: absolute;
		left: 1em;
		bottom: 1em;
		line-height: 1rem;
	}
	.month {
		font-size: 0.8em;
		position: absolute;
		left: 2.7em;
		bottom: 1em;
		line-height: 1rem;
	}
	.dayOfTheWeek {
		font-size: 0.7em;
		font-weight: bolder;
		text-transform: uppercase;
		position: absolute;
		top: 0.5em;
		right: 0.5em;
	}
}
</style>
