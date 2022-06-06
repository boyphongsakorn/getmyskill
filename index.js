const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//expressjs
/*const express = require('express');
const app = express();
const port = process.env.PORT || 3000;*/
const fs = require('fs');

//app.use(express.static('public'));

//app.get('/', async (req, res) => {
    fetch('https://api.github.com/users/boyphongsakorn/repos?per_page=100')
        .then(res => res.json())
        .then(async json => {
            let arrayl = [];
            let arraycount = [];
            let allofdep = [];
            //console all json[x].language
            for (let i = 0; i < json.length; i++) {
                //console.log(json[i].language);
                //add language to array
                if (json[i].language != null) {
                    arrayl.push(json[i].language);
                }

                //if (req.query.package == "true") {
                    await fetch('https://raw.githubusercontent.com/boyphongsakorn/' + json[i].name + '/' + json[i].default_branch + '/package.json')
                        .then(res => res.json())
                        .then(json => {
                            //console.log(json.dependencies);
                            //get name of dependencies
                            if (json.dependencies != null) {
                                for (let key in json.dependencies) {
                                    //console.log(key);
                                    //add name of dependencies to array
                                    allofdep.push(key);
                                }
                            }
                            //get name of devDependencies
                            if (json.devDependencies != null) {
                                for (let key in json.devDependencies) {
                                    //console.log(key);
                                    //add name of devDependencies to array
                                    allofdep.push(key);
                                }
                            }
                        })
                        .catch(err => {
                            //console.log(err);
                        })
                //}
            }
            //console.log(arrayl);
            //order arrayl
            arrayl.sort();
            //count duplicate language in arrayl and add to arraycount like language:count
            for (let i = 0; i < arrayl.length; i++) {
                let count = 0;
                for (let j = 0; j < arrayl.length; j++) {
                    if (arrayl[i] == arrayl[j]) {
                        count++;
                    }
                }
                //if arrayl[i] is not in arraycount.language, add it
                if (!arraycount.some(e => e.language == arrayl[i])) {

                    arraycount.push({
                        language: arrayl[i],
                        count: count
                    });
                }
            }
            //order arraycount by count
            arraycount.sort((a, b) => b.count - a.count);
            console.log(arraycount);
            let countprecent = [];
            //calculate precent of each language
            for (let i = 0; i < arraycount.length; i++) {
                let precent = (arraycount[i].count / json.length) * 100;
                //get 2 point of precent
                precent = precent.toFixed(2);
                countprecent.push({
                    language: arraycount[i].language,
                    precent: precent
                });
            }
            console.log(countprecent);
            //console.log(allofdep);
            let allofdepcount = [];
            //count duplicate name of dependencies in allofdep and add to allofdepcount like name:count
            for (let i = 0; i < allofdep.length; i++) {
                let count = 0;
                for (let j = 0; j < allofdep.length; j++) {
                    if (allofdep[i] == allofdep[j]) {
                        count++;
                    }
                }
                //if allofdep[i] is not in allofdepcount.name, add it
                if (!allofdepcount.some(e => e.name == allofdep[i])) {

                    allofdepcount.push({
                        name: allofdep[i],
                        count: count
                    });
                }
            }
            //order allofdepcount by count
            allofdepcount.sort((a, b) => b.count - a.count);
            console.log(allofdepcount);
            let countprecent2 = [];
            //calculate precent of each name of dependencies
            for (let i = 0; i < allofdepcount.length; i++) {
                let precent = (allofdepcount[i].count / allofdep.length) * 100;
                //get 2 point of precent
                precent = precent.toFixed(2);
                countprecent2.push({
                    name: allofdepcount[i].name,
                    precent: precent
                });
            }
            console.log(countprecent2);
            //if req.query.package is not null, return json of package.json of that package
            /*if (req.query.package != null) {
                if (req.query.precent == 'true') {
                    res.send(countprecent2);
                } else {
                    res.send(allofdepcount);
                }
            } else {
                if (req.query.precent == 'true') {
                    res.send(countprecent);
                } else {
                    res.send(arraycount);
                }
            }*/
            fs.writeFileSync('alldev.json', JSON.stringify(allofdepcount));
            fs.writeFileSync('alllang.json', JSON.stringify(arraycount));
            fs.writeFileSync('langprecent.json', JSON.stringify(countprecent));
            fs.writeFileSync('devprecent.json', JSON.stringify(countprecent2));
        })
/*});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});*/