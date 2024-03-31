const socket = io();
const state={}

let lasts = -1
let start=" "
let player=1
let turnc=" "
let win = 1
let win1=0

const mode1 = data => {
      socket.emit('mode','Spectate')
}
const mode2 = data => {
      socket.emit('mode','Play')
}


ReactDOM.render(React.createElement('div',{},
  React.createElement('h3',{style:{textAlign : "Center",fontSize: 100}},'WELCOME TO CONNECT 4'),
  React.createElement('button',{onClick : mode1,style : {marginLeft:'35%',width : 130,height : 70,fontSize: 20}},'Spectate'),
  React.createElement('button',{onClick : mode2,style : {marginLeft:'15%',width : 130,height : 70,fontSize: 20}},'Play'))
  ,document.getElementById('root'))

socket.on('list',data5 => {
  const ind = []
  // console.log(data5)
  for(let i=0;i<data5;i++){
      ind.push(i)
  }

  select(ind)


})

socket.on('win1',data=>{
  win1=data
})

socket.on('spectate',(data,data2) => {
  const ind2 = []
  for(let i=0;i<data2;i++){
      ind2.push(i)
  }
  show(data,win1,ind2)
  win1=' '
})
socket.on('start',data=>start=data)
socket.on('turn',data=> turnc = data)

socket.on('player',data=>{
  player=data
})
socket.on('yourmsg', data => {
  setState(data,0,0)})
socket.on('cheat', (data,arr)=> {
  setState(arr,0,data)
  // console.log(data)
})
socket.on('win',(data,arr)=>{
  // console.log(data)
  win=0
  setState(arr,data,0)
})
socket.on('renew',data=>{win=1})

let array = new Array(6)

for(i=0; i<6 ;i++){
   array[i]= new Array(7)
   for(j=0;j<7;j++){
    array[i][j]=null;
   }
}

const checkwin = (array1,player1)=>{
  let t='X'
  if(player1===2){
    t = 'O'
  }
  //row check
  for(k=0;k<6;k++){
    for(i=0; i<4 ;i++){
      let count=0
     for(j=0;j<4;j++){
      //console.log(k,j+i)
      if(array1[k][j+i]===t){
        count++
      }
     }
     //console.log("    ")
     if(count===4){
      return true
     }
    }
  }
  //col check
  for(k=0;k<7;k++){
    for(i=0; i<3 ;i++){
      let count=0
     for(j=0;j<4;j++){
      //console.log(j+i,k)
      if(array1[i+j][k]===t){
        count++
      }
     }
    // console.log("    ")
     if(count===4){
      return true
     }
    }
  }
  //right digonal
  for(k=0;k<3;k++){
    for(i=0; i<4 ;i++){
      let count=0
     for(j=0;j<4;j++){
     // console.log(k+j,j+i)
      if(array1[k+j][j+i]===t){
        count++
      }
     }
     //console.log("    ")
     if(count===4){
      return true
     }
    }
  }
  //left digonal
  for(k=0;k<3;k++){
    for(i=3; i<7 ;i++){
      let count=0
     for(j=0;j<4;j++){
     // console.log(k+j,i-j)
      if(array1[k+j][i-j]===t){
        count++
      }
     }
     //console.log("    ")
     if(count===4){
      return true
     }
    }
  }

  return false


}
//checkwin(array,1)

const makemove = (data,cur,array1) =>{
  for(let x=5;x>-1;x--){
      if(array1[x][data] === null){
        if(cur===1){
          array1[x][data]="X"
        } else{
          array1[x][data]="O"
        }
        break
      }
    }
}

const clickCell = event =>{
  if(win){
   let ele = event.target
   let y=ele.cellIndex
  // console.log(y)
    
   socket.emit('msg', y)
  }
  else{
    win=1
    socket.emit('new',1)

  }
}


const status = data=>{
  let ele = data.target
  //console.log(ele.parent)
 // ele.style.backgroundColor = 'red'
   let y=ele.cellIndex
  //console.log(player)
   if(ele.tagName === 'TD'){
     let st = JSON.parse(JSON.stringify(array))
      makemove(y,player,st)
      let winwiz=false
    for(z=0;z<7;z++){
      let ju=JSON.parse(JSON.stringify(st))
      if(player===1){
        makemove(z,2,ju)
        if(checkwin(ju,2)){
          //ele.style.backgroundColor = 'red'
          winwiz=true
        }
      } 

     // console.log(winwiz)
      else if(player===2){
        makemove(z,1,ju)
        if(checkwin(ju,1)){
          //ele.style.backgroundColor = 'red'
          winwiz=true
        }
      }
    }
    if(!winwiz){
      for(let o=0;o<6;o++){
        document.getElementById('Tul').rows[o].cells[y].style.backgroundColor = '#3eaf2e'
       // ele.style.backgroundColor = 'green'
      }
    } else{
      for(let o=0;o<6;o++){
        document.getElementById('Tul').rows[o].cells[y].style.backgroundColor = '#f04b1e'
       // ele.style.backgroundColor = 'green'
      }
    }

   //  console.log(winwiz)

 }


}
//socket.emit('msg', array)

