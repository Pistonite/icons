# botw-as-icons
Shrine-themed split icons for BotW speedrunning
![Shrine](https://github.com/iTNTPiston/botw-as-icons/blob/main/sample/Shrine.png)
![DLCShrine](https://github.com/iTNTPiston/botw-as-icons/blob/main/sample/DLCShrine.png)
![DoubleSword](https://github.com/iTNTPiston/botw-as-icons/blob/main/sample/DoubleSword.png)
![Magnesis](https://github.com/iTNTPiston/botw-as-icons/blob/main/sample/Magnesis.png)

These icons are inspired by assets from Breath of the Wild and Age of Calamity

## Download
The icons are free to use. If you just want to use the icons, see the [release page](https://github.com/iTNTPiston/botw-as-icons/releases)


The pre-bulit icons include a limited set of colors (defined [here](https://github.com/iTNTPiston/botw-as-icons/blob/main/src/palettes.json)). If you want to use a different combination of colors, you can edit the palette definition yourself. See the [Customization](https://github.com/iTNTPiston/botw-as-icons#Customization) section below

## Build
You need to have Python 3 installed, then follow the steps

Install pip
```
sudo apt-get update
sudo apt-get install python3-pip
```
Install Pillow (for image manipulation)
```
python3 -m pip install --upgrade pip
python3 -m pip install --upgrade Pillow
```
Use the scripts to build the icons. Output will be in the "build" directory
```
scripts/build.py
```

## Customization
This section explains how to customize the color by editing [palettes.json](https://github.com/iTNTPiston/botw-as-icons/blob/main/src/palettes.json)

If you feel like a palette/color should be included, feel free to submit a pull request

### Adding a Palette
A palette defines the background, foreground, and modifier color of the icon.

Background is the color of the diamond shaped frame, foreground is the icon, and modifier is the white symbol (plus, circle, etc)

Example:
```
"palettes":{
    "SheikahBlue":{
        "background": "StandardBlue",
        "foreground": "StandardBlue",
        "modifier": "StandardBlue",
        "groups": [
            "DivineBeasts",
            "Characters",
            "Locations",
            "Runes",
            "Shrines"
        ]
    }
}
```

Here, `SheikahBlue` is the name of the palette, `StandardBlue` is the name of the color (see next section). `groups` defines which groups of icons this palette should be applied to when building. If `groups` is not defined, the palette automatically applies to all groups.

You can add a palette by adding a new entry to `palettes` like this:

```
"palettes":{
    "SheikahBlue":{
        "background": "StandardBlue",
        "foreground": "StandardBlue",
        "modifier": "StandardBlue",
        "groups": [
            "DivineBeasts",
            "Characters",
            "Locations",
            "Runes",
            "Shrines"
        ]
    },
    "NewPalette":{
        "background": "YourColor",
        "foreground": "YourColor",
        "modifier": "YourColor",
        "groups": [
            "YourGroups"
        ]
    }
}
```

### Adding a color
You can add a color by changing the `colors` section of `palettes.json`. Example:
```
"colors":{
    "StandardBlue":{
        "outline": "69a2d5",
        "fill": "c1fefe"
    }
}
```

Here, `StandardBlue` is the name of the color, to be referenced by the palettes. The `outline` and `fill` defines the color in hex (rrggbb). Only 6-digit hex string works
