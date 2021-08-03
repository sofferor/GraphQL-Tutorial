let users = [
    {id: 'u1', firstName: 'John', age: 34, companyId: 'c1'},
    {id: 'u2', firstName: 'Dov', age: 24, companyId: 'c2'},
    {id: 'u3', firstName: 'David', age: 26, companyId: 'c1'},
    {id: 'u4', firstName: 'Dov', age: 25, companyId: 'c2'}
]
module.exports.users = users;

let companies = [
    {id: 'c1', name: 'Google', users: ['u1', 'u3']},
    {id: 'c2', name: 'Apple', users: ['u2', 'u4']}
]
module.exports.companies = companies;
