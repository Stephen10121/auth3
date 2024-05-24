import type { RecordModel } from "pocketbase";

export type LoginRecord = {
    date: Date
    ip: string
    service: string
    deviceType: string
    userAgent: string
    deviceInfo: {
        complete_device_name: string,
        form_factor: string,
        is_mobile: boolean
    }
}

export async function addLogin({record, locals, ip, service, deviceType, userAgent, deviceInfo}: {record: RecordModel, locals: App.Locals, ip: string, service: string, deviceType: string, userAgent: string, deviceInfo: LoginRecord["deviceInfo"]}) {
    let logins = record.logins === null ? [] : record.logins as LoginRecord[];
    logins.push({
        date: new Date(),
        ip,
        service,
        deviceType,
        userAgent,
        deviceInfo
    });

    try {
        await locals.pb.collection('users').update(record.id, { ...record, logins });
    } catch (err) {
        console.log(err);
    }
}