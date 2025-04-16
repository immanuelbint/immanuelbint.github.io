# Mounting a LUKS-Encrypted QCOW2 Image

## Introduction
LUKS (Linux Unified Key Setup) encryption secures QCOW2 images used in virtualization platforms like Libvirt/KVM. Mounting such an encrypted image allows you to access its contents on a Linux system. This guide walks you through creating an encrypted QCOW2 image, converting an existing image to encrypted format, and mounting it using `qemu-nbd` on a Linux OS.

## Environment
- **Operating System**: Linux (e.g., Fedora, Ubuntu, CentOS, or Rocky Linux).
- **Virtualization**: Libvirt/KVM.
- **Image Format**: QCOW2 with LUKS encryption.
- **Tools**: `qemu-img`, `qemu-nbd` (part of `qemu-utils` or `qemu-kvm` packages).

## Steps

### Step 1 - Create an Empty Encrypted QCOW2 Image
First, create a new, empty QCOW2 image with LUKS encryption. You’ll need to specify a password and size. Ensure `qemu-utils` is installed:
```bash
sudo apt install qemu-utils  # For Debian/Ubuntu
sudo yum install qemu-img  # For RHEL/CentOS/Rocky
```

Run the following command, replacing `password-bebas` with your chosen password and `ukuran-bebas` with your desired size:
```bash
qemu-img create --object secret,id=sec0,data=password-bebas,format=raw -f qcow2 -o encrypt.format=luks,encrypt.key-secret=sec0 nama-image.qcow2 ukuran-bebas
```

**Example**: Create a 30GB image with the password `geheim247`:
```bash
qemu-img create --object secret,id=sec0,data=geheim247,format=raw -f qcow2 -o encrypt.format=luks,encrypt.key-secret=sec0 demo.qcow2 30G
```

- `--object secret,id=sec0,data=geheim247,format=raw`: Defines the password (`geheim247`).
- `-f qcow2`: Specifies the QCOW2 format.
- `-o encrypt.format=luks,encrypt.key-secret=sec0`: Enables LUKS encryption with the secret.
- `demo.qcow2 30G`: Sets the output file name and size (30 gigabytes).

This creates an empty encrypted image ready for use.

### Step 2 - Convert an Existing QCOW2 Image to Encrypted Format
If you have an unencrypted QCOW2 image (e.g., `centos7.qcow2`), convert its contents into the encrypted image created in Step 1. Use the `qemu-img convert` command:
```bash
qemu-img convert --object secret,id=sec0,data=password-bebas --image-opts driver=qcow2,file.filename=nama-image-sebelum-encrypt --target-image-opts driver=qcow2,encrypt.key-secret=sec0,file.filename=nama-image-yg-telah-dibuat -n -p
```

**Example**: Convert `centos7.qcow2` to `demo.qcow2` with the password `geheim247`:
```bash
qemu-img convert --object secret,id=sec0,data=geheim247 --image-opts driver=qcow2,file.filename=centos7.qcow2 --target-image-opts driver=qcow2,encrypt.key-secret=sec0,file.filename=demo.qcow2 -n -p
```

- `--image-opts driver=qcow2,file.filename=centos7.qcow2`: Specifies the source (unencrypted) image.
- `--target-image-opts driver=qcow2,encrypt.key-secret=sec0,file.filename=demo.qcow2`: Defines the encrypted target image.
- `-n`: Skips pre-allocation for speed.
- `-p`: Shows conversion progress.

Wait for the process to complete. The encrypted image (`demo.qcow2`) now contains the data from the original image.

### Step 3 - Connect the LUKS Image to a Block Device
Use `qemu-nbd` to map the encrypted QCOW2 image to a network block device (NBD) on your Linux system. This makes it accessible as a disk. Run:
```bash
qemu-nbd --object secret,id=sec0,data=geheim247,format=raw -c /dev/nbd1 --image-opts driver=qcow2,file.filename=demo.qcow2,encrypt.format=luks,encrypt.key-secret=sec0
```

- `--object secret,id=sec0,data=geheim247,format=raw`: Provides the password.
- `-c /dev/nbd1`: Connects the image to `/dev/nbd1` (use `nbd0`, `nbd1`, etc., depending on availability).
- `--image-opts`: Specifies the encrypted image details.

Ensure the `nbd` kernel module is loaded:
```bash
sudo modprobe nbd
```

### Step 4 - Verify the Connection
Check if the image is connected as a block device:
```bash
sudo fdisk -l
```

Example output:
```
Device      Boot Start      End  Sectors Size Id Type
/dev/nbd1p1 *     2048 62914526 62912479  30G 83 Linux
```
This shows the partitions within the image (e.g., `/dev/nbd1p1`). If no output appears, ensure the NBD connection succeeded.

### Step 5 - Mount the LUKS Image
Mount the partition to a directory (e.g., `/mnt`):
```bash
sudo mount /dev/nbd1p1 /mnt
```

Verify the mount:
```bash
df -kh
```

Example output:
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/nbd1p1      30G  1.2G   29G   4% /mnt
```
You can now access the filesystem contents in `/mnt`.

#### Disconnect the Image
When done, unmount and disconnect the image:
```bash
sudo umount /mnt
sudo qemu-nbd --disconnect /dev/nbd1
```

This safely detaches the image from the NBD device.

## Notes
- If the image has multiple partitions, repeat the mount process for each (e.g., `/dev/nbd1p2`).
- Ensure the mount point (e.g., `/mnt`) exists (`sudo mkdir /mnt` if needed).
- The password must match the one used during encryption, or the image won’t open.

## References
- [QEMU Devel Mailing List: LUKS Encryption](https://lists.gnu.org/archive/html/qemu-devel/2017-07/msg06731.html)
- [IBM Cloud: Creating Encrypted Custom Images](https://cloud.ibm.com/docs/vpc?topic=vpc-create-encrypted-custom-image)