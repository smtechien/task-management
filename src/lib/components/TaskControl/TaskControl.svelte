<script lang="ts">
	type TaskData = {
		id?: string;
		state: 'PLAY' | 'PAUSE' | 'STOP' | 'DONE';
	};

	interface Props {
		task: TaskData;
	}

	const {
		task = {
			id: '',
			state: 'PLAY'
		}
	}: Props = $props();
</script>

<button
	id={task.id}
	name="taskControl"
	class="coba button bg-blue-500 p-1 text-2xl hover:bg-red-200"
>
	<span class={task.state}>{task.state}</span>
</button>

<style>
	.coba {
		font-size: 1em;
	}
</style>
