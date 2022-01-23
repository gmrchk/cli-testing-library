export type OutputType = 'stdout' | 'stderr';
export type InternalOutputType = '_stdout' | '_stderr';

export class Output {
    private _stdoutHandlers: ((line: string, type: 'stdout') => void)[] = [];
    private _stderrHandlers: ((line: string, type: 'stderr') => void)[] = [];

    private _stdout: string[] = [];
    private _stderr: string[] = [];

    public replaceStrings: Record<string, string> = {};

    public get stdout(): string[] {
        return this.processStdLineGet(this._stdout);
    }

    public set stdout(value: string[]) {
        this.processStdLineSet(value, '_stdout');
        this._stdoutHandlers.forEach((fn) => {
            fn(value[0], 'stdout');
        });
    }

    public get stderr(): string[] {
        return this.processStdLineGet(this._stderr);
    }

    public set stderr(value: string[]) {
        this.processStdLineSet(value, '_stderr');
        this._stderrHandlers.forEach((fn) => {
            fn(value[0], 'stderr');
        });
    }

    private processStdLineSet = (value: string[], type: InternalOutputType) => {
        value.forEach((input) => {
            input
                .toString()
                .split('\n')
                .forEach((line) => {
                    this[type].push(line);
                });
        });
    };

    private processStdLineGet = (buffer: string[]) => {
        const output = buffer
            .map((line) => {
                let output = line.toString();

                for (const [original, replaced] of Object.entries(
                    this.replaceStrings
                )) {
                    const reg = new RegExp(original, 'gm');

                    output = output.replace(reg, replaced);
                    output = output.trim();
                }

                return output;
            })
            .filter((line) => line !== '');

        return output;
    };

    public on = (
        handler: (line: string, type: OutputType) => void,
        type?: OutputType
    ) => {
        if (type === 'stdout') {
            this._stdoutHandlers.push(handler);
            return;
        }
        if (type === 'stderr') {
            this._stderrHandlers.push(handler);
            return;
        }

        this._stdoutHandlers.push(handler);
        this._stderrHandlers.push(handler);
    };

    public off = (
        handler: (line: string, type: OutputType) => void,
        type?: OutputType
    ) => {
        if (type === 'stdout') {
            this._stdoutHandlers = this._stdoutHandlers.filter(
                (item) => item !== handler
            );
            return;
        }
        if (type === 'stderr') {
            this._stderrHandlers = this._stderrHandlers.filter(
                (item) => item !== handler
            );
            return;
        }

        this._stdoutHandlers = this._stdoutHandlers.filter(
            (item) => item !== handler
        );
        this._stderrHandlers = this._stderrHandlers.filter(
            (item) => item !== handler
        );
    };
}
