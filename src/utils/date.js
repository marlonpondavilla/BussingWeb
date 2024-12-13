
export const date = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
    const day = String(now.getDate()).padStart(2, '0'); // padStart ensures 2 digits for the day

    return `${year}-${month}-${day}`;
}
