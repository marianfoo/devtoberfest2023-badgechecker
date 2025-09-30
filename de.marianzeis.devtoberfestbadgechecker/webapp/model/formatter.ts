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
	},

	/**
	 * Formats the earned date to display in brackets
	 * @param {string} earnedDate - The earned date in ISO format
	 * @returns {string} The formatted date in brackets or empty string
	 */
	formatEarnedDate: (earnedDate: string) => {
		if (!earnedDate) return '';

		try {
			// Parse the date and format it as DD.MM.YY
			const date = new Date(earnedDate);
			const day = ('0' + date.getDate()).slice(-2);
			const month = ('0' + (date.getMonth() + 1)).slice(-2);
			const year = String(date.getFullYear()).slice(-2);

			return `(${day}.${month}.${year})`;
		} catch (e) {
			return '';
		}
	}
};
