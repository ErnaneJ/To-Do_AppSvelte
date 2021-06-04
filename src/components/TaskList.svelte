<script>
  import Task from './Task.svelte';

  import { filter, tasks } from '../stores';
</script>
<div class="tasks">
    {#each $tasks as task, index}
        {#if $filter=='all'}
            <Task bind:task={task} index={index}/>
        {:else if $filter=='completed'}
            {#if task.status=='completed'}
                <Task bind:task={task} index={index}/>
            {/if}
        {:else}
            {#if task.status=='pending'}
                <Task bind:task={task} index={index}/>
            {/if}
        {/if}
    {/each}
</div>

