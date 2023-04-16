const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'unban',
        description: 'Unban a user from the server',
        type: 1, //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
        default_member_permissions: ["BAN_MEMBERS"],
        options: [{
            type: Discord.commandOptionsType.STRING,
            name: "user_id",
            description: "Who you want to unban from this server ? (give Id)",
            required: true
        }, {
            type: Discord.commandOptionsType.STRING,
            name: "reason",
            description: "What the reason ?",
            required: false
        }]
    }),
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true }).catch(e => { })
        let userId = interaction.getCommandValue("user_id")
        let reason = interaction.getCommandValue("reason")
        let user = await client.fetchUser(userId).catch(e => { })
        if (!user) return interaction.followUp({ content: `Unknow user :x:` }).catch(e => { })
        let isBan = await interaction.guild.fetchBan(user.id).catch(e=>{})
        if(!isBan) return interaction.followUp({content: `You can't unban this user (\`not banned\`)`}).catch(e=>{})
        interaction.guild.unbanMember(user, reason).then(() => {
            interaction.followUp({ content: `${user.tag} has been unbanned` })
        }).catch(e => {
            interaction.followUp({ content: `${user.tag} cannot be unbanned` })
        })
    }
}