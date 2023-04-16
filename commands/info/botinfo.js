const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'botinfo',
        description: 'Display the bot informations',
        type: 1 //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
    }),
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply().catch(e => { })

        let embed = new Discord.Embed({
            title: `About ${client.user.username}`,
            url: 'https://discord.gg/devland',
            fields: [{
                name: "🛠 Owners",
                value: `${client.ownerIds.map(id => client.users.get(id).tag).join('\n')}`,
                inline: true
            }, {
                name: "🛡 Developer",
                value: `Jeotique#0001`,
                inline: true
            }, {
                name: "🔌 Ping",
                value: `\`${client.ws.ping}ms\``
            }, {
                name: "🚀 Servers",
                value: `\`${client.guilds.size}\``,
                inline: true
            }, {
                name: "👥 Users",
                value: `\`${client.users.size}\``,
                inline: true
            }, {
                name: "🛎 Support",
                value: `[click here](https://discord.gg/devland)`,
                inline: true
            }, {
                name: "📗 Node.js",
                value: `\`${process.version}\``,
                inline: true
            }, {
                name: "📚 Devland.js",
                value: `\`${Discord.version||"update the lib"}\``,
                inline: true
            }, {
                name: "🟢 Uptime",
                value: `<t:${(Date.now()-client.uptime).toString().slice(0, -3)}:R>`,
                inline: true
            }],
            image: "attachment://LUMA.png",
            color: "GREEN",
            footer: {text: `Bot & Lib made by Jeotique#0001`}
        })
        interaction.followUp({embeds: [embed], files: ["./LUMA.png"]})
    }
}