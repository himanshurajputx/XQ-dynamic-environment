export const uuid = () => {
  try {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  } catch (e) {
    throw e;
  }
};

export const uuidV2 = () => {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString(16); // Convert Unix time to hex
    return `xxyyxxyy-4xxx-${timestamp}-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  } catch (e) {
    throw e;
  }
};

export const toTitleCase = (str: any) => {
  return str.replace(/\p{L}+/gu, function (txt) {
    if (str.indexOf(txt) !== 0 && str.includes(txt.toLowerCase())) {
      return txt.toLowerCase();
    }
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
export const isUUID = (uuid: string) => {
  let s: string = '' + uuid;

  // @ts-ignore
  s = s.match(
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
  );
  if (s === null) {
    return false;
  }
  return true;
};

export const unixHexToDecimal = (hexTimestamp: string): number => {
  const unixTimestamp = parseInt(hexTimestamp, 16);
  // new Date(unixTimestamp * 1000)
  return unixTimestamp;
};
