<template>
	<form class="modal-card" @submit.prevent="validate">
		<div class="modal-card-body">
			<b-field label="Nazwa zadania">
				<b-autocomplete
					v-model="task"
					placeholder="Wpisz nazwę zadania"
					field="name"
					:data="tasks"
					@select="option => (selected = option)"
					size="is-small"
					expanded
					required
				>
				</b-autocomplete>
			</b-field>
			<b-field label="Status">
				<b-select
					v-model="status"
					placeholder="Wybierz status"
					size="is-small"
					expanded
					required
				>
					<option
						v-for="status in statuses"
						:key="status[0]"
						:value="status[0]"
						>{{ status[1] }}</option
					>
				</b-select>
			</b-field>
			<b-field grouped>
				<b-field label="Od godziny">
					<b-timepicker
						placeholder="Od godziny"
						icon="clock"
						editable
						size="is-small"
						v-model="start"
						:max-time="end"
						expanded
						required
					>
					</b-timepicker>
				</b-field>
				<b-field
					label="Do godziny"
					:type="{ 'is-danger': hoursHaveError }"
					:message="{ 'Nieprawidłowy przedział godzinowy': hoursHaveError }"
				>
					<b-timepicker
						placeholder="Do godziny"
						icon="clock"
						editable
						size="is-small"
						v-model="end"
						:min-time="start"
						expanded
						required
					>
					</b-timepicker>
				</b-field>
			</b-field>
			<b-field label="Wybierz datę">
				<b-datepicker
					v-model="date"
					placeholder="Type or select a date..."
					icon="calendar-today"
					:month-names="monthNames"
					:day-names="dayNames"
					editable
					:first-day-of-week="1"
					inline
					size="is-small"
					required
				/>
			</b-field>
		</div>
		<footer class="modal-card-foot">
			<button type="submit" class="button is-success">Zapisz</button>
			<b-button type="is-danger" @click="remove" v-if="id">Usuń</b-button>
			<b-button @click="cancel">Anuluj</b-button>
		</footer>
	</form>
</template>

<script lang="ts">
import {
	createComponent,
	computed,
	reactive,
	toRefs,
} from '@vue/composition-api'
import { i18nType } from './i18nType'
import i18nPl from './i18n.pl'
import {
	combineDateAndHour,
	isDateAfter,
	toDate,
	doDateRangesOverlap,
} from './utility'
import { ReversedLogTypeDTO } from './TaskType'
import { LogStatusType, TaskType } from '@/services/UserTaskAPI'

const SchedulerTaskEditor = createComponent({
	props: {
		tasks: {
			type: Array as () => Array<TaskType>,
			required: true,
		},
		statuses: {
			type: Array as () => Array<[LogStatusType, string]>,
			required: true,
		},
		data: {
			type: Object as () => Partial<ReversedLogTypeDTO>,
			default: (() => {}) as () => Partial<ReversedLogTypeDTO>,
		},
		i18n: {
			type: Object as () => i18nType,
			default: () => i18nPl,
		},
	},
	setup(props, opts) {
		const state = reactive<{
			id: number | null
			start: Date | null
			end: Date | null
			task: String
			date: Date | null
			error: String | null
			status: String | null
		}>({
			id: null,
			start: null,
			end: null,
			task: '',
			date: null,
			error: null,
			status: null,
		})

		state.id = props.data.id || null
		state.start = props.data.start || null
		state.end = props.data.end || null
		state.date = props.data.start || null
		state.task = props.data.task || ''
		state.status = props.data.status || null

		const startDate = computed(() =>
			combineDateAndHour(state.date as Date)(state.start as Date),
		)
		const endDate = computed(() =>
			combineDateAndHour(state.date as Date)(state.end as Date),
		)

		const cancel = () => {
			opts.emit('cancel')
		}

		const remove = () => {
			opts.emit('remove', state.id)
			opts.emit('cancel')
		}

		const validate = () => {
			const dates = props.tasks
				.flatMap(({ logs }) => logs)
				.filter(log => log.id !== state.id)
				.map(log => [log.start, log.end]) as [string, string][]
			if (
				startDate.value &&
				endDate.value &&
				dates.some(doDateRangesOverlap([startDate.value, endDate.value]))
			) {
				opts.root.$buefy.notification.open({
					message: 'Zadanie nakłada się z ju istniejącym!',
					type: 'is-danger',
					duration: 0,
				})
			} else {
				save()
			}
		}

		const save = () => {
			if (startDate.value && endDate.value && !hoursHaveError.value)
				opts.emit('save', {
					id: state.id,
					task: state.task,
					start: toDate(startDate.value),
					end: toDate(endDate.value),
					status: state.status,
				} as ReversedLogTypeDTO)
			opts.emit('cancel')
		}

		const hoursHaveError = computed(() =>
			isDateAfter(state.start as Date)(state.end as Date),
		)

		const monthNames = computed(() => props.i18n.months)
		const dayNames = computed(() =>
			[props.i18n.shortDays[6], ...props.i18n.shortDays]
				.slice(0, 7)
				.map(name => name.toUpperCase()),
		)

		return {
			...toRefs(state),
			cancel,
			remove,
			save,
			monthNames,
			dayNames,
			startDate,
			endDate,
			hoursHaveError,
			validate,
		}
	},
})
export default SchedulerTaskEditor
</script>

<style lang="scss" scoped>
@import '@/assets/css/components/scheduler';
</style>
