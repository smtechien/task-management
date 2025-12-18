<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import TaskControl from './TaskControl.svelte';

	export const TaskData = {
		id: '1',
		state: 'PLAY'
	};

	const { Story } = defineMeta({
		title: 'Task Control Button',
		component: TaskControl
	});
</script>

<Story name="Default" args={{ task: TaskData }} />
<Story name="Pause" args={{ task: { ...TaskData, state: 'PAUSE' } }} />
<Story name="Stop" args={{ task: { ...TaskData, state: 'STOP' } }} />
<Story name="Done" args={{ task: { ...TaskData, state: 'DONE' } }} />
