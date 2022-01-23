import { prepareEnvironment } from '../src';

jest.setTimeout(10000);

describe('environment utils', () => {
    it('should create empty tempt folder', async () => {
        const { ls, path, cleanup } = await prepareEnvironment();

        expect(path).toContain('cli-testing-library-');
        expect(await ls()).toMatchInlineSnapshot(`Array []`);

        await cleanup();
    });

    it('should create file', async () => {
        const FILE_NAME = 'testing-file.txt';
        const FILE_CONTENT = 'TESTING-FILE-CONTEST';

        const { ls, readFile, writeFile, cleanup } = await prepareEnvironment();

        await writeFile(FILE_NAME, FILE_CONTENT);

        expect(await readFile(FILE_NAME)).toBe(FILE_CONTENT);
        expect(await ls()).toMatchInlineSnapshot(`
            Array [
              "testing-file.txt",
            ]
        `);

        await cleanup();
    });

    it('should create sub-folder and file in it', async () => {
        const FOLDER_NAME = `subfolder`;
        const FILE_NAME = `${FOLDER_NAME}/testing-file.txt`;
        const FILE_CONTENT = 'TESTING-FILE-CONTEST';

        const { ls, readFile, writeFile, cleanup } = await prepareEnvironment();

        await writeFile(FILE_NAME, FILE_CONTENT);

        expect(await readFile(FILE_NAME)).toBe(FILE_CONTENT);
        expect(await ls()).toMatchInlineSnapshot(`
            Array [
              "subfolder",
            ]
        `);
        expect(await ls(FOLDER_NAME)).toMatchInlineSnapshot(`
            Array [
              "testing-file.txt",
            ]
        `);

        await cleanup();
    });

    it('should create and remove sub-folder', async () => {
        const FOLDER_NAME = `subfolder`;

        const { ls, makeDir, removeDir, cleanup } = await prepareEnvironment();

        await makeDir(FOLDER_NAME);

        expect(await ls()).toMatchInlineSnapshot(`
            Array [
              "subfolder",
            ]
        `);

        await removeDir(FOLDER_NAME);

        expect(await ls()).toMatchInlineSnapshot(`Array []`);

        await cleanup();
    });

    it('should check that folder and file exists', async () => {
        const FOLDER_NAME = `subfolder`;
        const FILE_NAME = `${FOLDER_NAME}/testing-file.txt`;

        const { exists, writeFile, cleanup } = await prepareEnvironment();

        await writeFile(FILE_NAME, 'TESTING-FILE-CONTEST');

        expect(await exists(FOLDER_NAME)).toBeTruthy();
        expect(await exists(FILE_NAME)).toBeTruthy();
        expect(await exists('some-other-string')).not.toBeTruthy();

        await cleanup();
    });

    it('cleanup should remove the temp folder', async () => {
        const { exists, path, cleanup } = await prepareEnvironment();

        expect(await exists(path)).toBeTruthy();

        await cleanup();

        expect(await exists(path)).not.toBeTruthy();
    });
});
