export type ChunkExtractor<T> = (lastValue?: T) => T[] | Promise<T[]>;
