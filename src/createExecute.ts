import { Output } from './Output';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { homedir } from 'os';
import path from 'path';

export type ExitCode = 0 | 1;
export type ExecResult = { code: ExitCode; stdout: string[]; stderr: string[] };
export const createExecute =
    (
        base: string,
        output: Output,
        currentProcessRef?: { current: ChildProcessWithoutNullStreams | null },
        exitCodeRef?: { current: ExitCode | null }
    ) =>
    (
        runner: string,
        command: string,
        runFrom?: string
    ): Promise<ExecResult> => {
        return new Promise((accept) => {
            output.replaceStrings = {
                [homedir()]: '{{homedir}}',
                [`/private${base}`]: '{{base}}',
                [base]: '{{base}}',
                '[\\u001b\\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]':
                    '',
                '': '', // you might not see it, but there is a special ESC symbol
            };

            const args = command
                .split(' ')
                .map((arg) =>
                    arg.includes('./') ? path.join(process.cwd(), arg) : arg
                );
            let shell: ChildProcessWithoutNullStreams | null = spawn(
                runner,
                args,
                {
                    cwd: runFrom ? path.join(base, runFrom) : path.join(base),
                }
            );

            shell.stdin.setDefaultEncoding('utf8');

            if (currentProcessRef) {
                currentProcessRef.current = shell;
            }

            shell.stdout.on('data', (s: string) => (output.stdout = [s]));
            shell.stderr.on('data', (s: string) => (output.stderr = [s]));
            shell.on('close', (code: 0 | 1) => {
                if (exitCodeRef) {
                    exitCodeRef.current = code;
                }

                return accept({
                    code,
                    stdout: output.stdout,
                    stderr: output.stderr,
                });
            });

            shell.unref();
            shell = null;
        });
    };
