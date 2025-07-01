const config = require("../config.json");

module.exports = {
    name: "اضف",
    usePrefix: false,
    admin: true,
    usage: "add [list | number]",
    version: "1.1",
    description: "Add the owner to a group.",
    cooldown: 5,

    async execute({ api, event, args }) {
        const threadID = event.threadID;
        const senderID = event.senderID;

        if (senderID !== config.ownerID) {
            return api.sendMessage("ماعندك صلاحية 🐢.", threadID);
        }

        const threads = await api.getThreadList(100, null, ["INBOX"]);
        const groups = threads.filter(t => t.isGroup);

        if (args[0] === "list") {
            if (groups.length === 0) return api.sendMessage("لم اجدالمجموعه •-•.", threadID);

            const msg = groups.map((g, i) => `${i + 1}. ${g.name || "Unnamed"} (${g.threadID})`).join("\n");
            return api.sendMessage("📋قائمة المجموعات  :\n\n" + msg, threadID);
        }

        const index = parseInt(args[0]) - 1;
        const group = groups[index];
        if (!group) return api.sendMessage("❌ Invalid group number.", threadID);

        try {
            await api.addUserToGroup(config.ownerID, group.threadID);
            return api.sendMessage(`✅ Owner added to group: ${group.name || "Unnamed Group"}`, threadID);
        } catch (err) {
            console.error("❌ :", err);
            return api.sendMessage("ما قدرت اضيفك.برو 😐💔 .", threadID);
        }
    }
};
