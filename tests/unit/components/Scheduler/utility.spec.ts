import { countNumberOfDays } from '@/components/scheduler/utility'
import { addDay } from '@/components/scheduler/utility'
import { generateDays } from '@/components/scheduler/utility'
import i18nPl from '@/components/scheduler/i18n.pl'
import {
	findDate,
	findEarliestDate,
	findLatestDate,
	reverseTaskData,
	getAllDatesFromTasks,
	toDate,
	isTheSameDay,
	getReversedLogsForDate,
} from '@/components/scheduler/utility'
import { TaskType, ReversedLogType } from '@/components/scheduler/TaskType'

describe('countNumberOfDays()', () => {
	it('Properly counts number of days needed to render scheduler', () => {
		expect(
			countNumberOfDays(new Date('1991-01-06'))(new Date('1991-01-16')),
		).toEqual(11)
	})

	it('Properly counts number of days when start and end days are the same', () => {
		expect(countNumberOfDays(new Date())(new Date())).toEqual(1)
	})

	it('Returns 0 when start day is after end day.', () => {
		expect(
			countNumberOfDays(new Date('1991-01-16'))(new Date('1991-01-6')),
		).toEqual(0)
		expect(
			countNumberOfDays(new Date('1991-01-7'))(new Date('1991-01-6')),
		).toEqual(0)
	})
})

describe('addDay()', () => {
	it('Properly adds positive days to a date', () => {
		expect(addDay(new Date('1991-01-6'))(1).toISOString()).toEqual(
			new Date('1991-01-7').toISOString(),
		)
		expect(addDay(new Date('1991-01-6'))(3).toISOString()).toEqual(
			new Date('1991-01-9').toISOString(),
		)
		expect(addDay(new Date('1991-01-6'))(365).toISOString()).toEqual(
			new Date('1992-01-6').toISOString(),
		)
	})

	it('Properly adds 0 days to a date', () => {
		expect(addDay(new Date('1991-01-6'))(0).toISOString()).toEqual(
			new Date('1991-01-6').toISOString(),
		)
	})

	it('Properly substracts days from a date', () => {
		expect(addDay(new Date('1991-01-6'))(-3).toISOString()).toEqual(
			new Date('1991-01-3').toISOString(),
		)

		expect(addDay(new Date('1991-01-6'))(-5).toISOString()).toEqual(
			new Date('1991-01-1').toISOString(),
		)

		expect(addDay(new Date('1991-01-6'))(-365).toISOString()).toEqual(
			new Date('1990-01-6').toISOString(),
		)
	})
})

describe('generateDays()', () => {
	const startDate = new Date('1991-01-1')
	const numberOfDays = 30
	const days = generateDays(i18nPl)(startDate)(numberOfDays)
	it('Generates correct number of days', () => {
		expect(days.length).toEqual(30)
	})

	it('Each element matches snapshot', () => {
		days.forEach(day => {
			expect(day).toMatchSnapshot({
				date: expect.any(Date),
				day: expect.any(Number),
				month: expect.any(Array),
				year: expect.any(Number),
				dayOfTheWeek: expect.any(Array),
			})

			expect(day.month).toMatchSnapshot([
				expect.any(Number),
				expect.any(String),
			])

			expect(day.dayOfTheWeek).toMatchSnapshot([
				expect.any(Number),
				expect.any(String),
				expect.any(String),
			])
		})
	})

	it('First day matches the start day', () => {
		expect(new Date(days[0].date).toISOString()).toEqual(
			startDate.toISOString(),
		)
	})
	it('Last day is [start day] + [number of days]', () => {
		expect(new Date(days[numberOfDays - 1].date).toISOString()).toEqual(
			addDay(startDate)(numberOfDays - 1).toISOString(),
		)
	})
})

describe('findDate()', () => {
	const earliest = new Date('1990-01-7')
	const mid = new Date('1991-01-6')
	const latest = new Date('1992-01-4')
	const dates = [mid, latest, earliest]
	const empty: Date[] = []

	it('Finds the earliest date in array', () => {
		expect(findDate('isBefore')(dates)).toEqual(earliest)
		expect(findEarliestDate(dates)).toEqual(earliest)
	})

	it('Finds the latest date in array', () => {
		expect(findDate('isAfter')(dates)).toEqual(latest)
		expect(findLatestDate(dates)).toEqual(latest)
	})

	it('Returns undefined if array is empty', () => {
		expect(findEarliestDate(empty)).toBeUndefined()
		expect(findLatestDate(empty)).toBeUndefined()
	})
})

