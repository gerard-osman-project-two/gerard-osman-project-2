import app from './firebaseConfig.js';
import {getDatabase, ref, set, push, onValue} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js';

// Step 1:  Create a file (firebase.js) to configure and export the Firebase object.
// Import the database object, and any required Firebase modules at the top of the main app file (app.js)
// Call getDatabase() and ref() to create a reference to the Firebase database.

const database = getDatabase(app);
const dbRef = ref(database);

// reference to the plants in our database
const shoppingCartRef = ref(database, '/inventory');

// Step 2:  Declare a function that will add our data both the inventory and the currencies, to our database.

// global variables
const ulElement = document.querySelector(`.plants-list`);

const addToDatabase = (key, value) => {
  const plantRef = ref(database, key);
  set(plantRef, value);
};

// Array of plant objects
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

// An object that allows us to organize information that will be displayed conditionally depending on what currency the user selects:
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

// Step 3: Call our function twice, once to add our inventory data, and another time to add our currencies
addToDatabase('plants', plants);
addToDatabase('currencies', currencies);

// //Modal box
// const modal = document.querySelector('.modal')
//       const openModal = document.querySelector('.cart');
//       const closeModal = document.querySelector('.close-button')

//       openModal.addEventListener('click', () => {
//         modal.showModal()//Allows to escape via esc button
//       })
//       closeModal.addEventListener('click', () => {
//         modal.close()
//       })

onValue(dbRef, (data) => {
  const storeData = data.val();
  const plants = storeData.plants;
  const currencies = storeData.currencies;
  // ========== FILTERS FOR WHAT PLANTS APPEAR INITIALLY GO HERE ==========
  // put [filtered] item on page with a chosenCurrency param
  const displayItems = (chosenCurrency) => {
    // Find UL element that will contain our plants and empty it of any contents
    const plantsUL = document.querySelector('.plants-list');
    plantsUL.innerHTML = '';
    // loop through plants and create an LI for each item
    plants.forEach((item) => {
      // console.log(item);
      const newLI = document.createElement('li');
      newLI.innerHTML = `
      <a href="#">
        <img src="${item.url}" alt=""/>
        <button class="btn-add">
          <img src="assets/icons/cart.svg" alt=""/>
        </button>
      </a>
      <p>${item.name}</p>
      <span>${chosenCurrency.symbol}${(item.price * chosenCurrency.exchange).toFixed(2)}</p>
      `;
      // append the LI to UL
      plantsUL.appendChild(newLI);
    });
  };
  displayItems(currencies.cad);
});

// code for adding plants to our cart
// attached the event listender to the ul because the ul exists to javascript when we load our page

// Step 5:  Loop through the snapshot object.
const addToCart = (selectedPlant) => {
  // create a reference to the specific plant in firebase
  const chosenRef = ref(database, '/plants/${selectedPlant}');
  console.log(selectedPlant);
};

// code for adding items to our favourites
// attach the event listener to the ul because the ul exists to javascript when we load our page
ulElement.addEventListener('click', (event) => {
  // only run code if the user clicks on the BUTTON element
  if (event.target.tagName === 'BUTTON') {
    // get the id attribute value from the list item
    // pass the id attribute value as an argument to our addToFaves function
    addToFaves(event.target.parentElement.id);
  }
});

const addToFaves = (selectedPlant) => {
  // create a reference to the specific plant in firebase
  const chosenRef = ref(database, `/plants/${selectedPlant}`);
  console.log(selectedPlant);
  get(chosenRef).then((snapshot) => {
    const storeData = snapshot.val();
    // console.log(storeData)//testing

    // our new favourite anima object
    const favPlant = {
      alt: storeData.alt,
      imgUrl: storeData.url,
      id: storeData.id,
    };

    const favState = {
      isFavourited: true,
    };

    update(chosenRef, favState);

    // console.log(favPlant)//testing
    push(shoppingCartRef, favPlant);
  });
  // create a new object that represents our selected plant
  // this new object will have some of the properties of the original plant object
  // push this new object to a new location in firebase(/favourites section)
};

// display our selected plants
onValue(shoppingCartRef, (data) => {
  // clear out the section every time we add anew favourite to avoid data constatly appending and duplication on our page
  const ulElement = document.querySelector('#shoppingCart');

  ulElement.innerHTML = '';

  const favPlantData = data.val();
  // console.log(favPlantData)//testing
  // console.log('fav plant data', data.val)//testing

  // loop over our object and create our elements
  for (let key in favPlantData) {
    // console.log(favPlantData[key])//testing

    const listItem = document.createElement('li');

    const image = document.createElement('img');

    image.src = favPlantData[key].imgUrl;
    image.alt = favPlantData[key].alt;
    // console.log(image);//testing

    // add a remove button that will be for bonus content later
    const remove = document.createElement('button');
    remove.innerText = '❌';

    // append the image and button to the list item
    listItem.append(image, remove);
    // append the list item to the ul that already exists in our html
    ulElement.append(listItem);
  }
});
