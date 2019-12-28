Now, let's add our filter. We do that in the master.cf file that contains the list of all processes run when a mail is delivered.

```
myhook unix - n n - - pipe
  flags=F user=www-data argv=/path/to/postfix.php ${sender} ${size} ${recipient}
```

We have registered a script named "myhook".
Let's stay in master.cf. We must now tell Postfix when to run that script.

To do this, let's edit the smtp line and change it this way:

```
smtp      inet  n       -       -       -       -       smtpd
        -o content_filter=myhook:dummy
```

The -o content_filter=myhook:dummy tells Postfix to run the filter for any mail arriving via the SMTP delivery. Please note that is you are sending mails using the "sendmail" command, the filter will not trigger. In this case, add the option after the "pickup" delivery method:
```
pickup    fifo  n       -       -       60      1       pickup
    -o content_filter=myhook:dummy
```

Do not forget: after changing a configuration file, you must run the command:
```
postfix reload
```
