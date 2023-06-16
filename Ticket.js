const { v4: uuidv4 } = require('uuid');

exports.default = class Ticket {
    constructor(name, description) {
        this.id = uuidv4();
        this.name = name;
        this.description = description;
        this.status = null;
        this.created = new Date().toLocaleString();   
    }
}