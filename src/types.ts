import { ExecResult, ExitCode } from './createExecute';
import { KeyMap } from './keyToHEx';

export type SpawnResult = {
    wait: (delay: number) => Promise<void>;
    waitForText: (
        output: string
    ) => Promise<{ line: string; type: 'stdout' | 'stderr' }>;
    waitForFinish: () => Promise<ExecResult>;
    writeText: (input: string) => Promise<void>;
    getStdout: () => string[];
    getStderr: () => string[];
    getExitCode: () => null | ExitCode;
    kill: (signal: NodeJS.Signals) => void;
    debug: () => void;
    pressKey: (input: KeyMap) => Promise<void>;
};

export type CLITestEnvironment = {
    path: string;
    cleanup: () => Promise<void>;
    writeFile: (path: string, content: string) => Promise<void>;
    readFile: (path: string) => Promise<string>;
    removeFile: (path: string) => Promise<void>;
    removeDir: (path: string) => Promise<void>;
    ls: (path?: string) => Promise<string[]>;
    exists: (path: string) => Promise<boolean>;
    makeDir: (path: string) => Promise<void>;

    execute: (
        runner: string,
        command: string,
        runFrom?: string
    ) => Promise<ExecResult>;
    spawn: (
        runner: string,
        command: string,
        runFrom?: string
    ) => Promise<SpawnResult>;
};
