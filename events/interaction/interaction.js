const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    name: 'interaction',
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction
     */
    run: async(client, interaction) => {
        if(!interaction.isSlashCommand) return;
        let command = client.commands.get(interaction.commandName);
        if(!command) return;
        command.run(client, interaction)
    }
}