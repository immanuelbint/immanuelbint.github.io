# Sed

Sed is a stream editor, used to transforms text in an input stream a file or pipe. It operates by reading input line by line, applying editing commands, and outputting the modified lines.

## Useful flags

- `-n`, `--quiet`: suppress automatic printing of pattern space
- `-e`, `--expression`: add the script to the commands to be executed
- `-f`, `--file`: add the contents of script-file to the commands to be executed
- `-i`, `--in-place .bak`: edit files in place (makes backup if SUFFIX supplied)

## Example use cases

Find and replace all line containing word `disabled` to `enforcing` directly in file `/etc/selinux/config`

```bash
sed -i 's/disabled/enforcing/g' /etc/selinux/config
```

Delete line containing specific pattern

```bash
sed '/pattern/d' file.txt
```

Delete empty lines

```bash
sed '/^$/d' file.txt
```

Insert text before a specific line number:

```bash
sed '3i\This is a new line' file.txt
```

>note: this going to insert new line before line 3

Parenthesize First Character of Each Word

```bash
echo "Hello World" | sed 's/\(\b[A-Z]\)/\(\1\)/g'
```

output:

```bash
(H)ello (W)orld
```

## Best Practices

- Ensure to back up your files before apply changes with sed.
- Always test your SED command on sample file first to avoid misconfig.

## Notes and improvement

- Adding more advanced sed command use case.
- Refactor markdown document.


