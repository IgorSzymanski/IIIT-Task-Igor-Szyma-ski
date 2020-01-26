import { TaskLogStatusType } from './TaskType'

export const TaskStatuses: { [key in TaskLogStatusType]: [string, string] } = {
	accepted: ['check-circle', 'Zaakceptowane'],
	warning: ['alert', 'Ostrzeżenie'],
	active: ['check-circle', 'Aktywne'],
	pending: ['clock', 'Oczekujące'],
}

export const StatusValues = Object.keys(TaskStatuses) as TaskLogStatusType[]

export const StatusOptions = StatusValues.map(val => [
	val,
	TaskStatuses[val][1],
])
