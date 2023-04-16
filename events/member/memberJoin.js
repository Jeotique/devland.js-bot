const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    name: 'memberJoin',
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Member} member
     */
    run: async (client, member) => {
        const { guild } = member
        if (!guild) return
        let channel = await guild.fetchChannel(client.welcome.channelId).catch(e => { })
        if (channel) {
            channel.send(client.welcome.message(member)).catch(e => { })
        }
        client.welcome.default_roles = client.welcome.default_roles.filter(roleId => guild.roles.has(roleId))
        if (client.welcome.default_roles.length > 0) member.addRoles(client.welcome.default_roles, `Default role(s) when a member join`).catch(e => { })
    }
}