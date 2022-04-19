console.log("Welcome to The Office!!");
import paperStock_1 from "./paperStock.js";
// just in case, with the console.table I can check all the stock informations from console
console.table(paperStock_1);
// _____"PAGES" variables_______
const calculator = document.getElementById('Calculator');
const table = document.getElementById('Table');
// // _______CALCULATOR's variables_________
const dropDownSelection = document.getElementById('DropDownSelection');
const checkBox = document.getElementById('check');
const companyName = document.getElementById('companyName');
const documentsPerWeek = document.getElementById('documentsPerWeek');
const pagePerDocument = document.getElementById('pagePerDocument');
const calculateButton = document.getElementById('Calculate');
const allTheInputs = document.querySelectorAll('input');
let recycledOptions = [];
// //_________TABLE's variables________
const numberOfDocumentsPrintedPerYear = document.getElementById('NumberOfDocumentsPrintedPerYear');
const paperStockLabel = document.getElementById('paperStockLabel');
const michaelScottCostPerSheet = document.getElementById('MichaelScottCostPerSheet');
const competitorCostPerPage = document.getElementById('CompetitorCostPerPage');
const paperBrand = document.getElementById('paperBrand');
const additionalDetails = document.getElementById('additionalDetails');
const additionalDetailsRow = document.getElementById('additionalDetailsRow');
const annualCostForMikeResults = document.getElementById('annualCostForMikeResults');
const savingVsCompetitorResults = document.getElementById('savingVsCompetitorResults');
const adjustResponse = document.getElementById('adjustResponse');
// ______VALIDATIONS variables______
const companyNameError = document.getElementById('companyNameError');
const documentsPerWeekError = document.getElementById('documentsPerWeekError');
const pagePerDocumentError = document.getElementById('pagePerDocumentError');
// ___Object to store all the info I need to pass from the calculator to the table. I will also use it for the validations
let validation = {
    company_name: "",
    documents_per_week: 0,
    page_per_document: 0,
    paper_stock_option: ""
};
//______Function to CREATE OPTIONS for the drop down MENU______________
paperStock_1.map(option => {
    let optionSelection = document.createElement('option');
    optionSelection.innerHTML = option.paperName;
    dropDownSelection.appendChild(optionSelection);
});
// now that I have all the options created, I can store them in an array
const allThePaperStockOptions = document.querySelectorAll('option');
//__________Function to Show ONLY the RECYCLED products_______________
checkBox.addEventListener("click", (e) => {
    // every time I click the checkbox, the function will check if the box is marked or not
    let checked = e.target.checked;
    if (checked === true) {
        // if it's checked the function will filtered all the objects (from the paperStock array) with the recycled value equal to true
        let newArr = paperStock_1.filter((option) => option.recycled === true);
        // then it will store only the name of the recycled options in an array
        newArr.map(ar => { recycledOptions.push(ar.paperName); });
    }
    else {
        // if the checkbox is not checked the function will erase the array created above with the recycled options
        recycledOptions.length = 0;
    }
    // at this point the function will "loop" through the options( from the html Select menu)
    allThePaperStockOptions.forEach(option => {
        // if the innerHTML of the option is not in the recycled array, the function will set the "Css" display to none
        if (!recycledOptions.includes(option.innerHTML) && recycledOptions.length > 0) {
            option.style.display = 'none';
        }
        else if (recycledOptions.length === 0) {
            // here (because I reset the array when the checkbox is not marked), if the array with the recycled options is empty, the function will show all the options in the drop down menu
            option.style.display = 'contents';
        }
    });
});
// ________Event Listener to store the calculator's input values in the validation object, every time they change
Array.from(allTheInputs).map(input => input.addEventListener('change', (e) => {
    let value = e.target.value;
    // using the switch methods to check what input I'm saving the value from. Then I save it in the corresponding validation key value
    switch (input.id) {
        case "companyName":
            validation.company_name = value;
            break;
        case "pagePerDocument":
            validation.page_per_document = Number(value);
            break;
        case "documentsPerWeek":
            validation.documents_per_week = Number(value);
    }
}));
// _______"Helper" Function that will be used from the Calculate Button (eventListener) to elaborate the info that will be shown in the "results table's" rows
const switchingPage = () => {
    // First a little bit of magic, making the calculator disappear and the table appear
    calculator.style.display = 'none';
    table.style.display = 'flex';
    // filtering the "selected paper's" info from the product array and storing them in a variable(using interface SingleProduct) 
    const paperTypeInfo = paperStock_1.filter(product => product.paperName === validation.paper_stock_option)[0];
    //here now I fill the table's rows with the math and the info required, making also sure that the numbers will show the comma every 3 digits
    let mathForNumberOfDocumentPrintedPerYear = (validation.documents_per_week * validation.page_per_document) * 52;
    numberOfDocumentsPrintedPerYear.innerHTML = mathForNumberOfDocumentPrintedPerYear.toLocaleString();
    // below I'm passing the info from the validation object to the Table's rows 
    paperStockLabel.innerHTML = validation.paper_stock_option;
    michaelScottCostPerSheet.innerHTML = paperTypeInfo.costPerSheetMichaelScott;
    competitorCostPerPage.innerHTML = paperTypeInfo.costPerSheetCompetitor;
    paperBrand.innerHTML = paperTypeInfo.brand;
    // checking if there's any additional details; if not the additional info row won't show
    if (paperTypeInfo.additionalDetails.length) {
        additionalDetails.innerHTML = paperTypeInfo.additionalDetails;
    }
    else if (paperTypeInfo.additionalDetails.length === 0) {
        additionalDetailsRow.style.display = 'none';
    }
    // now the final results: Annual cost w/ Michael Scott....
    //I needed to use a little trick with the "split('')"  method because the data that I'm using, was saved in the object as a string, with a $ in front
    let mathForAnnualCostForMikeResults = Number(mathForNumberOfDocumentPrintedPerYear) * Number(paperTypeInfo.costPerSheetMichaelScott.split(" ")[1]);
    annualCostForMikeResults.innerHTML = `$ ${mathForAnnualCostForMikeResults.toLocaleString('en-us', { minimumFractionDigits: 2 })}`;
    // ...and Savings vs Competitor...I had to use the same "split()" trick to do the math
    let competitorResults = Number(mathForNumberOfDocumentPrintedPerYear) * Number(paperTypeInfo.costPerSheetCompetitor.split(" ")[1]);
    let mathForSavingVsCompetitorResults = competitorResults - mathForAnnualCostForMikeResults;
    savingVsCompetitorResults.innerHTML = `$ ${mathForSavingVsCompetitorResults.toLocaleString('en-us', { minimumFractionDigits: 2 })}`;
};
// _____________The Calculator Button's eventListener______mostly checking that all the keys in Validation have the correct value. 
calculateButton.addEventListener('click', () => {
    if (validation.company_name !== "") {
        companyName.style.border = 'none';
        companyNameError.style.display = 'none';
    }
    else {
        companyName.style.border = '1px solid red';
        companyNameError.style.display = 'contents';
    }
    if (validation.documents_per_week > 0) {
        documentsPerWeekError.style.display = 'none';
        documentsPerWeek.style.border = 'none';
    }
    else {
        documentsPerWeekError.style.display = 'contents';
        documentsPerWeek.style.border = '1px solid red';
    }
    if (validation.page_per_document > 0) {
        pagePerDocumentError.style.display = 'none';
        pagePerDocument.style.border = 'none';
    }
    else {
        pagePerDocumentError.style.display = 'contents';
        pagePerDocument.style.border = '1px solid red';
    }
    if (dropDownSelection.value !== 'Select one') {
        validation.paper_stock_option = dropDownSelection.value;
        dropDownSelection.style.border = 'none';
        dropDownSelection.style.color = 'black';
    }
    else {
        dropDownSelection.style.border = '1px solid red';
        dropDownSelection.style.color = 'red';
    }
    // at the end if all the info are stored correctly, the function will call the switchingPage function that will create, and pass all the info to the table section
    if (validation.company_name !== "" && validation.page_per_document > 0 && validation.documents_per_week > 0 && dropDownSelection.value !== 'Select one') {
        switchingPage();
    }
});
// The "Adjust Response's" event listener will bring the user to the initial calculator "state". Here I was a little confuse. The sheet says "where they can change their responses" so I made it in the way that when the customer goes back to the calculator, all the fields will be filled with the info previously insert.
adjustResponse.addEventListener('click', () => {
    calculator.style.display = 'flex';
    table.style.display = 'none';
    additionalDetailsRow.style.display = 'contents';
    companyName.value = validation.company_name;
    documentsPerWeek.value = (validation.documents_per_week).toString();
    pagePerDocument.value = (validation.page_per_document).toString();
    dropDownSelection.value = validation.paper_stock_option;
});
