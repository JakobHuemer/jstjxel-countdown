const PASSWORD = process.env.PASSWORD;

export default async function checkPassword(event: any): Promise<boolean> {
    return getHeader(event, "password") == PASSWORD;
}