const tasks: TaskType[] = [
	{
		id: 1,
		name: 'Task 1',
		logs: [
			{
				id: 1,
				start: new Date('2019-07-02T12:28:10Z'),
				end: new Date('2019-07-02T14:28:12Z'),
				status: 'accepted',
			},
			{
				id: 2,
				start: new Date('2019-07-04T16:59:00Z'),
				end: new Date('2019-07-04T18:03:08Z'),
				status: 'pending',
			},
		],
	},
	{
		id: 2,
		name: 'Task 2',
		logs: [
			{
				id: 3,
				start: new Date('2019-07-08T06:48:00Z'),
				end: new Date('2019-07-08T09:37:22Z'),
				status: 'accepted',
			},
		],
	},
]

const reversedLogs: ReversedLogType[] = [
	{
		id: 1,
		start: new Date('2019-07-02T12:28:10Z'),
		end: new Date('2019-07-02T14:28:12Z'),
		status: 'accepted',
		task: {
			id: 1,
			name: 'Task 1',
		},
	},
	{
		id: 2,
		start: new Date('2019-07-04T16:59:00Z'),
		end: new Date('2019-07-04T18:03:08Z'),
		status: 'pending',
		task: {
			id: 1,
			name: 'Task 1',
		},
	},
	{
		id: 3,
		start: new Date('2019-07-08T06:48:00Z'),
		end: new Date('2019-07-08T09:37:22Z'),
		status: 'accepted',
		task: {
			id: 2,
			name: 'Task 2',
		},
	},
]

describe('reverseTaskData()', () => {
	it('Properly reverse data', () => {
		expect(reverseTaskData(tasks)).toEqual(reversedLogs)
	})
})

describe('getAllDatesFromTasks()', () => {
	const allDates = getAllDatesFromTasks(tasks)
	it('Has proper number of dates', () => {
		expect(allDates.length).toEqual(6)
	})

	it('First date matches', () => {
		expect(allDates[0]).toEqual(new Date('2019-07-02T12:28:10Z'))
	})

	it('Last date matches', () => {
		expect(allDates[5]).toEqual(new Date('2019-07-08T09:37:22Z'))
	})
})

describe('isTheSameDay()', () => {
	it('When date is of Date type', () => {
		expect(
			isTheSameDay(new Date('2019-07-08T00:00:00Z'))(
				new Date('2019-07-08T06:48:00Z'),
			),
		).toBe(true)

		expect(
			isTheSameDay(new Date('2019-07-08T00:00:00Z'))('2019-07-08T06:48:00Z'),
		).toBe(true)

		expect(
			isTheSameDay(new Date('2018-07-08T00:00:00Z'))(
				new Date('2019-07-08T06:48:00Z'),
			),
		).toBe(false)

		expect(
			isTheSameDay(new Date('2019-08-08T00:00:00Z'))('2019-07-08T06:48:00Z'),
		).toBe(false)
	})

	it('When date is of String type', () => {
		expect(
			isTheSameDay('2019-07-08T00:00:00Z')(new Date('2019-07-08T06:48:00Z')),
		).toBe(true)

		expect(isTheSameDay('2019-07-08T00:00:00Z')('2019-07-08T06:48:00Z')).toBe(
			true,
		)

		expect(
			isTheSameDay('2018-07-08T00:00:00Z')(new Date('2019-07-08T06:48:00Z')),
		).toBe(false)

		expect(isTheSameDay('2019-08-08T00:00:00Z')('2019-07-08T06:48:00Z')).toBe(
			false,
		)
	})

	it('When date of String type is invalid', () => {
		expect(isTheSameDay('abc')(new Date('2019-07-08T06:48:00Z'))).toBe(false)

		expect(isTheSameDay('abc')('abc')).toBe(false)
	})
})

describe('toDate()', () => {
	it('When argument is valid date String or Date, return corresponding date', () => {
		expect(toDate('2019-07-08T06:48:00Z').toISOString()).toBe(
			new Date('2019-07-08T06:48:00Z').toISOString(),
		)

		expect(toDate(new Date('2019-07-08T06:48:00Z')).toISOString()).toBe(
			new Date('2019-07-08T06:48:00Z').toISOString(),
		)
	})

	it('When date String is invalid, returns invalid instance of Date', () => {
		const abc = toDate('abc')
		expect(abc instanceof Date).toBe(true)
		expect(isFinite(abc.getTime())).toBe(false)
	})
})

describe('getReversedLogsForDate()', () => {
	it('When logs for the day exist, return Array of ReversedLogs', () => {
		expect(
			getReversedLogsForDate(tasks)('2019-07-02T12:28:10Z'),
		).toStrictEqual([reversedLogs[0]])

		expect(
			getReversedLogsForDate(tasks)(new Date('2019-07-04T16:59:00Z')),
		).toStrictEqual([reversedLogs[1]])

		expect(
			getReversedLogsForDate(tasks)('2019-07-08T06:48:00Z'),
		).toStrictEqual([reversedLogs[2]])
	})

	it('When there are no logs for the day, return an empty Array', () => {
		expect(getReversedLogsForDate(tasks)('1991-07-08T06:48:00Z')).toStrictEqual(
			[],
		)
	})
})
