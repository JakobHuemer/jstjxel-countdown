import CountdownManager from '~/utils/CountdownManager';

export default defineEventHandler(() => {
    return {
        status: 200,
        msg: 'OK',
        list: CountdownManager.all
    }
})