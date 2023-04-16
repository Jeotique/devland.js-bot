const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'ban',
        description: 'Ban a user from the server',
        type: 1, //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
        default_member_permissions: ["BAN_MEMBERS"],
        options: [{
            type: Discord.commandOptionsType.STRING,
            name: "user_id",
            description: "Who you want to ban from this server ? (give Id)",
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
        if (interaction.userId === user.id) return interaction.followUp({ content: "You can't ban urself" }).catch(e => { })
        if (client.ownerIds.includes(user.id)) return interaction.followUp({ content: "You can't ban this person (`bot owner`)" }).catch(e => { })
        if (interaction.guild.ownerId === user.id) return interaction.followUp({ content: "You can't ban this person (`guild owner`)" })
        let member = interaction.guild.members.get(user.id)
        if (!member) member = await interaction.guild.fetchMember(user).catch(e => { })
        if (!member) {
            interaction.guild.banMember(user.id, 86400, reason).then(() => {
                interaction.followUp({ content: `${user.tag} has been banned` })
            }).catch(e => {
                interaction.followUp({ content: `${user.tag} cannot be banned` })
            })
        } else {
            if (!client.ownerIds.includes(interaction.userId) && interaction.guild.ownerId !== interaction.userId && member.permissions.has("ADMINISTRATOR")) return interaction.followUp({ content: "You can't ban this person (`administrator`)" }).catch(e => { })
            let myRoles = await interaction.member.fetchRoles()
            let hisRoles = await member.fetchRoles()
            if (myRoles.size > 0) myRoles = myRoles.sort((a, b) => a.position - b.position)
            if (hisRoles.size > 0) hisRoles = hisRoles.sort((a, b) => a.position - b.position)
            if (!client.ownerIds.includes(interaction.userId) && interaction.guild.ownerId !== interaction.userId && (myRoles.size > 0 && hisRoles.size > 0) && myRoles.first().comparePositions(hisRoles.first()) < 1) return interaction.followUp({ content: "You can't ban this person (`above you`)" }).catch(e => { })
            member.ban(86400, reason).then(() => {
                interaction.followUp({ content: `${user.tag} has been banned` })
            }).catch(e => {
                interaction.followUp({ content: `${user.tag} cannot be banned` })
            })
        }
    }
}