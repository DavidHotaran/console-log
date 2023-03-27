const chalk = require('chalk')
const { program } = require('commander')
const fs = require('fs');
const path = require('path');

function peek(options) {
    if (options.file && options.directory) {
        console.log(chalk.red.bold("ERROR: cannot have both file and directory, need one or the other"));
        process.exit();
    };

    if (options.directory) {
        let files = getFilesRecurse(path.join(__dirname, options.directory), []);
        read_files(files, options.all);
    } else {
        read_files([options.file], options.all);
    };
};

function getFilesRecurse(dir, filesList) {
    const filesOrDirectory = fs.readdirSync(dir);
    filesOrDirectory.forEach(item => {
        if (fs.lstatSync(path.join(dir, item)).isDirectory()) {
            getFilesRecurse(path.join(dir, item), filesList);
        };
        if (fs.lstatSync(path.join(dir, item)).isFile()) {
            filesList.push(path.join(dir, item));
        };
    });
    return filesList;
};

function read_files(files, printAll) {
    files.forEach(file => {
        if (['.js', '.ts', '.jsx', '.tsx'].includes(path.extname(file))) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                    console.log(err);
                    process.exit()
                };

                data.split("\n").forEach((f, i) => {
                    if (f.includes("console.log")) {
                        if (f.includes("//") || f.includes('/*')) {
                            if (printAll) {
                                console.log(chalk.green(`${file} on line ${i} \t ${f.trim()}`));
                            };
                        } else {
                            console.log(chalk.bold.red(`${file} on line ${i} \t ${f.trim()}`));
                        };
                    };
                });
            });
        };
    });
};

program
    .name('console-log')
    .description('CLI to discover any console.log() statements that exist BEFORE your push to prod')
    .version('1.0.0');

program.command('peek')
    .description('Display any console.log() statements that exist in your codebase.')
    .option('-f, --file <file>', 'File to peek into')
    .option('-d, --directory <directory>', 'Directory to start looking in')
    .option('-a, --all', 'Print out all console log statements. Default is only those uncommented.')
    .action(peek);

program.parse()
