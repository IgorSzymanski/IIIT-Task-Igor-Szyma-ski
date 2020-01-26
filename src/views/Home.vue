<template>
	<div class="home">
		<b-field grouped>
			<b-field label="Od dnia">
				<b-datepicker
					placeholder="Od:"
					:max-date="end"
					v-model="start"
					size="is-small"
				>
				</b-datepicker>
			</b-field>
			<b-field label="Do dnia">
				<b-datepicker
					placeholder="Do:"
					:min-date="start"
					v-model="end"
					size="is-small"
				>
				</b-datepicker>
			</b-field>
		</b-field>
		<Scheduler
			:tasks="tasks"
			:loading="loading"
			:start="start"
			:end="end"
			@saveTask="saveTask"
			@removeTask="removeTask"
		/>
	</div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import Scheduler from '@/components/scheduler/Scheduler.vue'
import { UserTaskAPI } from '../services/UserTaskAPI'

const Home = createComponent({
	components: { Scheduler },
	setup() {
		const start = ref(new Date('2020-01-01'))
		const end = ref(new Date('2020-01-31'))

		const service = UserTaskAPI(`${process.env.VUE_APP_API_URL}userTasks`)
		service.fetchTasks()
		return { ...service, start, end }
	},
})
export default Home
</script>
