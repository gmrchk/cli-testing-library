const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const prompts = require('prompts');

yargs(hideBin(process.argv))
    .command(
        'print [input]',
        'print a string',
        (yargs: any) => {
            return yargs.positional('input', {
                describe: 'input to print out',
            });
        },
        (argv: any) => {
            if (argv.verbose) {
                console.info(`Running in verbose mode.`);
            }

            console.info(`cli:print: ${argv.input}`);
        }
    )
    .command('text', 'ask text input', async () => {
        const { number } = await prompts({
            type: 'number',
            name: 'number',
            message: 'Give me a number:',
        });

        console.log(`Answered: ${number}`);
    })
    .command('select', 'ask select input', async () => {
        const { option } = await prompts({
            type: 'select',
            name: 'option',
            message: 'Pick option:',
            choices: [
                { title: 'First', value: 'first option' },
                { title: 'Second', value: 'second option' },
            ],
        });

        console.log(`Picked: ${option}`);
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging',
    })
    .demandCommand(1)
    .parse();
