# piston-icons
Shrine-themed split icons for BotW speedrunning (originally `botw-as-icons`)
![Shrine](https://icons.pistonite.org/img/shrine.shrine.std_blue.none.png)
![DLCShrine](https://icons.pistonite.org/img/shrine.dlc_shrine.incomplete.none.png)
![DoubleSword](https://icons.pistonite.org/img/shrine.double_sword.malice.none.png)
![Ruta](https://icons.pistonite.org/img/location.ruta.ruta.none.png)
![Zelda](https://icons.pistonite.org/img/character.zelda.medoh.none.png)
![StasisPlus](https://icons.pistonite.org/palette/rune.stasis.std_orange.std_orange.naboris_orange.plus.png)

These icons are inspired by assets from Breath of the Wild and Age of Calamity.

Check out all available icons [here](https://icons.pistonite.org)

## Development
### Setup
This app uses a React front end and a FastAPI server, and is containerized with Docker.
```
pip install -r requirements.txt
npm i
```

### Build
To build the docker image, run
```
rm -rf public/img
python service/main.py
npm run build
docker build -t itntpiston/piston-icons .
```
The image can be pushed to DockerHub with
```
docker push itntpiston/piston-icons
```

### Local Testing
If assets/palettes are changed/added, you need to rebuild the static images first
```
python service/main.py
```
To start the server
```
LOCAL_DEV=1 && uvicorn service.main:app
```
To start the client (webpack dev server)
```
npm run start
``` 
