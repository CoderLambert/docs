const fs = require('fs')
const path = require('path')
const os = require('os')
const { dir } = require('console')
const currentPath = './'

function removeFromArray(arr, ele) {


    const isArray = Array.isArray(ele)
    if (isArray) {
        for (let i = ele.length - 1; i > 0; i--) {
            const index = arr.indexOf(ele[i])
            if (index > -1) {
                arr.splice(index, 1)
            }
        }
    } else {
        const index = arr.indexOf(ele)
        if (index > -1) {
            arr.splice(index, 1)
        }
    }

}

function isDirectory(FilePath) {
    return fs.lstatSync(FilePath).isDirectory()
}

function isFile(FilePath) {
    return fs.lstatSync(FilePath).isFile()
}

function readDirs(FilePath) {
    return fs.readdirSync(FilePath)
}

function walkDirs(FilePath, deepLevel = 0) {
    const files = []
    const dirs = []
    const allFiles = readDirs(FilePath)
    allFiles.forEach((file) => {
        const fullFilePath = path.join(FilePath, file)
        if (isFile(fullFilePath)) {
            if (file.endsWith('.md')) {
                files.push(fullFilePath)
            }
        } else if (isDirectory(fullFilePath)) {
            if (!file.startsWith('.')) {
                const subFiles = walkDirs(fullFilePath, deepLevel++)
                if (subFiles.dirs.length || subFiles.files.length) {
                    dirs.push(subFiles)
                }
            }
        }
    })

    return {
        title: FilePath,
        dirs,
        files,
        deepLevel
    }
}

function writeSideBarMd(source, maxDeepLevel) {
    if (source.hasOwnProperty('maxDeepLevel')) {
        const dirs = source.dirs
        const deepLevel = maxDeepLevel - source.deepLevel
        let text = ''
        dirs.forEach((catogories) => {
            const title = `${' '.repeat(deepLevel)}- ${catogories.title}\n`
            let toc = ''
            catogories.files.forEach((subTitle) => {
                const name = subTitle.split('/')[1]
                toc += `${' '.repeat(deepLevel + 2)}- [${name.split('.')[0]}](${subTitle})\n`
            })
            console.log(title);
            console.log(toc);
            text = text + title + toc
        })
        return text
    }
}
let res = walkDirs(currentPath)
res.maxDeepLevel = res.deepLevel
const sideBarText = writeSideBarMd(res, res.maxDeepLevel)
try {
    const data = fs.writeFileSync('_sidebar.md', sideBarText)
    console.log("重置侧边栏成功");
} catch (err) {
    console.log(err);
}

// console.log(JSON.stringify(res, "", 2));

// console.log(dirs);
// console.log(files);