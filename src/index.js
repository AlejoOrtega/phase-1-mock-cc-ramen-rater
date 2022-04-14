// write your code here

const ramens2HTML = (ramens, firstTime=false) => {
    let menu = document.getElementById('ramen-menu')
    for (const ramen of ramens) {
        if(firstTime){
            mainRamen(ramen)
            firstTime=false;
        }
        menu.appendChild(ramen2Dom(ramen))
    }
    
}

const selectedRamen = (event) => {
    fetch(`http://localhost:3000/ramens/${event.target.id}`)
    .then((res)=> res.json())
    .then((ramen)=> mainRamen(ramen))
    .catch((err)=> console.log(err))
}

const ramen2Dom = (ramen) => {
    let img = document.createElement('img')
    img.src = ramen.image;
    img.id = ramen.id;
    img.addEventListener('click', selectedRamen)
    return img
}

const mainRamen = (ramen) => {
    let mainImage = document.getElementById('main-image');
    let mainName = document.getElementById('main-name');
    let mainRestaurant = document.getElementById('main-restaurant');
    let mainRating = document.getElementById('rating-display');
    let mainComment = document.getElementById('comment-display')

    mainImage.src = ramen.image;

    mainName.textContent = ramen.name;

    mainRestaurant.textContent = ramen.restaurant;

    mainRating.textContent = ramen.rating;

    mainComment.textContent = ramen.comment;



}

const fetchRamenImages = (firstTime) => {
    fetch('http://localhost:3000/ramens')
    .then((res)=> res.json())
    .then((ramens)=> ramens2HTML(ramens, firstTime))
    .catch((err)=> console.log(err))
}

const cleanRamenMenu = (reloadMain=false) => {
    let menu = document.getElementById('ramen-menu')
    let first = menu.firstChild
    while(first){
        first.remove()
        first = menu.firstChild;
    }

    fetchRamenImages(reloadMain)
}

const updateValues = (ramen) =>{
    let mainRating = document.getElementById('rating-display');
    let mainComment = document.getElementById('comment-display');
    mainRating.textContent = ramen.rating;
    mainComment.textContent = ramen.comment;
}

const patchRamen = (e) => {
    e.preventDefault()
    let children = document.getElementById('ramen-menu').children
    let mainRamen = document.getElementById('main-image')
    let ramenId;
    for (let index = 0; index < children.length; index++) {
        if(children[index].src == mainRamen.src){
            ramenId = children[index].id
            break;
        }
    }

    let ramen = {
        rating: e.target['new-rating'].value,
        comment: e.target['new-comment'].value,
    }
    fetch(`http://localhost:3000/ramens/${ramenId}`,{
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(ramen)
    })
    .then(()=>{
        e.target.reset()
        updateValues(ramen)
    })
    .catch((err)=>console.log(err))
}

const createRamen = (e) => {
    let ramen = {
        name: e.target['new-name'].value,
        restaurant: e.target['new-restaurant'].value,
        image: e.target['new-image'].value,
        rating: e.target['new-rating'].value,
        comment: e.target['new-comment'].value,
    }
    
    fetch('http://localhost:3000/ramens',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(ramen)
    })
    .then(()=>{
        cleanRamenMenu()
    })
    .catch((err)=>console.log(err))
}

const submitNewRamen = (e) => {
    e.preventDefault()
    createRamen(e);
    e.target.reset()
}

const deleteRamen = () => {
    let children = document.getElementById('ramen-menu').children
    let mainRamen = document.getElementById('main-image')
    for (let index = 0; index < children.length; index++) {
        if(children[index].src == mainRamen.src){
            fetch(`http://localhost:3000/ramens/${children[index].id}`,{
                method:'DELETE',
            })
            .then(() => {
                children[index].remove()
                cleanRamenMenu(true)

            })
            .catch((err)=>console.log(err))
            break;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchRamenImages(true)

    document.getElementById('new-ramen').addEventListener('submit', submitNewRamen)
    document.getElementById('edit-ramen').addEventListener('submit', patchRamen)
    document.getElementById('delete-btn').addEventListener('click', deleteRamen)
})