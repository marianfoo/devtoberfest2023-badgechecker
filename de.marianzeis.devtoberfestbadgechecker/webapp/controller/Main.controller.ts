import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import Filter from "sap/ui/model/Filter";
import Sorter from "sap/ui/model/Sorter";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace de.marianzeis.devtoberfestbadgechecker.controller
 */
export default class Main extends BaseController {
	response: any;
	
	onInit () {
		// Set initial model
		this.getView().setModel(new JSONModel({ badges: [], scnId: "", text: "" }));
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
			const response = await jQuery.ajax({
				url: `https://devtoberfest.marianzeis.de/api/checkBadges?scnId=${scnId}`,
				// url: `http://localhost:3000/checkBadges?scnId=${scnId}`,
				method: "GET",
			});
			this.response = response;
			const {
				userLevel,
				accumulatedPoints,
				pointsToNextLevel
			} = this.getProgress(response);	
			oModel.setProperty("/text", `Your current level is ${userLevel} with ${accumulatedPoints} points. You need ${pointsToNextLevel} points to reach the next level.`);
			oModel.setProperty("/badges", response);
		} catch (error) {
			MessageToast.show("Error fetching badges");
		}
		this.getView().setBusy(false);
	}

	onGoToGameboard(){
		// open the link https://devrel-tools-prod-scn-badges-srv.cfapps.eu10.hana.ondemand.com/devtoberfestContest/mariannnn in a new tab
		const scnId = this.getView().getModel().getProperty("/scnId");
		window.open(`https://devrel-tools-prod-scn-badges-srv.cfapps.eu10.hana.ondemand.com/devtoberfestContest/${scnId}`, "_blank");

	}

	getProgress(data: any) {
		const foundTotal = data.filter((badge: any) => badge.found);
		const points = foundTotal.reduce((a: any, b: any) => a + b.points, 0); // accumulatedPoints
	
		const levels = [
			{ "level": 1, "points": 3000 },
			{ "level": 2, "points": 14000 },
			{ "level": 3, "points": 22000 },
			{ "level": 4, "points": 30000 }
		];
	
		const {
			userLevel,
			accumulatedPoints,
			pointsToNextLevel
		} = this.calculateProgress(levels, points);
	
		console.log(userLevel, accumulatedPoints, pointsToNextLevel);
		return {
			userLevel,
			accumulatedPoints,
			pointsToNextLevel
		};
	}
	
	calculateProgress(data: any, accumulatedPoints: number) {
		let userLevel = 0;
		let pointsToNextLevel = 0;
	
		// Sort data by level in ascending order
		data.sort((a: any, b: any) => a.level - b.level);
	
		for (const badge of data) {
			if (accumulatedPoints < badge.points) {
				pointsToNextLevel = badge.points - accumulatedPoints;
				break;
			} else {
				userLevel = badge.level;
			}
		}
	
		return {
			userLevel,
			accumulatedPoints,
			pointsToNextLevel
		};
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
