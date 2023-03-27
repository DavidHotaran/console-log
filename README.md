# console-log

A CLI to discover any console.log() statements that exist BEFORE your push to prod.

```
Usage: console-log peek [options]

Display any console.log() statements that exist in your codebase.

Options:
  -f, --file <file>            File to peek into
  -d, --directory <directory>  Directory to start looking in
  -a, --all                    Print out all console log statements. Default is only those uncommented.
  -h, --help                   display help for command
```
