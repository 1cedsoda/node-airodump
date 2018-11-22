const proc = require('child_process')
const EventEmitter = require('events')

class Airodump extends EventEmitter{
  constructor(iface) {
    super()
    this.child = undefined
    this.iface = iface
    this.devices = []
  }

  start() {
    this.child = proc.spawn('sudo', ['node-aircrack', this.iface])
    this.child.stdout.on('data', (function(data) {
      this.parseStdout(data)
    }).bind(this))
    this.child.stderr.on('data', function(data) {
      this.emit('error', String(data))
    })
  }

  parseStdout(data) {
    data = String(data)
    data = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
    data = data.split("\n")
    let devices = []
    if(data.length>7) {
      for(var i = 3; i<data.length-6;i++) {
        devices.push(parseDevice(data[i]))
      }
      if(JSON.stringify(this.devices)!=JSON.stringify(devices)) {
        this.devices = devices
        this.emit('update', this.devices)
      }
    }
  }
}

function parseDevice(data) {
  let parsed = {
    "st": data.substring(2, 19),
    "ap": data.substring(20, 37),
    "stpwr": data.substring(38, 44).trim(),
    "appwr": data.substring(45, 51).trim(),
    "packets": data.substring(52, 57).trim(),
    "beacons": data.substring(58, 65).trim(),
    "ch": data.substring(66, 68).trim(),
    "enc": data.substring(69, 73).trim(),
    "cipher": data.substring(74, 80).trim(),
    "auth": data.substring(81, 85).trim(),
    "apssid": data.substring(86, data.length),
  }
  return parsed
}

module.exports = Airodump
