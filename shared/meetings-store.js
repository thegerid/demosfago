(function initDemoSfaGoMeetingsStore() {
  const STORAGE_KEY = "demo-sfa-go-meetings-v1";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
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
    try {
      return safeParse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      return [];
    }
  }

  function write(items) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      return;
    }
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
    read,
    write,
    ensure,
    getById,
    upsert,
    patch,
    remove
  };
})();
