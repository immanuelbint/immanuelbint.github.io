# Basic Shell Script to automate kinit

## Requirement
- Linux
- Kerberos client

## Step

1. Create script with your desired name, example `kinit.sh`, then copy content below

```
#!/bin/bash
## Declaring keytab to Associative Array
declare -A KEYTABS
KEYTABS["hdfs"]="/etc/security/keytabs/hdfs.headless.keytab"
KEYTABS["yarn"]="/etc/security/keytabs/yarn.service.keytab"
KEYTABS["hbase"]="/etc/security/keytabs/hbase.service.keytab"
KEYTABS["hive"]="/etc/security/keytabs/hive.service.keytab"
KEYTABS["storm"]="/etc/security/keytabs/storm.headless.keytab"
KEYTABS["kafka"]="/etc/security/keytabs/kafka.service.keytab"
KEYTABS["solr"]="/etc/security/keytabs/solr.service.keytab"
KEYTABS["spark"]="/etc/security/keytabs/spark.service.keytab"

## Reading the user input and check condition if exist on array or not
read -r -p "Enter service name you'd like to kinit => " response
response=$(echo "$response" | tr '[:upper:]' '[:lower:]')

if [[ -n "${KEYTABS[$response]}" ]]; then
    keytab_path="${KEYTABS[$response]}"
else
    echo "Service not found / keytab didn't exist."
    read -r -p "Do you still wanna to kinit with custom keytab? (y/n) => " userinput

    ## if else condition to custom keytabs
    if [[ "$userinput" =~ ^[Yy]$ ]]; then
        read -r -p "Enter full path to keytab => " keytab_path
    else
        exit 0
    fi
fi

## check if the path is exist
if [[ -f "$keytab_path" ]]; then
    principal=$(klist -kt "$keytab_path" | grep @ | cut -d' ' -f 7 | head -1)
    if [[ -n "$principal" ]]; then
        kinit -kt "$keytab_path" "$principal"
        echo "Successfully kinit with keytab : $keytab_path"
    else
        echo "Error: Cannot find the requested principal in keytab!"
    fi
else
    echo "Error: File keytab not found in $keytab_path!"
fi
```

2. Set the script executable with command 

```
chmod +x <namescript.sh>
```

3. Then running the script without <>

```
bash <namescript.sh>
```
