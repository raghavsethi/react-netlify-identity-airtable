const Airtable = require("airtable")

const airtableApiKey = process.env.AIRTABLE_API_KEY
const airtableBaseId = process.env.AIRTABLE_BASE_ID
const airtablePrimaryTableName = process.env.AIRTABLE_PRIMARY_TABLE_NAME

const airtablePrimaryTableViewName =
  process.env.AIRTABLE_PRIMARY_TABLE_VIEW_NAME

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId)

const getMatchingUserProfilesAsync = async function (email) {
  const completionPromise = new Promise((resolve, reject) => {
    const matchingRecords = []
    const filter = {
      filterByFormula: `{Email} = "${email}"`,
      ...(airtablePrimaryTableViewName
        ? { view: airtablePrimaryTableViewName }
        : {}),
    }
    base(airtablePrimaryTableName)
      .select(filter)
      .eachPage(
        (records, fetchNextPage) => {
          matchingRecords.push(...records)
          fetchNextPage()
        },
        err => {
          if (err) {
            console.error(err)
            reject(err)
            return
          }

          resolve(matchingRecords)
        }
      )
  })

  const results = await completionPromise
  console.log(results)
  return results.map(r => r.fields)
}

const checkUserAuthorizedAsync = async function (email) {
  const matchingProfiles = await getMatchingUserProfilesAsync(email)
  return matchingProfiles.length > 0
}

exports.handler = async (event, context) => {
  const parsedEvent = JSON.parse(event.body)
  const allowUserAccess = await checkUserAuthorizedAsync(parsedEvent.user.email)
  return {
    statusCode: allowUserAccess ? 200 : 400,
  }
}
