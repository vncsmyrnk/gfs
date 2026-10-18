[![GitHub main branch check runs](https://img.shields.io/github/check-runs/vncsmyrnk/gfs/main?style=plastic&logo=github&label=CI%20workflow)](https://github.com/vncsmyrnk/gfs/actions/workflows/ci.yaml)
[![GNOME versions](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fvncsmyrnk%2Fgfs%2Fraw%2Frefs%2Fheads%2Fmain%2Fmetadata.json&query=%24.shell-version&style=plastic&logo=gnome&label=GNOME%20versions)]()

GNOME extension to fast switch between windows using keybindings.

This extension overwrites the default `switch-to-application-N` keybindings. The default GNOME functionalities brings up all windows of the application when this keybind is triggered. This extension brings up _only_ the last focused window.

| keybind | action |
| --- | --- |
| `<Super>1..3` | Run or raise last window of application 1, 2 or 3 |
| `<Super>j` | Raise the last seen window of the currently focused application |
| `<Super>k` | Raise the last seen window NOT of the currently focused application (e.i. alt+tab) |
| `<Super>,` | Raise the last seen window NOT of the predefined applications 1, 2 or 3 |

## Install

```sh
autoreconf -fi
./configure
make install
```

Or using your favorite AUR helper:

```sh
paru -S gnome-shell-extension-gfs-git
```

## Customization

```sh
# Sets <Super>1 shortcut to run or raise ghostty
gsettings set org.gnome.shell.extensions.gfs shortcut-1-wm-class "com.mitchellh.ghostty"
```
