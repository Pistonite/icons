import { createUseDark } from "@pistonite/pure/pref";
import { useEffect, useState } from "react";

export const useDark = createUseDark(useState, useEffect);
