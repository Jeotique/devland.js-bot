const { Client, Store, IntentFlags } = require('devland.js')
const fs = require('fs')
module.exports = class Bot extends Client {
    constructor(options = {
        intents: [IntentFlags.ALL],
        guildsLifeTime: 7200000,
        messagesLifeTime: 7200000,
        usersLifeTime: 7200000,
        rolesLifeTime: 7200000,
        presencesLifeTime: 7200000,
        voicesLifeTime: 7200000,
        channelsLifeTime: 7200000,
        connect: true,
        token: "YOUR TOKEN HERE",
        presence: {
            activities: [{
                name: "devland.js",
                type: 1, //streaming, refer to https://devland-1.gitbook.io/devland.js/start-with-devland/declare-client
                url: 'https://twitch.tv/jeotique'
            }]
        }
    }) {
        super(options);
        this.setMaxListeners(0)

        /* Variables */
        this.ownerIds = ["484412542530224128"]
        this.suggestChannelId = ""
        this.reportChannelId = ""
        this.welcome = {
            channelId: "",
            message: (member) => {return `Welcome to ${member.user} ! We are now ${member.guild.member_count} on the server :wave:`},
            default_roles: [],
        }
        this.statusRole = {
            roleId: "",
            message: "/devland"
        }
        this.jointocreate = {
            channelId: "",
            name: (member) => {return `${member.user.username} room`},
            cache: [],
        }

        /* Important */
        this.commands = new Store()
        this.ms = require('ms')
        this.initCommands()
        this.initEvents()
    }

    initCommands() {
        const subFolders = fs.readdirSync('./commands')
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../../commands/${category}/${commandFile}`)
                this.commands.set(command.data.name, command)
            }
        }
    }

    initEvents() {
        const subFolders = fs.readdirSync(`./events`)
        for (const category of subFolders) {
            const eventsFiles = fs.readdirSync(`./events/${category}`).filter(file => file.endsWith(".js"))
            for (const eventFile of eventsFiles) {
                const event = require(`../../events/${category}/${eventFile}`)
                this.on(event.name, (...args) => event.run(this, ...args))
            }
        }
    }
}