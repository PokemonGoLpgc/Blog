
var pokedex;

//Internal
 * Created by alberto on 3/12/16.

function createCandyStatus(){
    candyList = new Map();
    pokedex.pokemon.forEach(function(pokemon){
        if(pokemon.prev_evolution == undefined) {
            candyList.set(pokemon.candy, {
                shortName: pokemon.name,
                evolution: pokemon.next_evolution != undefined,
                amount: 0
            });
        }
    });
    return candyList;
}

function createPokemonStatus(){
    pokemonList = new Map();
    pokedex.pokemon.forEach(function(pokemon){
        pokemonList.set(pokemon.name, {
            amount: 0
        });
    });
    return pokemonList;
}

//GUI

function fillCandyTable(candies){
    candies.forEach(function(candy, candyName) {
        var candyClass = (candy.evolution)? "" : " noEvolution ";
        candyClass += (candy.name == "None")? " noCandy " : "";

        var row = $('<tr>',{
            class: candyClass,
            title: candy.name
        });
        if(!candy.evolution || candy.name == "None")
            row.addClass("collapse out" );
        else
            row.addClass("collapse in" );

        var name = $("<td>").append(candyName);
        row.append(name);

        var amount = $("<td>").append(
            $("<input>", {
                class: "form-control",
                type:"number",
                min: 0,
                value: parseInt(candy.amount)
            })
        );
        row.append(amount);

        $("#candyTable tbody").append(row)

    })

}


function loadCandy(){
    var candies = createCandyStatus();
    fillCandyTable(candies);
    $("#candyTable tr").not('thead tr').each(function(){
        this.children[1].children[0].value = parseInt(Math.random()*25);
    });
    updateCandyGraph(saveCandyFromTable())
}

function toggleCandyClass(candyClass, hide){
    if(hide) {
        $("."+candyClass).addClass("in");
        $("."+candyClass).removeClass("out");
    } else {
        $("."+candyClass).addClass("out");
        $("."+candyClass).removeClass("in");
    }
}

function saveCandyFromTable(){
    var tableContent = $("#candyTable tr").not('thead tr');
    var saved = new Map();
    for(var i = 0; i < tableContent.length; i++){
        var shortName = tableContent[i].children[0].textContent;
        var name = tableContent[i].title;
        var amount = tableContent[i].children[1].children[0].value;
        var evolution = tableContent[i].className.indexOf("noEvolution") == -1;
        saved.set(shortName, {
            name: name,
            evolution: evolution,
            amount: parseInt(amount)
        });
    }

    return saved;
}

function fillPokemonTable(pokemonList, evolutions){
    pokemonList.forEach(function(pokemon, pokemonName) {
        var row = $('<tr>',{
        });

        var name = $('<td>').append(pokemonName);
        row.append(name);
        var amount = $('<td>').append($('<input>',{
            value:pokemon.amount,
            type: "number",
            class: "form-control",
            min: 0
        }));
        row.append(amount);
        var evolutions = $('<td>').append($('<input>',{
            value:0,
            type:"number",
            class: "form-control",
            min: 0
        }));
        row.append(evolutions);
        $("#candyTable tbody").append(row);
    });
}

function updateCandyGraph(candies){
    console.log(candies.size);
    var graph = new Array();
    candies.forEach(function (item, key) {
        graph.push({'name':key, 'y': item.amount});
    });

    Morris.Bar({
        element: 'candyGraph',
        data: graph,
        xkey: 'name',
        ykeys: 'y',
        labels: ['Cantidad']
    });
}


function pokemon(){
    var menu = document.querySelector('#tipWell');
    var menuPosition = menu.getBoundingClientRect();

    window.addEventListener('scroll', function() {
        if (window.pageYOffset >= menuPosition.top)
            menu.style.marginTop = (window.pageYOffset - menuPosition.top) +"px";
        else
            menu.style.marginTop = "0px";
    });
    Stickyfill.init();
    Stickyfill.add(document.getElementById("tipWell"));
    fillPokemonTable(createPokemonStatus(),0);
}