// --- Ambient stubs for optional peer dependencies ---

declare module "express" {
    export interface Request {
        body?: any;
        query?: any;
        params?: any;
        headers?: Record<string, string>;
    }
    export interface Response {
        status(code: number): Response;
        json(data: any): void;
        send(data: any): void;
    }
}

declare module "firebase-admin/firestore" {
    export interface DocumentData {
        [key: string]: any;
    }
    export interface DocumentReference<T = DocumentData> {
        id: string;
        path: string;
        get(): Promise<DocumentSnapshot<T>>;
        set(data: T): Promise<void>;
    }
    export interface DocumentSnapshot<T = DocumentData> {
        id: string;
        exists: boolean;
        data(): T | undefined;
    }
    export interface QueryDocumentSnapshot<T = DocumentData> extends DocumentSnapshot<T> { }
    export interface Timestamp {
        toDate(): Date;
        toMillis(): number;
    }
    export interface Transaction {
        get<T = DocumentData>(ref: DocumentReference<T>): Promise<DocumentSnapshot<T>>;
        set<T = DocumentData>(
            ref: DocumentReference<T>,
            data: T,
            options?: { merge?: boolean }
        ): Transaction;
    }
}