const PASSWORD = process.env.PASSWORD;

export default async function checkPassword(event: any): Promise<boolean> {
    console.log(PASSWORD);
    return getHeader(event, "password") == PASSWORD;
}