export declare class CountryCode {
    allCountries: ({
        name: string;
        dial_code: string;
        code: string;
        priority?: undefined;
        area_codes?: undefined;
    } | {
        name: string;
        dial_code: string;
        code: string;
        priority: number;
        area_codes: string[];
    })[];
}
