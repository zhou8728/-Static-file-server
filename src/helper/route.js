const fs=require('fs');
const promisify=require('util').promisify;
const stat=promisify(fs.stat);
const readdir=promisify(fs.readdir);
const Handlebars=require('handlebars');
const path=require('path');
const config=require('../config/defaultConfig')
const mime=require('./mime')
const compress=require('./compress')

const tplPath=path.join(__dirname,'../template/dir.tpl')
// const tplPath='..\template\dir.tpl';

const source=fs.readFileSync(tplPath);

const template=Handlebars.compile(source.toString());
console.log(template);

module.exports=async function (req,res,filePath){
    try{
        const stats=await stat(filePath);
        // console.log(stats)
        if(stats.isFile()){
            const contentType=mime(filePath);
            res.statusCode=200;
            res.setHeader('Content-Type',contentType);
            let rs=fs.createReadStream(filePath);
            if(filePath.match(config.compress)){
                rs=compress(rs,req,res);
                // console.log(rs);
            }
            // fs.createReadStream(filePath).pipe(res);
           rs.pipe(res)
        }else if(stats.isDirectory()){
                const files=await readdir(filePath)
                // fs.readdir(filePath,(err,files)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','text/html');
                console.log(config.root,filePath);
                const dir=path.relative(config.root,filePath);
                const data={
                   title:path.basename(filePath),
                   dir:dir?`/${dir}`:'',
                    // dir:`/${dir}`,
                   files:files.map(files=>{
                       return {
                           files
                        //    icon:mime(files)
                       }
                   })
                    // files
                   
                }
                console.log(data);
                res.end(template(data));
                // res.end(files.join(','))
            // })
        }
    } catch(ex){
        console.error(ex);
        res.statusCode=404;
        res.setHeader('Content-Type','text/html');
        res.end(`${filePath} is not a dictionary  or a file\n ${ex.toString()}`)
    }
}
