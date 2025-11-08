// --- Ambient stubs for optional peer dependencies ---

// Speech Recognition API types
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
};

interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
}

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