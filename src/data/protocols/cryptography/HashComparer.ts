export interface HashComparer {
    compare(payload: string, digest: string): Promise<boolean>;
}
