<script>
	import { error, tasks } from '../stores';

	let CurrentTask ="";

	function addTask(){
		if(CurrentTask != ""){
			$tasks = [{
				titleTask:CurrentTask,
				status:"pending"
			}, ...$tasks];
			CurrentTask = "";
		}else{
			$error = true;
			setTimeout(()=>{$error=false}, 2000);
		}
	}
</script>

<form class='form'>
    <input bind:value={CurrentTask} id="input" type="text" placeholder="Add a new task!">
    <button id="add" on:click|preventDefault={addTask}>Add</button>
    <button on:click|preventDefault={()=>$tasks = []}>Clear</button>
</form>

<p class="MsgError {! $error ? "opacity" : " "}">Give the task a title first.</p>