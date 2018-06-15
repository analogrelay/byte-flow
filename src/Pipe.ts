import { Buffer } from "buffer";

export const Pipe = {
    create(): IPipe {
        return new PipeImpl();
    }
};

export interface IPipe {
    readonly writer: PipeWriter;
    readonly reader: PipeReader;
}

export abstract class PipeReader {
    public abstract read(): Promise<Buffer>;

    public abstract advance(count: number): void;
}

export abstract class PipeWriter {
    public abstract getBuffer(): Buffer;
    public abstract getBuffer(sizeHint: number): Buffer;
    public abstract getBuffer(sizeHint?: number): Buffer;

    public abstract advance(count: number): void;
    public abstract commit(): void;
}
