
const http=require('http');
const conf=require('./config/defaultConfig');
const chalk =require('chalk');
const path=require('path')
const fs=require('fs');
const promisify=require('util').promisify;
const stat=promisify(fs.stat);
const readdir=promisify(fs.readdir);
const route=require('./helper/route')

const server=http.createServer((req,res)=>{
    const url=req.url;
    // console.log(url,conf.root);
    const filePath=path.join(conf.root,url);
    // console.log(filePath);
    route(req,res,filePath)
})

    // fs.stat(filePath,(err,stats)=>{
    //     if(err){
            // res.statusCode=404;
            // res.setHeader('Content-Type','text/html');
            // res.end(`${filePath} is not a dictionary  or a file`)
        // }

        // if(stats.isFile()){
        //     res.setCode=200;
        //     res.setHeader('Content-Type','text/plain');
        //     fs.createReadStream(filePath).pipe(res);
        // }else if(stats.isFile()){
          
        //     fs.readdir(filePath,(err,files)=>{
        //         res.setCode=200;
        //         res.setHeader('Content-Type','text/plain');
        //        res.end(files.join(','))
        //     })
        // }
    // })
//     res.statusCode=200;
//     res.setHeader('Content-Type','text/html');
//    res.end(filePath);
// })


server.listen(conf.port,conf.hostname,()=>{
    const addr=`http://${conf.hostname}:${conf.port}`;
    console.info(`Server started at ${chalk.green(addr)}`)
})