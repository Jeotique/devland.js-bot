const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'pic',
        description: 'Display user avatar',
        type: 1, //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
        options: [{
            name: 'user',
            description: 'Who ?',
            type: Discord.commandOptionsType.USER,
            required: true
        }]
    }),
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply().catch(e => { })
        let user = interaction.getCommandValue('user')

        let embed = new Discord.Embed({
            title: `${user.tag}`,
            description: user.avatar ? undefined : "This user have no avatar",
            image: user.avatar ? user.avatar : undefined,
            color: "RED"
        })
        interaction.followUp({ embeds: [embed] })
    }
}