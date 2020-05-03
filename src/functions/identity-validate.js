const airtableHelpers = require("./shared");

exports.handler = async (event, context) => {
  const parsedEvent = JSON.parse(event.body);
  const allowUserAccess = await airtableHelpers.checkUserAuthorizedAsync(
    parsedEvent.user.email
  );
  return {
    statusCode: allowUserAccess ? 200 : 400
  };
};
