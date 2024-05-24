import type { RecordModel } from "pocketbase";

export type LoginRecord = {
    date: Date
    ip: string
    service: string
    deviceType: string
}

export async function addLogin(record: RecordModel, locals: App.Locals, ip: string, service: string, deviceType: string) {
    let logins = record.logins === null ? [] : record.logins as LoginRecord[];
    logins.push({
        date: new Date(),
        ip,
        service,
        deviceType
    });

    try {
        await locals.pb.collection('users').update(record.id, { ...record, logins });
    } catch (err) {
        console.log(err);
    }
}