var fs = require('fs');

var dir = './public/js/';
var startGeneratedTextStr = '<!-- begin generated script tags -->\n';
var endGeneratedTextStr = '<!-- end generated script tags -->\n';
var jsDir = 'js/';


function compile() {


    var indexData = fs.readFileSync('./public/index.html', 'utf-8');
    indexData = prepareIndexData(indexData);

    var list = fs.readdirSync(dir);

    var jsFiles = [];
    var dirs = [];

    list.forEach(function (file) {
        if (file.indexOf('.js', file.length - 3) !== -1) {
            jsFiles.push(file);
        } else {
            var stat = fs.statSync(dir + '/' + file);
            if (stat && stat.isDirectory() && file !== 'vendor') {
                dirs.push(file);
            }
        }
    });

// insert vendor js files
    indexData = insertDirectory(indexData, dir + 'vendor');

// insert main app js files
    indexData = insertGroupName(indexData, 'main')
    jsFiles.forEach(function (file) {
        indexData = insertFileTag(indexData, jsDir + file);
    });

// insert the rest
    dirs.forEach(function (file) {
        indexData = insertDirectory(indexData, dir + file);
    });

    indexData = finishIndexData(indexData);

    fs.writeFileSync('./public/index.html', indexData, 'utf-8');

    console.log('angular dependencies complied into index.html');
}



function insertDirectory(data, dir){
    var list = fs.readdirSync(dir);

    list.sort();

    var parts = dir.split('/');
    if (parts.length <= 0) return;

    var groupName = parts[parts.length - 1];
    if (groupName){
        data = insertGroupName(data, groupName);
    }

    for (var i = 0; i < list.length; ++i){
        data = insertFileTag(data, jsDir + groupName + '/' + list[i]);
    }
    return data;
}


function insertGroupName(data, groupName){
    var index = data.indexOf(endGeneratedTextStr);
    if (index === -1) return;
    var str = '\n\t<!-- ' + groupName + ' -->\n';
    data = insertStr(data, index, str);
    return data;
}


function insertFileTag(data, fileName){
    var index = data.indexOf(endGeneratedTextStr);
    if (index === -1) return;

    data = insertStr(data, index, '\t<script type="text/javascript" src="' + fileName +'" ></script>\n');
    return data;
}


function prepareIndexData(data){
    // if no generated tags exists, add them
    if (data.indexOf(endGeneratedTextStr) === -1){
        data = insertStr(data, data.indexOf('</body>'), endGeneratedTextStr);
    }
    if (data.indexOf(startGeneratedTextStr) === -1){
        data = insertStr(data, data.indexOf(endGeneratedTextStr), startGeneratedTextStr);
    }

    // clear out anything in between the two tags
    var start = data.indexOf(startGeneratedTextStr) + startGeneratedTextStr.length;
    var end = data.indexOf(endGeneratedTextStr);
    if (start !== end){
        data = data.slice(0, start) + data.slice(end, data.length);
    }
    return data;
}

function finishIndexData(data){
    var index = data.indexOf(endGeneratedTextStr);
    if (index === -1) return;

    data = insertStr(data, index, '\n');
    return data;
}


// insert a string at an index
function insertStr(parentStr, index, childString) {
    if (index > 0)
        return parentStr.substring(0, index) + childString + parentStr.substring(index, parentStr.length);
    else
        return childString + parentStr;
};


// Export module
exports.compile = compile;