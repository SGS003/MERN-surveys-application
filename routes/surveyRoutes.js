const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplate/surveyTemplate");

const Survey = mongoose.model("surveys"); //也可以直接require写好的recipient file 但是这样可以在test的时候规避一些问题

module.exports = app => {
	app.post("/api/surveys", requireLogin, requireCredits, (req, res) => {
		const { title, subject, body, recipients } = req.body;
		const survey = new Survey({
			title: title,
			subject, //es6 syntax
			body,
			recipients: recipients
				.split(",")
				.map(email => ({ email: email.trim() })),
			_user: req.user.id, // id property is automated by mongodb
			dateSent: Date.now()
		});

		// Send email here.
		const mailer = new Mailer(survey, surveyTemplate(survey));
		mailer.send();
	});
};
