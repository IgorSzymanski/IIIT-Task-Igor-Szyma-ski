<template>
	<div class="scheduler">
		<SchedulerRow :start="0" :end="25" :id="0" first />

		<SchedulerHour
			v-for="hour in hours"
			:key="`hour-${hour}`"
			:hour="hour"
			:is-active="isHourActive(hour)"
		/>

		<template v-for="(day, id) in days">
			<SchedulerRow :key="`row-a-${id}`" :end="activeHours[0]" :id="id + 1" />
			<SchedulerRow
				:key="`row-b-${id}`"
				:start="activeHours[0]"
				:end="activeHours[1]"
				:id="id + 1"
			/>
			<SchedulerRow :key="`row-c-${id}`" :start="activeHours[1]" :id="id + 1" />

			<SchedulerDay
				:key="`day-${id}`"
				:day="day.day"
				:month="day.month[0]"
				:year="day.year"
				:day-of-the-week="day.dayOfTheWeek[2]"
				:style="getDayStyle(id)"
			/>

			<template v-for="log in getLogs(day.date)">
				<SchedulerTask
					:id="log.id"
					:key="log.id"
					:start="log.start"
					:end="log.end"
					:task="log.task.name"
					:status="log.status"
					:style="getTaskStyle(id)(log.start)(log.end)"
					@edit="openLogEditor"
				/>
			</template>
			<SchedulerActions
				:id="id + 1"
				:key="`actions-${id}`"
				:day="day.day"
				:month="day.month[0]"
				:year="day.year"
				:logs="getLogs(day.date)"
				@addLog="openLogEditor"
			/>
		</template>
		<b-modal :active.sync="isModalActive" has-modal-card>
			<SchedulerTaskEditor
				:tasks="tasks"
				:data="{ ...editorState }"
				:statuses="StatusOptions"
				@cancel="closeLogEditor"
				@remove="removeLog"
				@save="saveLog"
			/>
		</b-modal>
	</div>
</template>

<script lang="ts">
import { createComponent, computed, ref, reactive } from '@vue/composition-api'
import SchedulerDay from './SchedulerDay.vue'
import SchedulerTask from './SchedulerTask.vue'
import SchedulerRow from './SchedulerRow.vue'
import SchedulerHour from './ScheduleHour.vue'
import SchedulerActions from './SchedulerActions.vue'
import SchedulerTaskEditor from './SchedulerTaskEditor.vue'
import i18nPl from './i18n.pl'
import { i18nType } from './i18nType'
import {
	countNumberOfDays,
	generateDays,
	getAllDatesFromTasks,
	findEarliestDate,
	findLatestDate,
	addDay,
	getMinute,
	getHour,
	getRoundedMinute,
} from './utility'
import { TaskType, ReversedLogTypeDTO } from '@/components/scheduler/TaskType'
import { getReversedLogsForDate } from './utility'
import { NullPartial } from './NullPartial'
import { StatusOptions } from './TaskStatuses'

const Scheduler = createComponent({
	components: {
		SchedulerTask,
		SchedulerDay,
		SchedulerRow,
		SchedulerHour,
		SchedulerActions,
		SchedulerTaskEditor,
	},
	props: {
		start: {
			type: (Date as any) as () => Date,
		},
		end: {
			type: (Date as any) as () => Date,
		},
		tasks: {
			type: Array as () => TaskType[],
			required: true,
		},
		i18n: {
			type: Object as () => i18nType,
			default: () => i18nPl,
		},
		activeHours: {
			type: (Array as any) as () => [number, number],
			default: () => [8, 18],
		},
	},
	setup(props, opts) {
		const editorInitState: NullPartial<ReversedLogTypeDTO> = {
			id: null,
			task: '',
			start: null,
			end: null,
			status: null,
		}
		const editorState = ref<NullPartial<ReversedLogTypeDTO>>({
			...editorInitState,
		})

		const allDates = computed(() => getAllDatesFromTasks(props.tasks))

		const fallbackDate = new Date()

		const startDay = computed(
			() =>
				props.start ||
				findEarliestDate([...allDates.value]) ||
				addDay(fallbackDate)(-7).toDate(),
		)

		const endDay = computed(
			() => props.end || findLatestDate([...allDates.value]) || fallbackDate,
		)

		const numberOfDays = computed(() =>
			!!startDay && !!endDay
				? countNumberOfDays(startDay.value)(endDay.value)
				: 0,
		)

		const days = computed(() =>
			generateDays(props.i18n)(startDay.value)(numberOfDays.value),
		)

		const hours = Array.from(Array(24).keys())

		const getLogs = computed(() => getReversedLogsForDate(props.tasks))

		const getTaskStyle = (id: number) => (start: Date) => (end: Date) => ({
			'grid-column': `h${getHour(start)}-${getRoundedMinute(
				start,
			)} / h${getHour(end)}-${getRoundedMinute(end)}`,
			'grid-row': id + 2,
		})

		const getDayStyle = (id: number) => ({
			'grid-column': `days`,
			'grid-row': id + 2,
		})

		const isHourActive = (hour: number) =>
			hour >= props.activeHours[0] && hour <= props.activeHours[1]

		const isModalActive = ref(false)

		const openLogEditor = (data: Partial<ReversedLogTypeDTO> = {}) => {
			isModalActive.value = true
			editorState.value = { ...editorInitState, ...data }
		}

		const closeLogEditor = () => {
			isModalActive.value = false
			editorState.value = { ...editorInitState }
		}

		const saveLog = (task: ReversedLogTypeDTO) => {
			opts.emit('saveTask', task)
		}

		const removeLog = (id: number) => {
			opts.emit('removeTask', id)
		}

		return {
			allDates,
			days,
			hours,
			startDay,
			endDay,
			getLogs,
			getTaskStyle,
			getDayStyle,
			isHourActive,
			isModalActive,
			openLogEditor,
			closeLogEditor,
			saveLog,
			removeLog,
			editorState,
			StatusOptions,
		}
	},
})
export default Scheduler
</script>

<style lang="scss" scoped>
@import '@/assets/css/components/scheduler';

.scheduler {
	box-shadow: $box-shadow;
	align-items: center;
	display: grid;
	grid-template-columns: $columns;
	grid-template-rows: [hours] 3em auto;
	grid-column-gap: 0;
	grid-row-gap: 0;

	border-radius: $border-radius;
	overflow: hidden;
	margin: 2em;
}
</style>
