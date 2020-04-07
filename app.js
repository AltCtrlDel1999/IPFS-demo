const ipfsClient = require('ipfs-http-client');
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs');

const ipfs = new ipfsClient({host:'localhost', port:'5001', protocol:'http'});
const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

app.get('/',(req,res) => {
  res.render('home');
});

app.post('/upload', (req,res) =>{
  const file = req.files.file;
  const fileName = req.body.fileName;
  const filePath = 'files/' + fileName;

  file.mv(filePath, async (err) => {
    if(err){
      console.log('Error: Failed to download the file');
      return res.status(500),send(err);
    }

    const fileHash = await addFile(fileName, filePath);
    console.log(fileHash);
    fs.unlink(filePath,(err) =>{
      if(err)
        console.log(err);
    });

    res.render('upload',{fileName, fileHash});
  });
});

/*const addFile = async (fileName,filePath) =>{
  const file = fs.readFileSync(filePath);
  const fileAdded = await ipfs.add({path: fileName, content: file});

  const fileHash = fileAdded[0].hash;
  console.log(fileAdded);

  return fileHash;
}*/
const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    let results = [];
    for await (const result of ipfs.add({path: fileName, content: file})) {
        results.push(result);
    }
    console.log(results[0].cid);
    return results[0].cid;
};



app.listen(3000, ()=>{
  console.log("The IPFS server is started");
});
