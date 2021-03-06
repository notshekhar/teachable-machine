let video = document.querySelector('#vid')

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream){
      video.srcObject = stream
      video.play()
  })
}
let nn = new fnn([2352,221,3], 0.009999999776482582)
let greenCount = document.querySelector('#green')
let purpleCount = document.querySelector('#purple')
let redCount = document.querySelector('#red')

let greenBut = document.querySelector('#green_train')
let purpleBut = document.querySelector('#purple_train')
let redBut = document.querySelector('#red_train')
let result = [0,0,0]
let images = new Array()

let g = 1
let r = 1
let p = 1
let start = 0
let f = false
let gt, pt, rt
greenBut.onmousedown = function(){
  gt = setInterval(function(){
    let canva = document.createElement("canvas")
    canva.height = 28
    canva.width = 28
    let ctx = canva.getContext("2d")
    ctx.drawImage(video, 0, 0, 28, 28)
    let url = canva.toDataURL()
    result[0] = 1
    images.push({output: result, url: url})
    result = [0,0,0]
    greenCount.innerText = g
    g++
  },100)

}
purpleBut.onmousedown = function(){
  pt = setInterval(function(){
    let canva = document.createElement("canvas")
    canva.height = 28
    canva.width = 28
    let ctx = canva.getContext("2d")
    ctx.drawImage(video, 0, 0, 28, 28)
    let url = canva.toDataURL()
    result[1] = 1
    images.push({output: result, url: url})
    result = [0,0,0]
    purpleCount.innerText = p
    p++
  }, 100)


}
redBut.onmousedown = function(){
  rt = setInterval(function(){
    let canva = document.createElement("canvas")
    canva.height = 28
    canva.width = 28
    let ctx = canva.getContext("2d")
    ctx.drawImage(video, 0, 0, 28, 28)
    let url = canva.toDataURL()
    result[2] = 1
    images.push({output: result, url: url})
    result = [0,0,0]
    redCount.innerText = r
    r++
  }, 100)

}


let cont = document.querySelector("#cont")
let train = document.querySelector('#train')
let load = document.querySelector("#load")


cont.onmouseup = function(){
  //training
  let score = []
  for(let i=0; i<images.length; i++){
    let sum = 0
    let image = images[i]
    math.pixr(image.url, 28, 28, function(data){
      d = new Array()
      for(let i=0; i<data.green.length; i++){
        d.push(data.green[i])
        d.push(data.red[i])
        d.push(data.blue[i])
      }
      d = math.cto(d, 255)
      nn.learn(d, image.output)
      let o = nn.query(d)
      if(math.findmax(image.output) == math.findmax(o)){
        score.push(1)
      }else{
        score.push(0)
      }
      console.log(score)
      for(let i=0; i<score.length; i++){
        sum+=score[i]
      }
      let acc = sum/score.length*100
      console.log(acc)
      document.querySelector('#result_div').innerHTML = '<span id="lebal"> accuracy of model: '+ acc +' %</span>'
    })
  }
  //predicting
  setInterval(function(){
    let canva = document.createElement("canvas")
    canva.height = 28
    canva.width = 28
    let ctx = canva.getContext("2d")
    ctx.drawImage(video, 0, 0, 28, 28)
    let url = canva.toDataURL()
    math.pixr(url, 28, 28, function(data){
      let d = new Array()
      for(let i=0; i<data.green.length; i++){
        d.push(data.green[i])
        d.push(data.red[i])
        d.push(data.blue[i])
      }
      d = math.cto(d, 255)
      let o = nn.query(d)
      console.log(math.findmax(o), o[math.findmax(o)])
      if(math.findmax(o)==0){
        document.querySelector("#gp").style.width = o[math.findmax(o)]*100 + "%"
        document.querySelector("#pp").style.width = 0 + "%"
        document.querySelector("#rp").style.width = 0 + "%"
        document.querySelector('#result_div').innerHTML = '<span id="lebal">green</span>'
      }else if(math.findmax(o)==1){
        document.querySelector("#pp").style.width = o[math.findmax(o)]*100 + "%"
        document.querySelector("#gp").style.width = 0 + "%"
        document.querySelector("#rp").style.width = 0 + "%"
        document.querySelector('#result_div').innerHTML = '<span id="lebal">purple</span>'

      }else{
        document.querySelector("#rp").style.width = o[math.findmax(o)]*100 + "%"
        document.querySelector("#pp").style.width = 0 + "%"
        document.querySelector("#gp").style.width = 0 + "%"
        document.querySelector('#result_div').innerHTML = '<span id="lebal">red</span>'
      }
    })
  }, 100)
}
// Math.floor(Math.random() * images.length)
greenBut.onmouseup = function(){
  clearInterval(gt)
}
redBut.onmouseup = function(){
  clearInterval(rt)
}
purpleBut.onmouseup = function(){
  clearInterval(pt)
}
