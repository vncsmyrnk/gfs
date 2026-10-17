[![GitHub main branch check runs](https://img.shields.io/github/check-runs/vncsmyrnk/gfs/main?style=plastic&logo=github&label=CI%20workflow)](https://github.com/vncsmyrnk/gfs/actions/workflows/ci.yaml)

GNOME extension to fast switch between windows using keybindings.

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
