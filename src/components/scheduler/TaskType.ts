export type TaskType = {
	id: number
	name: string
	logs: TaskLogType[]
}

export type TaskLogType = {
	id: number
	start: Date | string
	end: Date | string
	status: TaskLogStatusType
}

export type ReversedTaskType = {
	id: number
	name: string
}

export type ReversedLogType = TaskLogType & {
	id: number
	start: Date
	end: Date
	status: TaskLogStatusType
	task: ReversedTaskType
}

export type ReversedLogTypeDTO = {
	id?: number
	start: Date
	end: Date
	status: TaskLogStatusType
	task: string
}

export type TaskLogStatusType = 'accepted' | 'pending' | 'warning' | 'active'
