export type Options = {
    option: string;
};
export default class LibTitle {
    private destroyed: boolean = false;
    private options: Options;
    public static defaultOptions: Options = {
        option: 'option',
    };

    constructor(options?: Partial<Options>) {
        this.options = {
            ...LibTitle.defaultOptions,
            ...options,
        };
    }

    public destroy = () => {
        if (this.destroyed) {
            return;
        }

        this.destroyed = true;
    };
}
