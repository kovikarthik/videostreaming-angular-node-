const express = require('express')
const router = express.Router()
const videos = require('../mockData')
const fs = require('fs')
// const axios = require('axios');
const superagent = require('superagent')
const https = require('https')
const database = require("../database/db")
const axios = require('axios')
const got = require('got');
const { gotScraping } = require('got-scraping');
// const { getVideoDurationInSeconds } = require('get-video-duration');
// import {file_size_url} from file_size_url


// get list of video
router.get('/', (req, res) => {
    res.json(videos)
})

// make request for a particular video
// router.get('/:id/data', (req, res) => {
//     const id = parseInt(req.params.id, 10)
//     console.log("id", id)
//     res.json(videos[id])
// })

//streaming route



router.get('/video/:id', async (req, res) => {
    // console.log("req.header", await req.headers)
    var posts = database.data[Math.floor(Math.random() * database.data.length)];
    console.log(posts, "posts")
    // posts.url="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
    const videoPath = posts.url;
    var res1;
    await (async () => {
        try {
            console.log("hello");
            await gotScraping.get(posts.url).then(a => {
                // console.log(a,"a");
                res1 = a
            });
            console.log(res1.headers['content-length']);
        } catch (err) {
            console.log(err.message); //can be console.error
        }
    })();
    console.log("videoPath----->", videoPath);
    const fileSize = await res1.headers['content-length'];
    const videoRange = await req.headers['range'];
    console.log("videoRange------->", videoRange)
    if (videoRange) {
        const chunksize = 10 ** 6;//1mb
        const start = Number(videoRange.replace(/\D/g, ""))
        const end = Math.min(start + chunksize, fileSize - 1)
        const contentlength = (end - start) + 1;
        console.log(contentlength, "contentlength", end, start)
        const head = await {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentlength,
            'Content-Type': 'video/mp4',
        };
        console.log("head")
        console.log(head, "head")
        await res.writeHead(206, head);
        // const file = await https.get(videoPath, { start, end });
        // console.log(file, "file")
        const stream = await got.stream(videoPath, { start, end })
        stream.pipe(res)
        // file.pipe(res)
    }
    else {
        console.log("elseeeeeeeeeeeeeeeeeeeeeeee")
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        https.get(videoPath, (stream) => {
            stream.pipe(res);
        });

    }
});


router.get('/video14-05-2022night/:id', async (req, res) => {
    // console.log("req.header", await req.headers)
    var posts = database.data[0];
    // var posts = database.data[Math.floor(Math.random() * database.data.length)];
    console.log(posts, "posts")
    // posts.url="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
    const videoPath = posts.url;
    var res1;
    await (async () => {
        try {
            console.log("hello");
            // await superagent.get(posts.url).then(a => {
            await got.get(posts.url).then(a => {
                // console.log(a,"a");
                res1 = a
            });
            console.log(res1.headers['content-length']);
        } catch (err) {
            console.log(err.message); //can be console.error
        }
    })();
    console.log("videoPath----->", videoPath);
    const fileSize = await res1.headers['content-length'];
    const videoRange = await req.headers['range'];
    console.log("videoRange------->", videoRange)
    const chunksize = 10 ** 6;//1mb
    const start = Number(videoRange.replace(/\D/g, ""))
    const end = Math.min(start + chunksize, fileSize - 1)
    const contentlength = (end - start) + 1;
    console.log(contentlength, "contentlength", end, start)
    const head = await {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentlength,
        'Content-Type': 'video/mp4',
    };
    console.log("head")
    console.log(head, "head")
    await res.writeHead(206, head);
    // const file = await https.get(videoPath, { start, end });
    // console.log(file, "file")
    got.stream(videoPath, { start, end })
        .pipe(res)
        .on('close', function () {
            console.log('File written!');
        });
    // file.pipe(res)
});

router.get('/video3/:id', (req, res) => {
    var fileUrl = 'https://firebasestorage.googleapis.com/v0/b/streaming-2dc2c.appspot.com/o/Video%20files%2FDemo%20video.mp4?alt=media&token=ded0e22f-4606-4daf-a567-ce2e87ba4432';
    var range = req.headers.range;
    var positions, start, end, total, chunksize;
    // request({
    //     url: fileUrl,
    //     method: 'HEAD'
    // }, (error, response, body) => {
    //     setResponseHeaders(response.headers);
    //     pipeToResponse();
    // });

    function setResponseHeaders(headers) {
        positions = range.replace(/bytes=/, "").split("-");
        start = parseInt(positions[0], 10);
        total = headers['content-length'];
        end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });
    }

    function pipeToResponse() {
        var options = {
            url: fileUrl,
            headers: {
                range: "bytes=" + start + "-" + end,
                connection: 'keep-alive'
            }
        };

        // request(options).pipe(res);
    }
})

