---
title: Resize LVM Disk
description: Step-by-step guide to resize LVM Disk
tags: [lvm, storage, linux, resize]
---

# Resizing an LVM Disk for the Root Mountpoint

## Introduction
Logical Volume Manager (LVM) provides flexible disk management, allowing you to resize storage without downtime. This guide explains how to resize the LVM disk for the root (`/`) mountpoint on a Linux system, typically used with KVM virtual machines. We’ll add a new disk, extend the volume group, and resize the logical volume to increase the root filesystem’s capacity.

## Environment
- **Operating System**: Linux (e.g., CentOS, Rocky Linux, Ubuntu).
- **Virtualization**: KVM (optional, for adding disks to VMs).
- **Disk Type**: LVM (Logical Volume Manager).
- **Mountpoint**: Root (`/`).

## Prerequisites
Before resizing, verify the current disk configuration, mountpoints, and LVM details using:
```bash
lsblk -p
```

Example output:
```
NAME                        MAJ:MIN RM    SIZE RO TYPE MOUNTPOINT
/dev/sr0                     11:0    1   1024M  0 rom
/dev/vda                    252:0    0    200G  0 disk
├─/dev/vda1                 252:1    0    200M  0 part /boot/efi
├─/dev/vda2                 252:2    0      1G  0 part /boot
└─/dev/vda3                 252:3    0  198.8G  0 part
  ├─/dev/mapper/centos-root 253:0    0   88.8G  0 lvm  /
  └─/dev/mapper/centos-swap 253:1    0     10G  0 lvm  [SWAP]
/dev/vdb                    252:16   0  500.1G  0 disk
├─/dev/vdb1                 252:17   0  186.3G  0 part /home
└─/dev/vdb2                 252:18   0  313.8G  0 part /log
/dev/vdc                    252:32   0 1000.2G  0 disk
└─/dev/vdc1                 252:33   0 1000.2G  0 part /data
```
- **Key Information**:
  - Mountpoint: `/` (root).
  - LVM Path: `/dev/mapper/centos-root`.
  - Volume Group: Likely `centos` (to be confirmed).
  - Disk: New disk will be added (e.g., `/dev/vdd`).

**Note**: Always back up critical data before modifying disks to prevent data loss.

## Steps

### Step 1 - Add a New Disk
For LVM resizing, adding a new disk is recommended to provide additional space. If using KVM:
- Access the VM’s management interface (e.g., `virt-manager` or `virsh`).
- Add a new virtual disk with the desired size (e.g., 100 GB) to the VM.
- Ensure the VM recognizes the new disk after rebooting or hot-adding.

**Note**: Choose a disk size that meets your capacity needs.

### Step 2 - Verify the New Disk
Check the new disk’s path using:
```bash
lsblk -p
```
- Example: If the new disk appears as `/dev/vdd`, note its path.
- If the disk isn’t visible, rescan the bus:
  ```bash
  echo "- - -" | sudo tee /sys/class/scsi_host/hostX/scan
  ```
  (Replace `hostX` with the appropriate SCSI host, e.g., `host0`.)

### Step 3 - Create a Physical Volume
Initialize the new disk as a physical volume (PV) for LVM:
```bash
sudo pvcreate <new-disk-path>
```
- Example: `sudo pvcreate /dev/vdd`
- This prepares the disk for use in an LVM volume group.

### Step 4 - Identify the Volume Group
List the existing volume groups to find the one associated with the root filesystem:
```bash
sudo vgs
```
Example output:
```
  VG     #PV #LV #SN Attr   VSize   VFree
  centos   1   2   0 wz--n- 198.80g 100.00g
```
- The volume group (VG) name is `centos` (from `/dev/mapper/centos-root`).

### Step 5 - Extend the Volume Group
Add the new physical volume to the existing volume group:
```bash
sudo vgextend <volume-group-name> <new-disk-path>
```
- Example: `sudo vgextend centos /dev/vdd`
- This increases the VG’s capacity by incorporating the new disk.

### Step 6 - Verify Volume Group Changes
Check the volume group to confirm the new physical volume was added:
```bash
sudo vgs
```
Or, for more details:
```bash
sudo vgdisplay
```
Example output:
```
  --- Volume group ---
  VG Name               centos
  ...
  VG Size               298.80 GiB
  PE Size               4.00 MiB
  Total PE              76544
  Free  PE              25600
  Alloc PE / Size       50944 / 198.80 GiB
  PV Count              2
```
- `PV Count: 2` confirms the new disk was added.

### Step 7 - Identify the Logical Volume
List logical volumes to find the one for the root mountpoint:
```bash
sudo lvs
```
Or, for details:
```bash
sudo lvdisplay
```
Example output:
```
  --- Logical volume ---
  LV Path                /dev/centos/root
  LV Name                root
  VG Name                centos
  LV Size                88.80 GiB
```
- The logical volume (LV) path is `/dev/centos/root`.

### Step 8 - Extend the Logical Volume
Extend the logical volume to use all available space in the volume group:
```bash
sudo lvextend -l +100%FREE <logical-volume-path>
```
- Example: `sudo lvextend -l +100%FREE /dev/centos/root`
- `-l +100%FREE`: Allocates all free space in the VG to the LV.

### Step 9 - Resize the Filesystem
Update the filesystem to recognize the new LV size. For XFS (common on CentOS/RHEL):
```bash
sudo xfs_growfs <mountpoint>
```
- Example: `sudo xfs_growfs /`
- If using ext4, use:
  ```bash
  sudo resize2fs <logical-volume-path>
  ```
  - Example: `sudo resize2fs /dev/centos/root`

This step adjusts the filesystem to use the expanded space.

### Step 10 - Verify the New Size
Confirm the resized disk size:
```bash
df -kh
```
Example output:
```
Filesystem                 Size  Used Avail Use% Mounted on
/dev/mapper/centos-root    188G  5.0G  183G   3% /
```
Or:
```bash
lsblk -p
```
Example output:
```
NAME                        MAJ:MIN RM    SIZE RO TYPE MOUNTPOINT
/dev/vda                    252:0    0    200G  0 disk
├─/dev/vda1                 252:1    0    200M  0 part /boot/efi
├─/dev/vda2                 252:2    0      1G  0 part /boot
└─/dev/vda3                 252:3    0  198.8G  0 part
  ├─/dev/mapper/centos-root 253:0    0   188.8G  0 lvm  /
  └─/dev/mapper/centos-swap 253:1    0     10G  0 lvm  [SWAP]
/dev/vdd                    252:48   0    100G  0 disk
```
- The root filesystem (`/dev/mapper/centos-root`) now reflects the increased size.

## Notes
- **Backup First**: Always back up data before resizing to avoid loss.
- **Filesystem Type**: Confirm the filesystem type (`xfs` or `ext4`) with `df -T`. Use the appropriate resize command.
- **KVM Disk Addition**: If not using KVM, add a physical disk to a bare-metal server and rescan as needed.
- **Error Handling**: If `pvcreate` fails, ensure the disk is not partitioned (`fdisk` to remove partitions if needed).


## 📎 Related Scripts
* 🚧 Content under construction