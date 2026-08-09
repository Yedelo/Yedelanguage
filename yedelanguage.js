import { registerToplevelHandler } from "../FPLanguage/toplevel/toplevel";

const Loader = Java.type("net.minecraftforge.fml.common.Loader");
const PingQueue = Java.type("at.yedel.yedelmod.features.ping.PingQueue");
const PingMethod = Java.type("at.yedel.yedelmod.features.ping.PingMethod");
const YedelConfig = Java.type("at.yedel.yedelmod.config.YedelConfig");
const UChat = Java.type("cc.polyfrost.oneconfig.libs.universal.UChat");

const yedelmodloaded = Loader.isModLoaded("yedelmod");

if (yedelmodloaded) {
    registerToplevelHandler((name, args, sourceCallback, admin) => {
        if (args.get(0) != "ping") return;
        const methodArg = args.get("method") || args.get(1);
        let method = PingMethod.values().find((method) => method.friendlyName.equalsIgnoreCase(methodArg));
        if (!method) method = PingMethod.values()[YedelConfig.getInstance().pingMethod];
        PingQueue.getInstance().queue(method, (ping) => {
            sourceCallback(`Current Ping: ${ping}ms (${method.friendlyName.toLowerCase()})`, { noAntiSpam: true });
        });
    });

    registerToplevelHandler((name, args, sourceCallback, admin) => {
        if (args.get(0) != "yd") return;
        const text = UChat.addColor([...args.values()].slice(1).join(" "));
        YedelConfig.getInstance().customTextHud.displayText = text;
        YedelConfig.getInstance().save();
    });
}

