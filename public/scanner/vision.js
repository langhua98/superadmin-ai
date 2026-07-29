// 拍完后自动识别扫描对象并命名(YOLOS-tiny,COCO 80 类)。
// 全部自托管:用户网络屏蔽 huggingface.co,绝不能让 transformers.js 联网取权重。
// 单张推理约 2~3 秒,故只在采集结束后跑少量样本,不做实时取景。

let detector = null;

const ZH = {
    person: "人物", bicycle: "自行车", car: "汽车", motorcycle: "摩托车", airplane: "飞机",
    bus: "公交车", train: "火车", truck: "卡车", boat: "船", "traffic light": "红绿灯",
    "fire hydrant": "消防栓", "stop sign": "停车牌", bench: "长椅", bird: "鸟", cat: "猫",
    dog: "狗", horse: "马", sheep: "羊", cow: "牛", elephant: "大象", bear: "熊",
    zebra: "斑马", giraffe: "长颈鹿", backpack: "背包", umbrella: "雨伞", handbag: "手提包",
    tie: "领带", suitcase: "行李箱", frisbee: "飞盘", skis: "滑雪板", snowboard: "单板",
    "sports ball": "球", kite: "风筝", "baseball bat": "球棒", skateboard: "滑板",
    surfboard: "冲浪板", "tennis racket": "网球拍", bottle: "瓶子", "wine glass": "酒杯",
    cup: "杯子", fork: "叉子", knife: "刀", spoon: "勺子", bowl: "碗", banana: "香蕉",
    apple: "苹果", sandwich: "三明治", orange: "橙子", broccoli: "西兰花", carrot: "胡萝卜",
    "hot dog": "热狗", pizza: "披萨", donut: "甜甜圈", cake: "蛋糕", chair: "椅子",
    couch: "沙发", "potted plant": "盆栽", bed: "床", "dining table": "餐桌", toilet: "马桶",
    tv: "电视", laptop: "笔记本电脑", mouse: "鼠标", remote: "遥控器", keyboard: "键盘",
    "cell phone": "手机", microwave: "微波炉", oven: "烤箱", toaster: "烤面包机",
    sink: "水槽", refrigerator: "冰箱", book: "书", clock: "钟", vase: "花瓶",
    scissors: "剪刀", "teddy bear": "玩偶", "hair drier": "吹风机", toothbrush: "牙刷",
};

async function load(onProgress) {
    if (detector) return detector;
    const { pipeline, env } = await import("./vendor/transformers.js");
    // 必须用绝对 URL:相对路径会以 transformers.js 自身位置为基准,解析成 /vendor/vendor/ort/
    const base = new URL(".", import.meta.url).href;
    env.allowLocalModels = true;                         // 浏览器版默认关闭,必须显式打开
    env.allowRemoteModels = false;                       // 禁止联网取权重
    env.localModelPath = base + "models/";
    env.backends.onnx.wasm.wasmPaths = base + "vendor/ort/";   // 自托管运行时
    env.backends.onnx.wasm.numThreads = 1;               // iOS 无 SharedArrayBuffer
    detector = await pipeline("object-detection", "yolos-tiny", {
        dtype: "q8", progress_callback: onProgress,
    });
    return detector;
}

// 从若干张照片里投票选出主体。blobs: Blob[];返回 {name, label, score} 或 null
export async function nameScene(blobs, onProgress) {
    const det = await load(onProgress);
    const { RawImage } = await import("./vendor/transformers.js");
    const votes = new Map();
    for (const b of blobs) {
        let img;
        try { img = await RawImage.fromBlob(b); } catch (e) { continue; }
        let out;
        try { out = await det(img, { threshold: 0.5 }); } catch (e) { continue; }
        for (const o of out) {
            const v = votes.get(o.label) || { n: 0, sum: 0 };
            v.n++; v.sum += o.score; votes.set(o.label, v);
        }
    }
    if (!votes.size) return null;
    // 出现次数 × 平均置信度 最高者胜出
    let best = null;
    for (const [label, v] of votes) {
        const score = v.n * (v.sum / v.n);
        if (!best || score > best.score) best = { label, score, avg: v.sum / v.n };
    }
    return best ? { name: ZH[best.label] || best.label, label: best.label, score: best.avg } : null;
}
