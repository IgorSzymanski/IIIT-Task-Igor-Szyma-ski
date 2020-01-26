<template>
	<div class="scheduler-actions" :style="style">
		<b-tag class="time" type="is-dark" v-if="time">{{
			time | formatMinutes
		}}</b-tag>
		<b-icon
			title="Dodaj zadanie"
			class="add"
			icon="plus-circle"
			type="is-danger"
			@click.native="addLog"
		/>
	</div>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { ReversedLogType } from './TaskType'
import { countLogTime, formatMinutes, createDate } from './utility'

const SchedulerActions = createComponent({
	filters: {
		formatMinutes,
	},
	props: {
		id: {
			type: Number,
			default: 0,
		},
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
		logs: {
			type: Array as () => ReversedLogType[],
			required: true,
		},
	},
	setup(props, opts) {
		const style = computed(() => ({
			'grid-row-start': props.id + 1,
			'grid-row-end': props.id + 2,
		}))

		const time = computed(() => countLogTime(props.logs))
		const addLog = () => {
			opts.emit('addLog', {
				start: createDate(props.day)(props.month)(props.year),
			})
		}

		return {
			style,
			time,
			addLog,
		}
	},
})
export default SchedulerActions
</script>

<style lang="scss" scoped>
@import '@/assets/css/components/scheduler';

.scheduler-actions {
	grid-column: h24-0 / h25-0;
	text-align: right;
	padding-right: 0.8em;
	position: relative;
	font-weight: bold;

	.time {
		position: relative;
		bottom: 0.6em;
		right: 1.2em;
		opacity: 0.3;
		font-size: 0.6em;
	}

	.add {
		cursor: pointer;
	}
}
</style>
