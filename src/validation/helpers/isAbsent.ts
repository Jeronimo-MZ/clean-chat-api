export const isAbsent = (value: any): value is undefined | null => {
    return value === null || value === undefined;
};
