export interface IObject { [key: string]: any }

export interface Dictionary {
    [key: string]: string
}

type Impossible<K extends keyof any> = {
    [P in K]: never;
};
export type NoExtraProperties<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>;