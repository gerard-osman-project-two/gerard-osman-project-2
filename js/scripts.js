import app from './firebaseConfig.js';
import {getDatabase, ref, set, push, get, onValue, update} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js';

// Step 1:  Create a file (firebase.js) to configure and export the Firebase object.
// Import the database object, and any required Firebase modules at the top of the main app file (app.js)
// Call getDatabase() and ref() to create a reference to the Firebase database.

const database = getDatabase(app);
const dbRef = ref(database);

// reference to the plants in our database
const shopRef = ref(database, '/plants');
const cartRef = ref(database, '/cart');

// Step 2:  Declare a function that will add our data both the inventory and the currencies, to our database.

const addToDatabase = (key, value) => {
  const plantRef = ref(database, key);
  set(plantRef, value);
};

// Array of plant, currency, and selected objects
// const plants = [
//   {
//     name: 'American marigold',
//     price: 23.45,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p1.jpeg',
//   },
//   {
//     name: 'Black eyed susan',
//     price: 25.45,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p2.jpeg',
//   },
//   {
//     name: 'Bleeding heart',
//     price: 30.45,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p3.jpeg',
//   },
//   {
//     name: 'Bloody cranesbill',
//     price: 45,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p4.jpeg',
//   },
//   {
//     name: 'Butterfly weed',
//     price: 50.45,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p5.jpeg',
//   },
//   {
//     name: 'Common yarrow',
//     price: 65,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p6.jpeg',
//   },
//   {
//     name: 'Double viburnum',
//     price: 67.45,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p7.jpeg',
//   },
//   {
//     name: 'Feather reed grass',
//     price: 20,
//     cartQuantity: 0,
//     storeQuantity: 10,
//     url: './assets/p8.jpeg',
//   },
// ];
// const currencies = {
//   usd: {
//     exchange: 1,
//     symbol: `$`,
//     displayName: `USD`,
//     altText: `the US flag`,
//     flag: `images/USD-flag.png`,
//   },
//   cad: {
//     exchange: 1.28,
//     symbol: `$`,
//     displayName: `CAD`,
//     altText: `the Canadian flag`,
//     flag: `images/CAD-flag.png`,
//   },
//   gbp: {
//     exchange: 0.76,
//     symbol: `£`,
//     displayName: `GBP`,
//     altText: `the UK flag`,
//     flag: `images/GBP-flag.png`,
//   },
// };
// const selected = {
//   test: {
//     testin1: 0,
//     testing2: 2,
//   }
// }

// adding to the database
// addToDatabase('plants', plants);
// addToDatabase('currencies', currencies);
// addToDatabase('selected', selected);

// const buttonsCart = () => {
//   const removeCartItemButtons = document.getElementById("remove")
//   removeCartItemButtons.addEventListener('click', function() {
//   console.log("Removed")
//   })

//   const increaseCartItemButtons = document.getElementById("increase")

//   increaseCartItemButtons.addEventListener('click', function() {
//   console.log("Increased")
//   })

//   const decreaseCartItemButtons = document.getElementById("decrease")
//   decreaseCartItemButtons.addEventListener('click', function() {
//   console.log("Decreased")
//   })
// }
// buttonsCart()

// display products

onValue(dbRef, (data) => {
  const storeData = data.val();
  // window.storeData =storeData //global variable that I can access in the browser inspect and console.log whenever I need
  const plants = storeData.plants;
  const currencies = storeData.currencies;
  const cartIconNum = document.querySelector('.cart-num');

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

      newLI.querySelector('button').addEventListener('click', (event) => {
        event.preventDefault();
        const id = event.target.parentNode.id.slice(5);

        if (event.target.tagName === 'IMG') {
          const selectedSrc = event.target.parentElement.previousElementSibling.attributes.src.nodeValue;
          console.log(selectedSrc);

          get(shopRef).then((snapshot) => {
            const plantData = snapshot.val();
            const index = plantData.findIndex((plant) => plant.url === selectedSrc);

            if (plantData[index].cartQuantity === 0) {
              addToCart(index);
            }
          });
        }

        cartIconNum.innerText = parseInt(cartIconNum.innerText) + 1;
        storeData.plants[id].cartQuantity += 1;
        set(dbRef, storeData);
      });
    });
  };

  const addToCart = (selectedPlantIndex) => {
    const chosenRef = ref(database, `/plants/${selectedPlantIndex}`);
    get(chosenRef).then((snapshot) => {
      const plantData = snapshot.val();

      const addedToCart = {
        name: plantData.name,
        imgUrl: plantData.url,
        alt: plantData.alt,
        cartQuantity: plantData.cartQuantity,
      };

      const cartState = {
        inCart: true,
      };

      update(chosenRef, cartState);

      push(cartRef, addedToCart);
    });
  };

  displayItems(currencies.cad);

  // shopping cart display
  const shoppingCart = document.querySelector('.cart');
  shoppingCart.innerHTML = '';
  plants
    .filter((item) => item.cartQuantity > 0)
    .forEach((item) => {
      // render the cart items
      const newLI = document.createElement('li');
      newLI.innerHTML = `
      <img src="${item.url}" alt="${item.alt}"/>
      <p>${item.name} x ${item.cartQuantity}</p>
      <button class="increase"><i class="fa-solid fa-plus" style="color: #ffffff;"></i></button>
      <button class="decrease"><i class="fa-solid fa-minus" style="color: #ffffff;"></i></button>
      <button class="remove"><i class="fa-solid fa-trash" style="color: #ffffff;"></i></button>
      `;
      shoppingCart.appendChild(newLI);

      // In this filtered list of plants,

      // I need to find the plants in the database that were filtered above
      // findIndex based on the name, item.name, I create a variable for the id
      // Now I can use the id variable to update storeData.plants. Either increase, decrease, or remove from the database
      // temp is a temporary placeholder, and looking for the exact match, in this case item.name
      const id = plants.findIndex((temp) => temp.name === item.name);

      newLI.querySelector('.increase').addEventListener('click', () => {
        storeData.plants[id].cartQuantity += 1;
        cartIconNum.innerText = parseInt(cartIconNum.innerText) + 1;
        set(dbRef, storeData);
      });
      newLI.querySelector('.decrease').addEventListener('click', () => {
        storeData.plants[id].cartQuantity -= 1;
        cartIconNum.innerText = parseInt(cartIconNum.innerText) - 1;
        set(dbRef, storeData);
      });
      newLI.querySelector('.remove').addEventListener('click', () => {
        cartIconNum.innerText = parseInt(cartIconNum.innerText) - storeData.plants[id].cartQuantity;
        storeData.plants[id].cartQuantity = 0;
        set(dbRef, storeData);
      });
    });
});

const modal = document.querySelector('.modal');
const openModal = document.querySelector('.shopping-cart');
const closeModal = document.querySelector('#close-button');

openModal.addEventListener('click', () => {
  modal.showModal(); // Allows to escape via esc button
});
closeModal.addEventListener('click', () => {
  modal.close();
});

/*
NOTE: For the future, this is all wrong for multiple users because everyone will have access to,
and in turn be able to edit, the same shopping cart. 
*/
