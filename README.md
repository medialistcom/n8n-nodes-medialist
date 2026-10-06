# n8n-nodes-medialist

This is an n8n community node for [Media List](https://medialist.com). Use it to find journalists, editors, TV and radio producers, podcast hosts and creators, and to read your saved Media List lists and email campaigns inside your n8n workflows.

[n8n](https://n8n.io/) is a workflow automation platform.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Example workflows](#example-workflows) · [Compatibility](#compatibility) · [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation and install `n8n-nodes-medialist`.

## Operations

All operations are read-only.

| Resource | Operation | What it does |
| --- | --- | --- |
| Contact | Search | Search contacts by keywords plus filters (title, outlet, location, state, country, beat, topic, media type, deliverable emails only) |
| Contact | Get | Get the full profile of one contact |
| Outlet | Search | Find newspapers, magazines, TV and radio stations, sites and podcasts by name or domain |
| List | Get Many | Get your saved lists |
| List | Get | Get one saved list |
| List | Get Contacts | Get the contacts in one list |
| Campaign | Get Many | Get your email campaigns with send, open and click counts |
| Campaign | Get | Get one campaign |
| Account | Get | Get your plan, remaining exports and API limits |
| Account | Get Filter Values | Get valid values for the media type, topic, country, state and language filters |

Emails are returned only when they are already unlocked in your Media List account. Otherwise a masked preview is returned.

The node can also be used as a tool by n8n AI agents.

## Credentials

You need a Media List API key. API access comes with paid Media List plans. Request a key at [medialist.com/developers](https://medialist.com/developers).

1. In n8n, create a new **Media List API** credential.
2. Paste your API key (it starts with `ml_live_`).
3. Save. n8n checks the key against your Media List account.

## Example workflows

- **Build a media list into a spreadsheet.** Manual Trigger, then Media List (Contact > Search, keywords "health", filter State "TX"), then Google Sheets (append rows).
- **Weekly campaign report.** Schedule Trigger every Monday, then Media List (Campaign > Get Many), then Slack or Email with the open and click counts.
- **Research an outlet.** Media List (Outlet > Search "Chronicle"), then Media List (Contact > Search with the outlet filter set to the outlet name).

## Compatibility

Tested with n8n 2.42.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Media List API documentation](https://medialist.com/developers)
- [Media List](https://medialist.com)
- Support: support@medialist.com

## License

[MIT](LICENSE.md)
