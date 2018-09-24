# Welcome to AntOS v0.2.4-alpha
***[[ WARNING: Then terminal access has been reenabled, however outgoing network is disabled on user demo ]]***

Github: [https://github.com/lxsang/antos](https://github.com/lxsang/antos)

Change log: [https://blog.lxsang.me/r:id:19](https://blog.lxsang.me/r:id:19)

AntOSDK tutorial : [https://blog.lxsang.me/r:id:20](https://blog.lxsang.me/r:id:20)

Server or Embedded Linux are often headless, so accessing the resource on these systems is not always obvious. The aim of this project is to develop a client core API that provides a desktop like experience to remotely access resource on the server using web technologies. 

AntOS is based on jQuery and Riot, it is designed to be used along with our antd server and Lua based server side app, but can be adapted to be used with any server side languages (PHP, etc) and server, by implementing all the system calls API defined in core/handlers/RemoteHandler.coffee. Basically, application design for the web os relies on these system calls to communicating with the server. The API defines the core UI, system calls (to server), Virtual File system, virtual database and the necessary libraries for easing the development of webOS's applications. Applications can be developped with coffee/javascript/css without the need of a server side script.

## Tip and trick
* **CTRL+SPACE** to open Spotlight for quick files and applications search
* Some applications support hot key, see detail in the menu: C for CTRL, A for ALT (e.g. C-S for CTRL-S)
* Beside the default installed applications, use the **MarketPlace** application to install more
* Language can be changed using the **Setting** application

## Documentation

Documentation will soon be available at my blog: [https://blog.lxsang.me](https://blog.lxsang.me)

## Credits

The core of AntOS is based on some open source libraries:
* Mandatory
    *  JQuery: [https://jquery.com/](https://jquery.com)
    * RiotJS: [http://riotjs.com/](http://riotjs.com/)
* Optional
    *  ACE editor library : [https://ace.c9.io/](https://ace.c9.io/)
    *  Font Awesome for default icon: [https://fontawesome.com](https://fontawesome.com)
    *  Showdown JS for markdown rendering: [https://github.com/showdownjs/showdown](https://github.com/showdownjs/showdown)
    *  Simple MDE for default Markdown editor: [https://simplemde.com/](https://simplemde.com/)
    *  JSZIP for in browser Zip file handle : [https://stuk.github.io/jszip/](https://stuk.github.io/jszip/)
    *  Other opensource libraries used by different application (see in each application README)...

## Licence

Copyright 2017-2018 Xuan Sang LE [xsang.le AT gmail DOT com]

AnTOS is is licensed under the GNU General Public License v3.0, see the LICENCE file for more information

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see [ https://www.gnu.org/licenses/]( https://www.gnu.org/licenses/).
