import dayjs from 'dayjs'
import { i18nType } from './i18nType'
import { TaskType, ReversedLogType } from './TaskType'
import i18nPl from './i18n.pl'
import { DayType } from './DayType'

export type FlexDate = string | Date | Readonly<Date>

/**
 * Used to render rows of days, therefore returns non-negative numbers.
 * Counts days between two days.
 * If endDay is before startDay, returns 0.
 */
export const countNumberOfDays = (startDay: Date | Readonly<Date>) => (
	endDay: Date | Readonly<Date>,
) => {
	const diff =
		dayjs(endDay.toISOString()).diff(dayjs(startDay.toISOString()), 'day') + 1
	return diff > 0 ? diff : 0
}

/**
 * Adds days to Date.
 */
export const addDay = (startDay: Date | Readonly<Date>) => (days: number = 1) =>
	dayjs(startDay.toISOString()).add(days, 'day')

export const generateDays = (i18n: i18nType) => (
	startDay: Date | Readonly<Date>,
) => (numberOfDays: number): DayType[] =>
	Array.from(Array(numberOfDays).keys())
		.map(addDay(startDay))
		.map(d => ({
			date: d.toDate(),
			day: Number(d.format('D')),
			month: [Number(d.format('M')), i18nPl.months[Number(d.format('M'))]],
			year: Number(d.format('YYYY')),
			dayOfTheWeek: [d.day(), i18nPl.days[d.day()], i18nPl.shortDays[d.day()]],
		}))

/**
 * Finds the earliest Date for 'isBefore' parameter, or latest for 'isAfter' parameter.
 */
export const findDate = (comp: 'isBefore' | 'isAfter') => (dates: Date[]) =>
	dates.length
		? dates
				.map(date => dayjs(date))
				.sort((a, b) => (a[comp](b) ? -1 : 1))[0]
				.toDate()
		: undefined

export const findEarliestDate = findDate('isBefore')
export const findLatestDate = findDate('isAfter')

/**
 * Converts TaskType to ReversedLogType
 */
export const reverseTaskData = (tasks: TaskType[]): ReversedLogType[] =>
	tasks.flatMap(task =>
		task.logs.map(log => ({
			...log,
			task: { id: task.id, name: task.name },
			end: toDate(log.end),
			start: toDate(log.start),
		})),
	)

/**
 * Returns Array of Date of start and end times of tasks.
 */
export const getAllDatesFromTasks = (tasks: TaskType[]): Date[] =>
	tasks
		.flatMap(task => task.logs.flatMap(log => [log.start, log.end]))
		.filter(date => !!date)
		.map(date => new Date(date))

/**
 * Converts String, Date, and readonly Date to Date.
 */
export const toDate = (date: FlexDate) =>
	typeof date === 'string'
		? new Date(date)
		: date instanceof Date
		? date
		: new Date('')

/**
 * Cheks if two dates are the same say. Hour may vary.
 */
export const isTheSameDay = (dateA: FlexDate) => (dateB: FlexDate) => {
	const A = dayjs(toDate(dateA))
	const B = dayjs(toDate(dateB))
	return A.isSame(B, 'year') && A.isSame(B, 'month') && A.isSame(B, 'day')
}

/**
 * Reverses Tasks and filters them by day.
 */
export const getReversedLogsForDate = (tasks: TaskType[]) => (date: FlexDate) =>
	reverseTaskData(tasks).filter(log => isTheSameDay(log.start)(date))

/**
 * Gets hour of date. Ex. for '2019-07-08T06:48:00Z' it's 6.
 */
export const getHour = (date: FlexDate) =>
	Number(dayjs(toDate(date)).format('H'))

/**
 * Gets minute of date. Ex. for '2019-07-08T06:48:00Z' it's 48.
 */
export const getMinute = (date: FlexDate) =>
	Number(dayjs(toDate(date)).format('m'))

/**
 * Gets minute of date. Ex. for '2019-07-08T06:48:00Z' it's 50.
 */
export const getRoundedMinute = (date: FlexDate) =>
	Math.floor(Number(dayjs(toDate(date)).format('m')) / 10) * 10

/**
 * Counts difference between two dates in minutes.
 */
export const countTimeDifference = (dateA: Date) => (dateB: Date) =>
	dayjs(dateA).diff(dayjs(dateB), 'minute')

/**
 * Sums time of logs and returns in minutes.
 */
export const countLogTime = (logs: ReversedLogType[]) =>
	logs
		.filter(log => log.status !== 'warning')
		.map(log => countTimeDifference(log.end)(log.start))
		.reduce((a, b) => a + b, 0)

/**
 * Formats minutes in HH:mm string format.
 */
export const formatMinutes = (timeInMinutes: number) => {
	const hours = Math.floor(timeInMinutes / 60)
	const minutes = timeInMinutes - hours * 60
	return `${pad(2)(hours)}:${pad(2)(minutes)}`
}

/**
 * Adds leading zeros to a number.
 */
export const pad = (size: number) => (number: number) => {
	let s = String(number)
	while (s.length < (size || 2)) {
		s = '0' + s
	}
	return s
}

export const parseDate = (date: string) =>
	dayjs(date, { format: 'DD.MM.YYYY' }).toDate()

export const combineDateAndHour = (date: Date | null) => (
	hour: Date | null,
) => {
	if (!date || !hour) {
		return
	}
	const dHour = dayjs(hour)
	return dayjs(date)
		.set('hour', dHour.hour())
		.set('minute', dHour.minute())
		.set('millisecond', dHour.millisecond())
		.toDate()
}

export const isDateAfter = (dateA: Date | null) => (dateB: Date | null) =>
	dateA && dateB ? dayjs(dateA).isAfter(dayjs(dateB)) : false

export const createDate = (day: number) => (month: number) => (year: number) =>
	dayjs(`${pad(4)(year)}-${pad(2)(month)}-${pad(2)(day)}`).toDate()

export const doDateRangesOverlap = (datesA: [FlexDate, FlexDate]) => (
	datesB: [FlexDate, FlexDate],
) => {
	const A = datesA.map(toDate).map(d => dayjs(d))
	const B = datesB.map(toDate).map(d => dayjs(d))
	return A.some(d => B[0].isBefore(d) && B[1].isAfter(d))
}
