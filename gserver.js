const fs = require('fs')
const http = require('http')
const socketio = require('socket.io')

let allgames = []
const spectatorlist = []


const remove = (data,re)=>{
	let my= allgames[data].splist
	console.log(allgames[data].splist.length)
	let ne = []
		my.forEach(f=>{
		//console.log(f.player1.id,f.player2.id,data.id)
		if(f === re ){
			console.log("Deleting")
		}else{
			ne.push(f)
		}
	})
	allgames[data].splist=ne
	console.log(allgames[data].splist.length)

}


const ondisc = (data)=>{
	let g= []
	allgames.forEach(f=>{
		//console.log(f.player1.id,f.player2.id,data.id)
		if(f.player1 === data || f.player2 === data){
			//console.log("Deleting")
		}else{
			g.push(f)
		}
	})
	allgames=g
}
const checkwin = (array,player)=>{
  let t='X'
  if(player===2){
    t = 'O'
  }
  //row check
  for(k=0;k<6;k++){
    for(i=0; i<4 ;i++){
      let count=0
     for(j=0;j<4;j++){
      //console.log(k,j+i)
      if(array[k][j+i]===t){
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
      if(array[i+j][k]===t){
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
      if(array[k+j][j+i]===t){
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
      if(array[k+j][i-j]===t){
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

const makemove = (data,cur,array) =>{
	let t=false
	for(let x=5;x>-1;x--){
      if(array[x][data] === null){
        if(cur===1){
          array[x][data]="X"
        } else{
          array[x][data]="O"
        }
        return true;
      }
    }
    return false
}

const check = (data,arr) => {
	let ret=false
	arr.forEach( g => {
		if(g.player1 === data){
			ret=true
		}
		if(g.player2 === data){
			ret=true
		}
	})
	return ret
}

const givegame = (data,arr) => {
	let ret=null
	arr.forEach( g => {
		if(g.player1 === data){
			ret=g
		}
		if(g.player2 === data){
			ret=g
		}
	})
	return ret
}

const waiting = (data,arr) => {
	let ans = false
	arr.forEach(g =>{
		if(!g.player1){
			g.player1=data
			ans =  true
		}
		else if(!g.player2){
			g.player2=data
			g.current=data
			ans =  true
		}
	})
	return ans
}

const turn = (data,arr) => {
	let ans = false
	arr.forEach(g =>{
		if(g.current === data){
			if(g.player1 === data){
				g.current=g.player2
			}
			else{
				g.current=g.player1
			}
			ans = true
		}
	})
	return ans
}



const server = http.createServer(async(req,resp) =>{
  resp.end(await readFile(req.url.substr(1)))
  //resp.end(await readFile(__dirname + '/index.html'))
})

server.listen(8000, () => console.log('Listening...'))
const readFile = f => new Promise((resolve,reject) =>
  fs.readFile(f, (e,d) => e?reject(e):resolve(d)))

const io = socketio(server)
io.sockets.on('connection', socket =>{

    socket.on('mode',data1 => {

    if(data1 === 'Play'){
	let t=check(socket,allgames)
	let u=givegame(socket,allgames)
	//console.log(t)
	if(!t){
		let r=waiting(socket,allgames)
		//console.log(r)
		if(!r && !u){
			allgames.push({player1 : socket  ,
						   player2 : null,
						   current : socket,
							splist : []})
			console.log('no user')
		}
	}
	u=givegame(socket,allgames)
	if(u && u.player1 && u.player2){
  	 	console.log('Starting game')
		let playerA=u.player1
		let playerB=u.player2
		let current=playerA
		let spectatorlist = u.splist
		let win = 1
		let count = 0
		let array = new Array(6)

		for(i=0; i<6 ;i++){
		   array[i]= new Array(7)
		   for(j=0;j<7;j++){
		    array[i][j]=null;
		   }
		}
		
		if(current===playerA){
			playerA.emit('player',1)
			playerA.emit('turn','Your Turn')
			playerB.emit('turn','Player1 Turn')	
			playerB.emit('player',1)	
		}else{
			playerA.emit('player',2)
			playerA.emit('turn','Player2 Turn')
			playerB.emit('turn','Your Turn')
			playerB.emit('player',2)
		}

		playerA.emit('start','You are player 1')
		playerA.emit('yourmsg',array)
		playerB.emit('start','You are player 2')
		playerB.emit('yourmsg',array)
	    
	    playerA.on('new',data=>{
	    	for(i=0; i<6 ;i++){
		   		for(j=0;j<7;j++){
		    		array[i][j]=null;
		  		}
			}
			win=1
			count=0
			current=playerA
			playerB.emit('renew',1)
			playerA.emit('yourmsg',array)
			playerB.emit('yourmsg',array)

	    })
	    playerB.on('new',data=>{
	    	for(i=0; i<6 ;i++){
		   		for(j=0;j<7;j++){
		    		array[i][j]=null;
		  		}
			}
			win=1
			count=0
			current=playerB

			playerA.emit('renew',1)
			playerA.emit('yourmsg',array)
			playerB.emit('yourmsg',array)
	    })
		playerA.on('msg', data => {	
			u=givegame(playerA,allgames)
			spectatorlist = u.splist
  			if(current===playerA && win){
  				if(makemove(data,1,array)){
  				count++
  				if(checkwin(array,1)){
  					win=0
  					playerA.emit('win','Player1 win',array)
  					playerB.emit('win','Player1 win',array)
  					spectatorlist.forEach(v=>{
  						v.emit('start','Player 2 is Making move')
  						v.emit('win1','Player1 win')
						v.emit('spectate',array,allgames.length)
					})
  				} else if(count===42){
  					win=0
  					playerA.emit('win','Its a draw',array)
  					playerB.emit('win','Its a draw',array)
  					spectatorlist.forEach(v=>{
  						v.emit('start','Player 2 is Making move')
  						v.emit('win1','Its a draw')
						v.emit('spectate',array,allgames.length)
					})
  				}
  				else{
  					playerA.emit('turn','Player2 Turn')
					playerB.emit('turn','Your Turn')
	  				playerA.emit('yourmsg',array)
	  				// console.log(data)
	  				playerB.emit('yourmsg',array)
	  				current = playerB
					playerA.emit('player',2)
					playerB.emit('player',2)
					spectatorlist.forEach(v=>{
						v.emit('start','Player 2 is Making move')
						v.emit('spectate',array,allgames.length)
					})
	  			}
	  		}
  			}else{
  				playerA.emit('cheat','Dont try to cheat Bud',array)
  			}
		})
		playerB.on('msg',data =>{
			u=givegame(playerB,allgames)
			spectatorlist = u.splist
			if(current===playerB && win){
				if(makemove(data,2,array)){
				if(checkwin(array,2)){
					win=0
					playerA.emit('win','Player2 win',array)
  					playerB.emit('win','Player2 win',array)
  					spectatorlist.forEach(v=>{
  						v.emit('start','Player 1 is Making move')
  						v.emit('win1','Player2 win')
						v.emit('spectate',array,allgames.length)
					})
				} else if(count===42){
  					win=0
  					playerA.emit('win','Its a draw',array)
  					playerB.emit('win','Its a draw',array)
  					spectatorlist.forEach(v=>{
  						v.emit('start','Player 1 is Making move')
  						v.emit('win1','Its a draw')
						v.emit('spectate',array,allgames.length)
					})
  				}
				else{
					playerA.emit('turn','Your Turn')
					playerB.emit('turn','Player1 Turn')	
	  				playerA.emit('yourmsg',array)
	  				// console.log(data)
	  				playerB.emit('yourmsg',array)
	  				current = playerA
					playerA.emit('player',1)
					playerB.emit('player',1)
					spectatorlist.forEach(v=>{
						v.emit('start','Player 1 is Making move')
						v.emit('spectate',array,allgames.length)
					})

  				}
  			}
  			}else{
  				playerB.emit('cheat','Dont try to cheat Bud',array)
  			}
		})

	}
   }
     else if (data1==='Spectate'){
     	spectatorlist.push(socket)
   		let spectator=socket
   		//console.log(socket.id)
   		console.log('In spectate mode')
   		//console.log(allgames)
   		spectator.emit('list', allgames.length)
   		spectator.on('need',data=>{
   			allgames[data].splist.push(spectator)
   		})
   		spectator.on('need2',(data,rem)=>{
   			remove(rem,spectator)
   			allgames[data].splist.push(spectator)

   		})
   }
   })
	
	socket.on('disconnect', () => {
		console.log(allgames.length)
		console.log('user DC')
		ondisc(socket)
		console.log(allgames.length)
	})
		

})


const startGame = (player1,player2) =>{
	player1.on('msg' , data =>  {

	})
	player2.on('msg', data => {

	})
}