const def = data =>{
    let ele = data.target
    let y=ele.cellIndex
    for(let o=0;o<6;o++){
    document.getElementById('Tul').rows[o].cells[y].style.backgroundColor = '#bf00ff'
  }
    //ele.style.backgroundColor = 'blue'
}

const set = data => {
    socket.emit('need',data)
    lasts = data
}

const select = data => {
  // console.log(data)
  ReactDOM.render(React.createElement('div',{},
  React.createElement('h3',{style:{textAlign : "Center",fontSize: 100}},'WELCOME TO CONNECT 4'),
  React.createElement('h2',{style:{textAlign : "Center",fontSize: 50}},'You are in spectate mode'),
  React.createElement('h1',{style:{textAlign : "Center",fontSize: 30}},'Select a game'),
    data.map(f=>React.createElement('button',{onClick : () => {set(f)},style: {marginLeft:'10%',width : 130,height : 70,fontSize: 20}},
      `Game ${f}`)))
  ,document.getElementById('root'))
}

const set1 = data =>{
  socket.emit('need2',data,lasts)
      lasts=data
}

const show = (data,win,data2)=>{
  ReactDOM.render(
    React.createElement('div',{textAlign : "Center"},React.createElement('h2',{style:{textAlign : "Center",fontSize: 60}},`Game ${lasts}`),
      React.createElement('h1',{style:{textAlign : "Center",fontSize: 40}},start),
            React.createElement('Table',{id:'Tul',style : {textAlign : "Center",border : "5px solid black" , marginLeft:'35%'}},
              data.map(row=>
                React.createElement('tr',{},
                  row.map(col=>
                    React.createElement('td',{
                      width: 70,
                      height:70,
                      style : {color : "black", backgroundColor: '#bf00ff' ,borderColor : "black" ,textAlign : "Center",
                       fontSize: 60,border: "5px solid black" , align : "center"}
                    },col)
                  )
                )
              )
            ),!win || React.createElement('div',{style:{textAlign : "Center",fontSize: 50}},win),
            data2.map(f=>React.createElement('button',{onClick : () => {set1(f)},style : {marginLeft:'10%',width : 130,height : 70,fontSize: 20} },
      `Game ${f}`))
    ),
    document.getElementById('root')
  )
}

const setState = (data,win,cheat) => {
  for(i=0; i<6 ;i++){
     for(j=0;j<7;j++){
      array[i][j]=data[i][j];
     }
}
     // if(checkwin(array,1)){
     //    console.log(array[5])
     // }
     // //console.log(data[5])
  ReactDOM.render(
    React.createElement('div',{textAlign : "Center"},React.createElement('h2',{style:{textAlign : "Center",fontSize: 60}},start),
      React.createElement('h1',{style:{textAlign : "Center",fontSize: 40}},turnc),
            React.createElement('Table',{id:'Tul',style : {textAlign : "Center",border : "5px solid black",marginLeft:'35%' , verticalAlign : "Middle"}},
              array.map(row=>
                React.createElement('tr',{},
                  row.map(col=>
                    React.createElement('td',{
                      onClick : clickCell,
                      onMouseOver : status,
                      onMouseOut : def,
                      width: 70,
                      height:70,
                      style : {color : "black", backgroundColor: '#bf00ff' ,borderColor : "black" ,textAlign : "Center",
                       fontSize: 60,border: "5px solid black" , align : "center"}
                    },col)
                  )
                )
              )
            ),!win || React.createElement('div',{style:{textAlign : "Center",fontSize: 50}},win),
          !cheat || React.createElement('div',{style:{textAlign : "Center",fontSize: 50}},cheat),
    ),
    document.getElementById('root')
  )
}
//console.log(document.getElementById('root'))
document.body.style.backgroundImage = "url('1.png')";


const formSubmit = async ev => {
  ev.preventDefault()
  socket.emit('msg', state.message)
  setState({message: ''})
}

const onclick = async ev => {
  ev.preventDefault()
  slocket.emit('msg',state.message)
  //setState({message : ''})
}




setState()

