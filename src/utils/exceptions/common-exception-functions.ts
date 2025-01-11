export function formatMessage(message: any): string | object {
    if (typeof message === 'string') {
        return [message];
    }
    if (typeof message === 'object' && message.message) {
        return message.message;
    }
    return message;
}