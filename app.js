const express = require("express"),
      app = express(),
      fs = require("fs"),
      multer = require("multer"),
      router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // '/files' это директория в которую будут сохранятся файлы 
    cb(null, 'img/')
  },
  filename: (req, file, cb) => {
// Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
    const { originalname } = file
    cb(null, originalname)
  }
})

const upload = multer({ storage: storage })

// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

app.use(allowCrossDomain);

// отправка всех фото клиенту
router.get('/get_photo', function(req, res) {
    var images = [];

    fs.readdir(__dirname + '/img/', function(err, items) { 
        for (var i=0; i<items.length; i++) {
            images.push(__dirname + '/img/' + items[i]);
        }

        var JSONstr = JSON.stringify(images);
        res.send(JSONstr);
    });
});

// получение фото от клиента
router.post('/', upload.single('postImg'), function(req, res, next) { // , upload.array('postImg', 12)
    const files = req.file;
    // const body = req.body;
     
    console.log(files);
    // console.log(body);
    // console.log('status: saved');
    // res.json({status: 'Saved'});
    // res.redirect(200, "/");
    // res.sendfile('http://localhost:3000/');
    // res.redirect('back');
});

app.use(router);

let port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`server listening at http://localhost:${port}`)
);