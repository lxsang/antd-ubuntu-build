# antd-ubuntu-build

Antd + Lua API + Antos build for ubuntu server 16.04 x86_64. Copy the antd.service to /etc/systemd/system and enable the service using the systemctl command

# denie SYNC attack
```
#  /etc/sysctl.conf 
# Protection SYN flood
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 1
net.ipv4.tcp_max_syn_backlog = 1024
```
