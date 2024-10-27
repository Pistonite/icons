package main

import (
	"fmt"
	"os"
	"path"
	"sort"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"

	"github.com/hashicorp/golang-lru/v2"
)

// load icon data
func LoadIcons(iconPath string) (map[string]*Icon, error) {
    out := make(map[string]*Icon)
    err := loadIconsRecur("", path.Join(iconPath, "icons"), out)
    if err != nil {
        return nil, fmt.Errorf("failed to load icons: %s", err.Error())
    }
    return out, nil
}

// load modifier data
func LoadModifiers(iconPath string) (map[string]*Icon, error) {
    out := make(map[string]*Icon)
    err := loadIconsRecur("", path.Join(iconPath, "modifiers"), out)
    if err != nil {
        return nil, fmt.Errorf("failed to load modifiers: %s", err.Error())
    }
    return out, nil
}

func loadIconsRecur(namespace string, currentPath string, out map[string]*Icon) error {
    entries, err := os.ReadDir(currentPath)
    if err != nil {
        return err
    }

    for _, e := range entries {
        subPath := path.Join(currentPath, e.Name())
            var subNamespace string
        if namespace == "" {
            subNamespace = e.Name()
        } else {
            subNamespace = namespace + "." + e.Name()
        }
        if e.IsDir() {
            err := loadIconsRecur(subNamespace, subPath, out)
            if err != nil {
                return err
            }
            continue
        }

        if !strings.HasSuffix(e.Name(), ".png") {
            log.Warnf("ignoring non-png file %s", subPath)
            continue
        }

        log.Infof("loading %s", subPath)
        icon, err := LoadIcon(subPath)
        if err != nil {
            return err
        }

        // remove .png
        length := len(subNamespace)
        out[subNamespace[0:length-4]] = icon
    }

    return nil
}


func main() {
    env, err := NewEnvConfig()
    if err != nil {
        log.Fatal(err)
    }
    log.SetLevel(env.ParseLogLevel())

    log.Info("loading icons")

    iconMap, err := LoadIcons(env.IconPath)
    if err != nil {
        log.Fatal(err)
    }
    iconKeys := make([]string, 0, len(iconMap))
    for k := range iconMap {
        iconKeys = append(iconKeys, k)
    }
    sort.Strings(iconKeys)

    log.Info("loading modifiers")

    modifierMap, err := LoadModifiers(env.IconPath)
    if err != nil {
        log.Fatal(err)
    }
    modifierKeys := make([]string, 0, len(modifierMap))
    for k := range modifierMap {
        modifierKeys = append(modifierKeys, k)
    }
    sort.Strings(modifierKeys)

    iconCache, err := lru.New[string, []byte](10240)
    if err != nil {
        log.Error("failed to create icon cache")
        log.Fatal(err)
    }

    app := fiber.New()
    app.Use(logger.New(logger.Config{
		DisableColors: !env.LogColor,
	}))
    app.Use(cors.New())

    app.Get("/meta", func(ctx *fiber.Ctx) error {
        type Meta struct {
Icons []string `json:"icons"`
Modifiers []string `json:"modifiers"`
        }
        meta := Meta {
            Icons: iconKeys,
            Modifiers: modifierKeys,
        }
        ctx.Set("Cache-Control", "public, max-age=3600")
        return ctx.JSON(meta)
    })

    app.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.Redirect("/index.html")
	})
	app.Static("/", env.AppPath, fiber.Static{
		Compress: true,
		MaxAge:   3600,
	})

    iconRoute := fiber.New()
    iconRoute.Use(compress.New())
    app.Mount("/icon", iconRoute)

    iconRoute.Get("/+", func(ctx *fiber.Ctx) error {
        iconQuery := ctx.Params("+")
        if len(iconQuery) > 1000 {
            log.Errorf("request too long")
            return ctx.SendStatus(400)
        }
        // check cache
        data, ok := iconCache.Get(iconQuery)
        if !ok {
            parts := strings.Split(iconQuery, ".")
            partsLength := len(parts)
            // name . modifier . color[6] . png
            if partsLength < 9 {
                log.Errorf("invalid icon query %s: not enough parts", iconQuery)
                return ctx.SendStatus(404)
            }
            name := strings.Join(parts[0:partsLength-8], ".")
            icon, ok := iconMap[name]
            if !ok {
                log.Errorf("icon not found: %s", name)
                return ctx.SendStatus(404)
            }
            palette, err := NewPalette( parts[partsLength-7:partsLength-1])
            if err != nil {
                log.Errorf("fail to create palette from %s: %s", iconQuery, err.Error())
                return ctx.SendStatus(404)
            }
            // apply modifier
            modifierName := parts[partsLength-8]
            if modifierName != "none" {
                modifier, ok := modifierMap[modifierName]
                if !ok {
                    log.Errorf("modifier not found")
                    return ctx.SendStatus(404)
                }
                iconClone := *icon
                iconClone.AddOverlay(modifier)
                icon = &iconClone
            }
            // encode
            newData, err := icon.EncodeWithPalette(palette)
            if err != nil {
                log.Errorf("fail to encode icon %s: %s", iconQuery, err.Error())
                return ctx.SendStatus(500)
            }

            data = newData
            iconQueryCopy := make([]byte, len(iconQuery))
            copy(iconQueryCopy, iconQuery)
            iconCache.Add(string(iconQueryCopy), newData)
        }

        // cache for a week (not expected to change much)
        ctx.Set("Cache-Control", "public, max-age=604800")
        ctx.Set("Content-Type", "image/png")

        return ctx.Send(data)
    })

    app.Listen(":" + env.Port)
}
