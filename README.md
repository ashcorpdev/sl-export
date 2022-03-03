## STREAMLABS LOYALTY TO STREAMELEMENTS EXPORTER

This tool will allow you to export your Streamlabs Loyalty Extension points to a CSV file that can be imported into StreamElements.

### Setup
In order for the tool to work, you'll need to install NodeJS and grab a few details from the developer tools in your browser. Please follow the instructions below to get started.

#### NodeJS
Make sure you have the latest LTS version of NodeJS installed. You can download it [here](https://nodejs.org/en/download/).

#### Download the tool
If you use git, clone the repo using the following command:
```bash
git clone https://github.com/ashcorpdev/sl-export.git && cd sl-export && npm i
```
Alternatively, download this repo as a zip file, extract it in a location of your choosing, and open a terminal in the directory.

#### Streamlabs Cookies
Make a copy of the provided `.env.example` file and rename it to `.env`. Once that's done, you'll need to login to the [Streamlabs Dashboard](https://streamlabs.com/dashboard) and sign in with your Twitch account if you haven't done so already.

Once you're logged in, go to the [Loyalty Extension](https://streamlabs.com/dashboard#/loyalty) page, you'll need to open up your browser's developer tools. On Firefox/Chrome, you can press F12 to do this; other browsers may have different hotkeys.

On Firefox/Chrome, navigate to the `Network` tab and reload the Streamlabs Loyalty page. Find the `user-points` request and click it. Scrolls down to the `Response Headers` and grab the `user-agent`, `cookie` and `x-csrf-token` values replace the placeholder text inside of `.env` file.

### **WARNING! Never provide these to anybody else. They will give complete access to your Streamlabs data, including any API access, payment information or personal information.**

Once that's done, close the developer tools and scroll down to the bottom of the Loyalty page and check how many pages are shown. 

Change the `PAGES` option in the `.env` file to be the number of pages that you saw.

### Usage

#### Running the tool
Ensure you are in the directory that you've download the tool into. Ensure you have all of the values set in the `.env` file in the root directory of the project.

Run the following command and the tool should begin downloading the required data:
```bash
npm start
```

The tool will give you a running total of the progress made on each page. Once it has finished gathering all of the data, it should output all the user points into a `sl-points.csv` file in the root directory of the tool.

Once this is done and the tool says it's safe to do so, you can close the terminal or press Ctrl+C to kill the process.

*Note: This process can take a long time. By default, the tool will make a maximum of 2 requests per second to prevent your account from being blocked by Streamlabs. If you wish to adjust this, you can edit the settings in `index.js` to your preferred timings - do so at your own risk.*

#### Uploading to StreamElements
Log into the [StreamElements Dashboard](https://streamelements.com/dashboard) and click on your profile image in the top-right corner of the page. Click on `Import`, then scroll down and select `Other`. You will be redirected to the Imports page for Streamelements.

Click the `IMPORT NOW` button underneath the `Import from CSV` option. Select the `sl-points.csv` file and click `SELECT FILES`.

*You should now have succesfully imported your streamlabs currency into StreamElements!*