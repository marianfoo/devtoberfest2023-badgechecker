import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import Sorter from "sap/ui/model/Sorter";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace de.marianzeis.devtoberfestbadgechecker.controller
 */
export default class Main extends BaseController {
	response: any;
	
	onInit () {
		// Set initial model
		this.getView().setModel(new JSONModel({ badges: [], scnId: "" }));
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
		
		const oModel = this.getView().getModel() as JSONModel;
		const parameters = oEvent.getParameters();
		const selected = oEvent.getParameter("selected")
		if(selected){
			const filteredBadges = this.response.filter((badge: any) => {
				return badge.found === false;
			});
			oModel.setProperty("/badges", filteredBadges);
		} else {
			oModel.setProperty("/badges", this.response);
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
		try {
			const response = await jQuery.ajax({
				url: `https://devtoberfest.marianzeis.de/api/checkBadges?scnId=${scnId}`,
				// url: `http://localhost:3000/checkBadges?scnId=${scnId}`,
				method: "GET",
			});
			this.response = response;
			oModel.setProperty("/badges", response);
		} catch (error) {
			MessageToast.show("Error fetching badges");
		}
		this.getView().setBusy(false);
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
		binding.sort(sorter);
	}

	_getKey(oControl) {
		return this.getView().getLocalId(oControl.getId());
	}
}
