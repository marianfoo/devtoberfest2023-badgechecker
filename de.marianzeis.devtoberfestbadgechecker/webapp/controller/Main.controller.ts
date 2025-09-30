import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import Filter from "sap/ui/model/Filter";
import Sorter from "sap/ui/model/Sorter";
import JSONModel from "sap/ui/model/json/JSONModel";
import Theming from "sap/ui/core/Theming";

/**
 * @namespace de.marianzeis.devtoberfestbadgechecker.controller
 */
export default class Main extends BaseController {
	response: any;

	onInit () {
		// Set initial model
		this.getView().setModel(new JSONModel({ badges: [], scnId: "", text: "", currentDate: new Date().toISOString() }));
		this.getRouter()
			.getRoute("main")
			.attachEventOnce("patternMatched", this.onPatternMatchedOnce, this);
	}

	onPatternMatchedOnce() {
		const mParams = new URLSearchParams(window.location.search);
		const scnId = mParams.get("scnId");
		this.getView().byId("input").setValue(scnId);
		this.onGetBadgesPress(undefined, scnId);
	}

	onFilterBadges(oEvent: Event) {

		const table = this.byId("table");
		const binding = table.getBinding("items");
		const selected = oEvent.getParameter("selected")
		if(selected){
			binding.filter(new Filter("found", "EQ", false));
		} else {
			binding.filter();
		}

	}

	async onGetBadgesPress(event:any, scnIdPara?: string) {

		this.getView().setBusyIndicatorDelay(0);
		this.getView().setBusy(true);
		const oModel = this.getView().getModel() as JSONModel;
		const scnId = scnIdPara || oModel.getProperty("/scnId");
		if (!scnId) {
			MessageToast.show("Please enter scnId");
			this.getView().setBusy(false);
			return;
		}
		const mParams = new URLSearchParams(window.location.search);
		mParams.set("scnId", scnId);
		const newURL = `${window.location.origin}${
			window.location.pathname
		}?${mParams.toString()}`;
		window.history.pushState({}, "", newURL);
		try {
			const response = await fetch(`https://devtoberfest.marianzeis.de/api/checkBadges?scnId=${scnId}`);
			const result = await response.json();
			this.response = result;
			const levels = {
				1: 3000,
				2: 14000,
				3: 22000,
				4: 30000
			};
			const userLevel = result.level as number;
			const userName = result.userName as string;
			const accumulatedPoints = result.points as number;
			const pointsToNextLevel = Math.abs(
				accumulatedPoints - levels[userLevel + 1]
			);
			if (userLevel === 4) {
				oModel.setProperty(
					"/text",
					`You have reached the highest level with ${accumulatedPoints} points.`
				);
			} else {
				oModel.setProperty(
					"/text",
					`Hello ${userName}, your current level is ${userLevel} with ${accumulatedPoints} points. You need ${pointsToNextLevel} more points to advance to the next level.`
				);
			}
			oModel.setProperty("/badges", result.results);
		} catch (error) {
			MessageToast.show("Error fetching badges");
			console.error(error);
		}
		this.getView().setBusy(false);
	}

	onGoToGameboard(){
		// open the link https://devrel-tools-prod-scn-badges-srv.cfapps.eu10.hana.ondemand.com/devtoberfestContest/mariannnn in a new tab
		const scnId = this.getView().getModel().getProperty("/scnId");
		window.open(`https://devrel-tools-prod-scn-badges-srv.cfapps.eu10.hana.ondemand.com/devtoberfestContest/${scnId}`, "_blank");

	}

	goToRepo(){
		window.open("https://github.com/marianfoo/devtoberfest2023-badgechecker", "_blank");
	}

	goToCommunity(){
		window.open("https://community.sap.com/t5/devtoberfest/gh-p/Devtoberfest", "_blank");
	}

	onToggleTheme() {
		// Get current theme
		const currentTheme = Theming.getTheme();

		// Toggle between light and dark theme
		const newTheme = currentTheme === "sap_horizon_dark" ? "sap_horizon" : "sap_horizon_dark";

		// Apply new theme
		Theming.setTheme(newTheme);

		// Store user preference in localStorage
		localStorage.setItem("userPreferredTheme", newTheme);

		// Show feedback to user
		const themeMode = newTheme === "sap_horizon_dark" ? "Dark" : "Light";
		MessageToast.show(`Switched to ${themeMode} Mode`);
	}

	beforeOpenColumnMenu(oEvt) {
		var oMenu = this.byId("menu");
		var oColumn = oEvt.getParameter("openBy");
		var oSortItem = oMenu.getQuickActions()[0].getItems()[0];

		oSortItem.setKey(this._getKey(oColumn));
		oSortItem.setLabel(oColumn.getHeader().getText());
		oSortItem.setSortOrder(oColumn.getSortIndicator());
	}

	onSort(event: Event){
		var oSortItem = event.getParameter("item");
		var oTable = this.byId("table");
		var sAffectedProperty = oSortItem.getKey();
		var sSortOrder = oSortItem.getSortOrder();

		// sort table binding
		const binding = oTable.getBinding("items");
		const sorter = new Sorter(sAffectedProperty, sSortOrder === "Descending");
		binding.sort(sorter);
	}

	onResetSort(event: Event){
		const oTable = this.byId("table");
		const binding = oTable.getBinding("items");
		// default is sort by week and group true
		const sorter = new Sorter("week", false, true);
		const sorter2 = new Sorter("date");
		binding.sort([sorter, sorter2]);
	}

	_getKey(oControl) {
		return this.getView().getLocalId(oControl.getId());
	}
}
