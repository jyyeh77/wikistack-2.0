var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', { logging: false });

var Page = db.define('page', {
	id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed'),
    },
    date: {
    	type: Sequelize.DATE,
    	defaultValue: Sequelize.NOW
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
    },

},
    {
        // before each row is created via page.build, check if title is inputted in text box - if not, randomly generate it
    	hooks: {
			beforeValidate: function (user, options) {
			  	if(user.title) {
			    	// Removes all non-alphanumeric characters from title
			    	// And make whitespace underscore
			    	user.urlTitle = user.title.replace(/\s+/g, '_').replace(/\W/g, '');
			  	} else {
			    	// Generates random 5 letter string
			    	user.urlTitle = Math.random().toString(36).substring(2, 7);
			  	}
			}
	}
});

var User = db.define('user', {
	id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// var Tags = db.define('tags', {
// 	id: {
// 		type: Sequelize.INTEGER,
// 		autoIncrement: true,
// 		primaryKey: true
// 	},
// 	name: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	},
// 	articleUrl: {
// 		type: Sequelize.STRING,
// 		allowNull: false
// 	}
// })

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
