using System.Threading.Tasks;
using Microsoft.Playwright;

class Program
{
    public static async Task Main()
    {

        // Setup Playwright
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = false });
        var context = await browser.NewContextAsync();
        var page = await context.NewPageAsync();

        // Step 1: Navigate to the specified URL
        await page.GotoAsync("https://miacademy.co/#/");

        // Step 2: Navigate to MiaPrep Online High School through the link on the banner
        // Assuming the link text is "MiaPrep Online High School"
        await page.ClickAsync("//a[contains(text(),'Online High School')]");
        
        // Step 3: Apply to MOHS
        await page.ClickAsync("(//li[contains(@class,'menu-cta-button_design_1 menu-item')]//a)[1]");
        await page.ClickAsync("(//button[contains(@class,'fmSmtButton next_previous')])[1]");

        // Step 4: Fill in the Parent Information
        // Assuming input fields have IDs "parentFirstName", "parentLastName", etc.
        await page.FillAsync("(//input[@name='Name'])[1]", "John");
        await page.FillAsync("(//input[@name='Name'])[2]", "Doe");
        await page.FillAsync("#Email-arialabel", "john.doe@example.com");
        await page.FillAsync("#PhoneNumber", "1234567890");
        await page.ClickAsync("(//span[@class='select2-selection__arrow select2FormArrow'])[1]");
        await page.ClickAsync("//li[text()='No']");
        await page.ClickAsync("//label[@for='Checkbox_5']");
        await page.FillAsync("#Date-date", "20-aug-2024");
        await page.ClickAsync("(//em[text()=' Next '])[2]");

        //Student Information registration page
        await page.ClickAsync("(//span[@class='select2-selection__arrow select2FormArrow'])[2]");
        await page.ClickAsync("//li[text()='One']");
        await page.FillAsync("(//input[@name='Name2'])[1]", "John");
        await page.FillAsync("(//input[@name='Name2'])[2]", "Mark");
        await page.FillAsync("#SingleLine5-arialabel", "Markus");
        await page.FillAsync("#Email2-arialabel", "john.doe@example.com");
        await page.FillAsync("#PhoneNumber2", "1234567890");
        await page.FillAsync("#Date3-date", "30-Aug-2020");
        await page.ClickAsync("(//span[@class='select2-selection__arrow select2FormArrow'])[3]");
        await page.ClickAsync("//li[text()='No']");
        await page.ClickAsync("//span[@id='select2-Dropdown3-arialabel-container']/following-sibling::span[1]");
        await page.ClickAsync("//li[text()='Male']");
        await page.ClickAsync("#select2-Dropdown4-arialabel-container");
        await page.ClickAsync("//li[text()='No']");
        await page.FillAsync("#Number1-arialabel", "3");
        await page.ClickAsync("//label[@for='Checkbox7_1']");
        await page.ClickAsync("//label[@for='Checkbox1_1']");
        await page.ClickAsync("//label[@for='Checkbox2_1']");
        await page.ClickAsync("//label[@for='Checkbox3_2']");
        await page.FillAsync("#MultiLine-arialabel", "Swimming, Fencing");
        await page.ClickAsync("(//span[@title='-Select-']/following-sibling::span)[3]");
        await page.ClickAsync("//li[text()='No']");
        await page.ClickAsync("((//button[@elname='next'])[3])");

        //financial Aid page
        // await page.ClickAsync("(//span[@id='select2-Dropdown12-arialabel-container']/following-sibling::span[1])");
        // await page.ClickAsync("//li[text()='No']");

        //click the submit button
        // await page.ClickAsync("//em[text()='Submit']");
        
        
      
        System.Console.WriteLine("Test stopped at Student Information page");
    }
}
