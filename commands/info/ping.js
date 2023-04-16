const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'ping',
        description: 'Display the bot ping in ms',
        type: 1 //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
    }),
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply().catch(e => { })

        if (client.ws.ping < 1)
            return interaction.followUp({
                content: "Impossible to get the ping before the first heartbeat, please wait some seconds and retry",
            })

        let embed = new Discord.Embed({
            title: 'PING',
            fields: [{
                name: 'WS',
                value: `${client.ws.ping}ms`
            }],
            color: 'BLUE',
            //timestamp: Date.now(),
            footer: {
                text: 'devland.js',
                icon_url: undefined
            }
        })
        let realTimestamp = Date.now() //we create this here to get the real time between a request and his response
        interaction.followUp({ embeds: [embed] }).then(msg => {
            embed.fields.push({
                name: 'BOT',
                value: `${realTimestamp - msg.createdTimestamp}ms`
            })
            interaction.editFollowUp({ embeds: [embed] })
        })
    }
}