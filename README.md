# lara Frontend
Frontend für das PSE-Projekt lara auch Werkzeug zur Literaturrecherche genannt.

## Setup

### Umgebungsvariablen

Um das Projekt zu starten, müssen Umgebungsvariablen gesetzt werden. Diese können in einer Datei `.env` gesetzt werden.
Die Umgebungsvariablen sind:
- `VITE_API_HOST`: URL des Backend-Servers (z.B. `http://localhost:8080`)

### Docker

Der einfachste Weg ist es, Docker zu verwenden. Dafür muss Docker installiert sein. Danach kann das Projekt mit folgendem Befehl gestartet werden:
```sh
docker-compose up
```

### Manuell
Für den manuellen Weg muss [node.js](https://nodejs.org/en/) installiert sein. Danach kann das Projekt mit folgendem Befehl gebaut werden:
```sh
npm install
npm run build
```

Jetzt kann das Projekt von einem Webserver wie z.B. [nginx](https://nginx.org/en/) ausgeliefert werden. 
Zu beachten ist, dass der Webserver auf den Ordner `dist` zeigen muss und das Routing auf `index.html` umgeleitet werden muss.
Eine Beispielkonfiguration für nginx ist in der Datei `nginx.conf` zu finden.
