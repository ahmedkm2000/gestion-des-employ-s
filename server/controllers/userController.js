const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const view = ((req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("connected as: " + connection.threadId)
        connection.query('select * from user where status = ?', ['active'], (err, rows) => {
            connection.release()
            if (!err) {
                const { removed } = req.query
                res.render('home', { rows, removed })

            } else {
                console.log(err)
            }


        })




    })

})
const find = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as: ' + connection.threadId)
        const { search } = req.body
        connection.query('select * from user where (first_name like ? or last_name like ? or email like ? or phone like ? )and status =?', ['%' + search + '%', '%' + search + '%', '%' + search + '%', '%' + search + '%', "active"], (err, rows) => {
            connection.release()
            if (!err) {
                res.render('home', { rows })
            } else {
                console.log(err)
            }
        })
    })
}
const adduser = (req, res) => {
    res.render('add-user')
}
const insertuser = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as: ' + connection.threadId)
        const { FirstName, LastName, Email, Phone, Comment } = req.body
        const status = 'active'
        connection.query('insert into user set first_name = ?,last_name = ? ,email = ? ,phone = ? ,comments = ? ,status = ?', [FirstName, LastName, Email, Phone, Comment, status], (err, rows) => {
            connection.release()
            if (!err) {
                res.render('add-user', { alert: 'User hass been added successfully' })
            } else {
                console.log(err)
            }
        })
    })
}
const edituser = (req, res) => pool.getConnection((err, connection) => {
    if (err) throw err
    console.log('connected as: ' + connection.threadId)
    const { id } = req.params
    connection.query('select * from user where id = ?', [id], (err, rows) => {
        connection.release()
        if (!err) {
            res.render('edit-user', { rows })
        } else {
            console.log(err)
        }
    })
})

const updateuser = (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) throw err
            console.log('connected as: ' + connection.threadId)
            const { id } = req.params
            const { FirstName, LastName, Email, Phone, Comment } = req.body
            const status = 'active'
            connection.query('update user set first_name = ?,last_name = ? ,email = ? ,phone = ? ,comments = ? ,status = ? where id = ?', [FirstName, LastName, Email, Phone, Comment, status, id], (err, rows) => {
                connection.release()
                if (!err) {
                    pool.getConnection((err, connection) => {
                        if (err) throw err;
                        console.log("connected as: " + connection.threadId)
                        connection.query('select * from user where status = ?', ['active'], (err, rows) => {
                            connection.release()
                            if (!err) {
                                res.render('home', { rows, alert: "user has been updated successefly" })
                            } else {
                                console.log(err)
                            }
                            console.log(rows)
                        })
                    })




                } else {
                    console.log(err)
                }
            })
        })
    }
    /*const deleteuser = (req, res) => {
        pool.getConnection((err, connection) => {
            if (err) throw err
            console.log('connected as: ' + connection.threadId)
            const { id } = req.params
            connection.query("delete from user where id = ?", [id], (err, _rows) => {
                connection.release()
                if (!err) {
                    res.redirect('/')
                } else {
                    console.log(err)
                }

            })
        })
    }*/

const deleteuser = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as: ' + connection.threadId)
        const { id } = req.params
        connection.query("update user Set status = ? where id = ?", ['removed', id], (err, rows) => {
            connection.release()
            if (!err) {
                let removed = encodeURIComponent('user removed successfully')
                res.redirect('/?removed=' + removed)
            } else {
                console.log(err)
            }

        })
    })
}
const viewuser = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as: ' + connection.threadId)
        const { id } = req.params
        connection.query("select * from user where id = ?", [id], (err, rows) => {
            connection.release()
            if (!err) {
                res.render('view-user', { rows })
            } else {
                console.log(err)
            }
        })

    })

}

module.exports = { view, find, adduser, insertuser, edituser, updateuser, deleteuser, viewuser }