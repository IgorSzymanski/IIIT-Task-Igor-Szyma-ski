<template>
	<b-tooltip
		:label="`${statusText} / ${formatMinutes(taskTime)} / ${task}`"
		animated
		type="is-dark"
	>
		<b-button
			class="scheduler-task"
			:class="{ [`is-${status}-status`]: status }"
			:icon-left="icon"
			@click="edit"
			expanded
		>
			<span class="scherduler-task-time">{{ taskTime | formatMinutes }}</span>
			<span class="scherduler-task-name"> / {{ task }}</span>
		</b-button>
	</b-tooltip>
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { formatMinutes, countTimeDifference, pad } from './utility'
import { TaskLogStatusType, ReversedLogTypeDTO } from './TaskType'
import { TaskStatuses as Icons } from './TaskStatuses'

const SchedulerTask = createComponent({
	filters: {
		formatMinutes,
		pad: pad(2),
	},
	props: {
		id: {
			type: Number,
			required: true,
		},
		task: {
			type: String,
			required: true,
		},
		status: {
			type: String as () => TaskLogStatusType,
			required: true,
		},
		start: {
			type: (Date as any) as () => Date,
			required: true,
		},
		end: {
			type: (Date as any) as () => Date,
			required: true,
		},
	},
	setup(props, opts) {
		const taskTime = computed(() => countTimeDifference(props.end)(props.start))

		const icon = computed(() => Icons[props.status][0])
		const statusText = computed(() => Icons[props.status][1])

		const edit = () => {
			opts.emit('edit', { ...props } as ReversedLogTypeDTO)
		}
		return { props, taskTime, icon, edit, formatMinutes, statusText }
	},
})
export default SchedulerTask
</script>

<style lang="scss" scoped>
@import '@/assets/css/components/scheduler';

.scheduler-task {
	text-overflow: ellipsis;
	overflow: hidden;
	justify-content: left;
	display: block;
	text-align: left;

	.scherduler-task-time {
		font-weight: bold;
	}

	&.is-active-status /deep/ .icon {
		color: $red;
	}

	&.is-pending-status /deep/ .icon {
		color: $grey-darker;
	}

	&.is-accepted-status /deep/ .icon {
		color: $green;
	}

	&.is-warning-status /deep/ .icon {
		color: $warning;
	}
}
</style>
