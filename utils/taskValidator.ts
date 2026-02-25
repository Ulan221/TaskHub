

export const isTaskValid = (user: object | null, text: string) => {
    if (!user|| text.trim() === "") {
        return false
    } else {
        return true
    }
}