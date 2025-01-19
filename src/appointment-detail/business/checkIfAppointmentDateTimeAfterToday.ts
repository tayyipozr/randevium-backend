export function checkIfAppointmentDateTimeAfterToday(date: string) {
    const _date = new Date(date);
    return _date > new Date();
}