import BaseController from "./BaseController";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace de.marianzeis.devtoberfestbadgechecker.controller
 */
export default class Main extends BaseController {
	app: any;
	functions: any;
	
	onInit () {
		// Set initial model
		this.getView().setModel(new JSONModel({ badges: [], scnId: "" }));
		this.app = app;
	}

	async onGetBadgesPress() {
		
		console.log(functions);
		const oModel = this.getView().getModel() as JSONModel;
		const scnId = oModel.getProperty("/scnId");
		if (!scnId) {
			MessageToast.show("Please enter scnId");
			return;
		}
		try {
			const response = await jQuery.ajax({
				url: `https://<region>-<project-id>.cloudfunctions.net/getBadges?scnId=${scnId}`,
				method: "GET",
			});
			oModel.setProperty("/badges", response);
		} catch (error) {
			MessageToast.show("Error fetching badges");
		}
	}
}
