const usersUrl = 'http://localhost:3000/users';
const treesUrl = 'http://localhost:3000/trees';
let user = "";
let username = "";

function fetchUser(username) {
    return fetch(usersUrl, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            Accept: "application/json"
        },
        body: JSON.stringify({ username })
    })
    .then(resp => resp.json())
    .then(json => {
        user = json;
    });
};

function waterMsg(water) {
    const div = document.getElementById('msg');
    div.style.display = "";
    if ( water < 16) {
        div.textContent = (`You have watered ${water} times.`);
    } else if (water < 20 ) {
        div.textContent = (`Watering is not needed anymore.`);
    } else {
        div.textContent = (`New seed awaits you.`);
    }
    ;
    setTimeout(() => { 
        div.style.display = "none";
     }, 7000)
};

document.addEventListener("DOMContentLoaded", () => {

    const eLogin = document.getElementById('login');
    const eMain = document.getElementById('main');
    const eSeedChoices = document.getElementById('seed-choices');
    const eMyTreeList = document.getElementById('my-tree-list');
    const eGrowTree = document.getElementById('grow-tree');
    const eMenubar = document.getElementById('menu-bar');
    const eTreeDiv = document.getElementById('tree');
    const logout = document.getElementById('logout');

    login.addEventListener('submit', (e) => loginUser(e));

    function loginUser(e) {
        e.preventDefault();
        username = e.target[0].value;
        fetchUser(username).then(renderSeedDisplay);
        eLogin.reset();
    };

    function renderSeedDisplay(){
        eLogin.style.display = 'none';
        eMain.style.display = 'block';
        eSeedChoices.style.display = 'block';
        eGrowTree.style.display = 'none';
        renderSeedImgs();
        renderTreeList();
    }

    function renderSeedImgs() {
        const list = ["Orange", "Lemon", "Evergreen"];
        eSeedChoices.innerText = "";
        for (seed of list) {
            const img = document.createElement("img");
            eSeedChoices.appendChild(img);
            if (seed === "Orange") {
                img.src = '../tree-api/treeimg/orange_seed.png';
            } else if (seed === "Lemon"){
                img.src = '../tree-api/treeimg/trans_seed.png'; 
            } else {
                img.src = '../tree-api/treeimg/pine.png';
            }
            img.id = seed;
            img.alt = seed;
            img.class = "seeds";
            img.style.width = "150px";
            img.style.margin = '30px';
            img.addEventListener('click', (e) => newTree(e));
        };
        // renderSeedNameInput();
    };

    function renderSeedNameInput() {
        const form = document.createElement('form');
        form.className = 'seed-name';
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'seed-name';
        const submit = document.createElement('input');
        submit.type = 'submit';
        submit.value = 'Name Your Seed'
        submit.className = 'seed-name';

        eSeedChoices.appendChild(form);
        form.appendChild(input);
        form.appendChild(submit);
    }

    function newTree(e) {
        const user_id = user.id;
        const tree_type = e.target.id;
        
        fetch(treesUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({ tree_type, user_id })
        })
        .then(resp => resp.json())
        .then(jsonTree => {
            eSeedChoices.style.display = "none";
            fetchUser(username)
            .then(() => renderTreeList())
            .then(openGrowTree(jsonTree));
        });
    }

    function renderTreeList() {
        eMyTreeList.innerText = "";
        for (tree of user.trees){
            const thisTree = tree;
            const div =document.createElement("div");
            eMyTreeList.appendChild(div);
            div.innerText = "Tree #" + tree.id; 
            div.addEventListener('click', () => {
                eSeedChoices.style.display = "none";
                openGrowTree(thisTree);
            });
        };
    };

    function openGrowTree(tree){
        eGrowTree.style.display = 'block';
        renderTree(tree);
        renderMenu(tree);
    };

    function renderTree(tree) {
        eTreeDiv.innerText = "";
        const img = document.createElement("img");
        eTreeDiv.appendChild(img);
        if (tree.water <= 5){
            img.src = "../tree-api/treeimg/trans_water0-10.png";
        } else if (tree.water <= 10){
            img.src = "../tree-api/treeimg/trans_water11-20.png";
            img.style.width = "400px";
        } else if (tree.water <= 15) {
            if (tree.tree_type === "Evergreen") {
                img.src = "../tree-api/treeimg/trans_evergreen_young.png"
                img.style.width = "800px";
            } else {
                img.src = "../tree-api/treeimg/trans_tree.png";
                img.style.width = "800px";
            }
        } else {
            if (tree.tree_type === "Lemon") {
                img.src = "../tree-api/treeimg/trans_lemon.png";
                img.style.width = "1000px";
            } else if (tree.tree_type === "Orange") {
                img.src = "../tree-api/treeimg/trans_orange.png";
                img.style.width = "1000px";
            } else {
                img.src = "../tree-api/treeimg/trans_evergreen_pines.png";
                img.style.width = "1000px";
            };
        };
    };

    function renderMenu(tree) {
        eMenubar.innerText = "";

        const water = MenuHelper('../tree-api/treeimg/trans_watering_can.png', 'water', 'watering can', 'water');
        water.addEventListener('click', () => updateWater(tree));

        const newSeed = MenuHelper('../tree-api/treeimg/trans_seeds.png', 'new-seed', 'new-seed', 'plant new seed');
        newSeed.addEventListener('click', () => renderSeedDisplay());

        const uproot = MenuHelper('../tree-api/treeimg/trans_shovel.png', 'shovel-delete', 'delete', 'uproot the tree');
        uproot.addEventListener('click', () => uprootTree(tree));
    }

    function MenuHelper(src, alt, id, text) {
        const container = document.createElement('div');
        container.className = 'container';
        eMenubar.appendChild(container);
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.id = id;
        img.className = "menu-item";
        container.appendChild(img);
        const div = document.createElement('div');
        div.className = 'overlay';
        container.appendChild(div);
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        div.appendChild(textDiv);
        textDiv.innerText = text;
        
        return img;
    }

    function updateWater(tree) {
        let water = tree.water;
        
        if (tree.water <= 20) {
            const id = tree.id;
            water = water + 1;
            fetch(treesUrl + '/' + tree.id, {
                method:"PATCH",
                headers: {
                    "Content-Type": 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ water, id })
            })
            .then((e)=> e.json())
            .then((jsonTree => {
                openGrowTree(jsonTree);
                fetchUser(username)
                .then(() => {
                    waterMsg(jsonTree.water);
                    renderTreeList();
                });
            }));
        } else {
            waterMsg(water);
        }
    };

    function uprootTree(tree) {
        fetch(treesUrl + '/' + tree.id, {
            method:"DELETE",
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            }
        })
        .then(() => fetchUser(username))
        .then(() => renderSeedDisplay());
        
    };

    logout.addEventListener('click', () => {
        username = "";
        user = "";
        eLogin.style.display = '';
        eMain.style.display = 'none';
    })


});

