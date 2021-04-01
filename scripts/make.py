#!/usr/bin/env python3
# Automation tool
from sys import argv, exit
from clean import clean
from build import build
from test_icon import test

def help(argv):
	print("usage:",argv[0],"command")
	print("command is one of:")
	print("build\t\tBuild the icons")
	print("test\t\tTest a specific icon")
	print("\targs: icon frame frame_palette center center_palette")
	print("clean\t\tClean")
	print("help\t\tPrint this message")
	exit(1)

if len(argv)<2:
	help(argv)

commands = {
	"build": build,
	"clean": clean,
	"test": test,
	"help": help,
}

commands.get(argv[1], help)(argv)