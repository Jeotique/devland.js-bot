const Bot = require('../../structures/client')
const Discord = require('devland.js')

module.exports = {
    data: new Discord.GuildCommand({
        name: 'reportbug',
        description: 'Report a bug about the bot',
        type: 1 //CHAT_INPUT, refer to https://devland-1.gitbook.io/devland.js/commands/chat_input
    }),
    /**
     * 
     * @param {Bot} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true }).catch(e => { })

        let reportChannel = client.textChannels.get(client.reportChannelId) || client.announcementChannels.get(client.reportChannelId) || client.voiceChannels.get(client.reportChannelId) || client.threadChannels.get(client.reportChannelId) || client.stageChannels.get(client.reportChannelId) || client.forumChannels.get(client.reportChannelId)
        if (!reportChannel) reportChannel = Object.values(await interaction.guild.fetchChannels()).find(store => store.has(client.reportChannelId))?.get(client.reportChannelId)
        if (!reportChannel) return interaction.followUp({ content: "Invalid report channel, please put the Id in `/structures/client`" }).catch(e => { })
        let embed = new Discord.Embed()
        embed.title = "Report panel"
        embed.description = "Use the buttons below to set your report."
        embed.timestamp = Date.now()
        embed.color = "BLUE"
        let data = {
            description: null,
            image: null
        }
        let btn_modal = new Discord.Button({
            label: "Description",
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
            custom_id: "report",
            components: [{
                label: "Write the description here",
                placeholder: "Here my problem...",
                max_length: 4000,
                min_length: 10,
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
                        if (!data.description) return collect.reply({ content: "The description is missing", ephemeral: true }).catch(e => { })
                        if (!data.image) return collect.reply({ content: `You must add a picture to report a bug`, ephemeral: true }).catch(e => { })
                        let reportEmbed = new Discord.Embed({
                            author: { name: `New report by ${interaction.user.tag}`, icon_url: interaction.user.avatar },
                            description: data.description,
                            image: data.image ? data.image : undefined,
                            color: "PURPLE",
                            timestamp: Date.now(),
                            footer: { text: `User Id : ${interaction.userId}` }
                        })
                        reportChannel.send({ embeds: [reportEmbed] }).then(() => {
                            collect.reply({ content: "Report sent", ephemeral: true }).catch(e => { })
                            interaction.editFollowUp({ components: [] }).catch(e => { })
                        }).catch(e => {
                            collect.reply({ content: "An error occured", ephemeral: true }).catch(e => { })
                            interaction.editFollowUp({ components: [] }).catch(e => { })
                        })
                    }
                } else if (collect.isModal) {
                    if (collect.customId !== "report") return
                    await collect.deferUpdate().catch(e => { })
                    let description = collect.getModalValue("description")
                    embed.fields = [{
                        name: "Description",
                        value: description
                    }]
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