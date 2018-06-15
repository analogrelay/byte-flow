import { IPipe, PipeWriter, PipeReader } from "./Pipe";

class BufferPipe implements IPipe {
    private buffer: Buffer;
    private readHead: number = 0;
    private writeHead: number = 0;
    private commitHead: number = 0;

    public readonly writer: PipeWriter = new DefaultPipeWriter(this);
    public readonly reader: PipeReader = new DefaultPipeReader(this);

    public constructor() {
        // TODO: Grow the buffer!
        this.buffer = Buffer.alloc(1024);
    }

    public getBuffer(sizeHint?: number): Buffer {
        // Slice the buffer at the write head and return it
        return this.buffer.slice(this.writeHead);
    }

    public advanceWriter(count: number) {
        this.writeHead += count;
    }

    public commitWriter() {
        this.commitHead = this.writeHead;
    }

    public advanceReader(count: number) {
        this.readHead += count;
    }

    public read(): Promise<Buffer> {
        // Slice the buffer from read head to commit head
        let buf = this.buffer.slice(this.readHead, this.commitHead);
        if(buf.byteLength == 0) {
            throw new Error("Not yet implemented: waiting for new data :)");
        }
        return Promise.resolve(buf);
    }
}

class DefaultPipeReader extends PipeReader {
    public constructor(private pipe: BufferPipe) { super(); }

    public read(): Promise<Buffer> {
        return this.pipe.read();
    }

    public advance(count: number): void {
        this.pipe.advanceReader(count);
    }
}

class DefaultPipeWriter extends PipeWriter {
    public constructor(private pipe: BufferPipe) { super(); }

    public getBuffer(): Buffer;
    public getBuffer(sizeHint: number): Buffer;
    public getBuffer(sizeHint?: number): Buffer {
        return this.pipe.getBuffer(sizeHint);
    }

    public advance(count: number): void {
        this.pipe.advanceWriter(count);
    }

    public commit(): void {
        this.pipe.commitWriter();
    }
}