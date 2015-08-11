/**
 * Created by limeng on 15-8-10.
 */

var database = require('./modules/database.m.js');
database = new database();

var rowInfo = {};

rowInfo.book_name = 'nodejs book';
rowInfo.author = 'danhuang';

/*
 database.insert('book', rowInfo, function (ret) {
 console.log(ret);
 });
 */

database.findOneById('book', {'book_id': 1}, function (ret) {
    console.log(ret);
});

var idJson = {'book_id': 2};
var newInfo = {};
newInfo.book_name = 'nodejs book-by danhuang';
newInfo.author = 'Jimi';

database.modify('book', idJson, newInfo, function (ret) {
    console.log(ret);
});

/*
 database.remove('book', {book_id: 3}, function (ret) {
 console.log(ret);
 });
 */

var whereJson = {
    'and': [
        {
            'key': 'book_id',
            'opts': '>', 'value': '1'
        },
        {
            'key': 'book_name',
            'opts': ' like ',
            'value': '"%node%"'
        }
    ],
    'or': []
}

database.find('book', whereJson, '', '', '', function (ret) {
    console.log(ret);
})