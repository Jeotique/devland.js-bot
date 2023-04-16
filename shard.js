const {ShardingManager} = require('devland.js')

const shardSystem = new ShardingManager('./index.js', {
    token: 'OTkzNDk3NDA0MjEwOTU0MzMy.G2pvCF.dSs8Iyn6bzm3HE2jBAinHKzyn8qN_iJXTsGkWg',
    autospawn: true
})
shardSystem.on('shardCreate', shard => {
    console.log(`[CREATED] Shard ${shard.id}`)
    shard.on('ready', () => console.log(`[READY] Shard ${shard.id}`))
    shard.on('disconnect', () => console.log(`[DISCONNECT] Shard ${shard.id}`))
    shard.on('reconnecting', () => console.log(`[RECONNECTING] Shard ${shard.id}`))
    shard.on('spawn', () => console.log(`[SPAWN] Shard ${shard.id}`))
    shard.on('message', message => {
        console.log(`--------------------`)
        console.log(`[MESSAGE] Shard ${shard.id} :`)
        console.log(message)
        console.log(`--------------------`)
    })
   shard.on('error', error => {
        console.log(`--------------------`)
        console.log(`[ERROR] Shard ${shard.id} :`)
        console.log(error)
        console.log(`--------------------`)
    })
})