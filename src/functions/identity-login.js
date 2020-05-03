const airtableHelpers = require("./shared");

exports.handler = async (event, context) => {
  const parsedEvent = JSON.parse(event.body);
  const userProfile = await airtableHelpers.getFirstMatchingUserProfile(
    parsedEvent.user.email
  );

  return {
    statusCode: userProfile === null ? 400 : 200,
    body: JSON.stringify({
      user_metadata: { userProfile }
    })
  };
};
