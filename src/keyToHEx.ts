const keyMap = {
    arrowDown: '\x1B\x5B\x42',
    arrowLeft: '\x1b\x5b\x44',
    arrowRight: '\x1b\x5b\x43',
    arrowUp: '\x1b\x5b\x41',
    backSpace: '\x08',
    delete: '\x1b\x5b\x33\x7e',
    end: '\x1b\x4f\x46',
    enter: '\x0D',
    escape: '\x1b',
    home: '\x1b\x4f\x48',
    pageUp: '\x1b\x5b\x35\x7e',
    pageDown: '\x1b\x5b\x36\x7e',
    space: '\x20',
};

export type KeyMap = keyof typeof keyMap;
export const keyToHEx = (key: KeyMap) => {
    return keyMap[key];
};
