# Using `awk` for Text Processing

The `awk` command mainly used for manipulate, extract data and generating reports

---

## Printing all line

To display all lines in a file, use awk with the print $0 action, where $0 represents the entire line:

```bash
awk '{print $0}' employee.txt
```
output:
```
Name Postition Department
anto manager accounting
budi manager finance
cecil manager HR
Dinda assistant marketing
Eko supervisor IT
Farah hr_officer HR
Gita senior_analyst finance
```

---

## Printing specific columns

Extract specific columns (fields) using $1, $2, etc., where numbers correspond to field positions. Use \t for tab-separated output:

```bash
awk '{print $1 "\t" $3}' employee.txt
```

output:
```
Name    Department
anto    accounting
budi    finance
cecil   HR
Dinda   marketing
Eko     IT
Farah   HR
Gita    finance
```

---

## Printing all lines that match specific pattern

Filter lines that contain a specific pattern using a regular expression:

```bash
awk '/finance/ {print $0}' employee.txt
```
output:
```
budi manager finance
Gita senior_analyst finance
```

---

## Count and print matched pattern

Count the number of lines matching a pattern and display the total:

```bash
awk '/m/{++total} END {print "Total matched = ", total}' employee.txt
```

output:
```
Total matched =  5
```

before count ( for clarity )
```bash
$ awk '/m/ {print $0}' employee.txt
Name Postition Department
anto manager accounting
budi manager finance
cecil manager HR
Dinda assistant marketing
```

---

## Saving output from AWK to different file

Redirect output to a new file using the > operator. For example, filter lines containing the letter "o":

```bash
awk '/o/ {print $0}' employee.txt > output.txt
```

output:
```bash
$ cat output.txt
Name Postition Department
anto manager accounting
Eko supervisor IT
Farah hr_officer HR
Gita senior_analyst finance
```

---

## Useful flags
- -F: Specifies a custom field separator (e.g., -F"," for CSV files).
    >Example: awk -F"," '{print $1}' data.csv
- -f: Reads an awk program from a file instead of the command line.
    >Example: awk -F"," '{print $1}' data.csv
- {}: Encloses actions to perform when a pattern matches.

---

## Additional notes
- NR: Built-in variable for the current line number.
- NF: Built-in variable for the number of fields in the current line.
- Example: awk '{print NR ": " $0}' employee.txt prefixes each line with its line number.
---