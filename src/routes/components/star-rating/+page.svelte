<script lang="ts">
	import { CodeSpan, Subheading } from '$lib/components/docs';
	import Installation from '$lib/components/installation.svelte';
	import Playground from '$lib/components/playground.svelte';
	import Code from '$lib/components/docs/code.svelte';
	import { Link } from '$lib/components/ui/link';
	import { examples } from './examples';
</script>

<Subheading class="mt-0">Basic</Subheading>
<p>
	The <CodeSpan>{'<StarRating/>'}</CodeSpan> component builds on top of the <Link
		href="https://bits-ui.com"
		target="_blank">bits-ui</Link
	>
	<CodeSpan>{'<RatingGroup/>'}</CodeSpan> component so it has all the behaviors you'd expect.
</p>
<Playground code={examples.basic.code}>
	<examples.basic.Component />
</Playground>
<Installation specifier="ui/star-rating" />
<Subheading>Usage</Subheading>
<div>
	<Code
		lang="svelte"
		code={`\<script lang="ts"\>
	import * as StarRating from '$lib/components/ui/star-rating';
\<\/script\>

<StarRating.Root>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<StarRating.Star {...item} />
		{/each}
	{/snippet}
</StarRating.Root>`}
	/>
</div>
<Subheading>Custom Stars</Subheading>
<p>You can have an arbitrary number of stars.</p>
<Playground code={examples.customStars.code}>
	<examples.customStars.Component />
</Playground>
<Subheading>Half Rating</Subheading>
<p>You can also have half ratings. And they even work in RTL!</p>
<Playground code={examples.halfRating.code}>
	<examples.halfRating.Component />
</Playground>
<Subheading>Disabled</Subheading>
<Playground code={examples.disabled.code}>
	<examples.disabled.Component />
</Playground>
<Subheading>Readonly</Subheading>
<Playground code={examples.readonly.code}>
	<examples.readonly.Component />
</Playground>
<Subheading>Custom Color</Subheading>
<Playground code={examples.customColor.code}>
	<examples.customColor.Component />
</Playground>
<Subheading>Custom Size</Subheading>
<Playground code={examples.customSize.code}>
	<examples.customSize.Component />
</Playground>
