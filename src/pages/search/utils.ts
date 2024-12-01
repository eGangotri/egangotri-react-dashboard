
 const filterLogic = (data: any[],
     filterTerm: string,
      _useOrLogic: boolean,
      titleKey: string = "titleGDrive") => {
    const terms = filterTerm.toLowerCase().split(/\s+/g).filter(term => term.length > 0); console.log(`terms ${JSON.stringify(terms)} ${terms.length}`);
    return data.filter(item => {
        const title = item[`${titleKey}`].toLowerCase();
        if (_useOrLogic) {
            return terms.some(term => title.includes(term.trim()));
        } else {
            return terms.every(term => title.includes(term.trim()));
        }
    });
}

export const filterLogicForArchiveSearch = (data: any[], filterTerm: string, _useOrLogic: boolean) => {
    return filterLogic(data, filterTerm, _useOrLogic, "originalTitle");
}

export const filterLogicForGDriveSearch = (data: any[], filterTerm: string, _useOrLogic: boolean) => {
    return filterLogic(data, filterTerm, _useOrLogic);
}
