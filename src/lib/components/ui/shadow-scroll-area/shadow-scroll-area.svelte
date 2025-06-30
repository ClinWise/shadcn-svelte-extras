<script lang="ts">
	import { ScrollArea as ScrollAreaPrimitive } from 'bits-ui';
	import { ShadowScrollbar } from './index.js';
	import { cn, type WithoutChild } from '$lib/utils.js';
	import { onMount } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		orientation = 'vertical',
		scrollbarXClasses = '',
		scrollbarYClasses = '',
		enableScrollShadows = false,
		shadowSize = 'md',
		shadowColor = 'black',
		shadowOpacity = 0.1,
		shadowHideDelay = 1000,
		children,
		...restProps
	}: WithoutChild<ScrollAreaPrimitive.RootProps> & {
		orientation?: 'vertical' | 'horizontal' | 'both' | undefined;
		scrollbarXClasses?: string | undefined;
		scrollbarYClasses?: string | undefined;
		enableScrollShadows?: boolean;
		shadowSize?: 'sm' | 'md' | 'lg';
		shadowColor?: 'black' | 'gray' | 'slate';
		shadowOpacity?: number;
		shadowHideDelay?: number;
	} = $props();

	let viewportRef: HTMLElement | null = $state(null);
	let lastScrollTop = $state(0);
	let scrollDirection: 'up' | 'down' | null = $state(null);
	let isScrolling = $state(false);
	let showTopShadow = $state(false);
	let showBottomShadow = $state(false);
	let scrollTimeout: NodeJS.Timeout | null = null;
	let shadowHideTimeout: NodeJS.Timeout | null = null;

	// 根据配置生成阴影样式
	const getShadowClasses = (position: 'top' | 'bottom') => {
		const baseClasses =
			'absolute left-0 right-0 pointer-events-none transition-opacity duration-300 z-10';
		const sizeMap = {
			sm: 'h-2',
			md: 'h-4',
			lg: 'h-6'
		};

		const colorMap = {
			black: position === 'top' ? 'bg-gradient-to-b from-black' : 'bg-gradient-to-t from-black',
			gray:
				position === 'top' ? 'bg-gradient-to-b from-gray-900' : 'bg-gradient-to-t from-gray-900',
			slate:
				position === 'top' ? 'bg-gradient-to-b from-slate-900' : 'bg-gradient-to-t from-slate-900'
		};

		const positionClasses = position === 'top' ? 'top-0' : 'bottom-0';

		return `${baseClasses} ${sizeMap[shadowSize]} ${colorMap[shadowColor]} ${positionClasses}`;
	};

	// 检查是否可以滚动到某个方向
	const canScrollInDirection = (direction: 'up' | 'down') => {
		if (!viewportRef) return false;

		const { scrollTop, scrollHeight, clientHeight } = viewportRef;

		if (direction === 'up') {
			return scrollTop > 5; // 不在顶部
		}
		return scrollTop < scrollHeight - clientHeight - 5; // 不在底部
	};

	// 更新滚动状态和阴影显示
	const updateScrollState = () => {
		if (!viewportRef || !enableScrollShadows) return;

		const currentScrollTop = viewportRef.scrollTop;

		// 检测滚动方向
		if (Math.abs(currentScrollTop - lastScrollTop) > 1) {
			// 避免微小滚动导致方向误判
			if (currentScrollTop > lastScrollTop) {
				scrollDirection = 'down';
			} else if (currentScrollTop < lastScrollTop) {
				scrollDirection = 'up';
			}
		}

		lastScrollTop = currentScrollTop;
		isScrolling = true;

		// 根据滚动方向和可滚动性决定显示哪个阴影
		if (scrollDirection === 'down' && canScrollInDirection('up')) {
			// 向下滚动时显示顶部阴影（提示上方还有内容）
			showTopShadow = true;
			showBottomShadow = false;
		} else if (scrollDirection === 'up' && canScrollInDirection('down')) {
			// 向上滚动时显示底部阴影（提示下方还有内容）
			showTopShadow = false;
			showBottomShadow = true;
		}

		// 清除之前的定时器
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		}
		if (shadowHideTimeout) {
			clearTimeout(shadowHideTimeout);
		}

		// 检测滚动停止
		scrollTimeout = setTimeout(() => {
			isScrolling = false;
			scrollDirection = null;

			// 滚动停止后延迟隐藏阴影
			shadowHideTimeout = setTimeout(() => {
				showTopShadow = false;
				showBottomShadow = false;
			}, shadowHideDelay);
		}, 150); // 150ms 后认为滚动停止
	};

	// 监听滚动事件
	const handleScroll = () => {
		updateScrollState();
	};

	onMount(() => {
		if (enableScrollShadows && viewportRef) {
			// 设置初始滚动位置
			lastScrollTop = viewportRef.scrollTop;

			// 监听窗口大小变化
			const resizeObserver = new ResizeObserver(() => {
				if (viewportRef) {
					lastScrollTop = viewportRef.scrollTop;
				}
			});

			resizeObserver.observe(viewportRef);

			return () => {
				resizeObserver.disconnect();
				if (scrollTimeout) {
					clearTimeout(scrollTimeout);
				}
				if (shadowHideTimeout) {
					clearTimeout(shadowHideTimeout);
				}
			};
		}
	});
</script>

<ScrollAreaPrimitive.Root
	bind:ref
	data-slot="shadow-scroll-area"
	class={cn('relative', className)}
	{...restProps}
>
	<ScrollAreaPrimitive.Viewport
		bind:ref={viewportRef}
		data-slot="shadow-scroll-area-viewport"
		class="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
		onscroll={handleScroll}
	>
		{@render children?.()}
	</ScrollAreaPrimitive.Viewport>

	<!-- 滚动阴影 -->
	{#if enableScrollShadows}
		<!-- 顶部阴影 - 向下滚动时显示 -->
		<div
			class={getShadowClasses('top')}
			style="opacity: {showTopShadow ? shadowOpacity : 0};"
		></div>

		<!-- 底部阴影 - 向上滚动时显示 -->
		<div
			class={getShadowClasses('bottom')}
			style="opacity: {showBottomShadow ? shadowOpacity : 0};"
		></div>
	{/if}

	{#if orientation === 'vertical' || orientation === 'both'}
		<ShadowScrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if orientation === 'horizontal' || orientation === 'both'}
		<ShadowScrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
