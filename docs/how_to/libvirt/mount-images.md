# Mounting a Disk Image to a Physical Server

## Introduction
Mounting a virtual disk image (e.g., QCOW2) to a physical Linux server allows you to access its contents as if it were a physical drive. This is useful for inspecting or modifying VM disk data without running the VM itself. In this guide, we’ll use `qemu-nbd` to mount a QCOW2 image on a Linux system with Qemu/KVM.

## Environment
- **Virtualization**: Qemu/KVM.
- **Operating System**: Linux (e.g., Fedora, Ubuntu, CentOS, or Rocky Linux).
- **Image Format**: QCOW2 (or other formats supported by `qemu-nbd`).
- **Tools**: `qemu-nbd` (part of `qemu-utils` or `qemu-kvm` packages).

## Steps

### Step 1 - Load the NBD Kernel Module
The Network Block Device (NBD) kernel module allows you to map disk images to block devices (e.g., `/dev/nbd0`). Load it with support for up to 8 partitions:
```bash
sudo modprobe nbd max_part=8
```

- `max_part=8`: Enables recognition of up to 8 partitions within the image.
- Run this once per boot; it persists until reboot.

Ensure `qemu-nbd` is installed:
```bash
sudo apt install qemu-utils  # For Debian/Ubuntu
sudo yum install qemu-img    # For RHEL/CentOS/Rocky
```

### Step 2 - Connect the QCOW2 Image to an NBD Device
Use `qemu-nbd` to connect the QCOW2 image to a block device (e.g., `/dev/nbd0`). Replace `/path/to/qcow2/image` with the actual path to your image:
```bash
sudo qemu-nbd --connect=/dev/nbd0 /path/to/qcow2/image
```

**Example**: Connect an image located at `/home/bintang/os-centos-7-vol`:
```bash
sudo qemu-nbd --connect=/dev/nbd0 /home/bintang/os-centos-7-vol
```

- `--connect=/dev/nbd0`: Maps the image to `/dev/nbd0` (use `nbd1`, `nbd2`, etc., if `nbd0` is in use).
- The image must be a valid QCOW2 file.

### Step 3 - Verify the Connected Disk
Check the disk information to confirm the image is mapped and inspect its partitions:
```bash
sudo fdisk /dev/nbd0 -l
```

Example output:
```
Disk /dev/nbd0: 30 GiB, 32212254720 bytes, 62914560 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x000940fd

Device      Boot Start      End  Sectors Size Id Type
/dev/nbd0p1 *     2048 62914526 62912479  30G 83 Linux
```
- `/dev/nbd0p1`: Indicates the first partition of the image.
- If no partitions appear, the image may lack a partition table (e.g., it’s a raw filesystem).

### Step 4 - Mount the Disk Image
Mount the partition to a directory (e.g., `/mnt`). Replace `/mnt` with your desired mount point if needed:
```bash
sudo mount /dev/nbd0p1 /mnt
```

**Example**: Mount to `/mnt/tes` (create it first if it doesn’t exist with `sudo mkdir -p /mnt/tes`):
```bash
sudo mount /dev/nbd0p1 /mnt/tes
```

Verify the mount:
```bash
sudo df -kh
```

Example output:
```
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        4.0M     0  4.0M   0% /dev
tmpfs           985M     0  985M   0% /dev/shm
tmpfs           394M  1.4M  393M   1% /run
/dev/sda2        29G   22G  7.0G  76% /
tmpfs           985M   16K  985M   1% /tmp
/dev/sda2        29G   22G  7.0G  76% /home
/dev/sda1       974M  220M  687M  25% /boot
tmpfs           197M  108K  197M   1% /run/user/1000
/dev/nbd0p1      30G  837M   30G   3% /mnt/tes
```
- `/dev/nbd0p1` is now mounted at `/mnt/tes`, and you can access its files there.

#### Disconnect the Image
When finished, unmount and disconnect the image:
```bash
sudo umount /mnt
sudo qemu-nbd --disconnect /dev/nbd0
```

- `umount`: Removes the mount point.
- `--disconnect`: Frees the NBD device.

### Notes
- If the image has multiple partitions (e.g., `/dev/nbd0p2`), mount them separately.
- For encrypted QCOW2 images (e.g., LUKS), additional steps are required (see a LUKS-specific guide).
- Ensure the mount point exists before mounting (`sudo mkdir /mnt` if needed).

## References
- [Xmodulo: How to Mount a QCOW2 Disk Image on Linux](https://www.xmodulo.com/mount-qcow2-disk-image-linux.html)