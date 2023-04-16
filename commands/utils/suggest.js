const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'suggest',
        description: 'Suggest a new feature for the bot',
        type: 1 //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
    }),
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ephemeral: true}).catch(e => { })

        let suggestChannel = client.textChannels.get(client.suggestChannelId) || client.announcementChannels.get(client.suggestChannelId) || client.voiceChannels.get(client.suggestChannelId) || client.threadChannels.get(client.suggestChannelId) || client.stageChannels.get(client.suggestChannelId) || client.forumChannels.get(client.suggestChannelId)
        if (!suggestChannel) channelNotInCache = true
        if (!suggestChannel) suggestChannel = Object.values(await interaction.guild.fetchChannels()).find(store => store.has(client.suggestChannelId))?.get(client.suggestChannelId)
        if (!suggestChannel) return interaction.followUp({ content: "Invalid suggest channel, please put the Id in `/structures/client`" }).catch(e => { })
        let embed = new Discord.Embed()
        embed.title = "Suggest panel"
        embed.description = "Use the buttons below to set your suggestion."
        embed.timestamp = Date.now()
        embed.color = "BLUE"
        let data = {
            name: null,
            description: null,
            image: null
        }
        let btn_modal = new Discord.Button({
            label: "Name & Description",
            customId: "call_modal"
        })
        let btn_image = new Discord.Button({
            label: "Image",
            customId: "image"
        })
        let btn_send = new Discord.Button({
            label: "Send",
            customId: "send",
            style: Discord.ButtonStyle.Success
        })
        let row = new Discord.ActionRow(btn_modal, btn_image, btn_send)
        let modal = new Discord.Modal({
            name: "Tell us more ?",
            custom_id: "suggest",
            components: [{
                label: "Write the name here",
                placeholder: "My cool name idea",
                max_length: 256,
                min_length: 3,
                required: true,
                style: Discord.textInputStyle.Short,
                custom_id: "name"
            }, {
                label: "Write the description here",
                placeholder: "My cool description idea",
                max_length: 2000,
                min_length: 30,
                required: true,
                style: Discord.textInputStyle.Paragraph,
                custom_id: "description"
            }]
        })
        interaction.followUp({ embeds: [embed], components: [row] }).then(async msg => {
            const collector = msg.createComponentsCollector({ time: 1200000, filter: (m) => m.userId === interaction.userId })
            collector.on('collected', async collect => {
                if (collect.isButton) {
                    if (collect.customId === "call_modal") {
                        return collect.submitModal(modal)
                    } else if (collect.customId === "image") {
                        await collect.deferUpdate().catch(e => { })
                        let askQuestion = await interaction.channel.send({ content: "Can you please send me the image ?" }).catch(e => { })
                        if (!askQuestion) return
                        let message = (await interaction.channel.awaitMessages({ filter: (m) => m.authorId === interaction.userId, time: 180000, count: 1 }))?.first()
                        askQuestion.delete().catch(e => { })
                        if (!message) {
                            interaction.channel.send({ content: "Time elapsed" }).then(msg => {
                                msg.delete(3000).catch(e => { })
                            }).catch(e => { })
                        } else {
                            message.delete().catch(e => { })
                            if (message.content && message.attachments.size < 1) {
                                embed.image = message.content
                                interaction.editFollowUp({ embeds: [embed] }).then(() => {
                                    data.image = message.content
                                }).catch(e => {
                                    interaction.channel.send({ content: "Invalid image, provid a picture or a link" }).then(msg => {
                                        msg.delete(4000).catch(e => { })
                                    }).catch(e => { })
                                })
                            } else if (message.attachments.size > 0) {
                                embed.image = message.attachments.first().url
                                interaction.editFollowUp({ embeds: [embed] }).then(() => {
                                    data.image = message.attachments.first().url
                                }).catch(e => {
                                    interaction.channel.send({ content: "Invalid image, provid a picture or a link" }).then(msg => {
                                        msg.delete(4000).catch(e => { })
                                    }).catch(e => { })
                                })
                            } else {
                                interaction.channel.send({ content: "You didn't answer good, provid a picture or a link" }).then(msg => {
                                    msg.delete(4000).catch(e => { })
                                }).catch(e => { })
                            }
                        }
                    } else if (collect.customId === "send") {
                        if (!data.name) return collect.reply({ content: "The name is missing", ephemeral: true }).catch(e => { })
                        if (!data.description) return collect.reply({ content: "The description is missing", ephemeral: true }).catch(e => { })
                        let suggestEmbed = new Discord.Embed({
                            author: { name: `New suggestion by ${interaction.user.tag}`, icon_url: interaction.user.avatar },
                            title: data.name,
                            description: data.description,
                            image: data.image ? data.image : undefined,
                            color: "PURPLE",
                            timestamp: Date.now(),
                            footer: { text: `User Id : ${interaction.userId}` }
                        })
                        suggestChannel.send({ embeds: [suggestEmbed] }).then(() => {
                            collect.reply({ content: "Suggestion sent", ephemeral: true }).catch(e => { })
                            interaction.editFollowUp({ components: [] }).catch(e => { })
                        }).catch(e => {
                            collect.reply({ content: "An error occured", ephemeral: true }).catch(e => { })
                            interaction.editFollowUp({ components: [] }).catch(e => { })
                        })
                    }
                } else if (collect.isModal) {
                    if (collect.customId !== "suggest") return
                    await collect.deferUpdate().catch(e => { })
                    let name = collect.getModalValue("name")
                    let description = collect.getModalValue("description")
                    embed.fields = [{
                        name: "Name",
                        value: name
                    }, {
                        name: "Description",
                        value: description
                    }]
                    data.name = name
                    data.description = description
                    interaction.editFollowUp({ embeds: [embed] })
                }
            })
            collector.on('end', () => {
                interaction.editFollowUp({ components: [] }).catch(e => { })
            })
        })
    }
}