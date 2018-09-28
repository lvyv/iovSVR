var SEQDB= require('sequelize')

//dao layer
var dbcfg = { 
    host: 'localhost', 
    user: 'testusr',  
    password: 'testpswd', 
    database: 'testcarinfo'
}

const db = new SEQDB(dbcfg.database,dbcfg.user,dbcfg.password,{
    host: dbcfg.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
})

const car = db.define('car', {
    sn: {
        type: SEQDB.STRING,
        allowNull: false,
        comment: 'dev sn'
    },
    no: {
        type: SEQDB.STRING,
        allowNull: false,
        comment: 'car no'
    },
    type: {
        type: SEQDB.INTEGER,
        allowNull: false,
        comment: 'car type'
    }
},  {
   timestamps: true,
   underscored: true,
   paranoid: true,
   freezeTableName: true, // Model 对应的表名将与model名相同
   tablename: 'car',
   charset: 'utf8',
   collate: 'utf8_general_ci'
});
  
const info = db.define('info', {
    time: {
        type: SEQDB.DATE,
        field: 'time',
        allowNull: false,
        comment: 'info time'
    },
    longtitude: {
        type: SEQDB.DOUBLE,
        field: 'longtitude',
        allowNull: false,
        comment: 'pos longtitude'
    },
    latitude: {
        type: SEQDB.DOUBLE,
        field: 'latitude',
        allowNull: false,
        comment: 'pos latitude'
    },
    coordtype:{
        type: SEQDB.STRING,
        field: 'coord_type',
        allowNull: false,
        comment: 'pos coord type'
    },
    speed:{
        type: SEQDB.FLOAT,
        field: 'speed',
        allowNull: false,
        comment: 'car speed'
    },
    direction:{
        type: SEQDB.FLOAT,
        field: 'direction',
        allowNull: false,
        comment: 'car direction'
    },
    height:{
        type: SEQDB.FLOAT,
        field: 'height',
        allowNull: false,
        comment: 'pos height'
    },
    radius:{
        type: SEQDB.FLOAT,
        field: 'radius',
        allowNull: false,
        comment: 'pos radius'
    },
    upload:{
        type: SEQDB.INTEGER,
        field: 'upload',
        allowNull: false,
        comment: 'upload flag'
    },
    rmp:{
        type: SEQDB.INTEGER,
        field: 'rmp',
        allowNull: false,
        comment: 'rmp'
    },
    rmj:{
        type: SEQDB.INTEGER,
        field: 'rmj',
        allowNull: false,
        comment: 'rmj'
    },
    oil:{
        type: SEQDB.FLOAT,
        field: 'oil',
        allowNull: false,
        comment: 'oil'
    },
    distance:{
        type: SEQDB.INTEGER,
        field: 'distance',
        allowNull: false,
        comment: 'distance'
    },
    flag:{
        type: SEQDB.INTEGER,
        field: 'flag',
        allowNull: false,
        comment: 'acc flag tag'
    }
},  {
    timestamps:true,
    underscored:true,
    paranoid:true,
    freezeTableName: true, // Model 对应的表名将与model名相同
    tablename:'info_histroy',
    charset:'utf8',
    collate:'utf8_general_ci'
});

car.hasMany(info)
info.belongsTo(car)
//dao layer end

//service layer start
function saveinfo(info)
{
    var c = car.create({
        sn: info.s,
        no: info.n,
        type: info.t
    }).catch((res)=>{
        console.log(res)
    })


    var inf = c.createinfo({
           time: info.m.t ,
           longtitude:info.m.j,
           latitude:info.m.w,
           coordtype:info.m.y,
           speed:info.m.p,
           direction:info.m.d,
           height:info.m.h,
           radius:info.m.r,
           rmp:info.m.m,
           rmj:info.m.z,
           oil:info.m.o,
           distance:info.m.s,
           flag:info.m.f,
    }).catch((res)=>{
        console.log(res)
    })

    return 
}

function getinfo(time)
{
    var carinfos = car.findAll({
        'include':[{
            'model':info,
            'where': {
                'time': {
                    '$gt': time.start,
                    '$lt': time.end
                }
            }
        }],
        'where':{
            sn: time.sn
        }
    }) 
    return carinfos;
}

function delinfo(info)
{
    var c = car.findAll({
        where :{
            sn : info.sn
        }
    })

    var info = c.getinfo({
        'where':{
            'time': {
               '$gt': info.start,
               '$lt': info.end,
            }
        }
    })

    return info.destroy(); 

}

module.exports.getinfo = getinfo 
module.exports.saveinfo = saveinfo
module.exports.delinfo = delinfo 
//service layer end



