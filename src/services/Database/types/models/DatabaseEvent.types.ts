export type DatabaseEventHandler = (data: any) => void;
export type DatabaseEventTypes = 'before-insert' | 'after-insert' | 'before-update' | 'after-update' | 'before-delete' | 'after-delete' | 'before-select' | 'after-select' | 'custom';

export interface DatabaseEventsConfig {
   onBeforeInsert?: DatabaseEventHandler;
   onAfterInsert?: DatabaseEventHandler;
   onBeforeUpdate?: DatabaseEventHandler;
   onAfterUpdate?: DatabaseEventHandler;
   onBeforeDelete?: DatabaseEventHandler;
   onAfterDelete?: DatabaseEventHandler;
   onBeforeSelect?: DatabaseEventHandler;
   onAfterSelect?: DatabaseEventHandler;
   customs?: DatabaseEventSetup[];
}

export interface DatabaseEventSetup {
   id?: string;
   name: string;
   type: DatabaseEventTypes;
   handler: DatabaseEventHandler;
}
