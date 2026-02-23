

import { GameTheme } from '../gameTypes';
import { MarioTheme } from './mario/index';

// This file now acts as the entry point for selecting the active theme.
// To change the theme, import a different Theme object and assign it to CurrentTheme.

export const CurrentTheme: GameTheme = MarioTheme;
