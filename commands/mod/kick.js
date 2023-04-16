const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'kick',
        description: 'Kick a member from the server',
        type: 1, //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
        default_member_permissions: ["KICK_MEMBERS"],
        options: [{
            type: Discord.commandOptionsType.USER,
            name: "user",
            description: "Who you want to kick from this server ?",
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
        await interaction.deferReply({ephemeral: true}).catch(e => { })
        let user = interaction.getCommandValue("user")
        let reason = interaction.getCommandValue("reason")
        if(interaction.userId === user.id) return interaction.followUp({content: "You can't kick urself"}).catch(e=>{})
        if(client.ownerIds.includes(user.id)) return interaction.followUp({content: "You can't kick this person (`bot owner`)"}).catch(e=>{})
        if(interaction.guild.ownerId === user.id) return interaction.followUp({content: "You can't kick this person (`guild owner`)"})
        let member = interaction.guild.members.get(user.id)
        if(!member) member = await interaction.guild.fetchMember(user)
        if(!client.ownerIds.includes(interaction.userId) && interaction.guild.ownerId !== interaction.userId && member.permissions.has("ADMINISTRATOR")) return interaction.followUp({content: "You can't kick this person (`administrator`)"}).catch(e=>{})
        let myRoles = await interaction.member.fetchRoles()
        let hisRoles = await member.fetchRoles()
        if(myRoles.size > 0) myRoles = myRoles.sort((a, b) => a.position-b.position)
        if(hisRoles.size > 0) hisRoles = hisRoles.sort((a, b) => a.position-b.position)
        if(!client.ownerIds.includes(interaction.userId) && interaction.guild.ownerId !== interaction.userId && (myRoles.size > 0 && hisRoles.size > 0) && myRoles.first().comparePositions(hisRoles.first()) < 1) return interaction.followUp({content: "You can't kick this person (`above you`)"}).catch(e=>{})
        member.kick(reason).then(() => {
            interaction.followUp({content: `${user.tag} has been kicked`})
        }).catch(e=>{
            interaction.followUp({content: `${user.tag} cannot be kicked`})
        })
    }
}