<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

const App = createComponent({})
export default App
</script>

<style lang="scss">
@import '@/assets/css/main';
</style>
