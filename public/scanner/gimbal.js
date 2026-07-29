// 大疆 Osmo Mobile 手持云台 Web Bluetooth 控制(社区逆向协议,参考 alkersan/om-research)
// 协议:DUML over BLE GATT — service FFF0,write FFF5,notify FFF4
// 转动包:55 15 04 a9 | 02 04 01 00 00 04 <0c|14> | yaw(i16LE) roll(i16LE) pitch(i16LE) mode time | crc16(LE)
// speed 模式(mode=0x80):yaw 单位约 0.1°/s,指令持续 time×0.1s,需周期重发
// 已验证型号 OM2/3/4;OM6 同族协议,靠日志诊断确认

const SVC = "0000fff0-0000-1000-8000-00805f9b34fb";
const CH_NOTIFY = "0000fff4-0000-1000-8000-00805f9b34fb";
const CH_WRITE = "0000fff5-0000-1000-8000-00805f9b34fb";

// poly=0x1021 refin/refout,init 0xdf0c(已含固定包头),对照 om-research 抓包样本验证通过
const T16 = [
    0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf,
    0x8c48, 0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7,
    0x1081, 0x0108, 0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e,
    0x9cc9, 0x8d40, 0xbfdb, 0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876,
    0x2102, 0x308b, 0x0210, 0x1399, 0x6726, 0x76af, 0x4434, 0x55bd,
    0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e, 0xfae7, 0xc87c, 0xd9f5,
    0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e, 0x54b5, 0x453c,
    0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd, 0xc974,
    0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb,
    0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3,
    0x5285, 0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a,
    0xdecd, 0xcf44, 0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72,
    0x6306, 0x728f, 0x4014, 0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9,
    0xef4e, 0xfec7, 0xcc5c, 0xddd5, 0xa96a, 0xb8e3, 0x8a78, 0x9bf1,
    0x7387, 0x620e, 0x5095, 0x411c, 0x35a3, 0x242a, 0x16b1, 0x0738,
    0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862, 0x9af9, 0x8b70,
    0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e, 0xf0b7,
    0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff,
    0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036,
    0x18c1, 0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e,
    0xa50a, 0xb483, 0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5,
    0x2942, 0x38cb, 0x0a50, 0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd,
    0xb58b, 0xa402, 0x9699, 0x8710, 0xf3af, 0xe226, 0xd0bd, 0xc134,
    0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7, 0x6e6e, 0x5cf5, 0x4d7c,
    0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1, 0xa33a, 0xb2b3,
    0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72, 0x3efb,
    0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232,
    0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a,
    0xe70e, 0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1,
    0x6b46, 0x7acf, 0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9,
    0xf78f, 0xe606, 0xd49d, 0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330,
    0x7bc7, 0x6a4e, 0x58d5, 0x495c, 0x3de3, 0x2c6a, 0x1ef1, 0x0f78,
];
function crc16(bytes, init) {
    let crc = init;
    for (let i = 0; i < bytes.length; i++) crc = ((crc >> 8) ^ T16[(bytes[i] ^ crc) & 0xff]) & 0xffff;
    return crc;
}

export function buildRotate(yaw, pitch, roll, time, mode) {
    const header = [0x55, 0x15, 0x04, 0xa9];
    const body = [0x02, 0x04, 0x01, 0x00, 0x00, 0x04, mode === 0x80 ? 0x0c : 0x14];
    const p = new Uint8Array(8);
    const dv = new DataView(p.buffer);
    dv.setInt16(0, yaw, true); dv.setInt16(2, roll, true); dv.setInt16(4, pitch, true);
    p[6] = mode; p[7] = time;
    const bp = new Uint8Array([...body, ...p]);
    const crc = crc16(bp, 0xdf0c);
    return new Uint8Array([...header, ...bp, crc & 0xff, crc >> 8]);
}

const hex = (u8) => [...u8].map(b => b.toString(16).padStart(2, "0")).join(" ");
let device = null, writeChar = null, spinTimer = null, log = () => {};

export function setLog(fn) { log = fn; }
export function isConnected() { return !!(device && device.gatt && device.gatt.connected); }
export function isSpinning() { return !!spinTimer; }
export function deviceName() { return device ? (device.name || "未知设备") : null; }

export async function connect() {
    if (!navigator.bluetooth) throw new Error("此浏览器不支持网页蓝牙");
    device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SVC] }, { namePrefix: "OM" }, { namePrefix: "DJI" }, { namePrefix: "Osmo" }],
        optionalServices: [SVC],
    });
    device.addEventListener("gattserverdisconnected", () => { log("⚠️ 蓝牙已断开"); stopSpin(true); });
    log("连接中 " + (device.name || device.id) + " …");
    const server = await device.gatt.connect();
    log("✅ 已连接 " + (device.name || "未知设备"));

    // 诊断:枚举全部服务/特征(OM6 若与 OM4 不同,靠这里的日志排查)
    try {
        const svcs = await server.getPrimaryServices();
        for (const s of svcs) {
            const chars = await s.getCharacteristics().catch(() => []);
            log("service " + s.uuid.slice(4, 8) + " [" + chars.map(c => c.uuid.slice(4, 8)).join(",") + "]");
        }
    } catch (e) { log("服务枚举失败:" + e.message); }

    const svc = await server.getPrimaryService(SVC);
    try {
        const notif = await svc.getCharacteristic(CH_NOTIFY);
        await notif.startNotifications();
        let nlogged = 0;
        notif.addEventListener("characteristicvaluechanged", (e) => {
            if (nlogged++ < 5) log("← " + hex(new Uint8Array(e.target.value.buffer)));
        });
    } catch (e) { log("通知订阅失败(不影响控制):" + e.message); }
    writeChar = await svc.getCharacteristic(CH_WRITE);
    log("写通道就绪,可以开始转圈");
    return device.name || "云台";
}

async function writePacket(pkt) {
    const w = writeChar.properties.writeWithoutResponse
        ? (d) => writeChar.writeValueWithoutResponse(d)
        : (d) => writeChar.writeValue(d);
    try { await w(pkt); }
    catch (e) {
        // 个别栈限制单次写长度 → 拆两段(DUML 解析端有缓冲,可分段送达)
        await w(pkt.slice(0, 18)); await w(pkt.slice(18));
    }
}

// degPerSec:正=向右转;speed 指令持续 1s,每 500ms 重发保持匀速
export async function startSpin(degPerSec) {
    if (!writeChar) throw new Error("请先连接云台");
    stopSpinTimerOnly();
    const yaw = Math.max(-1500, Math.min(1500, Math.round(degPerSec * 10)));
    const pkt = buildRotate(yaw, 0, 0, 10, 0x80);
    log("→ 转动 " + degPerSec + "°/s  " + hex(pkt));
    const send = () => writePacket(pkt).catch((e) => log("发送失败:" + e.message));
    await writePacket(pkt);
    spinTimer = setInterval(send, 500);
}

function stopSpinTimerOnly() { if (spinTimer) { clearInterval(spinTimer); spinTimer = null; } }

export function stopSpin(silent) {
    stopSpinTimerOnly();
    if (writeChar && isConnected()) {
        writePacket(buildRotate(0, 0, 0, 10, 0x80)).catch(() => {});
        if (!silent) log("⏹ 已停止转动");
    }
}

export function disconnect() {
    stopSpin(true);
    if (device && device.gatt.connected) device.gatt.disconnect();
    device = null; writeChar = null;
}
