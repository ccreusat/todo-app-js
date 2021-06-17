const useLocalStorage = {
	// get item from local storage
	getItem: key => {
		let getParsedItem = JSON.parse(window.localStorage.getItem(key));
		// if @key exists return it, otherwise, return a string.
		return getParsedItem ? getParsedItem : "";
	},
	// set item from local storage. pass a key and element to be stored
	setItem: (key, element) => {
		window.localStorage.setItem(key, JSON.stringify(element));
	},
	// remove item from local storage using the @key
	removeItem: key => {
		window.localStorage.removeItem(key);
	},
};
