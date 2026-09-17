const startButton = document.getElementById("startButton")
const materialEl = document.getElementById("material")
const tierEl = document.getElementById("tier")
const levelEl = document.getElementById("level")
const weightEl = document.getElementById("weight")
const capitalEl = document.getElementById("capital")
const sheet = document.getElementById("sheet")
const profitEl = document.getElementById("profit")
const capitalElBox = document.getElementById("max_capital")
const AlbionMaterials = {
    2: {raw: 1, weight: 0.23},
    3: {raw: 2, weight: 0.34},
    4: {raw: 2, weight: 0.51},
    5: {raw: 3, weight: 0.76},
    6: {raw: 4, weight: 1.14},
    7: {raw: 5, weight: 1.7},
    8: {raw: 5, weight: 2.6}
}


function start()
{
    let tier = tierEl.value

    calculationSheet(tier)
}
    

startButton.addEventListener("click", () => start())

function calculationSheet(tier)
{
    let tierTables = document.createElement("div")
    tierTables.setAttribute("id", "tierTables")
    let tbl = document.createElement("table")
    let tbdy = document.createElement("tbody")
    for(let i=0; i<3; i++)
    {
        let tr = document.createElement("tr")
        if(i==0)
        {
            tierTable(tr, tier)
        }
        else if(i==1)
        {
            priceTable(tr, tier)
        }
        else if(i==2)
        {
            quantityTable(tr, tier)
        }
        tbdy.appendChild(tr)
    }
    tbl.appendChild(tbdy)
    tierTables.append(tbl)
    sheet.innerHTML = ""
    sheet.appendChild(tierTables)
    let valueText = document.createElement("label")
    valueText.setAttribute("for", "sell_value")
    valueText.appendChild(document.createTextNode("Sell value:"))
    sheet.appendChild(valueText)
    let value = document.createElement("input")
    value.setAttribute("type", "number")
    value.setAttribute("id", "sell_value")
    sheet.appendChild(value)
    let button = document.createElement("button")
    button.setAttribute("id", "real_calculate")
    button.innerHTML = "Calculate profit!"
    sheet.appendChild(button)
    document.getElementById("real_calculate").addEventListener("click", () => profit())
}

function tierTable(tr, tier)
{
    for(let j=1; j<=tier; j++)
    {
        let td = document.createElement("td")
        if(j==1)
        {
            td.appendChild(document.createTextNode(""))
            tr.appendChild(td)
        }
        else
        {
            td.appendChild(document.createTextNode("T"+j))
            tr.appendChild(td)
        }
    }
}

function priceTable(tr, tier)
{
    for(let j=1; j<=tier; j++)
    {
        let td = document.createElement("td")
        if(j==1)
        {
            td.appendChild(document.createTextNode("Price"))
            tr.appendChild(td)
        }
        else
        {
            let input = document.createElement("input")
            input.setAttribute("id", `t${j}_price`)
            input.setAttribute("type", "number")
            td.appendChild(input)
            tr.appendChild(td)
        }
    }
}

function quantityTable(tr, tier)
{
    for(let j=1; j<=tier; j++)
    {
        let td = document.createElement("td")
        if(j==1)
        {
            td.appendChild(document.createTextNode("Quantity"))
            tr.appendChild(td)
        }
        else
        {
            let p = document.createElement("p")
            p.setAttribute("id", `t${j}_quantity`)
            td.appendChild(p)
            tr.appendChild(td)
        }
    }
}

function getFoodCost(tier, enchantment) {
    return 0.45 * Math.pow(2, parseInt(tier) + parseInt(enchantment) - 2);
}

function getCost(how_many, R, tier)
{
    
    let level = parseInt(levelEl.value)
    let price, quantity
    let cost = 0
    let totalNutrition = 0
    let pricePer100Food = 400
    for (let i = tier; i > 1; i--)
    {
        let this_many = Math.ceil(how_many * AlbionMaterials[i].raw * Math.pow(R, tier - i))
        document.getElementById(`t${i}_quantity`).textContent = this_many

        let currentEnchantment
        if (i>=4)
        {
            currentEnchantment = level
        }
        else
        {
            currentEnchantment = 0
        }
        let foodPerCraft = getFoodCost(i, currentEnchantment)
        let foodForThisTier = foodPerCraft * this_many 

        totalNutrition += foodForThisTier
    }

    cost = totalNutrition/100 * pricePer100Food
    for (let i = tier; i > 1; i--)
    {
        price = document.getElementById(`t${i}_price`).value
        quantity = document.getElementById(`t${i}_quantity`).textContent
        cost += price * quantity * 1.025
    }

    cost = Math.ceil(cost)
    return cost
}

function profit()
{
    profitEl.textContent = ""
    let calculateByCapital = capitalElBox.checked
    console.log(calculateByCapital)
    let tier = parseInt(tierEl.value)
    let capital = parseInt(capitalEl.value)
    let max_weight = (weightEl.value-10) /0.7
    let divider = 0
    let R = 1 - 0.367
    for (let i = tier; i > 1; i--)
    { 
        divider += AlbionMaterials[i].raw * AlbionMaterials[i].weight * Math.pow(R, tier - i)
    }
    let how_many = max_weight/divider
    
    let cost = getCost(how_many, R, tier)

    if(calculateByCapital)
    {
        if(cost > capital)
        {
            let costPerUnit = cost / how_many 
            max_amount = Math.ceil(capital / costPerUnit) - 5
            cost = getCost(max_amount, R, tier)
            how_many = max_amount
        }
    }
        
    let profit = Math.ceil((document.getElementById("sell_value").value * how_many * 0.935 / R) - cost)
    let tbl = document.createElement("table")
    let tbdy = document.createElement("tbody")
    for(let i = 0; i<2; i++)
    {
        let tr = document.createElement("tr")
        for(let j=0; j<2; j++)
        {
            if(i==0)
            {
                if(j==0)
                {
                    let td = document.createElement("td")
                    td.appendChild(document.createTextNode("Cost"))
                    tr.appendChild(td)
                }
                else
                {
                    let td = document.createElement("td")
                    td.appendChild(document.createTextNode("Profit"))
                    tr.appendChild(td)
                }
            }
            else
            {
                if(j==0)
                {
                    let td = document.createElement("td")
                    td.appendChild(document.createTextNode(cost))
                    tr.appendChild(td)
                }
                else
                {
                    let td = document.createElement("td")
                    td.appendChild(document.createTextNode(profit))
                    tr.appendChild(td)
                }
            }
        }
        tbdy.appendChild(tr)   
    }
    tbl.appendChild(tbdy)
    profitEl.appendChild(tbl)
}

