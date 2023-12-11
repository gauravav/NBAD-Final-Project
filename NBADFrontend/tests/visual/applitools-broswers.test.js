//    eyes.setApiKey('0tvegKYFN0aG9kJqQL6rZrOQxlwVkd9TfYPd0ae106t6c110');

const { Eyes, Target } = require('@applitools/eyes-webdriverio');
const { remote } = require('webdriverio');

async function runVisualTest() {
    const eyes = new Eyes();

    // Set your Applitools API key
   eyes.setApiKey('0tvegKYFN0aG9kJqQL6rZrOQxlwVkd9TfYPd0ae106t6c110');

    // Define browsers for cross-browser testing
    const browsers = [
        { browserName: 'chrome' },
        { browserName: 'firefox' },
        { browserName: 'safari'},
    ];

    for (const browserConfig of browsers) {
        const browser = await remote({
            capabilities: browserConfig,
        });

        try {
            // Start the test for the specific browser
            await eyes.open(browser, 'Budget Management App', `Cross Browser Testing, Broswer Name - ${browserConfig.browserName}`);

            // Navigate to your React app
            await browser.url('http://localhost:3000');

            // Capture a screenshot
            await eyes.check('React App Page', Target.window());

            // End the test for the specific browser
            await eyes.close();
        } finally {
            // Close the browser for the specific browser
            await browser.deleteSession();

            // If there are visual differences, the Applitools dashboard will show them
            await eyes.abortIfNotClosed();
        }
    }
}

runVisualTest();

