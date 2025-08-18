# `cut` – Extract fields or columns from input text

The `cut` command slices sections of each line from input (stdin or file).

---

## Cut by delimiter (e.g., `:`)

```bash
cut -d ':' -f1 /etc/passwd
```
>Print only the first field of each line, using : as delimiter.

## Cut by character position
```bash
echo "hello-world" | cut -c1-5
```
>Output: hello


## Useful flags
- -d: delimiter (e.g., ,, :, |)
- -f: field number(s)
- -c: character position(s)

---