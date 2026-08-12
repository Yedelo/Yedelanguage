import { registerToplevelHandler } from "../FPLanguage/toplevel/toplevel";

const Loader = Java.type("net.minecraftforge.fml.common.Loader");
const PingQueue = Java.type("at.yedel.yedelmod.features.ping.PingQueue");
const PingMethod = Java.type("at.yedel.yedelmod.features.ping.PingMethod");
const YedelConfig = Java.type("at.yedel.yedelmod.config.YedelConfig");
const YedelCommand = Java.type("at.yedel.yedelmod.features.YedelCommand");

const yedelmodloaded = Loader.isModLoaded("yedelmod");

if (yedelmodloaded) {
    registerToplevelHandler((source) => {
        if (source.args.get(0) != "ping") return;
        const methodArg = source.args.get("method") || source.args.get(1);
        let method = PingMethod.values().find((method) => method.friendlyName.equalsIgnoreCase(methodArg));
        if (!method) method = PingMethod.values()[YedelConfig.getInstance().pingMethod];
        PingQueue.getInstance().queue(method, (ping) => {
            source.respond(`Current Ping: ${ping}ms (${method.friendlyName.toLowerCase()})`, { noAntiSpam: true });
        });
    });

    registerToplevelHandler((source) => {
        if (source.args.get(0) != "yd") return;
        const text = [...source.args.values()].slice(1).join(" ");
        YedelCommand.getInstance().settext(text);
    });
}

