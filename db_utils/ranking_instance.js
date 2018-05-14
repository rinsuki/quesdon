// インスタンス別ユーザー数ランキング
// RoboMongoで実行

(function(){

var hostNames = db.getCollection('users').find({}, {acctLower: 1}).map(user => user.acctLower.split("@").pop()).filter(hostName => hostName)
var count = {}

hostNames.forEach(hostName => {
    if (count[hostName] == null) count[hostName] = 0
    count[hostName]++
})

var sortedCount = Object.keys(count).map(hostName => [hostName, count[hostName]]).sort((a, b) => b[1] - a[1])

count = {}

sortedCount.forEach(a => {
    count[a[0]] = a[1]
})

return count
    
})()
