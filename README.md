# Devtoberfest 2023 Badge Checker

This Bash script fetches and validates Devtoberfest 2023 badges for a user and calculates their total points. It was jointly developed by [Your Name] and OpenAI's ChatGPT.

## Usage using bash

To use the script, provide a user ID as an argument:

```bash
./devtoberfest-badge-checker.sh <user_id>
```

Replace <user_id> with the user's actual ID.

Note: This README and the accompanying script were generated using an AI language model. Modifications made to this file may be overwritten by future code generations.

### Requirements

- Bash
- cURL
- jq

### Example

```bash
./validate.sh vladimirs.semikins                                                                                                                                                           at  11:13:12
🔍 Fetching and validating Devtoberfest 2023 badges for user - vladimirs.semikins 🔍
✅ Devtoberfest 2023 Participant [Points: 200]
✅ SAP TechEd in 2023 Registered Attendee [Points: 1000]
❌ SAP TechEd in 2023 Attendee - Bangalore [Points: 1000]
❌ #E3CF57 - Devtoberfest 2023 - Petoberfest [Points: 1000]
✅ #CD9B1D - Devtoberfest 2023 - Making SAP Extensibility real with CAP in 60 minutes [Points: 300]
✅ #D2691E - Devtoberfest 2023 - Capire: Introduction, enhancements, and facilitating the development process [Points: 300]
✅ #B0171F - Devtoberfest 2023 - Overview of ABAP Cloud [Points: 300]
✅ #9C661F - Devtoberfest 2023 - ABAP Cloud for Classic ABAP Developers [Points: 300]
✅ #CAE1FF - Devtoberfest 2023 - SAP BTP ABAP Environment – How to Build a Multitenancy SaaS Application [Points: 300]
✅ #DAA520 - Devtoberfest 2023 - Create an SAP BTP ABAP Environment Trial User [Points: 150]
✅ #292421 - Devtoberfest 2023 - Create a CAP Project with SAP Business Application Studio [Points: 200]
✅ #EE7621 - Devtoberfest 2023 - Learn About Selected CAP Conventions [Points: 450]
❌ #ED9121 - Devtoberfest 2023 - Get to Know the ABAP RESTful Application Programming Model [Points: 50]
✅ #FF00FF - Devtoberfest 2023 - Create Database Table and Generate UI Service [Points: 200]
✅ #9B30FF - Devtoberfest 2023 - Enhance the Business Object Data Model and Enable OData Streams [Points: 150]
✅ #BF3EFF - Devtoberfest 2023 - Enhance the Business Object Behavior With Unmanaged Internal Numbering [Points: 150]
✅ #228B22 - Devtoberfest 2023 - What is SAP Build and How to Start Your Journey  [Points: 300]
✅ #698B22 - Devtoberfest 2023 - From Idea to Reality: Simplifying App Development for Everyone [Points: 300]
✅ #EEB422 - Devtoberfest 2023 - Custom UI & Theming Essentials in SAP Build Apps  [Points: 300]
✅ #6B8E23 - Devtoberfest 2023 - Build SAP S/4HANA Extensions with SAP Build Apps and Key User Extensibility [Points: 300]
❌ #FF7F24 - Devtoberfest 2023 - Create a Composite Component (List with Rating) [Points: 200]
✅ #FFC125 - Devtoberfest 2023 - Create a Social Media Backend [Points: 100]
✅ #8B5A2B - Devtoberfest 2023 - Create a Product List Page with Ratings [Points: 100]
✅ #A0522D - Devtoberfest 2023 - Prepare a Product Page [Points: 100]
✅ #F5FFFA - Devtoberfest 2023 - Create the Product Page UI with Ratings/Comments [Points: 250]
✅ #556B2F - Devtoberfest 2023 - Event-Driven Architecture: Bringing SAP and Microsoft closer together in real time [Points: 300]
✅ #ADFF2F - Devtoberfest 2023 - Develop an LLM-Based Application with Graph in SAP Integration Suite [Points: 300]
❌ #32CD32 - Devtoberfest 2023 - Integrate SAP API Management with 3rd party IDP for SAML/JWT/OAuth based Authentication [Points: 300]
✅ #9ACD32 - Devtoberfest 2023 - Set Up API Management from Integration Suite [Points: 150]
❌ #B3EE3A - Devtoberfest 2023 - Add an API Proxy to a Product [Points: 150]
❌ #DC143C - Devtoberfest 2023 - Configure SAP API Management policies to avoid CORS issues and generate an API Key [Points: 200]
❌ #6E8B3D - Devtoberfest 2023 - Protect Your API Proxy by Adding Application Key Verification [Points: 200]
❌ #E066FF - Devtoberfest 2023 - Manage APIs with Policies [Points: 200]
❌ #836FFF - Devtoberfest 2023 - Create Custom Dimensions and Measures [Points: 150]
❌ #8470FF - Devtoberfest 2023 - Get Started with API Revisions [Points: 150]
❌ #C0FF3E - Devtoberfest 2023 - Create Destination for SAP API Management Service [Points: 150]
✅ #CD853F - Devtoberfest 2023 - Hybrid development on SAP HANA Cloud and SAP HANA using SAP Business Application Studio [Points: 300]
❌ #FF7D40 - Devtoberfest 2023 - SAP Datasphere - the evolution towards a business data fabric [Points: 300]
❌ #3D9140 - Devtoberfest 2023 - Openness and flexibility with SAP Analytics Cloud’s APIs for data import and export [Points: 300]
✅ #008B45 - Devtoberfest 2023 - Sign up for an SAP HANA Cloud Trial account [Points: 100]
✅ #EE9A49 - Devtoberfest 2023 - Start Using SAP HANA Cloud Trial in SAP BTP Cockpit [Points: 100]
✅ #8B814C - Devtoberfest 2023 - Provision an Instance of SAP HANA Cloud, SAP HANA Database [Points: 100]
✅ #8B864E - Devtoberfest 2023 - SAP HANA Database Explorer Overview [Points: 100]
❌ #2F4F4F - Devtoberfest 2023 - Create Database Objects with SAP HANA Database Explorer [Points: 100]
❌ #FFA54F - Devtoberfest 2023 - wdi5 2.0: New Features and Migration from v1 [Points: 300]
❌ #8B0A50 - Devtoberfest 2023 - Using UI5 Web Components with Svelte [Points: 300]
❌ #548B54 - Devtoberfest 2023 - Setup for Mobile Development Kit [Points: 100]
❌ #8B7355 - Devtoberfest 2023 - Start Your MDK Application in the Editor [Points: 150]
❌ #872657 - Devtoberfest 2023 - Create a Customer List Page in an MDK App [Points: 100]
❌ #2E8B57 - Devtoberfest 2023 - Create a Customer Detail Page in an MDK App [Points: 200]
🌟 Total Points for ✅ badges: 7200 🌟
```

Note: This README and the accompanying script were generated using an AI language model.

## Using NodeJS

To use the Node.js version of the Devtoberfest Badges Checker, follow the instructions below:

### Prerequisites

- Node.js and npm installed on your system. If not, download and install them from [nodejs.org](https://nodejs.org/).

### Installation

In your project directory, install the required dependencies using the following command:

```sh
npm install 
```

### Usage

To execute the Node.js script, use the following command in your terminal, replacing `<scnId>` with the SCN ID you want to check:

```sh
node index.js -u <scnId>
```

If you only want to display those badges that were not found, add the -n or --notFound flag:

```sh
node index.js -u <scnId> -n
```

For example:

```sh
node index.js -u mariannnn -n
```

### Output

The script will compare the badges from the SAP People API against the badges listed in the JSON file and will display a list of badges with a "✅" symbol for earned badges and a "❌" symbol for unearned badges.

Example output:

```sh
✅ #E3CF57 - Devtoberfest 2023 - Petoberfest
❌ #CD9B1D - Devtoberfest 2023 - Making SAP Extensibility real with CAP in 60 minutes
✅ #D2691E - Devtoberfest 2023 - Capire: Introduction, enhancements, and facilitating the development process
```
