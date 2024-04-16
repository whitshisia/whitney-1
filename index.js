// Fetch Posts
fetch("http://localhost:3000/rooms")
.then((data)=> data.json() )
.then((rooms)=>{

  renderReservations(rooms)

})
