package main

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2/log"

	"github.com/plaid/go-envvar/envvar"
)

// config from environment variables
type EnvConfig struct {
	LogLevel string `envvar:"ICONSS_LOG" default:"info"`
	LogColor bool   `envvar:"ICONSS_LOG_COLOR" default:"true"`
	Port     string `envvar:"ICONSS_PORT"`
	AppPath  string `envvar:"ICONSS_APP_PATH"`
	IconPath string `envvar:"ICONSS_ICON_PATH"`
}

func NewEnvConfig() (*EnvConfig, error) {
	var config EnvConfig
	if err := envvar.Parse(&config); err != nil {
		return nil, fmt.Errorf("fail to load env config: %s", err.Error())
	}
	return &config, nil
}

func (self *EnvConfig) ParseLogLevel() log.Level {
	switch strings.ToLower(self.LogLevel) {
	case "debug":
		return log.LevelDebug
	case "info":
		return log.LevelInfo
	case "warn":
		return log.LevelWarn
	default:
		return log.LevelError
	}
}
