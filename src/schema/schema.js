const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = require('graphql');
const {users, companies} = require("./localDB");

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        age: {type: GraphQLInt},
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return companies.find(company => company.users.includes(parentValue.id));
            }
        }
    })
});

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return users.filter(user => parentValue.users.includes(user.id));
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        message: {
            type: GraphQLString,
            resolve: () => "Hello World"
        },
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return users.find(user => user.id == args.id)
            }
        },
        company: {
            type: CompanyType,
            args: {id: {type: GraphQLString}},
            resolve(parentValue, args) {
                return companies.find(company => company.id == args.id)
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () => users
        },
        companies: {
            type: new GraphQLList(CompanyType),
            resolve: () => companies
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})
