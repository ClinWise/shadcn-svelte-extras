<script lang="ts">
	import { Subheading } from '$lib/components/docs';
	import Installation from '$lib/components/installation.svelte';
	import Playground from '$lib/components/playground.svelte';
	import Code from '$lib/components/docs/code.svelte';
	import { examples } from './examples';
</script>

<Playground replay code={examples.basic.code}>
	<examples.basic.Component />
</Playground>
<Installation specifier="hooks/use-promise.svelte" />
<Subheading>Usage</Subheading>
<p>Set a default value for the version until it is streamed back from the server.</p>
<div>
	<Code
		lang="svelte"
		highlight={[2, 6, 12]}
		code={`\<script lang="ts"\>
    import { UsePromise } from $'lib/hooks/use-promise.svelte.js';

    let { data } = $props();

    const version = new UsePromise(data.version, '1.x.x');
\<\/script\>

<!-- 1.x.x until resolved -->
<PMCommand
    command="execute"
    args={[\`jsrepo@\${version.current}\`, 'add', 'hooks/use-promise.svelte']}
/>`}
	/>
</div>
