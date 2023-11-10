import db from '../config.js';
const table = 'member';

export default {
    table: table,

    /**
     * 전체리스트
     */
    listAll: (wheres={}, select='*', orderBy=' `idx` DESC ')=>{
        return new Promise((resolve, reject)=>{
            let whereArr = [];
            for (const [_, v] of Object.entries(wheres)) {
                for (const [field, where] of Object.entries(v)) {
                    if (field) {
                        const match = /in|like|is/ig;
                        if (match.test(where)) {
                            whereArr.push(' `'+field+'` '+where+' ');
                        } else {
                            whereArr.push(' `'+field+'` = '+where+' ');
                        }
                    } else {
                        whereArr.push(where);
                    }

                }
            };
            const whereString = (whereArr.length > 0?'and '+whereArr.join('and'):'');
            const query = ' SELECT '+select+' FROM `'+table+'` WHERE (1) '+whereString+' ORDER BY '+orderBy;
            db.query(query, [], (error, rows)=>{
                if (error) {
                    return reject({error: error});
                }
                return resolve(rows??{});
            });
        });
    },

    /**
     * 회원정보를 찾는다.
     */
    userFind: (value, where_field='idx', select='*')=>{
        return new Promise((resolve, reject)=>{
            if (!value) {
                return reject({error: 'target value undefined'});
            }
            const query = ' SELECT '+select+' FROM `'+table+'` WHERE `'+where_field+'` = ? ';
            db.query(query, [value], (error, row)=>{
                if (error) {
                    return reject({error: error});
                }
                return resolve(row[0]??{});
            });
        });
    },

    /**
     * 데이터 삭제
     */
    delete: (wheres={})=>{
        let whereArr = [];
        for (const [_, v] of Object.entries(wheres)) {
            for (const [field, where] of Object.entries(v)) {
                if (field) {
                    const match = /in|like|is/ig;
                    if (match.test(where)) {
                        whereArr.push(' `'+field+'` '+where+' ');
                    } else {
                        whereArr.push(' `'+field+'` = '+where+' ');
                    }
                } else {
                    whereArr.push(where);
                }

            }
        };
        const whereString = (whereArr.length > 0?'and '+whereArr.join('and'):'');
        return new Promise((resolve, reject)=>{
            db.query(' delete from `'+table+'` where (1) '+whereString, (error, rows)=>{
                if (error) {
                    return reject(error);
                }
                return resolve('success');
            })
        });
    },

    /**
     * 데이터 추가
     */
    insert: (data)=>{
        let newData = [];
        if (data.length === undefined) {
            newData.push(data);
        } else {
            newData = data;
        }

        return new Promise((resolve, reject)=>{
            for (let key in newData) {
                const queryString = ' insert into `'+table+'` set ?';
                db.query(queryString, newData[key], (error, result)=>{
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result.insertId);
                });
            }
        });
    },
}