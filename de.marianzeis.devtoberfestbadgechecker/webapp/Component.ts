import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import Device from "sap/ui/Device";
import Theming from "sap/ui/core/Theming";

/**
 * @namespace de.marianzeis.devtoberfestbadgechecker
 */
export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
	};

	private contentDensityClass: string;

	public init(): void {
		// call the base component's init function
		super.init();

		// set up automatic dark mode detection based on system preferences
		this._applyThemeBasedOnSystemPreference();

		// create the device model
		this.setModel(models.createDeviceModel(), "device");

		// create the views based on the url/hash
		this.getRouter().initialize();
	}

	/**
	 * Detects the system's color scheme preference and applies the appropriate UI5 theme.
	 * Prioritizes user's manual preference (stored in localStorage) over system preference.
	 * Automatically switches between light (sap_horizon) and dark (sap_horizon_dark) themes.
	 * Also listens for system preference changes to update the theme dynamically (if no user preference is set).
	 * @private
	 */
	private _applyThemeBasedOnSystemPreference(): void {
		// Check if user has manually set a theme preference
		const userPreferredTheme = localStorage.getItem("userPreferredTheme");

		if (userPreferredTheme) {
			// User has manually chosen a theme, use that
			Theming.setTheme(userPreferredTheme);
		} else {
			// No user preference, use system preference
			const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

			// Function to apply the appropriate theme
			const applyTheme = (prefersDark: boolean) => {
				const theme = prefersDark ? "sap_horizon_dark" : "sap_horizon";
				Theming.setTheme(theme);
			};

			// Apply theme based on current system preference
			applyTheme(darkModeMediaQuery.matches);

			// Listen for changes in system color scheme preference
			// This allows the app to respond dynamically when user changes their system theme
			// Note: Manual theme selection will override this
			darkModeMediaQuery.addEventListener("change", (event) => {
				// Only apply automatic theme change if user hasn't set a preference
				if (!localStorage.getItem("userPreferredTheme")) {
					applyTheme(event.matches);
				}
			});
		}
	}

	/**
	 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
	 * design mode class should be set, which influences the size appearance of some controls.
	 * @public
	 * @returns css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
	 */
	public getContentDensityClass(): string {
		if (this.contentDensityClass === undefined) {
			// check whether FLP has already set the content density class; do nothing in this case
			if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
				this.contentDensityClass = "";
			} else if (!Device.support.touch) {
				// apply "compact" mode if touch is not supported
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				this.contentDensityClass = "sapUiSizeCozy";
			}
		}
		return this.contentDensityClass;
	}
}
