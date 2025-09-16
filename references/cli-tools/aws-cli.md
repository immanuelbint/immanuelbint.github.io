# Using AWS CLI for Cloud Management

## Introduction
Linux administration is a critical skill for managing robust, secure, and scalable systems in modern IT environments. From configuring servers to automating tasks, Linux admins handle a wide range of responsibilities to keep infrastructure running smoothly. The AWS Command Line Interface (AWS CLI) is a powerful tool for interacting with AWS services, enabling administrators and DevOps professionals to manage cloud resources like EC2, S3, and IAM directly from the terminal. Whether you’re automating deployments, querying cloud storage, or managing user permissions, mastering the AWS CLI enhances efficiency and streamlines cloud operations, making it an essential skill for any system administrator or DevOps engineer.

## Overview
The AWS CLI is a unified tool for managing AWS services via command-line commands. It supports a wide range of services, including EC2, S3, RDS, and more, and is ideal for scripting and automation tasks in cloud environments.

**Environment**:
- **Operating System**: Any Linux distribution (e.g., Rocky Linux, Ubuntu, CentOS).
- **Tools**: AWS CLI v2 (recommended for modern features and security).
- **Prerequisites**: An AWS account with access keys or IAM roles for authentication.

## Prerequisites
- **AWS Account**: Create an AWS account and generate access keys (Access Key ID and Secret Access Key) from the AWS IAM console.
- **Permissions**: Ensure the user or role has permissions for the AWS services you plan to manage.
- **Internet Access**: Required to install the AWS CLI and interact with AWS services.
- **Root/Sudo Access**: Needed for installing the AWS CLI on Linux.

## Steps and Examples

### 1. Installing the AWS CLI
Install AWS CLI v2 on a Linux system:

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -f awscliv2.zip
```

Verify the installation:

```bash
aws --version
```

**Output**:

```
aws-cli/2.17.0 Python/3.11.6 Linux/5.15.0-73-generic exe/x86_64.rocky.8 prompt/off
```

- **Explanation**: Downloads and installs AWS CLI v2, then verifies the version. The installer places the binary in `/usr/local/bin/aws`.

### 2. Configuring AWS CLI
Configure the AWS CLI with your credentials:

```bash
aws configure
```

Follow the prompts to enter:
- AWS Access Key ID (e.g., `AKIAIOSFODNN7EXAMPLE`).
- AWS Secret Access Key (e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`).
- Default region (e.g., `us-east-1`).
- Default output format (e.g., `json`).

Example session:

```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

- **Explanation**: Stores credentials in `~/.aws/credentials` and settings in `~/.aws/config`. Use IAM roles or environment variables for production.

### 3. Listing S3 Buckets
List all S3 buckets in your AWS account:

```bash
aws s3 ls
```

**Output**:

```
2023-01-15 10:30:22 my-bucket-1
2023-05-20 14:45:10 my-bucket-2
```

- **Explanation**: `aws s3 ls` retrieves a list of S3 buckets. Ensure your IAM user has `s3:ListAllMyBuckets` permission.

### 4. Uploading a File to S3
Upload a local file to an S3 bucket:

```bash
aws s3 cp /data/employee.txt s3://my-bucket-1/employee.txt
```

**Output**:
```
upload: data/employee.txt to s3://my-bucket-1/employee.txt
```

- **Explanation**: `aws s3 cp` copies the file `employee.txt` to the specified bucket. Replace `my-bucket-1` with your bucket name.

### 5. Listing EC2 Instances
List all EC2 instances in the default region:

```bash
aws ec2 describe-instances --query 'Reservations[].Instances[].{ID:InstanceId,State:State.Name}' --output table
```

**Output**:

```
-----------------------------------------
|            DescribeInstances           |
+---------------+-----------------------+
|      ID       |        State         |
+---------------+-----------------------+
| i-1234567890  | running              |
| i-0987654321  | stopped              |
+---------------+-----------------------+
```

- **Explanation**: `--query` filters the output to show instance IDs and states in a table format. Requires `ec2:DescribeInstances` permission.

### 6. Saving AWS CLI Output to a File
Save the output of a command (e.g., S3 bucket list) to a file:

```bash
aws s3 ls > buckets.txt
```

**Verify the Output**:

```bash
cat buckets.txt
```

**Output**:

```
2023-01-15 10:30:22 my-bucket-1
2023-05-20 14:45:10 my-bucket-2
```

- **Explanation**: The `>` operator redirects the command output to `buckets.txt`. Use `>>` to append instead of overwrite.

## Useful Commands and Options
- `aws configure`: Configures credentials, region, and output format.
  - Example: `aws configure --profile dev` (for named profiles).
- `--output`: Sets the output format (`json`, `table`, `text`).
  - Example: `aws s3 ls --output text`
- `--query`: Filters JSON output using JMESPath.
  - Example: `aws ec2 describe-instances --query 'Reservations[].Instances[].InstanceId'`
- `--profile`: Uses a specific AWS profile from `~/.aws/credentials`.
  - Example: `aws s3 ls --profile dev`
- `--region`: Specifies a region for the command.
  - Example: `aws s3 ls --region us-west-2`

## Additional Notes
- **Credentials Security**: Store access keys securely. Prefer IAM roles or AWS SSO for production environments.
- **Output Formats**: Use `--output table` for human-readable output or `--output json` for scripting.
- **Error Handling**: If a command fails (e.g., “Access Denied”), verify IAM permissions and region settings.
- **Scripting**: Combine AWS CLI with Bash for automation (e.g., `for bucket in $(aws s3 ls --output text); do ...; done`).

## Notes
- **Installation**: Ensure the AWS CLI binary is in your PATH (`/usr/local/bin/aws`).
- **Permissions**: Verify IAM policies allow the required actions (e.g., `s3:ListBucket`, `ec2:DescribeInstances`).
- **Testing**: Test commands in a non-production AWS account to avoid unintended changes.
- **Versioning**: Use AWS CLI v2 for better performance and features (v1 is deprecated for some services).

## Example Input File (`employee.txt`)
For the S3 upload example, use this sample file:

```
Name Position Department
Anto manager accounting
Budi manager finance
Cecil manager HR
Dinda assistant marketing
Eko supervisor IT
Farah hr_officer HR
Gita senior_analyst finance
```

---

### Key Features of the Guide
1. **Structure**: Matches the style of your `awk` guide with clear sections, code blocks, and outputs.
2. **Introduction**: Styled like your Linux Administration example, emphasizing AWS CLI’s role in cloud management.
3. **Examples**: Provides practical examples (S3, EC2, output redirection) with a sample file for context.
4. **Clarity**: Each command is explained with outputs and notes on permissions or requirements.
5. **Completeness**: Covers installation, configuration, common tasks, and useful options, with tips for scripting and security.