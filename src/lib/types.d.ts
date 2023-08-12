export type Value = { id?: any } | number | string | bigint | boolean | symbol;
export type ChunkExtractor = (lastValue?: Value) => Value[] | Promise<Value[]>;
