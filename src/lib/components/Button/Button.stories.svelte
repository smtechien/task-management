<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Button from './Button.svelte';

  const { Story } = defineMeta({
    title: 'Button',
    component: Button,
  });
</script>

<Story name="Default" />
