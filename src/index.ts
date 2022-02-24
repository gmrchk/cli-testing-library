/** @license CLI testing library
 * Copyright (c) Georgy Marchuk.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ChildProcessWithoutNullStreams } from 'child_process';
import {
    copyFile,
    readFile,
    unlink,
    rmdir,
    writeFile,
    mkdtemp,
    access,
    readdir,
    mkdir,
} from 'fs';
import path from 'path';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { CLITestEnvironment, SpawnResult } from './types';
import { Output, OutputType } from './Output';
import { checkRunningProcess } from './utils';
import { createExecute, ExecResult, ExitCode } from './createExecute';
import { keyToHEx, KeyMap } from './keyToHEx';

export const copy = promisify(copyFile);
export const fsRead = promisify(readFile);
export const fsWrite = promisify(writeFile);
export const fsRemove = promisify(unlink);
export const fsRemoveDir = promisify(rmdir);
export const fsMakeDir = promisify(mkdir);
export const fsMakeTempDir = promisify(mkdtemp);
export const fsReadDir = promisify(readdir);
export const fsAccess = promisify(access);
export const relative = (p: string) => path.resolve(__dirname, p);

export const prepareEnvironment = async (): Promise<CLITestEnvironment> => {
    const hasCalledCleanup: {
        current: boolean;
    } = { current: false };
    const startedTasks: { current: ChildProcessWithoutNullStreams | null }[] =
        [];
    const tempDir = await fsMakeTempDir(
        path.join(tmpdir(), 'cli-testing-library-')
    );
    const relative = (p: string) => path.resolve(tempDir, p);
    const cleanup = async () => {
        hasCalledCleanup.current = true;

        startedTasks.forEach((task) => {
            task.current?.kill(0);
            task.current?.stdin.end();
            task.current?.stdin.destroy();
            task.current?.stdout.destroy();
            task.current?.stderr.destroy();

            task.current = null;
        });

        await fsRemoveDir(tempDir, { recursive: true });
    };

    try {
        const execute = async (
            runner: string,
            command: string,
            runFrom?: string
        ) => {
            const output = new Output();
            const currentProcessRef: {
                current: ChildProcessWithoutNullStreams | null;
            } = { current: null };

            const scopedExecute = createExecute(
                tempDir,
                output,
                currentProcessRef
            );

            startedTasks.push(currentProcessRef);

            return await scopedExecute(runner, command, runFrom);
        };
        const spawn = async (
            runner: string,
            command: string,
            runFrom?: string
        ): Promise<SpawnResult> => {
            const output = new Output();
            const currentProcessRef: {
                current: ChildProcessWithoutNullStreams | null;
            } = { current: null };
            const exitCodeRef: { current: ExitCode | null } = { current: null };
            let currentProcessPromise: Promise<ExecResult> | null = null;

            const scopedExecute = createExecute(
                tempDir,
                output,
                currentProcessRef,
                exitCodeRef
            );

            startedTasks.push(currentProcessRef);

            currentProcessPromise = scopedExecute(runner, command, runFrom);

            const waitForText = (
                input: string
            ): Promise<{ line: string; type: OutputType }> => {
                return new Promise((resolve) => {
                    const handler = (value: string) => {
                        if (value.toString().includes(input)) {
                            resolve({
                                type: 'stdout',
                                line: value.toString(),
                            });

                            output.off(handler);
                        }
                    };

                    output.on(handler);
                });
            };
            const wait = (delay: number): Promise<void> => {
                return new Promise((resolve) => {
                    setTimeout(resolve, delay);
                });
            };
            const waitForFinish = async (): Promise<ExecResult> => {
                if (currentProcessPromise) {
                    currentProcessRef.current?.stdin.end();

                    return currentProcessPromise;
                }

                return new Promise((resolve) => {
                    resolve({
                        code: exitCodeRef.current as ExitCode,
                        stdout: output.stdout,
                        stderr: output.stderr,
                    });
                });
            };
            const writeText = async (input: string): Promise<void> => {
                return new Promise((resolve) => {
                    if (checkRunningProcess(currentProcessRef)) {
                        currentProcessRef.current.stdin.write(input, () =>
                            resolve()
                        );
                    }
                });
            };
            const pressKey = async (input: KeyMap): Promise<void> => {
                return new Promise((resolve) => {
                    if (checkRunningProcess(currentProcessRef)) {
                        currentProcessRef.current.stdin.write(
                            keyToHEx(input),
                            () => {
                                resolve();
                            }
                        );
                    }
                });
            };
            const kill = (signal: NodeJS.Signals) => {
                if (checkRunningProcess(currentProcessRef)) {
                    currentProcessRef.current.kill(signal);
                }
            };
            const debug = () => {
                const handler = (value: string, type: OutputType) => {
                    process[type].write(value);
                };

                output.on(handler);
            };

            return {
                wait,
                waitForFinish,
                waitForText,
                pressKey,
                writeText,
                kill,
                debug,
                getStdout: () => output.stdout,
                getStderr: () => output.stderr,
                getExitCode: () => exitCodeRef.current,
            };
        };
        const exists = async (path: string) => {
            try {
                await fsAccess(relative(path));

                return true;
            } catch {
                return false;
            }
        };
        const makeDir = async (path: string) => {
            await fsMakeDir(relative(path), { recursive: true });
        };
        const writeFile = async (p: string, content: string) => {
            const dir = path.dirname(relative(p));
            if (!(await exists(dir))) {
                await makeDir(dir);
            }
            await fsWrite(relative(p), content);
        };
        const readFile = async (path: string) => {
            return (await fsRead(relative(path))).toString();
        };
        const removeFile = async (path: string) => {
            return await fsRemove(relative(path));
        };
        const removeDir = async (path: string) => {
            return await fsRemoveDir(relative(path));
        };
        const ls = async (path?: string) => {
            return await fsReadDir(path ? relative(path) : tempDir);
        };

        return {
            path: tempDir,
            cleanup,
            writeFile,
            readFile,
            removeFile,
            removeDir,
            ls,
            exists,
            makeDir,
            execute,
            spawn,
        };
    } catch (e) {
        await cleanup();
        throw e;
    }
};
