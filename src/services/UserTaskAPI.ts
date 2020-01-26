import axios from 'axios'
import { reactive, toRefs, computed, watch } from '@vue/composition-api'
import { ReversedLogTypeDTO } from '../components/scheduler/TaskType'

export type TaskType = {
	id: number
	name: string
	logs: LogType[]
}

export type LogType = {
	id: number
	start: string
	end: string
	status: LogStatusType
}

export type ReversedLogType = LogType & {
	task: TaskType
}

export type LogStatusType = 'accepted' | 'pending' | 'warning' | 'active'

export type TaskDTO = {
	name: string
	logs: LogDTO[]
}

export type LogDTO = {
	id: number
	start: string
	end: string
	status: LogStatusType
}

export const UserTaskAPI = (url: string) => {
	const state = reactive({
		tasks: [] as TaskType[],
		loading: false,
		error: false,
	})

	const logs = computed<ReversedLogType[]>(() =>
		state.tasks.flatMap(task =>
			(task.logs || []).map(log => ({ ...log, task })),
		),
	)

	const fetchTasks = async () => {
		state.loading = true
		try {
			state.tasks = (await axios.get<TaskType[]>(url)).data
		} catch (e) {
			state.error = true
		} finally {
			state.loading = false
		}
	}

	const getNewIdForLog = () =>
		logs.value.map(({ id }) => id)[logs.value.length - 1] + 1

	const prepareDTO = ({
		id,
		status,
		start,
		end,
	}: ReversedLogTypeDTO): LogDTO => ({
		id: id || getNewIdForLog(),
		status,
		start: start.toISOString(),
		end: end.toISOString(),
	})

	const addNewTask = (data: ReversedLogTypeDTO): TaskDTO => ({
		name: data.task,
		logs: [
			{
				id: getNewIdForLog(),
				start: data.start.toISOString(),
				end: data.end.toISOString(),
				status: data.status,
			},
		],
	})

	const pushNewLogToTask = (task: TaskType) => (data: ReversedLogTypeDTO) => {
		task.logs.push(prepareDTO(data))
		return task
	}

	const editLogInTask = (task: TaskType) => (data: ReversedLogTypeDTO) => {
		const index = task.logs.findIndex(log => log.id === data.id)
		task.logs[index] = prepareDTO(data)
		return task
	}

	const popLogFromTask = (task: TaskType) => (id: number) => {
		const index = task.logs.findIndex(log => log.id === id)
		task.logs.splice(index, 1)
		return task
	}

	const saveTask = async (data: ReversedLogTypeDTO) => {
		state.loading = true

		const task = state.tasks.find(task => task.name === data.task)

		try {
			if (task) {
				const modTask = data.id
					? editLogInTask(task)(data)
					: pushNewLogToTask(task)(data)
				await axios.patch(`${url}/${modTask.id}`, modTask)
			} else {
				const newTask = addNewTask(data)
				await axios.post(url, newTask)
			}
		} catch (e) {
			state.error = true
		} finally {
			state.loading = false
			await fetchTasks()
		}
	}

	const removeTask = async (id: number) => {
		const task = state.tasks.find(task => task.logs.some(log => log.id === id))
		if (!task) {
			return
		}
		state.loading = true
		const modTask = popLogFromTask(task)(id)
		try {
			await axios.patch(`${url}/${modTask.id}`, modTask)
		} catch (e) {
			state.error = true
		} finally {
			state.loading = false
			await fetchTasks()
		}
	}

	return { ...toRefs(state), logs, fetchTasks, saveTask, removeTask }
}
