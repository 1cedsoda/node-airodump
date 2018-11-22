const Airodump = require('../app')

var lastOutput = ""

function processDevices(devices) {
  let networks = {}

  for(i in devices) {
    let d = devices[i]
    let st = d.st
    let apssid = d.apssid
    if(!networks.hasOwnProperty(apssid)) networks[apssid] = []
    if(networks[apssid].indexOf(st)<0) networks[apssid].push(st)
  }

  let output = ""
  for(n in networks) {
    output += n +"\n"
    for(i in networks[n]) {
      output += "  " + networks[n][i] + "\n"
    }
  }

  if(output!=lastOutput) {
    lastOutput = output
    console.log("" + new Date())
    console.log(output)
  }
}
console.log("Run 'ifconfig' to list your iterfaces")
console.log("Make sure your interface is in MONITOR MODE!")
console.log("Type your interface's label in and press ENTER:")
process.stdin.on('data', function (iface) {
  console.log()
  let a = new Airodump(String(iface).split("\n")[0])
  a.start()
  a.on('update', function(devices) {
    processDevices(devices)
  })
})
