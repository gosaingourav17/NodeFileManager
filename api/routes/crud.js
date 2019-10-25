const express = require('express');
const router = express.Router();
var fs = require('fs');
var rimraf = require("rimraf");

//update
router.post('/update', function (req, res) {
    const tochange = __dirname + '/files/';
    //check if new file already does not exist
    fs.access(tochange + req.body.final, fs.F_OK, (err) => {
        if (!err) {
            //if it exists
            res.status(400).send('file already exists.')
            return;
        }
        else {
            fs.rename(tochange + req.body.prev, tochange + req.body.final, function (err) {
                if (err) console.log(err);
                else {
                    res.redirect('http://localhost:3000');
                }
            })
        }
    });

})
//..update

//read
router.get('/read', (req, res, next) => {
    const testFolder = __dirname + '/files/';

    fs.readdir(testFolder, (err, files) => {
        if (err) { res.status(400).send(err); }
        else {
            var arr = [];
            files.forEach(file => {
                arr.push(file);
            }
            );
            res.status(200).send(arr);
        }

    });


});
//..read

//file upload
router.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    else {

        var file = req.files.upfile,
            name = file.name,
            type = file.mimetype;
        var uploadpath = __dirname + '/files/' + name;
        file.mv(uploadpath, function (err) {
            if (err) {
                res.send("Error Occured!")
            }
            else {
                res.redirect('http://localhost:3000');
            }

        });

    }
})
//..file upload

//new folder
router.get('/newfolder', function (req, res) {


    var dir = __dirname + '/files/new_folder';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        res.status(200).send('newfolder made');
    }
    else {
        if (!fs.existsSync(dir + '2')) {
            fs.mkdirSync(dir + '2');
            res.status(200).send('newfolder2 made');
        }
        else { res.status(200).send('rename newfolder2 first'); }
    }


})
//...new folder

//delete
router.post('/delete', (req, res, next) => {
    var dir = __dirname + '/files/' + req.body.filetodelete;
    rimraf(dir, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.redirect('http://localhost:3000');

        }
    });




});
//..delete

//download

router.get('/download/:file(*)', (req, res) => {
    var file = req.params.file;

    var fileLocation = __dirname + '/files/' + file;

    res.download(fileLocation, file);
});




//..download

module.exports = router;