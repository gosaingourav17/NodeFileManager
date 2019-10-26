const express = require('express');
const router = express.Router();
var fs = require('fs');
var rimraf = require("rimraf");

//update
router.post('/update', function (req, res) {
    const tochange = __dirname + '/files/' + req.body.curdirect + '/';
    console.log(req.body.curdirect)
    //check if old file doesn't exist
    fs.access(tochange + req.body.prev, fs.F_OK, (err) => {
        if (err) {
            //if it exists
            res.status(400).send('file to be renamed does not exist.')
            return;
        }
    });

    //check if new file already does not exist
    fs.access(tochange + req.body.final, fs.F_OK, (err) => {
        if (!err) {
            //if it exists
            res.status(400).send('new file already exists.')
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
router.get('/read/:subdir(*)', (req, res, next) => {
    if (req.params.subdir.length > 0) {
        var testFolder = __dirname + '/files/' + req.params.subdir + '/';
    }
    else {
        var testFolder = __dirname + '/files/';
    }


    fs.readdir(testFolder, (err, files) => {
        if (err) { res.status(400).send(err); }
        else {
            //folder array
            var frr = [];
            //directory array
            var drr = [];
            files.forEach(file => {
                if (fs.lstatSync(testFolder + file).isFile()) { frr.push(file); }
                else { drr.push(file); }
            }
            );
            res.status(200).json({

                fil: frr,
                directory: drr
            });
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
        var uploadpath = __dirname + '/files/' + req.body.curdirect + '/' + name;
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
router.post('/newfolder', function (req, res) {


    var dir = __dirname + '/files/' + req.body.curdirect + '/' + req.body.newfoldername;
    console.log(req.body.curdirect)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        res.redirect('http://localhost:3000');
    }
    else {
        res.send('Folder of this name already exists')
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