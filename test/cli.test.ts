import { prepareEnvironment } from '../src';

jest.setTimeout(10000);

describe('Tests testing the CLI and so, the testing lib itself', () => {
    describe('general', () => {
        it('runs with multiple runners', async () => {
            const { execute, cleanup } = await prepareEnvironment();

            const { code } = await execute(
                'node',
                './test/testing-cli-entry.js --help'
            );

            const { code: code2 } = await execute(
                'ts-node',
                './test/testing-cli.ts --help'
            );

            expect(code2).toBe(0);
            expect(code).toBe(0);

            await cleanup();
        });

        it('should fail without any params', async () => {
            const { execute, cleanup } = await prepareEnvironment();

            const { code, stdout, stderr } = await execute(
                'node',
                './test/testing-cli-entry.js'
            );

            expect(stdout).toMatchInlineSnapshot(`Array []`);
            expect(stderr).toMatchInlineSnapshot(`
                Array [
                  "testing-cli-entry.js <command>",
                  "Commands:",
                  "testing-cli-entry.js print [input]  print a string",
                  "testing-cli-entry.js text           ask text input",
                  "testing-cli-entry.js select         ask select input",
                  "Options:",
                  "--help     Show help                                             [boolean]",
                  "--version  Show version number                                   [boolean]",
                  "-v, --verbose  Run with verbose logging                              [boolean]",
                  "Not enough non-option arguments: got 0, need at least 1",
                ]
            `);
            expect(code).toBe(1);

            await cleanup();
        });

        it('should wait for one second', async () => {
            const { spawn, cleanup } = await prepareEnvironment();

            const { wait, waitForFinish } = await spawn(
                'node',
                './test/testing-cli-entry.js select'
            );

            const start = new Date();
            await wait(1000);
            const end = new Date();
            const delay = end.getTime() - start.getTime();

            await waitForFinish();

            expect(delay).toBeGreaterThan(990);
            expect(delay).toBeLessThan(1010);

            await cleanup();
        });

        it('should kill process', async () => {
            const { spawn, cleanup } = await prepareEnvironment();

            const { waitForText, kill, getStderr, getStdout, getExitCode } =
                await spawn('node', './test/testing-cli-entry.js select');

            await waitForText('Pick option');

            kill('SIGINT');

            expect(getStderr()).toMatchInlineSnapshot(`Array []`);
            expect(getStdout()).toMatchInlineSnapshot(`
                Array [
                  "? Pick option: › - Use arrow-keys. Return to submit.",
                  "❯   First",
                  "Second",
                ]
            `);
            expect(getExitCode()).toBe(null);

            await cleanup();
        });

        it('should enable debug logging', async () => {
            const { spawn, cleanup } = await prepareEnvironment();

            process.stdout.write = jest.fn();

            const { waitForFinish } = await spawn(
                'node',
                './test/testing-cli-entry.js --help'
            );

            await waitForFinish();

            expect(process.stdout.write).not.toBeCalled();

            const { debug, waitForFinish: waitForFinishOnceMore } = await spawn(
                'node',
                './test/testing-cli-entry.js --help'
            );

            debug();

            await waitForFinishOnceMore();

            expect(process.stdout.write).toBeCalled();

            await cleanup();
        });
    });

    describe('command:help', () => {
        it('should print help', async () => {
            const { execute, cleanup } = await prepareEnvironment();

            const { code, stdout, stderr } = await execute(
                'node',
                './test/testing-cli-entry.js --help'
            );

            expect(stdout).toMatchInlineSnapshot(`
                            Array [
                              "testing-cli-entry.js <command>",
                              "Commands:",
                              "testing-cli-entry.js print [input]  print a string",
                              "testing-cli-entry.js text           ask text input",
                              "testing-cli-entry.js select         ask select input",
                              "Options:",
                              "--help     Show help                                             [boolean]",
                              "--version  Show version number                                   [boolean]",
                              "-v, --verbose  Run with verbose logging                              [boolean]",
                            ]
                    `);
            expect(stderr).toMatchInlineSnapshot(`Array []`);
            expect(code).toBe(0);

            await cleanup();
        });
    });

    describe('command:input', () => {
        it('should print the value provided', async () => {
            const { execute, cleanup } = await prepareEnvironment();

            const { code, stdout } = await execute(
                'node',
                './test/testing-cli-entry.js print print-this-string'
            );

            expect(stdout).toMatchInlineSnapshot(`
                            Array [
                              "cli:print: print-this-string",
                            ]
                    `);
            expect(code).toBe(0);
        });

        it('should print the value provided with verbose option', async () => {
            const { execute, cleanup } = await prepareEnvironment();

            const { code, stdout } = await execute(
                'node',
                './test/testing-cli-entry.js print print-this-string -v'
            );

            expect(stdout).toMatchInlineSnapshot(`
                            Array [
                              "Running in verbose mode.",
                              "cli:print: print-this-string",
                            ]
                    `);
            expect(code).toBe(0);

            await cleanup();
        });
    });

    describe('command:text', () => {
        it('should give exit code when program finished', async () => {
            const { spawn, cleanup } = await prepareEnvironment();

            const { waitForFinish, getExitCode } = await spawn(
                'node',
                './test/testing-cli-entry.js --help'
            );
            expect(getExitCode()).toBe(null);

            await waitForFinish();

            expect(getExitCode()).toBe(0);

            await cleanup();
        });

        it('should ask for text and print it', async () => {
            const { spawn, cleanup } = await prepareEnvironment();

            const {
                waitForText,
                waitForFinish,
                writeText,
                pressKey,
                getStdout,
                getExitCode,
            } = await spawn('node', './test/testing-cli-entry.js text');

            await waitForText('Give me a number');
            await writeText('15');
            await pressKey('enter');
            await waitForFinish();

            expect(getStdout()).toMatchInlineSnapshot(`
                Array [
                  "? Give me a number: ›",
                  "? Give me a number: › 1",
                  "? Give me a number: › 15",
                  "✔ Give me a number: … 15",
                  "Answered: 15",
                ]
            `);
            expect(getExitCode()).toBe(0);

            await cleanup();
        });
    });

    describe('command:select', () => {
        it('should select an option and print it', async () => {
            const { spawn, cleanup } = await prepareEnvironment();

            const { waitForText, waitForFinish, getStdout, pressKey } =
                await spawn('node', './test/testing-cli-entry.js select');

            await waitForText('Pick option');
            await pressKey('arrowDown');
            await pressKey('enter');
            await waitForFinish();

            expect(getStdout()).toMatchInlineSnapshot(`
                Array [
                  "? Pick option: › - Use arrow-keys. Return to submit.",
                  "❯   First",
                  "Second",
                  "? Pick option: › - Use arrow-keys. Return to submit.",
                  "First",
                  "❯   Second",
                  "✔ Pick option: › Second",
                  "Picked: second option",
                ]
            `);

            await cleanup();
        });
    });
});
