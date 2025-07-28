var lop = 10;
var slotMols = []
while (lop--) {
    var molCount = Math.floor(Math.random() * 6) + 5

    molCount += 5
    console.log(molCount)
    var curSlot = []
    while (molCount--) {
        var currentMol = {}
        currentMol.weight = Math.floor(Math.random() * 300) + 5;
        currentMol.quantity = Math.floor(Math.random() * 1000) + 5;
        curSlot.push(currentMol)
    }
    slotMols.push(curSlot)

}
console.log(JSON.stringify(slotMols))