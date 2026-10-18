import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

export type Picker = (windows: Meta.Window[]) => Meta.Window | Shell.AppSystem | undefined;

export const buildLastShortcutWindowPicker: (wmClass: string) => Picker = (wmClass) => {
  return (windows) => windows.find(w => w.get_wm_class() == wmClass);
}

export const pickLastWindowCurrentApplication: Picker = (windows) => {
  if (windows.length < 1) {
    return;
  }
  const currentWindowWmClass = windows[0].get_wm_class();
  for (let i = 1; i < windows.length; i++) {
    if (windows[i].get_wm_class() == currentWindowWmClass) return windows[i];
  }
};

export const pickLastWindowExceptCurrentApplication: Picker = ((windows) => {
  if (windows.length < 1) {
    return;
  }
  const currentWindowWmClass = windows[0].get_wm_class();
  for (let i = 1; i < windows.length; i++) {
    if (windows[i].get_wm_class() != currentWindowWmClass) return windows[i];
  }
});

export const buildLastNonShortcutWindowPicker: (shortcutWmClasses: string[]) => Picker = (shortcutWmClasses) => {
  return (windows) => {
    for (let i = 0; i < windows.length; i++) {
      if (!shortcutWmClasses.includes(windows[i].get_wm_class() ?? "")) return windows[i];
    }
  }
};
