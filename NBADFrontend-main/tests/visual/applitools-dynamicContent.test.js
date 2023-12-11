const { Eyes, Target } = require('@applitools/eyes-webdriverio');
const { remote } = require('webdriverio');

async function runDynamicContentTest() {
    const eyes = new Eyes();

    // Set your Applitools API key
    eyes.setApiKey('0tvegKYFN0aG9kJqQL6rZrOQxlwVkd9TfYPd0ae106t6c110');

    // Initialize the browser
    const browser = await remote({
        capabilities: {
            browserName: 'chrome',
        },
    });

    try {
        // Start the test
        await eyes.open(browser, 'Budget Management App', 'Dynamic Content Test');

        // Navigate to your React app
        await browser.url('http://localhost:3000');

        // Login scenario with dynamic content
        await login(browser);

        // Capture a screenshot, ignoring the dynamic content area during comparison
        await eyes.check('After Login - Ignore Dynamic Content', Target.window().ignore('.dynamic-content'));

        // Add a new budget scenario with dynamic content
        await addNewBudget(browser);

        // Capture a screenshot, ignoring the dynamic content area during comparison
        await eyes.check('After Adding Budget - Ignore Dynamic Content', Target.window().ignore('.dynamic-content'));

        // End the test
        await eyes.close();
    } finally {
        // Close the browser
        await browser.deleteSession();

        // If there are visual differences, the Applitools dashboard will show them
        await eyes.abortIfNotClosed();
    }
}

async function login(browser) {
    // Implement your login logic here
    // For example, enter credentials and perform login actions
    await browser.addValue('#username', 'your_username');
    await browser.addValue('#password', 'your_password');
    await browser.click('#login-button');
    // Add other login-related actions as needed
}

async function addNewBudget(browser) {
    // Implement your new budget addition logic here
    // For example, navigate to the budget page and add a new budget
    await browser.click('#budgets-tab');
    await browser.click('#add-budget-button');
    await browser.addValue('#budget-name', 'New Budget');
    await browser.addValue('#budget-amount', '1000');
    await browser.click('#save-budget-button');
    // Add other budget-related actions as needed
}

runDynamicContentTest();
