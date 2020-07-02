export interface StoreConfig {
    state: string;
    initialState?: {
        [property: string]: any;
    };
    actions?: {
        name: string;
        service: any;
        method: string;
    }[];
    useLocalStorage?: boolean;
};

export enum StoreActions {
    ACTION = 'ACTION',
    GET = 'GET',
    SET = 'SET',
    UNSET = 'UNSET',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}