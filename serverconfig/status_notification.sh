#!/bin/bash
# Simple script that uses systemctl to check if a service is
# running. If its not it is restarted and an email is sent to
# the configured mailbox.
######################

# The service we want to check (according to systemctl)
SERVICE=antd
# Where to send the restart mail to
MAILBOX=xsang.le@gmail.com

if [ "`systemctl is-active $SERVICE`" != "active" ] 
then 
	echo "$SERVICE wasnt running so attempting restart"
	systemctl restart $SERVICE
	echo "Mailing $MAILBOX with current status"
	systemctl status $SERVICE | /usr/sbin/sendmail  $MAILBOX
	exit 0
fi 
echo "$SERVICE is currently running"
exit 0
