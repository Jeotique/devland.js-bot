const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    name: 'ready',
    /**
     * 
     * @param {Bot} client 
     */
    run: async (client) => {
        console.log(`${client.user.tag} connected`)
        console.log(`${client.guilds.size} servers`)
        client.guilds.map(guild => guild.setCommands(client.commands.map(cmd => cmd.data)).catch(e => { 
            console.log(`Can't setup commands on ${guild.name}`)
         }))
    }
}