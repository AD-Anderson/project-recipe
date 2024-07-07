export const truncateText = (text, numWords=60) => {
    const textArray = text.split("")
    if (textArray.length <= numWords) {
        return text
    } else {
        return textArray.slice(0, numWords).join("") + "..."
    }

}