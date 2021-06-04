<script>
    import { filter } from '../stores';
    import { tasks } from '../stores';

    let completed = 0, incomplete = 0;

    $: {
      completed = 0, incomplete = 0;
      for(let i in $tasks){
        if($tasks[i].status == "pending"){
          incomplete++;
        }else{
          completed++;
        }
      }
    }

    $: allTasks = $tasks.length;
    $: completedTasks = completed;
    $: incompleteTasks = incomplete;

</script>

<div class="filters">
  <button class={$filter == "all" ? "active" : ""} on:click={() => $filter = "all"}>All {allTasks !=0 ? "("+allTasks+")": ''}</button>
  <button class={$filter == "completed" ? "active" : ""} on:click={() => $filter = "completed"}>Completed {completedTasks !=0 ? "("+completedTasks+")": ''}</button>
  <button class={$filter == "incomplete" ? "active" : ""} on:click={() => $filter = "incomplete"}>Incomplete {incompleteTasks !=0 ? "("+incompleteTasks+")": ''}</button>
</div>