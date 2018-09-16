var list =  []

function getIdx(sn) {
    for(var i =0; i < list.length; i++) {
        if(sn == list[i].SN) {
            return i
        }
    }
    return list.length
}

function del(data) {
   var idx = getIdx(data.SN);
   list.splice(idx, 1);
   return
}

function add(data) {
    if(list.length > 0) {
        var idx = getIdx(data.SN)
        if(idx < list.length) {
            change(idx, data)
            return
        }
    }
    list.push(data)
    return
}
function change(data) {
    var idx = getIdx(data.SN)
    for (var key in  data) {  
        list[idx][key] = data[key]
    }
    return
}
function has(SN){
    if(list.length > 0)
    {
        var idx = getIdx(SN);
        if(idx < list.length){
            return 1;
        }
    }   
    return 0 
}
function getdev(SN){
    if(list.length > 0)
    {
        var idx = getIdx(SN);
        if(idx < list.length){
            return list[idx]
        }
    } 
    return null
}

function getlist(){
    return list
}


module.exports.getlist = getlist 
module.exports.getdev = getdev
module.exports.del = del 
module.exports.change = change 
module.exports.add = add 




