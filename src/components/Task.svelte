<script>
  import { filter, tasks } from '../stores';

  export let task, index;

  function markComplete(index){
    if($tasks[index].status==="pending" ){
      $tasks[index].status = "completed";
    }else{
      $tasks[index].status ="pending";
    }
		
		$tasks = [...$tasks];
	}
	function removeTask(index){
		$tasks.splice(index,1);
		$tasks = [...$tasks];
	}
</script>

<div class="task">
    <h4>{task.titleTask}</h4>
    <div class="btn-group">
        {#if $filter=='all'}
            <button id="complete{index}" class="{task.status=='completed'?'active':''}" on:click={()=>markComplete(index)}>&#10004</button>
            <button id="remove{index}" on:click={()=>{removeTask(index)}}>&#10006;</button>
        {:else if $filter=='completed'}
            <button id="remove{index}" on:click={()=>{removeTask(index)}}>&#10006;</button>
        {:else}
            <button id="complete{index}" class="{task.status=='completed'?'active':''}" on:click={()=>markComplete(index)}>&#10004</button>
        {/if}
    </div>
</div>