import app from './firebaseConfig.js';
import {getDatabase, ref, set, push, onValue} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js';

// Step 1:  Create a file (firebase.js) to configure and export the Firebase object.
// Import the database object, and any required Firebase modules at the top of the main app file (app.js)
// Call getDatabase() and ref() to create a reference to the Firebase database.

const database = getDatabase(app);
const dbRef = ref(database);
// reference to the plants in our database


// Step 2:  Declare a function that will add our data both the inventory and the currencies, to our database.

const addToDatabase = (key, value) => {
  const plantRef = ref(database, key);
  set(plantRef, value);
};

// Array of plant, currency, and selected objects
const plants = [
  {
    name: 'American marigold',
    price: 23.45,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p1.jpeg',
  },
  {
    name: 'Black eyed susan',
    price: 25.45,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p2.jpeg',
  },
  {
    name: 'Bleeding heart',
    price: 30.45,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p3.jpeg',
  },
  {
    name: 'Bloody cranesbill',
    price: 45,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p4.jpeg',
  },
  {
    name: 'Butterfly weed',
    price: 50.45,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p5.jpeg',
  },
  {
    name: 'Common yarrow',
    price: 65,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p6.jpeg',
  },
  {
    name: 'Double viburnum',
    price: 67.45,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p7.jpeg',
  },
  {
    name: 'Feather reed grass',
    price: 20,
    cartQuantity: 0,
    storeQuantity: 10,
    url: './assets/p8.jpeg',
  },
];
const currencies = {
  usd: {
    exchange: 1,
    symbol: `$`,
    displayName: `USD`,
    altText: `the US flag`,
    flag: `images/USD-flag.png`,
  },
  cad: {
    exchange: 1.28,
    symbol: `$`,
    displayName: `CAD`,
    altText: `the Canadian flag`,
    flag: `images/CAD-flag.png`,
  },
  gbp: {
    exchange: 0.76,
    symbol: `£`,
    displayName: `GBP`,
    altText: `the UK flag`,
    flag: `images/GBP-flag.png`,
  },
};

const cart = [];

// const addToCart = (item) => {

//   item.cartQuantity = 1;
//   cart.push(item)
//   addToDatabase('cart', cart)
// }

// adding to the database
addToDatabase('plants', plants);
addToDatabase('currencies', currencies);


// display products
onValue(dbRef, (data) => {
  const storeData = data.val();
  // window.storeData =storeData //global variable that I can access in the browser inspect and console.log whenever I need
  const plants = storeData.plants;
  const currencies = storeData.currencies;

  const displayItems = (chosenCurrency) => {
    const plantsUL = document.querySelector('.plants-list');
    plantsUL.innerHTML = '';
    plants.forEach((item, index) => {
      const newLI = document.createElement('li');
      newLI.innerHTML = `
      <a id="item_${index}">
        <img src="${item.url}" id="item_${index}" alt=""/>
        <button class="btn-add" id="item_${index}">
          <img src="assets/icons/cart.svg" alt=""/>
        </button>
      </a>
      <p>${item.name}</p>
      <span>${chosenCurrency.symbol}${(item.price * chosenCurrency.exchange).toFixed(2)}</p>
      `;
      plantsUL.appendChild(newLI);
      newLI.querySelector('button').addEventListener('click', event =>{
        const id = event.target.parentNode.id.slice(5)
        // console.log(event.target.parentNode.id.slice(5))
        storeData.plants[id].cartQuantity += 1;
        set(dbRef, storeData);
      })
    });
  };
  displayItems(currencies.cad);


  // shopping cart display
  const shoppingCart = document.querySelector('.cart');
  shoppingCart.innerHTML = '';
  plants.filter((item) => item.cartQuantity > 0)
    .forEach(item => {
      // render the cart items
      const newLI = document.createElement('li');
      newLI.innerHTML = `<img src="${item.url}" alt="" style= "max-height:50px"/> <p>${item.name} x${item.cartQuantity}
      <p>${item.price*item.cartQuantity}
      <button class="increase">🔼</button>
      <button class="decrease">🔽</button>
      <button class="remove">❌</button>
      `
      shoppingCart.appendChild(newLI);

      // In this filtered list of plants, 

      // I need to find the plants in the database that were filtered above
      // findIndex based on the name, item.name, I create a variable for the id
      // Now I can use the id variable to update storeData.plants. Either increase, decrease, or remove from the database
      // temp is a temporary placeholder, and looking for the exact match, in this case item.name
      const id = plants.findIndex(temp => temp.name === item.name);
    
      newLI.querySelector('.increase').addEventListener('click', () => {
        storeData.plants[id].cartQuantity += 1;
        set(dbRef, storeData)
      })
      newLI.querySelector('.decrease').addEventListener('click', () => {
        storeData.plants[id].cartQuantity -= 1;
        set(dbRef, storeData)
      })
      newLI.querySelector('.remove').addEventListener('click', () => {
        storeData.plants[id].cartQuantity = 0;
        set(dbRef, storeData)
      })
   
     let totalResult = 0;
     plants.forEach((item) => {
      totalResult += item.cartQuantity * item.price
     })
     console.log(totalResult)
      // display totalPrice
      const totalPrice = document.querySelector('.totalPrice');
      totalPrice.innerHTML = '';
      
      const totalSection = document.createElement('p')
      totalSection.innerHTML = `Total Cost: ${totalResult}`

      totalPrice.append(totalSection)


    })
});




const modal = document.querySelector('.modal')
const openModal = document.querySelector('.shopping-cart');
const closeModal = document.querySelector('.close-button')

openModal.addEventListener('click', () => {
  modal.showModal()//Allows to escape via esc button
})
closeModal.addEventListener('click', () => {
  modal.close()
})


/*
NOTE: For the future, this is all wrong for multiple users because everyone will have acces to,
and in turn be able to edit, the same shopping cart. 
*/