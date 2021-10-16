const getPlayer = (value)=>{
  if(value==1){
    return 'X';
  }
  return 'O';
}

let boxes = document.querySelectorAll('.ticTacBoard .col-4')
boxes.forEach((box,index)=>{
  box.setAttribute('key',index) 
})
let host = window.document.location.host.replace(/:.*/, '');

let client = new Colyseus.Client(location.protocol.replace("http", "ws") + "//" + host + (location.port ? ':' + location.port : ''));
let room;
client.joinOrCreate("ticTacToe").then(room_instance => {
  room = room_instance

  let players = {};
  console.log(room);
  room.onMessage('classify', msg => {
    console.log(msg);
  })
  room.onMessage('update', msg => {
    console.log(msg);
    boxes[msg.index].querySelector('span').innerHTML = getPlayer(msg.player);
    boxes[msg.index].setAttribute('data-value',msg.player);
  })
});


boxes.forEach(box=>{
  box.addEventListener('click',()=>{
    let key = box.getAttribute('key');
    let value= box.dataset.value;
    console.log('Clicked',key,value);
    box.querySelector('span').innerHTML = getPlayer(1);
    room.send('mark',key);
  })
})

