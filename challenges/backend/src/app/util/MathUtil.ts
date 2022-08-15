export abstract class MathUtil {

    public static Average(items: number[]): number {
        return MathUtil.Sum(items) / (items?.length || 1);
    }

    public static Sum(items: number[]): number {
        return items?.reduce((total, currentValue) => total + currentValue, 0)
    }

    public static trunc(value: number, digits: number): number {
        return Math.trunc(value * Math.pow(10, digits)) / Math.pow(10, digits);
    }
}