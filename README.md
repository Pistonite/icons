# icons
Shrine-themed split icons for BOTW and TOTK speedrunning

![Shrine](https://icons.pistonite.org/icon/shrine.shrine.none.69a2d5.c1fefe.69a2d5.c1fefe.69a2d5.c1fefe.png)
![DLCShrine](https://icons.pistonite.org/icon/shrine.dlc_shrine.none.69a2d5.c1fefe.8c5e28.ffffb5.8c5e28.ffffb5.png)
![DoubleSword](https://icons.pistonite.org/icon/shrine.double_sword.none.f24c99.ffc0fa.f24c99.ffc0fa.f24c99.ffc0fa.png)
![Ruta](https://icons.pistonite.org/icon/location.ruta.plus.69a2d5.c1fefe.69a2d5.fdfdfd.69a2d5.fdfdfd.png)
![Zelda](https://icons.pistonite.org/icon/character.zelda.circle.568c28.c8e6af.568c28.fdfdfd.568c28.fdfdfd.png)
![Stasis](https://icons.pistonite.org/icon/rune.stasis.minus.8c5e28.ffffb5.8c5e28.ffffb5.8c5e28.fdfdfd.png)

These icons are inspired by assets from Breath of the Wild and Age of Calamity.

Check out all available icons [here](https://icons.pistonite.org)

# Tech Stack
This project uses [http-rs/tide](https://github.com/http-rs/tide) on the backend for icon manipulation,
and uses [vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) + [React](https://reactjs.org/) on the frontend
for the icon picker web app.

The app is dockerized with an alpine image for efficiency. Check it out on [DockerHub](https://hub.docker.com/repository/docker/pistonite/icons/general)
# Development

## Requirements
Install nodejs and cargo, then install Just:
```
cargo install just
```

Install other cargo and npm dependencies
```
just install
```

## Workflows
|Command|Usage|
|-|-|
|`just server`|Run the server in watch mode (`cargo run` to run in non-watch mode)|
|`just client`|Run the client in watch mode.|
|`just build`|Build the client.|
|`just docker`|Build the docker image (may require `sudo`)|

Note that the server also serves frontend files. If you are not changing the client, you can build the client and only run the server for testing.

## Docker
To push the docker image:
```
docker push pistonite/icons
```
