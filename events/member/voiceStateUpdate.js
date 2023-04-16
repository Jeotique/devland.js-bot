const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.VoiceState} old_state
     * @param {Discord.VoiceState} state
     */
    run: async (client, old_state, state) => {
        const { guild, member } = state;
        if (!member) return;
        if (!guild) return;
        if (!old_state.data_is_available) return;
        let channel = client.voiceChannels.get(client.jointocreate.channelId) || await guild.fetchChannel(client.jointocreate.channelId).catch(e => { });
        if (!channel) return;
        if (old_state.channelId === state.channelId) return;
        if (!old_state.channelId) {
            if (state.channelId === client.jointocreate.channelId) {
                guild.createChannel({
                    name: client.jointocreate.name(member),
                    type: Discord.channelType.GUILD_VOICE,
                    parent_id: channel.parent_id,
                    permission_overwrites: [{
                        type: Discord.PermissionIdType.USER,
                        id: member.id,
                        allow: ["MOVE_MEMBERS", "DEAFEN_MEMBERS", "MUTE_MEMBERS", "MANAGE_CHANNELS", "MANAGE_MESSAGES"]
                    }]
                }).then(user_channel => {
                    client.jointocreate.cache.push(user_channel.id);
                    member.edit({ channel_id: user_channel.id, reason: `Join to create` });
                });
            }
        } else {
            if (!client.jointocreate.cache.includes(old_state.channelId)) return;
            if (guild.members.filter(m => m.voice?.channelId === old_state.channelId).size < 1) {
                let roomChannel = client.voiceChannels.get(old_state.channelId) || await guild.fetchChannel(old_state.channelId).catch(e => { });
                if (!roomChannel) return;
                roomChannel.delete(`Join to create channel empty`).catch(e => { });
                client.jointocreate.cache = client.jointocreate.cache.filter(channelId => channelId !== old_state.channelId);
            }
        }
    }
}