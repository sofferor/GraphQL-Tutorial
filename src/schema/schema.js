const { v4: uuidv4 } = require('uuid');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
} = require('graphql');
const { users, companies } = require('./localDB');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue) {
                return companies.find((company) => company.id === parentValue.companyId);
            },
        },
    }),
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue) {
                return users.filter((user) => parentValue.users.includes(user.id));
            },
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        message: {
            type: GraphQLString,
            resolve: () => 'Hello World',
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return users.find((user) => user.id === args.id);
            },
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return companies.find((company) => company.id === args.id);
            },
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () => users,
        },
        companies: {
            type: new GraphQLList(CompanyType),
            resolve: () => companies,
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString },
            },
            resolve(parentValue, { firstName, age, companyId }) {
                const user = {
                    id: uuidv4(), firstName, age, companyId,
                };
                users.push(user);
                pushUserToHisCompany(user);
                return user;
            },
        },
        deleteUser: {
            type: new GraphQLList(UserType),
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve(parentValue, { id }) {
                let user = users.find((user) => user.id === id);
                const index = users.indexOf(user);
                if (index > -1) {
                    user = users.splice(index, 1);
                    deleteUserFromHisCompany(user);
                }
                return user;
            },
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString },
            },
            resolve(parentValue, {
                id, firstName, age, companyId,
            }) {
                const user = users.find((user) => user.id === id);
                if (firstName) {
                    user.firstName = firstName;
                }
                if (age) {
                    user.age = age;
                }
                if (companyId) {
                    if (companyId !== user.companyId) {
                        deleteUserFromHisCompany(user);
                        user.companyId = companyId;
                        pushUserToHisCompany(user);
                    } else {
                        user.companyId = companyId;
                    }
                }
                return user;
            },
        },
    },
});

function getCompanyUsersByCompanyId(companyId) {
    let users;
    if (companyId) {
        const company = companies.find((company) => company.id === companyId);
        if (company) {
            users = company.users;
        }
    }
    return users;
}

function pushUserToHisCompany(user) {
    if (user) {
        const companyUsers = getCompanyUsersByCompanyId(user.companyId);
        if (companyUsers) {
            companyUsers.push(user.id);
        }
    }
}

function deleteUserFromHisCompany(user) {
    if (user) {
        const companyUsers = getCompanyUsersByCompanyId(user.companyId);
        if (companyUsers) {
            const index = companyUsers.indexOf(user.id);
            if (index > -1) {
                companyUsers.splice(index, 1);
            }
        }
    }
}

module.exports = new GraphQLSchema({
    mutation,
    query: RootQuery,
});
