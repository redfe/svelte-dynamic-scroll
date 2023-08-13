export type ChunkExtractor<T> = (lastValue?: T | undefined) => T[] | Promise<T[]>;
