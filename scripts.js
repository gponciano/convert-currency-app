const form = document.querySelector("form")
const amount = document.getElementById("amount")
const currency = document.getElementById("currency")
const footer = document.querySelector("main footer")
const description= document.getElementById("description")
const result = document.getElementById("result")

let americanCurrency = 0;
let euroCurrency = 0;
let britishCurrency = 0;
let brazilianCurrency = 0;

amount.addEventListener("input", (e) => {
    e.preventDefault()
    const numbersOnlyRegex = /\D+/g;
    amount.value = amount.value.replace(numbersOnlyRegex, "")

})

async function getApiKey() {
    const response = await fetch("/api-key");  
    const data = await response.json();
    const apiKey = data.apiKey;  
    getData(apiKey);
}


async function getData(apiKey) {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        
        const conversionRates = data.conversion_rates;
        const selectedCurrencies = ["USD", "EUR", "GBP", "BRL"];
        const currencyVariables = selectedCurrencies.reduce((acc, currency) => {
            acc[currency] = conversionRates[currency];
            return acc;
        }, {});

        
        americanCurrency = currencyVariables.USD; 
        euroCurrency = currencyVariables.EUR;     
        britishCurrency = currencyVariables.GBP;  
        brazilianCurrency = currencyVariables.BRL; 
        
        const amountValue = parseFloat(amount.value);
        const targetCurrency = currency.value.toUpperCase();

        
        const currentExchange = conversionRates[targetCurrency];
        if (currentExchange) {
            
            convertCurrency(amountValue, currentExchange, targetCurrency);
        } else {
            alert("Selected currency is not available. Please try another one.");
        }
    } catch (error) {
        console.error("Error fetching data:", error.message);
        alert("Failed to fetch currency data. Please try again later.");
    }
}

function convertCurrency(amountValue, currentExchange, prefix) {
    try {
        
        const usdToBrl = 1 * brazilianCurrency;

        // Convert the target currency to BRL
        const exchangeToBrl = currentExchange * usdToBrl;

        // Update description and result
        description.textContent = `${prefix} 1 = ${formatCurrencyBRL(exchangeToBrl)}`;
        let total = amountValue * exchangeToBrl;
        total = formatCurrencyBRL(total).replace("R$", "");
        result.textContent = `${total} Reais`;
        footer.classList.add("show-result");
    } catch (error) {
        console.error("Error during conversion:", error);
        footer.classList.remove("show-result");
        alert("We were unable to apply the conversion. Please try again later.");
    }
}

form.onsubmit = (e) => {
    e.preventDefault();

    const amountValue = parseFloat(amount.value);
    if (isNaN(amountValue)) {
        alert("Please enter a valid amount.");
        return;
    }

    switch (currency.value) {
        case "USD":
            convertCurrency(amountValue, americanCurrency, "US$");
            break;
        case "EUR":
            convertCurrency(amountValue, euroCurrency, "€");
            break;
        case "GBP":
            convertCurrency(amountValue, britishCurrency, "£");
            break;
        case "BRL":
            convertCurrency(amountValue, brazilianCurrency, "R$");
            break;
        default:
            alert("Currency not supported.");
    }
};



function formatCurrencyBRL(value) {
    return Number(value).toLocaleString("br-PT", {
        style: "currency",
        currency: "BRL"
    })
}

window.onload = getApiKey;