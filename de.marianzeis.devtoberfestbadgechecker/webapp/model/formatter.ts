export default {
	formatValue: (value: string) => {
		return value?.toUpperCase();
	},

	/**
	 * Removes "Devtoberfest 2025" prefix from badge names on mobile devices
	 * @param {string} badgeName - The full badge name
	 * @param {boolean} isDesktop - Whether the current device is desktop
	 * @returns {string} The formatted badge name
	 */
	formatBadgeNameForMobile: (badgeName: string, isDesktop: boolean) => {
		if (!badgeName) return badgeName;

		// If desktop, return the full name
		if (isDesktop) return badgeName;

		// For mobile, remove "Devtoberfest 2025 - " or "Devtoberfest 2025 " prefix
		return badgeName
			.replace(/^Devtoberfest 2025 - /, '')
			.replace(/^Devtoberfest 2025 /, '');
	}
};
