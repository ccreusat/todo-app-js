// THEME SWITCHER //
// Display the default theme using user's OS configuration (Dark Mode on / off) and using @media color-scheme
// If theme is already stored in local storage, use it. Otherwise, get it from the OS.
(function () {
	"use strict";

	const switchToggle = document.getElementById("switch");
	let getCurrentTheme = useLocalStorage.getItem("theme") || "light";

	if (getCurrentTheme) {
		document.body.className = getCurrentTheme;
	}

	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", event => {
			if (event.matches) {
				document.body.className = "dark";
			} else {
				document.body.className = "light";
			}
		});

	// Toggle theme using Moon & Sun Icon
	const switchTheme = currentTheme => {
		let newTheme;
		let bodyClassName = document.body.className;

		// Looking which theme is actually used
		if (bodyClassName === currentTheme) {
			newTheme = "dark";
		} else {
			newTheme = "light";
		}

		document.body.className = newTheme;
		useLocalStorage.setItem("theme", newTheme);
	};

	switchToggle.onclick = () => switchTheme("light");
})();
