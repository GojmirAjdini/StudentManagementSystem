
function random(){
let rez;
let max = 10000;
let min = 1000;

for(let i = 0;i < 5; i++){
    return Math.floor(min + Math.random() * (max - min + 1));
}
}

console.log(random());