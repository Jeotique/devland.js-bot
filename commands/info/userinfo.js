const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'userinfo',
        description: 'Display some informations about a member',
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
        let member = interaction.guild.members.get(user.id) || await interaction.guild.fetchMember(user.id)
        let banner = await user.fetchBanner().catch(e=>{})
        let embed = new Discord.Embed({
            title: `${user.tag}`,
            fields: [{
                name: "Basic",
                value: `・Username : ${user.username}\n・Full : ${user.tag}\n・Account creation : <t:${member.user.createdTimestamp.toString().slice(0, -3)}>\n・Join date : <t:${member.joinedTimestamp.toString().slice(0, -3)}>`
            }, {
                name: "Roles",
                value: interaction.guild.roles.filter(r => member.roles.includes(r.id)).map(role => `<@&${role.id}>`).join(', ')
            }, {
                name: "Voice",
                value: `・In voice : ${member.voice.channelId ? `✅` : `❌`}\n・Voice channel : ${member.voice.channelId ? `<#${member.voice.channelId}>` : `❌`}`
            }, {
                name: "Presence",
                value: `・Status : ${member.presence.status}\n・Activities : ${member.presence.activities.length < 1 ? `❌` : "\n" + member.presence.activities.map(activity => `> ・Name : \`${activity.name}\`\n> ・State : \`${activity.state ? activity.state : '❌'}\`\n> ・Details : \`${activity.details ? activity.details : '❌'}\`\n> ・Url : \`${activity.url ? activity.url : `❌`}\`\n> ・Since : <t:${activity.created_at.toString().slice(0, -3)}:R>`).join('\n\n')}`
            }],
            color: "RED",
            timestamp: Date.now(),
            thumbnail: user.avatar,
            image: banner ? banner : undefined
        })
        let btn = new Discord.Button({
            label: "Permissions",
            custom_id: 'perm',
            emoji: '🔒'
        })
        interaction.followUp({ embeds: [embed], components: [new Discord.ActionRow(btn)] }).then(async msg => {
            let collector = msg.createComponentsCollector({ componentType: Discord.ComponentsType.Button, time: 60000 })
            collector.on('collected', async button => {
                let perms = member.permissions.toArray()
                let embed = new Discord.Embed({
                    description: perms.length < 1 ? `The user have no permission` : perms.map(p => {
                        let a = p.split('_')
                        let final = ""
                        a.map(b => final += b[0].toUpperCase() + b.slice(1).toLowerCase())
                        return `\`${final}\``
                    }).join(', ')
                })
                button.reply({ ephemeral: true, embeds: [embed] })
            })
            collector.on('end', () => {
                interaction.editFollowUp({ components: [] }).catch(e => { })
            })
        })
    }
}