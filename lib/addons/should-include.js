export default function shouldIncludeAddon(addon, blacklist, whitelist) {
  if (!addonEnabled(addon)) {
    return false;
  }

  return !addonDisabledByBlacklist(addon, blacklist) && !addonDisabledByWhitelist(addon, whitelist);
}

function addonEnabled(addon) {
  return !addon.isEnabled || addon.isEnabled();
}

function addonDisabledByBlacklist(addon, blacklist) {
  return !!blacklist && blacklist.indexOf(addon.name) !== -1;
}

function addonDisabledByWhitelist(addon, whitelist) {
  return !!whitelist && whitelist.indexOf(addon.name) === -1;
}