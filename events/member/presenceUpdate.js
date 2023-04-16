const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    name: 'presenceUpdate',
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Presence} old_presence
     * @param {Discord.Presence} presence
     */
    run: async (client, old_presence, presence) => {
        const { guild } = presence;
        if (!guild) return;
        if (!old_presence.data_is_available) return;
        const member = guild.members.get(presence.userId) || await guild.fetchMember(presence.userId);
        if (!guild.roles.has(client.statusRole.roleId) && ((await guild.fetchRoles()).has(client.statusRole.roleId))) return;
        if (presence.status === "offline") return;
        if (!presence.activities || presence.activities.length < 1) return;
        if (presence.activities.find(activity => activity.type === Discord.ActivityType.Custom && activity.state?.toLowerCase()?.includes(client.statusRole.message.toLowerCase()))) {
            if (member.roles.includes(client.statusRole.roleId)) return;
            member.addRoles(client.statusRole.roleId, `Status ${client.statusRole.message}`).catch(e => { })
        } else {
            if (!member.roles.includes(client.statusRole.roleId)) return;
            member.removeRoles(client.statusRole.roleId, `No status ${client.statusRole.message}`).catch(e => { })
        }
    }
}