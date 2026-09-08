const startButton = document.getElementById("startButton")
const materialEl = document.getElementById("material")
const tierEl = document.getElementById("tier")
const levelEl = document.getElementById("level")
const weightEl = document.getElementById("weight")
const capitalEl = document.getElementById("capital")
let calculateByCapital = false
const sheet = document.getElementById("sheet")
const profitEl = document.getElementById("profit")
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
    let material = materialEl.value
    let tier = tierEl.value
    let level = levelEl.value


    if(document.getElementById("max_capital").checked)
    {
        calculateByCapital = true
        capitalOrWeight = capitalEl.value
    }
    else
    {
        calculateByCapital = false
        capitalOrWeight = weightEl.value
    }
    
    
    calculationSheet(material, tier, level, calculateByCapital, capitalOrWeight)
}
    

startButton.addEventListener("click", () => start())

function calculationSheet(material, tier, level, calculateByCapital, capitalOrWeight)
{
    // material is only for visuals (it doesn't affect calculations, just prices in the future with API)
    // level only affects price with API
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
    sheet.innerHTML = ""
    sheet.appendChild(tbl)
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

function profit()
{
    let tier = tierEl.value
    let max_weight = (weightEl.value-10) /0.7
    let divider = 0
    let R = 1 - 0.367
    for (let i = tier; i > 1; i--)
    { 
        divider += AlbionMaterials[i].raw * AlbionMaterials[i].weight * Math.pow(R, tier - i)
    }
    let how_many = max_weight/divider
    for (let i = tier; i > 1; i--)
    {
        let this_many = Math.ceil(how_many * AlbionMaterials[i].raw * Math.pow(R, tier - i))
        document.getElementById(`t${i}_quantity`).textContent = this_many
    }

    let cost = 0, price, quantity
    for (let i = tier; i > 1; i--)
    {
        price = document.getElementById(`t${i}_price`).value
        quantity = document.getElementById(`t${i}_quantity`).textContent
        cost += price * quantity
    }
    cost = Math.ceil(cost * 1.025)
    let profit = Math.ceil((document.getElementById("sell_value").value * how_many * 0.935 / (1-0.367)) - cost)
    // note to add the refining cost, but need to do research for that 
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

