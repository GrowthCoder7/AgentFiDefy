// global.d.ts
declare var pink: any;

// If you want more specific types:
interface Pink {
    deriveSecret(salt: string): Uint8Array;
    httpRequest(config: {
        url: string;
        method: string;
        headers?: Record<string, string>;
        body?: string | Uint8Array;
    }): {
        statusCode: number;
        body: string | Uint8Array;
    };
}
declare var pink: Pink;