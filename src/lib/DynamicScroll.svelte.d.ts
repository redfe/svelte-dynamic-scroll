export default class DynamicScroll<T> extends SvelteComponent<
	DynamicScrollProps<T>,
	DynamicScrollEvents<T>,
	DynamicScrollSlots<T>
> {}
export type DynamicScrollProps<T> = ReturnType<typeof __propDef<T>>['props'];
export type DynamicScrollEvents<T> = ReturnType<typeof __propDef<T>>['events'];
export type DynamicScrollSlots<T> = ReturnType<typeof __propDef<T>>['slots'];
import { SvelteComponent } from 'svelte';
declare const __propDef: <T>() => {
	props: {
		previousChunk?: ChunkExtractor<T>;
		nextChunk?: ChunkExtractor<T>;
		bufferSize?: number;
		triggerRangeRatio?: number;
		maxRetryCountOnPreLoad?: number;
		onScrollCallback?: (event: UIEvent) => void;
		axis?: 'x' | 'y';
		list?: T[] | undefined;
		scrollPosition?: number | undefined;
	};
	events: {
		[evt: string]: CustomEvent<any>;
	};
	slots: {
		loading: {};
		default: {
			index: number;
			value: T;
		};
	};
};

export type ChunkExtractor<T> = (lastValue?: T | undefined) => T[] | Promise<T[]>;

export {};
