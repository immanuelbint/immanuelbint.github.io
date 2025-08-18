# `xargs` – Build and execute command lines from standard input

`xargs` is used to convert input from `stdin` into arguments for other commands.

---

## Example: Delete files listed in a text file

```bash
cat files.txt | xargs rm -v
```

## Combine with find
```bash
find . -name "*.log" | xargs rm -v
```
>Deletes all .log files recursively under current directory.

## Safer alternative (handles filenames with spaces)
```bash
find . -name "*.log" -print0 | xargs -0 rm -v
```

## Tips

- xargs avoids using for loops manually.
- Use -n to control how many arguments per command.

---