router.get('/video4/:id', async (req, res) => {
    console.log("req.header", await req.headers)
    // let posts=0;
    // data.forEach((d,i)=>{
    //     if(req.params.id==d.post_id)
    //     {
    //         posts=d.url;
    //     }
    // })
    // console.log(posts)
    var posts = database.data[Math.floor(Math.random() * database.data.length)];
    const videoPath = posts.url;
    // getVideoDurationInSeconds(videoPath).then((duration) => {
    //     console.log(duration)
    // })
    var res1;
    console.log(videoPath, "videoPath")
    res1 = await axios.options(videoPath);
    // console.log(res1,"res1")
    console.log("videoPath----->", videoPath);
    const fileSize = await res1.headers['content-length'];
    const videoRange = await req.headers['range'];
    console.log("videoRange------->", videoRange)
    // var head = {
    //     'Content-Length': fileSize,
    //     'Content-Type': 'video/mp4',
    // };
    if (videoRange != 'bytes=0-') {
        const parts = videoRange.replace(/bytes=/, "").split("-");
        console.log(parts, "parts")
        const chunksize = 10 ** 6;//1mb
        const start = parseInt(videoRange.replace(/\D/g, ""))
        const end = Math.min(start + chunksize, fileSize - 1)
        // const start = parseInt(parts[0], 10);
        // const end = parts[1]
        //     ? parseInt(parts[1], 10)
        //     : fileSize-1;
        const contentlength = (end - start) + 1;
        console.log(contentlength, "contentlength", end, start)
        const file = await https.get(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentlength,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res)
        // temp=1
    }
    else {
        console.log("elssssssssssssss")
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        https.get(videoPath, (stream) => {
            stream.pipe(res);
        });
    }

    // if(videoRange!="bytes=0-"){

    // }
    // else{

    // }
});

router.get('/video2/:id', async (req, res) => {
    var posts = database.data[Math.floor(Math.random() * database.data.length)];
    // url="https://firebasestorage.googleapis.com/v0/b/streaming-2dc2c.appspot.com/o/Video%20files%2FDemo%20video.mp4?alt=media&token=ded0e22f-4606-4daf-a567-ce2e87ba4432"
    // url='https://firebasestorage.googleapis.com/v0/b/streaming-2dc2c.appspot.com/o/Video%20files%2Fbandicam%202022-05-07%2019-11-48-017.mp4?alt=media&token=9862e32b-3ecc-4f32-ab13-bd0349594b6d'
    // url='https://firebasestorage.googleapis.com/v0/b/streaming-2dc2c.appspot.com/o/Video%20files%2FStreamVideo.mp4?alt=media&token=89231bf1-14ad-416f-af99-caed4ef3a83a'
    const videoPath = posts.url;
    var res1;
    await (async () => {
        try {
            console.log("hello");
            res1 = await superagent.get(posts.url);
            console.log(res1.headers['content-length']);
            //   const headerDate = res1.headers && res1.headers.date ? res1.headers.date : 'no response date';
            //   console.log('Status Code:', res1.statusCode);
            //   console.log('Date in Response header:', headerDate);
        } catch (err) {
            console.log(err.message); //can be console.error
        }
    })();
    console.log("videoPath");
    const fileSize = res1.headers['content-length'];
    const videoRange = req.headers.range;
    console.log("videoRange")
    if (videoRange) {
        console.log("if condition")
        const parts = videoRange.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = https.get(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        https.get(videoPath, (stream) => {
            file.pipe(res);
        });
    }
    else if (!videoRange) {
        console.log("else if")
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        https.get(videoPath, (stream) => {
            stream.pipe(res);
        });
    }
});

// router.get('/video/:id', async (req, res) => {
//     console.log("helooooooooooooooooooooooooooooooooooooo")
//     var posts = data[Math.floor(Math.random() * data.length)];
//     let respo = await fetch(posts.url).then(res=>{
//         console.log(res,"respo.json()")
//     }).catch(e=>{console.log("error")})
//     // request({
//     //     url: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/core.js",
//     //     method: "HEAD"
//     // }, function (err, response, body) {
//     //     console.log(response.headers);
//     //     process.exit(0);
//     // });
//     console.log(req.params.id, "req.params.id")
//     const videoPath = `assets/${req.params.id}.mp4`;

//     console.log("karthik")

//     // await urlMetadata('https://firebasestorage.googleapis.com/v0/b/streaming-2dc2c.appspot.com/o/Video%20files%2FDemo%20video.mp4?alt=media&token=ded0e22f-4606-4daf-a567-ce2e87ba4432').then(
//     //     function (metadata) { // success handler
//     //         console.log(metadata, "metadata")
//     //     },
//     //     function (error) { // failure handler
//     //         console.log(error)
//     //     })
//     console.log("karthik11111")
//     const videoStat = fs.statSync(videoPath);
//     // console.log(videoStat, "videoStat")
//     const fileSize = videoStat.size;
//     // const fileSize = req.headers['content-length'];
//     console.log(fileSize, "fileSize")
//     const videoRange = req.headers.range;
//     if (videoRange) {
//         const parts = videoRange.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1]
//             ? parseInt(parts[1], 10)
//             : fileSize - 1;
//         // end = parts[1] ? parseInt(parts[1], 10) : total - 1;
//         const chunksize = (end - start) + 1;
//         const file = fs.createReadStream(videoPath, { start, end });
//         const head = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp4',
//         };
//         res.writeHead(206, head);
//         file.pipe(res);
//     } else {
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp4',
//         };
//         res.writeHead(200, head);
//         fs.createReadStream(videoPath).pipe(res);
//     }
// });

// captions route
const captionPath = '../backend'
router.get('/video/:id/caption', (req, res) => { console.log(`assets/captions/${req.params.id}.vtt`); res.sendFile(`assets/captions/${req.params.id}.vtt`, { root: captionPath }) });
module.exports = router;