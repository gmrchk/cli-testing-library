# Lib template
You should: 
* Replace any occurences of LibTitle
* Replace `site/src/images/icon.png`
* Replace `site/src/images/og.png`
* Replace `linear-gradient(` colors

---
<h1 align="center">CLI Testing Library</h1>
<p align="center">
  Small but powerful library for testing CLI the way they are used.
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@gmrchk/cli-testing-library"><img src="https://img.shields.io/npm/v/@gmrchk/cli-testing-library.svg?color=brightgreen" alt="npm version"></a>
    <a href="https://github.com/gmrchk/LibName/blob/master/LICENSE"><img src="https://img.shields.io/github/license/gmrchk/cli-testing-library.svg" alt="License"></a>
    <a href="https://github.com/gmrchk/cli-testing-library/actions/workflows/test.yml"><img src="https://github.com/gmrchk/cli-testing-library/actions/workflows/test.yml/badge.svg" alt="Test"></a>
</p>

```javascript
it('testing CLI the way they are used', async () => {
    const { spawn, cleanup } = await prepareEnvironment();
    const { wait, waitForText, waitForFinish, writeText, getStdout, getStderr, getExitCode, kill, debug, pressKey } = await spawn(
        'node',
        './my-cli.js start'
    );

    debug();   // enables logging to console from the tested program
    
    await wait(1000);   // wait one second
    await waitForText('Enter your name:');   // wait for question
    await writeText('John');   // answer the question above
    await pressKey('enter');   // confirm with Enter
    await waitForFinish();   // wait for program to finish

    kill(); // would kill the program if we didn't wait for finish above

    getStdout();   // ['Enter your name:', ...]
    getStderr();   // [] empty since no errors encountered
    getExitCode();   // 0 since we finished successfully
  
    await cleanup();    // cleanup after test
});
```

- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [execute](#execute)
  - [spawn](#spawn)
  - [cleanup](#cleanup)
  - [path](#path)
  - [writeFile](#writeFile)
  - [readFile](#readFile)
  - [removeFile](#removeFile)
  - [removeDir](#removeDir)
  - [ls](#ls)
  - [exists](#exists)
  - [makeDir](#makeDir)
  - [makeDir](#makeDir)
- [Contributions](#contributions)
- [License](#license)


## Motivation
Just like [Testing Library](https://testing-library.com/), this library aims to provide a way to test the flows actually encountered by the users.
While there are certainly ways to unit tests various parts of your CLI without actually running the CLI itself, a test providing an identical flow to what the user of the CLI would do provides a much better reassurance of the things working the way they should.

Although this library is written and tested using JavaScript tools (TypeScript, Jest), it works directly with shell, and so it can be used to test CLIs written in any language.  

Since most CLIs will at least in some scenarios read or manipulate file system, it would be hard for us to run tests without affecting other tests manipulating the same filesystem.
That's why this library creates completely enclosed environment for each test, including the filesystem. 

## Installation
The best way to consume CLI Testing Library is as the npm package.
You can install the library with package managers like **npm** or **yarn**.

```shell
npm install @gmrchk/cli-testing-library --save-dev
# or 
yarn add @gmrchk/cli-testing-library --dev
```

Once the package is installed as a node module (eg. inside of `node_modules` folder), you can access it from `@gmrchk/cli-testing-library` path.

```javascript
import CLITestingLibary from '@gmrchk/cli-testing-library';
```

The library is provided together with TypeScript type definitions.  

## Usage
The core of the library is the `prepareEnvironment` function, which should be part of any test.
The call of this function creates a completely independent environment for running further commands, including temporary filesystem space. 

```javascript
import { prepareEnvironment } from '@gmrchk/cli-testing-library';

describe('My CLI', () => {
    it('program runs successfully', async () => {
        const { execute, cleanup } = await prepareEnvironment();

        const { code } = await execute(
            'node',
            './my-cli.js --help'
        );
        
        expect(code).toBe(0);

        await cleanup();
    });
});
```

The `prepareEnvironment` returns a bunch of helpers described further. 
An important part to notice is the use of `cleanup` function returned by the `prepareEnvironment`. 
Just like the fully independent environment is created per test, it is also fully cleaned up this way, including any memory leaks in your CLI itself which could prevent tests from running correctly.   

## API
As mentioned before, `prepareEnvironment` is at the core of this library. 
Any test begins with creating an independent environment. 

This function returns all kinds of helper described below.
Most of them are mostly self-explanatory, and together with the provided TypeScript types could be used without exploring the documentation too much. 

### execute
Serves to run a command and waiting for it to finish. 
This should be used for most CLI commands that have no interactive prompts as a part of the program.

The function accepts three parameter: 
1. `runner` - the command used for running shell process, like `node`.
2. `command` - any arguments provided to the runner, such as location of the file to execute. It can also contain any arguments or options you might wish to include for you CLI, like `./my-cli.js --help`. In combination with the `runner` it should be the way you would run your CLI.  
2. `runFrom` **optional** sub path to run the command from. The sub path is automatically relatives to the enclosed filesystem created.    

The function return several things: 
* `code` - the exit code of the program. Usually if the value is `0`, the program finished successfully.
* `stdout` - an array of lines outputted by the program through the execution.  
* `stderr` - an array of lines outputted by the program through the execution as an error output. This array would normally only contain something when program failed.

To prevent inconsistencies across test runs (on the same or different machines), `stdout` and `stderr` output is normalized, cleaned of any special shell/OS characters or empty lines, and any paths pointing to a specific place on the current disk are modified to not contain things specific to current environment. For example, output of the home folder of current user is replace with generic `{{homedir}}`.

```javascript
it('program runs successfully', async () => {
    const { execute, cleanup } = await prepareEnvironment();
    const { code, stdout, stderr } = await execute(
        'node',
        './my-cli.js --help'
    );

    console.log(code); // 0
    console.log(stdout); // ["Hello world!"]
    console.log(stderr); // []

    await cleanup();
});
```

### spawn
Similar to `execute`, it serves to run a command. 
However, instead of simply waiting for the program, it allows you to control it.

This should be used for most CLI commands that have interactive prompts as a part of the program.

The function accepts three parameter:
1. `runner` - the command used for running shell process, like `node`.
2. `command` - any arguments provided to the runner, such as location of the file to execute. It can also contain any arguments or options you might wish to include for you CLI, like `./my-cli.js --help`. In combination with the `runner` it should be the way you would run your CLI.
2. `runFrom` **optional** sub path to run the command from. The sub path is automatically relatives to the enclosed filesystem created.

The function return several bunch of methods to communicate/control the tested CLI program:
* `wait` - wait for given amount of miliseconds.
* `waitForText` - wait for given string in output received in `stdout` or `stderr` output of the CLI. For example, it can be used to wait for a certain question from the CLI.
* `waitForFinish` - wait for the program to finish and exit.
* `writeText` - input text into the program. It can be used to answer any text questions from the CLI.
* `getStdout` - get the current array of text `stdout` lines. It can change all the way until the program has finished. 
* `getStderr` - get the current array of text `stderr` lines. It can change all the way until the program has finished.
* `getExitCode` - get the exit code of a program. Usually if the value is `0`, the program finished successfully. If the program hasn't finished, the value is `null`. 
* `kill` - kill the program.
* `debug` - enable logging of the running program into the console where the test is running. As name suggest, this is only for debugging purposes.
* `pressKey` - simulate key press of certain keyboard key. The options are following:
  * `arrowDown`
  * `arrowLeft`
  * `arrowRight`
  * `arrowUp`
  * `backSpace`
  * `delete`
  * `end`
  * `enter`
  * `escape`
  * `home`
  * `pageUp`
  * `pageDown`
  * `space`

```javascript
it('should ask for name and wait for input string', async () => {
    const { spawn, cleanup } = await prepareEnvironment();
    const { wait, waitForText, waitForFinish, writeText, getStdout, getStderr, getExitCode, kill, debug, pressKey } = await spawn(
        'node',
        './my-cli.js start'
    );

    debug();   // enables logging to console from the tested program
    
    await wait(1000);   // wait one second
    await waitForText('Enter your name:');   // wait for question
    await writeText('John');   // answer the question above
    await pressKey('enter');   // confirm with Enter
    await waitForFinish();   // wait for program to finish

    kill(); // would kill the program if we didn't wait for finish above

    getStdout();   // ['Enter your name:', ...]
    getStderr();   // [] empty since no errors encountered
    getExitCode();   // 0 since we finished successfully
  
    await cleanup();    // cleanup after test
});
```

### cleanup
Should be run any time the `prepareEnvironment` is called and test finished. 
The function makes sure that: 
* No filesystem files or folders are left behind on the disk.
* No pending node interfaces or timers are left pending. 
* No unfinished tasks are within program, that could prevent the test run from finishing and leaving the test run hanging. 

```javascript
it('program', async () => {
    const { execute, cleanup } = await prepareEnvironment();
    await execute('node', './my-cli.js create-file');

    await cleanup();
});
```

### path
The path to the filesystem root folder created for the test run environment. 

```javascript
it('program', async () => {
    const { cleanup, path } = await prepareEnvironment();
    
    console.log(path);  // path to temporary folder on the disk

    await cleanup();
});
```

### writeFile
Write a file inside of the created filesystem. Accepts: 
1. `path` - the path to file, including its name, extension, or the full path to it. Any folders in the path that don't exist will be created.
2. `content` - string to write into the file. 

```javascript
it('program', async () => {
    const { cleanup, writeFile } = await prepareEnvironment();

    await writeFile('./subfolder/file.txt', 'this will be content');

    await cleanup();
});
```

### readFile
Read a file inside of the created filesystem. Returns string. Accepts:
1. `path` - the path to file, including its name, extension, or the full path to it. 

```javascript
it('program', async () => {
    const { cleanup, readFile } = await prepareEnvironment();

    const content = await readFile('./subfolder/file.txt');
    cosnole.log(content);   // this will be content

    await cleanup();
});
```

### removeFile
Remove a file inside of the created filesystem. Accepts:
1. `path` - the path to file, including its name, extension, or the full path to it.

```javascript
it('program cleanup', async () => {
    const { cleanup, removeFile } = await prepareEnvironment();

    await removeFile('./subfolder/file.txt');

    await cleanup();
});
```

### removeDir
Remove a directory inside of the created filesystem. Removes any files or subfolders in it also. Accepts:
1. `path` - the path to directory, including the full path to it.

```javascript
it('program cleanup', async () => {
    const { cleanup, removeDir } = await prepareEnvironment();

    await removeDir('./subfolder');

    await cleanup();
});
```

### ls
Print out the array of files and folders inside of give folder in a created filesystem. Accepts:
1. `path` - **optional** path to directory, including the full path to it.

```javascript
it('program cleanup', async () => {
    const { cleanup, ls } = await prepareEnvironment();

    await ls('./'); // ['subfolder', 'some-file.txt']

    await cleanup();
});
```

### exists
Checks whether file exists inside of the created filesystem. Accepts:
1. `path` - the path to file, including its name, extension, or the full path to it.

```javascript
it('program cleanup', async () => {
    const { cleanup, ls } = await prepareEnvironment();

    await ls('./'); // ['subfolder', 'some-file.txt']

    await cleanup();
});
```

### makeDir
Creates folder inside of the created filesystem. Accepts:
1. `path` - the path to folder, including its name, or the full path to it. Any folders in the path that don't exist will be created.

```javascript
it('program cleanup', async () => {
    const { cleanup, makeDir } = await prepareEnvironment();

    await makeDir('./subfolder'); 

    await cleanup();
});
```


## Contributions
Any contributions are welcome!

Remember, if merged, your code will be used as part of a free product. 
By submitting a Pull Request, you are giving your consent for your code to be integrated into LibTitle as part of a commercial product.

## License
Check the LICENSE.md file in the root of this repository tree for closer details.
 
