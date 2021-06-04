<script>
	import TaskList from './components/TaskList.svelte';
	import Filter from './components/Filters.svelte';
  import AddTask from './components/AddTask.svelte';
</script>

<main class="container">
	<div class="To-Do">
		<AddTask/>
		<TaskList/>
		<Filter/>
	</div>
</main>