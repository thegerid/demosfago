(function initDemoSfaGoMeetingsStore() {
  const STORAGE_KEY = "demo-sfa-go-meetings-v1";
  const MANUAL_CARDS_STORAGE_KEY = "demo-sfa-go-manual-cards";
  const SESSION_STATE_KEYS = [STORAGE_KEY, MANUAL_CARDS_STORAGE_KEY];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getStorage(name) {
    try {
      return window[name] || null;
    } catch {
      return null;
    }
  }

  function clearKeys(storage, keys) {
    if (!storage) {
      return;
    }
    keys.forEach((key) => {
      try {
        storage.removeItem(key);
      } catch {
        return;
      }
    });
  }

  function getNavigationType() {
    try {
      const navigationEntries = typeof window.performance?.getEntriesByType === "function"
        ? window.performance.getEntriesByType("navigation")
        : [];
      if (navigationEntries[0] && typeof navigationEntries[0].type === "string") {
        return navigationEntries[0].type;
      }
    } catch {
      // Ignore navigation timing issues in local demo mode.
    }
    try {
      if (window.performance?.navigation?.type === 1) {
        return "reload";
      }
    } catch {
      // Ignore legacy navigation timing issues in local demo mode.
    }
    return "navigate";
  }

  const storage = getStorage("sessionStorage");
  clearKeys(getStorage("localStorage"), SESSION_STATE_KEYS);
  if (getNavigationType() === "reload") {
    clearKeys(storage, SESSION_STATE_KEYS);
  }

  function safeParse(raw) {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function read() {
    if (!storage) {
      return [];
    }
    return safeParse(storage.getItem(STORAGE_KEY));
  }

  function write(items) {
    if (!storage) {
      return;
    }
    storage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function ensure(seedItems) {
    const current = read();
    if (current.length) {
      return clone(current);
    }
    const next = Array.isArray(seedItems) ? clone(seedItems) : [];
    write(next);
    return next;
  }

  function getById(id) {
    return read().find((item) => item && item.id === id) || null;
  }

  function upsert(record) {
    if (!record || !record.id) {
      return null;
    }
    const items = read();
    const index = items.findIndex((item) => item && item.id === record.id);
    const next = Object.assign({}, index >= 0 ? items[index] : {}, clone(record));
    if (index >= 0) {
      items[index] = next;
    } else {
      items.push(next);
    }
    write(items);
    return clone(next);
  }

  function patch(id, patchValue) {
    if (!id) {
      return null;
    }
    const current = getById(id);
    if (!current) {
      return null;
    }
    return upsert(Object.assign({}, current, clone(patchValue || {})));
  }

  function remove(id) {
    const items = read().filter((item) => item && item.id !== id);
    write(items);
  }

  window.DemoSfaGoMeetingsStore = {
    STORAGE_KEY,
    storage,
    read,
    write,
    ensure,
    getById,
    upsert,
    patch,
    remove
  };
})();
