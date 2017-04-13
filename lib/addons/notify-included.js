export default function _notifyAddonIncluded(project, blacklist, whitelist, notiferFn) {
  let addonNames = project.addons.map(addon => addon.name);

  if (blacklist) {
    blacklist.forEach(addonName => {
      if (addonNames.indexOf(addonName) === -1) {
        throw new Error(`Addon "${addonName}" defined in blacklist is not found`);
      }
    });
  }

  if (whitelist) {
    whitelist.forEach(addonName => {
      if (addonNames.indexOf(addonName) === -1) {
        throw new Error(`Addon "${addonName}" defined in whitelist is not found`);
      }
    });
  }

  project.addons = project.addons.filter(notiferFn);
}