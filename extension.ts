/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import Clutter from 'gi://Clutter';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {
  Picker,
  buildLastShortcutWindowPicker,
  buildLastNonShortcutWindowPicker,
  pickLastWindowCurrentApplication,
  pickLastWindowExceptCurrentApplication,
  buildLastNthWindowCurrentApplicationPicker
} from './lib/picker';

declare const global: Shell.Global;

export default class gfs extends Extension {
  _gsettings?: Gio.Settings
  _active: boolean = true
  _stageSignalId?: number
  _sessionWindows: Meta.Window[] = []
  _step: number = 0

  static _raise(picker: Picker): boolean {
    const windows = global.display.get_tab_list(Meta.TabList.NORMAL_ALL, null);
    const picked = picker(windows);
    if (picked) {
      Main.activateWindow(picked);
      return true;
    }
    return false;
  }

  static _run(wmClass: string): void {
    global.get_app_system().lookup_desktop_wmclass(wmClass).activate();
  }


  static _keybindRaise(picker: Picker): Meta.KeyHandlerFunc {
    return (_d: Meta.Display, _w: Meta.Window, _e: Clutter.Event, _b: Meta.KeyBinding): void => {
      this._raise(picker);
    };
  }

  static _keybindRunOrRaise(wmClass: string): Meta.KeyHandlerFunc {
    return (_d: Meta.Display, _w: Meta.Window, _e: Clutter.Event, _b: Meta.KeyBinding): void => {
      if (!this._raise(buildLastShortcutWindowPicker(wmClass))) {
        this._run(wmClass);
      }
    };
  }

  enable() {
    this._gsettings = this.getSettings();
    this._stageSignalId = global.stage.connect(
      'key-release-event',
      (_actor, event) => this._onKeyReleased(event)
    );

    const shortcut1WmClass = this._gsettings.get_string("shortcut-1-wm-class");
    const shortcut2WmClass = this._gsettings.get_string("shortcut-2-wm-class");
    const shortcut3WmClass = this._gsettings.get_string("shortcut-3-wm-class");
    const allShortcutWmClasses = [shortcut1WmClass, shortcut2WmClass, shortcut3WmClass];

    const gnomeShellKeybindingsSettings = this.getSettings("org.gnome.shell.keybindings");
    gnomeShellKeybindingsSettings.set_strv("switch-to-application-1", null);
    gnomeShellKeybindingsSettings.set_strv("switch-to-application-2", null);
    gnomeShellKeybindingsSettings.set_strv("switch-to-application-3", null);
    gnomeShellKeybindingsSettings.set_strv("switch-to-application-4", null);

    Main.wm.addKeybinding("shortcut-1-keybind",
      this._gsettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL,
      gfs._keybindRunOrRaise(shortcut1WmClass)
    );
    Main.wm.addKeybinding("shortcut-2-keybind",
      this._gsettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL,
      gfs._keybindRunOrRaise(shortcut2WmClass)
    );
    Main.wm.addKeybinding("shortcut-3-keybind",
      this._gsettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL,
      gfs._keybindRunOrRaise(shortcut3WmClass)
    );

    Main.wm.addKeybinding("shortcut-test-keybind",
      this._gsettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL,
      (_d: Meta.Display, _w: Meta.Window, _e: Clutter.Event, _b: Meta.KeyBinding): void => {
        console.warn("triggered")
        if (!this._active) {
          this._sessionWindows = global.display.get_tab_list(Meta.TabList.NORMAL_ALL, null);
        }
        console.warn("active? -> " + (this._active ? "true" : "false"))
        this._active = true
        console.warn("step -> " + this._step)

        const picked = buildLastNthWindowCurrentApplicationPicker(++this._step)(this._sessionWindows);
        if (picked) {
          Main.activateWindow(picked);
        }
      }
    );

    Main.wm.addKeybinding("shortcut-last-window-current-application",
      this._gsettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL,
      gfs._keybindRaise(pickLastWindowCurrentApplication)
    );
    Main.wm.addKeybinding("shortcut-last-window-except-current-application",
      this._gsettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL,
      gfs._keybindRaise(pickLastWindowExceptCurrentApplication)
    );
    Main.wm.addKeybinding("shortcut-last-window-non-shortcut",
      this._gsettings, Meta.KeyBindingFlags.NONE, Shell.ActionMode.NORMAL,
      gfs._keybindRaise(buildLastNonShortcutWindowPicker(allShortcutWmClasses))
    );
  }

  disable() {
    if (this._stageSignalId) {
      global.stage.disconnect(this._stageSignalId);
      this._stageSignalId = undefined;
    }

    Main.wm.removeKeybinding("shortcut-1-keybind");
    Main.wm.removeKeybinding("shortcut-2-keybind");
    Main.wm.removeKeybinding("shortcut-3-keybind");
    Main.wm.removeKeybinding("shortcut-test-keybind");
    Main.wm.removeKeybinding("shortcut-last-window-current-application");
    Main.wm.removeKeybinding("shortcut-last-window-except-current-application");
    Main.wm.removeKeybinding("shortcut-last-window-non-shortcut");
  }

  _onKeyReleased(event: Clutter.Event) {
    console.warn("release event")
    if (!this._active)
      return Clutter.EVENT_PROPAGATE;

    if (event.type() === Clutter.EventType.KEY_RELEASE) {
      const symbol = event.get_key_symbol();
      const superKey =
        symbol === Clutter.KEY_Super_L || symbol === Clutter.KEY_Super_R;
      if (superKey) {
        console.warn("deactivated")
        this._active = false;
        this._step = 0;
      }
    }

    return Clutter.EVENT_PROPAGATE;
  }
}
