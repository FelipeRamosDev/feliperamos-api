export interface QueryResult {
   data?: any[];
   error?: any;
   rowCount?: number;
}

export interface JoinConfig {
   path: string;
   alias?: string;
}

export interface WhereCondition {
   [key: string]: any;
}

export interface SortConfig {
   [key: string]: 'ASC' | 'DESC';
}