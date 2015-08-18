/**
 * Created by limeng on 15-8-12.
 */

var mongodb=require('./modules/mongodb.m.js');
var tableName='node_book';
var rowInfo={};

mongodb=new mongodb();

/*
rowInfo.book_name='nodejs book';
rowInfo.author='danhuang';

mongodb.insert(tableName,rowInfo,function(ret){
    console.log(ret);
});
*/