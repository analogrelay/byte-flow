export class PromiseSource<T> {
    private rejecter?: (reason?: any) => void;
    private resolver?: (value?: T | PromiseLike<T>) => void;

    public readonly promise: Promise<T>;

    public constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolver = resolve;
            this.rejecter = reject;
        });
    }

    public resolve(value?: T | PromiseLike<T>): void {
        this.resolver(value);
    }

    public reject(reason?: any): void {
        this.rejecter(reason);
    }
}