#!/usr/bin/env python3
from shutil import rmtree
from os import path
def clean(argv):
	if path.exists("build"):
		rmtree("build")
	if path.exists("test"):
		rmtree("test")