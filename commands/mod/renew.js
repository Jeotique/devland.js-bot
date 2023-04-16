const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'renew',
        description: 'Delete and recreate the channel',
        type: 1, //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
        default_member_permissions: ["MANAGE_CHANNELS"]
    }),
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true }).catch(e => { })
        let embed = new Discord.Embed({
            description: "Do you really want to renew this channel ?",
            color: Discord.Colors.RED
        })
        let btn_yes = new Discord.Button({
            emoji: "✅",
            custom_id: "delete_channel",
            style: Discord.ButtonStyle.Danger
        })
        let btn_no = new Discord.Button({
            emoji: "❌",
            custom_id: "cancel",
            style: Discord.ButtonStyle.Success
        })
        interaction.followUp({
            embeds: [embed],
            components: [new Discord.ActionRow(btn_yes, btn_no)]
        }).then(async msg => {
            const collector = msg.createComponentsCollector({ time: 10000, filter: (m) => m.userId === interaction.userId, componentType: Discord.ComponentsType.Button })
            collector.on('collected', async (button) => {
                switch (button.customId) {
                    case 'delete_channel':
                        await interaction.channel.delete().catch(e => { })
                        interaction.channel.clone().catch(e => { })
                        break;
                    case 'cancel':
                        embed.description = "Command canceled."
                        embed.color = Discord.Colors.GREEN
                        interaction.editFollowUp({
                            embeds: [embed],
                            components: []
                        })
                        break;
                }
            })
            collector.on('end', () => {
                embed.description = "Time elapsed, command canceled."
                embed.color = Discord.Colors.PURPLE
                interaction.editFollowUp({
                    embeds: [embed],
                    components: []
                }).catch(e => { })
            })
        })
    }
}